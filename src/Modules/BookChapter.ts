import { IHighlighted } from "../Models/IHighlighted.model";
import { Book } from "./Book";
import { UTILS } from "./Utils";

export class BookChapter {
  chapterEl: HTMLElement;
  bookId: string;
  pagesContentRanges: number[][];
  page: number;
  ROUNDING_TOLERANCE: number;
  bookContainerPadding: number;
  exactColumnsGap: number;
  exactColumnWidth: number;
  columnWidth: number;
  currentChapterIndex: number;
  rootFolder: string;
  constructor(
    chapterEl: HTMLElement,
    bookId: string,
    currentChapterIndex: number,
    rootFolder: string
  ) {
    this.bookId = bookId;
    this.chapterEl = chapterEl;
    this.currentChapterIndex = currentChapterIndex;
    this.rootFolder = rootFolder;

    /**
     * An array of arrays containing the index of the starting and ending words of each page for the current rendered chapter
     */
    this.pagesContentRanges = [];
    this.page = 0;
    this.ROUNDING_TOLERANCE = 3;
    this.bookContainerPadding = 0;
    this.exactColumnsGap = 0;
    this.exactColumnWidth = 0;
    this.columnWidth = 0;
    this.renderChapter();
  }

  /**
    Replace image paths
  */
  updateImagePaths(): void {
    const images =
      Array.from(UTILS.DOM_ELS.book.querySelectorAll("img")).length > 0
        ? UTILS.DOM_ELS.book.querySelectorAll("img")
        : UTILS.DOM_ELS.book.querySelectorAll("image");

    images.forEach((img: HTMLImageElement | SVGImageElement) => {
      const imgSrc =
        img.getAttribute("src")?.split("/") ||
        img.getAttribute("xlink:href")?.split("/");
      const imgName = imgSrc[imgSrc.length - 1];
      if (img instanceof HTMLImageElement) {
        img.src = `${this.rootFolder}/Images/${imgName}`;
        return;
      }
      img.setAttribute("xlink:href", `${this.rootFolder}/Images/${imgName}`);
    });
  }

  /**
    Searches for a span inside an element at a given order
  */
  getSpan(el: HTMLElement, order: "first" | "last"): HTMLElement {
    if (order === "first") {
      let span = el?.querySelector("span:first-child") as HTMLElement;
      if (!span?.getAttribute("n")) {
        span = span?.querySelector("span[n]");
      }
      return span;
    } else if (order === "last") {
      return Array.from(
        el?.querySelectorAll("span[n]") || []
      ).pop() as HTMLElement;
    }
  }

  /**
    Gets the highest parent that's below the main story element for a given child element
  */
  getHighestParent(el: HTMLElement): HTMLElement {
    let child = el;
    let parent = child.parentElement;
    while (parent !== UTILS.DOM_ELS.book.firstElementChild) {
      child = child.parentElement;
      parent = child.parentElement;
    }
    return child;
  }

  /**
    Searches for element that has span
  */
  getElement(el: HTMLElement, direction: "next" | "prev"): HTMLElement {
    let child = el;

    if (!child) {
      return;
    }
    if (child?.querySelector("span[n]")) {
      return child;
    }
    if (child?.parentNode?.children.length === 1) {
      return child;
    }
    const nextChild =
      direction === "next"
        ? (child?.nextElementSibling as HTMLElement)
        : (child?.previousElementSibling as HTMLElement);
    child = nextChild;

    if (!child?.querySelector("span[n]")) {
      this.getElement(child, direction);
      return;
    }

    return child;
  }

  /**
    Calculates the left edge position of the page in the rendered HTML
  */
  getPageLeft(language = "ar"): number {
    return language === "ar"
      ? Math.round(
          this.bookContainerPadding -
            this.page * (this.exactColumnWidth + this.exactColumnsGap)
        )
      : Math.round(
          this.page * (this.exactColumnWidth + this.exactColumnsGap) +
            this.bookContainerPadding
        );
  }

