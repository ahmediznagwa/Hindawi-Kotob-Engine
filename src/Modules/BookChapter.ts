import { UTILS } from "./Utils";
import { prodRootUrl } from "./constants";

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
  constructor(chapterEl: HTMLElement, bookId: string) {
    this.bookId = bookId;
    this.chapterEl = chapterEl;

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
    Searches for a span inside an element at a given order
  */
  getSpan(el: HTMLElement, order: "first" | "last"): HTMLElement {
    if (order === "first")
      return el.querySelector("span:first-child") as HTMLElement;
    else if (order === "last")
      return Array.from(
        el.querySelectorAll("span:last-child")
      ).pop() as HTMLElement;
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
    Calculates the left edge position of the page in the rendered HTML
  */
  getPageLeft(): number {
    return Math.round(
      this.bookContainerPadding -
        this.page * (this.exactColumnWidth + this.exactColumnsGap)
    );
  }

  /**
    Calculates the right edge position of the page in the rendered HTML
  */
  getPageRight(): number {
    return this.getPageLeft() + this.exactColumnWidth;
  }

  /**
    Checks whether an element is or is not in the current page
  */
  isInOtherPage(el: HTMLElement): boolean {
    return (
      this.getPageRight() -
        (el?.offsetLeft + Math.min(el?.offsetWidth, this.columnWidth)) >=
      this.columnWidth - this.ROUNDING_TOLERANCE
    );
  }

  /**
    Loops over all the words in a given element and updates the pagesContentRanges according to words locations
  */
  loopOverWords(el: HTMLElement) {
    Array.from(el.querySelectorAll("span[n]")).forEach(
      (wordEl: HTMLElement, i: number, wordArr: HTMLElement[]) => {
        if (this.isInOtherPage(wordEl)) {
          // word is in another page
          this.pagesContentRanges[this.page][1] =
            +wordArr[i - 1]?.getAttribute("n");
          this.page++;
          this.pagesContentRanges[this.page][0] = +wordEl?.getAttribute("n");
        }
        if (i === wordArr.length - 1) {
          // last word in paragraph
          const nextParent = this.getHighestParent(wordEl)
            ?.nextElementSibling as HTMLElement;
          if (this.isInOtherPage(nextParent)) {
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
    Array.from(UTILS.DOM_ELS.book.firstElementChild.children).forEach(
      (child: HTMLElement, i: number, childrenArr: HTMLElement[]) => {
        //if there's only one child in the chapter
        if (childrenArr.length === 1)
          this.pagesContentRanges[this.page][0] = +this.getSpan(
            child,
            "first"
          )?.getAttribute("n");
        // last element in chapter
        if (i === childrenArr.length - 1) {
          if (this.isInOtherPage(this.getSpan(child, "last"))) {
            // paragraph split into two pages
            this.loopOverWords(child);
          }
          this.pagesContentRanges[this.page][1] = +this.getSpan(
            child,
            "last"
          )?.getAttribute("n");
        }
        //First Element in chapter
        else if (i === 0) {
          this.pagesContentRanges[this.page][0] = +this.getSpan(
            child,
            "first"
          )?.getAttribute("n");
          this.loopOverWords(child);
        }
        //any other element
        else {
          if (this.isInOtherPage(child?.nextElementSibling as HTMLElement)) {
            // paragraph at the end of the page
            if (this.isInOtherPage(this.getSpan(child, "last")))
              this.loopOverWords(child); // paragraph split into two pages
            else {
              // paragraph didn't split into two pages
              this.pagesContentRanges[this.page][1] = +this.getSpan(
                child,
                "last"
              )?.getAttribute("n");
              this.page++;
              this.pagesContentRanges[this.page][0] = +this.getSpan(
                child?.nextElementSibling as HTMLElement,
                "first"
              )?.getAttribute("n");
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
    const section = document.createElement("section");
    section.classList.add("book-chapter");
    section.innerHTML = this.chapterEl?.innerHTML;
    UTILS.DOM_ELS.book.innerHTML = "";
    UTILS.DOM_ELS.book.append(section);
    this.calcPagesContentRanges();
    this.updateImagesPaths();
    this.bindClickEventOnAllWordsInChapter();
    this.imageInsertionHandler();
  }

  /**
    Update chapter images relative to selected book folder
  */
  updateImagesPaths() {
    const images = UTILS.DOM_ELS.book.querySelectorAll("img");
    images.forEach((img: HTMLImageElement) => {
      const currentSrc = img.getAttribute("src");
      img.src = currentSrc.replace(
        "../Images/",
        `${prodRootUrl}/packages/${this.bookId}/Images/`
      );
    });
  }

  /**
    Highlight selected word
  */
  highlightWord(target: HTMLElement) {
    $(target).closest(".actions-menu").addClass("has-highlight");
    $(target).addClass("highlighted");
    $(".actions-menu").remove();
    this.saveHighlightedWords();
  }

  /**
    Unhighlight selected word
  */
  unhighlightWord(target: HTMLElement) {
    $(target).closest(".actions-menu").removeClass("has-highlight");
    $(target).removeClass("highlighted");
    $(".actions-menu").remove();
  }

  saveHighlightedWords() {
    const highlightedWords = Array.from(
      document.querySelectorAll(".highlighted")
    );

    localStorage.setItem(
      "highlightedWords",
      JSON.stringify({
        chapter: this.currentChapterIndex,
        words: highlightedWords,
      })
    );
  }

  /**
    Update chapter images relative to selected book folder
  */
  copyText(target: HTMLElement) {
    navigator.clipboard.writeText(target.textContent);
    $(".actions-menu").remove();
  }

  bindClickEventOnAllWordsInChapter() {
    UTILS.DOM_ELS.words?.forEach((word: HTMLElement) => {
      word.addEventListener("click", this.wordEventHandler.bind(this));
    });
  }

  /**
    Handling dropdown that show on word click
  */
  wordEventHandler(e: MouseEvent) {
    e.stopPropagation();
    const element = e.target as HTMLElement;
    $(".actions-menu").remove();
    const top = $(element).offset().top;
    const left = $(element).offset().left;
    const menu = document.createElement("div");
    menu.classList.add("actions-menu");
    const actionsMenu = `
      <ul>
        <li class="highlight"><a href="#">تلوين</a></li>
        <li class="unhighlight"><a href="#">الغاء التلوين</a></li>
        <li class="copy"><a href="#">نسخ</a></li>
      </ul>
    `;

    menu.innerHTML = actionsMenu;
    document.body.appendChild(menu);

    if ($(element).hasClass("highlighted")) {
      $(menu).addClass("has-highlight");
      $(menu).find(".highlight").remove();
    }

    // Positioning the appended menu according to word
    $(menu).css({
      position: "absolute",
      left: left + element.clientWidth / 2,
      transform: "translate(-50%,-120%)",
      top,
    });

    $(window).on("resize", function () {
      $(".actions-menu").remove();
    });

    // Binding click events on menu
    $(menu).on("click", function (e: any) {
      e.stopPropagation();
    });
    if (menu.querySelector(".highlight")) {
      menu
        .querySelector(".highlight")
        .addEventListener("click", this.highlightWord.bind(this, element));
    }
    if (menu.querySelector(".unhighlight")) {
      menu
        .querySelector(".unhighlight")
        .addEventListener("click", this.unhighlightWord.bind(this, element));
    }

    menu
      .querySelector(".copy")
      .addEventListener("click", this.copyText.bind(this, element));
  }

  imageInsertionHandler() {
    const book = $(UTILS.DOM_ELS.book);
    const el = book.find("#selected-word");
    const parent = el.parent();
    const bookHeight = book.outerHeight();
    if (el.length) {
      const allElementsOfChapter = document.querySelectorAll("*");
      allElementsOfChapter.forEach((item) => {
        if ($(item).is(":visible")) {
          console.log(item);
        }
      });
      const image = `<div class="inserted-image" style="height: ${bookHeight}px"><img src="../image.jpg"></div>`;
      parent.after(image);
      $(image).css("height");
    }
  }
}