  /**
    Calculates the right edge position of the page in the rendered HTML
  */
  getPageRight(language = "ar"): number {
    return this.getPageLeft(language) + this.exactColumnWidth;
  }

  /**
    Checks whether an element is or is not in the current page
  */
  isInOtherPage(el: HTMLElement): boolean {
    let language = "ar";

    if (el?.textContent?.match(/^[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%\^&*|']*$/)) {
      language = "en";
    }

    if (language === "ar") {
      return (
        this.getPageRight(language) -
          (el?.offsetLeft + Math.min(el?.offsetWidth, this.columnWidth)) >=
        this.columnWidth - this.ROUNDING_TOLERANCE
      );
    }
    return (
      el?.offsetLeft - this.getPageLeft(language) >=
      this.columnWidth - this.ROUNDING_TOLERANCE
    );
  }

  /**
    Loops over all the words in a given element and updates the pagesContentRanges according to words locations
  */
  loopOverWords(el: HTMLElement) {
    if (!el?.querySelectorAll("span[n]").length) {
      return;
    }

    Array.from(el?.querySelectorAll("span[n]")).forEach(
      (wordEl: HTMLElement, i: number, wordArr: HTMLElement[]) => {
        if ($(wordEl).closest("sup").length) {
          return;
        }
        if (this.isInOtherPage(wordEl)) {
          // word is in another page
          if (!this.pagesContentRanges[this.page]) {
            return;
          }
          this.pagesContentRanges[this.page][1] =
            +wordArr[i - 1]?.getAttribute("n");
          this.page++;

          if (!this.pagesContentRanges[this.page]) {
            return;
          }

          this.pagesContentRanges[this.page][0] = +wordEl?.getAttribute("n");
        }
        if (i === wordArr.length - 1) {
          // last word in paragraph
          const nextParent = this.getHighestParent(wordEl)
            ?.nextElementSibling as HTMLElement;
          if (this.isInOtherPage(nextParent)) {
            if (!this.pagesContentRanges[this.page]) {
              return;
            }
            this.pagesContentRanges[this.page][1] = +wordEl?.getAttribute("n");
            this.page++;
            this.pagesContentRanges[this.page][0] = +this.getSpan(
              nextParent,
              "first"
            )?.getAttribute("n");
          }
        }
      }
    );
  }

  /**
    Calculates the starting and ending words of each page for the current rendered chapter
  */
  calcPagesContentRanges() {
    //update container values
    this.page = 0;
    this.bookContainerPadding = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book.parentElement,
      "padding-left"
    );
    this.exactColumnsGap = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book,
      "column-gap"
    );
    this.exactColumnWidth = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book,
      "width"
    );
    this.columnWidth = UTILS.DOM_ELS.book.offsetWidth;
    //reset the pagesContentRanges to empty state

    this.pagesContentRanges = Array.from(
      { length: UTILS.calcPageCount() },
      () => []
    );

    //loop over the children of the rendered chapter
    const bookChapter = UTILS.DOM_ELS.bookChapter;

    Array.from(bookChapter.children).forEach(
      (child: HTMLElement, i: number, childrenArr: HTMLElement[]) => {
        //if there's only one child in the chapter
        if (childrenArr.length === 1) {
          this.pagesContentRanges[this.page][0] = +this.getSpan(
            child,
            "first"
          )?.getAttribute("n");
        }
        // last element in chapter
        if (i === childrenArr.length - 1) {
          if (this.isInOtherPage(this.getSpan(child, "last"))) {
            // paragraph split into two pages
            this.loopOverWords(child);
          }
          const element = this.getElement(child, "prev");

          if (this.pagesContentRanges[this.page]) {
            this.pagesContentRanges[this.page][1] = +this.getSpan(
              element,
              "last"
            )?.getAttribute("n");
          }
        }
        // first element in chapter
        if (i === 0) {
          const element = this.getElement(child, "next");
          if (!child.querySelector("span[n]")) {
            this.pagesContentRanges[this.page][0] = +this.getSpan(
              element,
              "first"
            )?.getAttribute("n");
            this.loopOverWords(element);
            return;
          }

          this.pagesContentRanges[this.page][0] = +this.getSpan(
            element,
            "first"
          )?.getAttribute("n");
          this.loopOverWords(child);
        }
        //any other element
        else {
          if (
            this.isInOtherPage(
              this.getElement(child?.nextElementSibling as HTMLElement, "next")
            )
          ) {
            // paragraph at the end of the page
            if (this.isInOtherPage(this.getSpan(child, "last"))) {
              this.loopOverWords(child); // paragraph split into two pages
            } else {
              // paragraph didn't split into two pages

              if (this.pagesContentRanges[this.page]) {
                this.pagesContentRanges[this.page][1] = +this.getSpan(
                  this.getElement(child, "prev"),
                  "last"
                )?.getAttribute("n");
                this.page++;
                this.pagesContentRanges[this.page][0] = +this.getSpan(
                  this.getElement(
                    child?.nextElementSibling as HTMLElement,
                    "prev"
                  ),
                  "first"
                )?.getAttribute("n");
              }
            }
          }
        }
      }
    );
  }

  /**
    Render selected chapter
  */
  renderChapter() {
    $("body").addClass("loading");
    const section = document.createElement("section");
    section.classList.add("book-chapter");

    section.innerHTML = this.chapterEl?.innerHTML;

    // Some wrapper contain class controll the style so I added the whole thing if they
    if (
      this.chapterEl.classList.contains("center") ||
      this.chapterEl.classList.contains("copyright")
    ) {
      section.innerHTML = "";
      section.appendChild(this.chapterEl);
    }

    UTILS.DOM_ELS.book.innerHTML = "";
    UTILS.DOM_ELS.book.append(section);
    this.calcPagesContentRanges();
    this.wrapWordsInAnchors();
    this.updateImagePaths();
    this.getHighlightedWords();
    $("body").removeClass("loading");
    // this.insertFullPageImage(); insert fullpage image after specific index
  }

  /**
    Wrap all words that contains link inside
  */

  wrapWordsInAnchors(): void {
    UTILS.DOM_ELS.words.forEach((word) => {
      if (word.textContent.includes("@hindawi.org")) {
        word.innerHTML = `<a class="regular-link" href="mailto:${word.textContent}" target="_blank">${word.textContent}</a>`;
        return;
      }
      if (word.textContent.includes("http")) {
        word.innerHTML = `<a class="regular-link" href="${word.textContent}" target="_blank">${word.textContent}</a>`;
      }
    });
  }

  /**
    Get highlighted words for each chapter
  */
  getHighlightedWords() {
    const storedhighlightedWords = JSON.parse(
      localStorage.getItem(`${this.bookId}_highlights`)
    );
    if (storedhighlightedWords) {
      storedhighlightedWords[this.currentChapterIndex]?.highlights?.forEach(
        (word: IHighlighted) => {
          $(`span[n=${word.index}]`).addClass("highlighted");
        }
      );
    }
  }

  /**
    Removing actions menu
  */
  hideActionsMenu(): void {
    $(".actions-menu").remove();
    $("span").removeClass("selected");
  }

  // insertFullPageImage(wordIndex: number = 533) {
  //   const book = $(UTILS.DOM_ELS.book);
  //   const el = book.find(`span[n='${wordIndex}']`);
  //   const bookChapter = el.closest(".book-chapter");
  //   const bookHeight = book.outerHeight();
  //   if (el.length) {
  //     const image = `<div class="inserted-image" style="height: ${bookHeight}px"><img src="image.jpg"></div>`;
  //     bookChapter.append(image);
  //     $(image).css("height");
  //     this.calcPagesContentRanges();
  //   }
  // }
}
