import { IBookmark } from "../Models/IBookmark.model";
import { BookChapter } from "./BookChapter";
import { UTILS } from "./Utils";

interface ITableOfContent {
  chapterIndex: number;
  chapterTitle: string;
  chapterTitleAnchorWord: number;
}

export class Book {
  bookId: string;
  chapters: HTMLDivElement[];
  rootFolder: string;
  fontSize: number;
  currentChapterIndex: number;
  currentPage: number;
  bookWordsCount: number;
  colorMode: string;
  fontFamily: string;
  bookmarks: IBookmark[];
  currentChapter: BookChapter;
  currentProgressPercent: number;
  currentScrollPercentage: number;
  rootFontSize: number;
  fontSizeStep: number;
  isLastPage: boolean;
  isFirstPage: boolean;
  isLastChapter: boolean;
  isFirstChapter: boolean;
  canIncreaseFont: boolean;
  canDecreaseFont: boolean;
  currentPageFirstWordIndex: number;
  currentPageLastWordIndex: number;
  anchorWordIndex: number;
  tableOfContents: ITableOfContent[] = [];
  bookCss: string;
  constructor(
    bookId,
    chapters,
    rootFolder,
    tableOfContents,
    bookCss,
    fontSize = 18,
    currentChapterIndex = 0,
    anchorWordIndex,
    colorMode = "white",
    fontFamily = "NotoNaskhArabic",
    bookmarks = []
  ) {
    this.bookId = bookId;
    this.rootFolder = rootFolder;
    this.tableOfContents = tableOfContents;
    this.bookCss = bookCss;
    this.bookWordsCount = null;
    this.chapters = chapters;
    this.currentChapterIndex = Math.min(
      currentChapterIndex || 0,
      this.chapters.length - 1
    );
    this.currentChapter = new BookChapter(
      this.chapters[this.currentChapterIndex],
      this.bookId,
      this.currentChapterIndex,
      this.rootFolder
    );
    this.calculateBookWordsCount();
    this.anchorWordIndex = Math.min(anchorWordIndex || 0, this.bookWordsCount);
    this.currentProgressPercent = 0;
    this.rootFontSize = 18;
    this.colorMode = colorMode;
    this.fontFamily = fontFamily;
    this.bookmarks = bookmarks;
    this.fontSizeStep = 0.15;
    this.fontSize = fontSize || this.rootFontSize;
    this.changeFontSize();
    this.changeColorMode(this.colorMode);
    this.changeFontFamily(this.fontFamily);
    setTimeout(() => {
      this.currentChapter.calcPagesContentRanges();
      this.currentPage = this.calcAnchorWordPage();
      this.changePage();
    }, 1000);
    this.renderBookmarks();
    this.addBookStyles();
    this.handleClickOnAnchors();
    this.generateBookTableOfContent();
  }

  /**
      Updates the state corresponding to current page and current chapter. The updated values are: `isLastPage`, `isFirstPage`, `isLastChapter` and `isFirstChapter`
    */
  updateChapterPageState() {
    this.isLastPage = this.currentPage >= UTILS.calcPageCount() - 1;
    this.isFirstPage = this.currentPage === 0;
    this.isLastChapter = this.currentChapterIndex >= this.chapters.length - 1;
    this.isFirstChapter = this.currentChapterIndex === 0;
  }

  /**
      Updates the state corresponding to the current font size. The updated values are: `canIncreaseFont` and `canDecreaseFont`
    */
  updateFontIncreaseDecreaseState() {
    this.canIncreaseFont =
      this.fontSize <=
      this.rootFontSize + this.rootFontSize * this.fontSizeStep;
    this.canDecreaseFont =
      this.fontSize >=
      this.rootFontSize - this.rootFontSize * this.fontSizeStep;

    UTILS.DOM_ELS.resetFontBtn.textContent =
      Math.round((this.fontSize / this.rootFontSize) * 100) + "%";
    if (!this.canIncreaseFont) {
      UTILS.DOM_ELS.biggerFontBtn.classList.add("disabled");
      return;
    }
    if (!this.canDecreaseFont) {
      UTILS.DOM_ELS.smallerFontBtn.classList.add("disabled");
      return;
    }
    UTILS.DOM_ELS.smallerFontBtn.classList.remove("disabled");
    UTILS.DOM_ELS.biggerFontBtn.classList.remove("disabled");
  }

  /**
    Calculating book words count to use in scroll percentage
  */
  calculateBookWordsCount() {
    const lastChapter = this.chapters[this.chapters.length - 1];
    const lastChapterAllSpans = lastChapter.querySelectorAll("span[n]");
    this.bookWordsCount =
      +lastChapterAllSpans[lastChapterAllSpans.length - 1].getAttribute("n");
  }

  /**
      Scrolls the view window into the current page
    */
  scrollToCurrentPage() {
    const columnWidth = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book,
      "width"
    );
    const columnsGap = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book,
      "column-gap"
    );
    const x = (columnWidth + columnsGap) * this.currentPage;

    UTILS.DOM_ELS.book.scrollTo(-x, 0);
  }

  /**
      Updates the DOM element representing the progress percentage value
    */
  updateProgressPercentage() {
    // DR. HINDAWI'S EQUATION TO CALCULATE THE PROGRESS PERCENTAGE
    // i = first word on the page j = last word on the page n = number of words in the reader
    // t = ROUND((n-(i-1))/n)*(i-1)/n+ROUND((i-1)/n)*j/n
    // t = isInFirstHalf ? (i-1)/n : j/n
    // Percentage = ((i-1) + (j-i+1)*t)/n

    const isInFirstHalf =
      Math.round((this.currentPageFirstWordIndex - 1) / this.bookWordsCount) ==
      0;
    const firstWordProgress =
      (this.currentPageFirstWordIndex - 1) / this.bookWordsCount;
    const lastWordProgress =
      this.currentPageLastWordIndex / this.bookWordsCount;
    const t = isInFirstHalf ? firstWordProgress : lastWordProgress;

    const percentage =
      this.currentChapterIndex === 0
        ? 0
        : (this.currentPageFirstWordIndex -
            1 +
            t *
              (this.currentPageLastWordIndex -
                this.currentPageFirstWordIndex +
                1)) /
          this.bookWordsCount;

    this.currentProgressPercent =
      (percentage || percentage === 0
        ? percentage
        : this.currentProgressPercent / 100) * 100;

    if (UTILS.DOM_ELS.percent) {
      UTILS.DOM_ELS.percent.innerText =
        this.currentProgressPercent.toFixed(0) + "%";
    }
    if (UTILS.DOM_ELS.barPercent) {
      UTILS.DOM_ELS.barPercent.querySelector("span").style.width =
        this.currentProgressPercent + "%";
    }
  }

  /**
      Changes the current rendered chapter into a different one depending on the inputted mode
    */
  changeChapter(mode: "next" | "prev" | "first" | "last") {
    const oldChapterIndex = this.currentChapterIndex;

    switch (mode) {
      case "next":
        if (!this.isLastChapter) {
          this.currentChapterIndex++;
          this.currentPage = 0;
        }
        break;
      case "prev":
        if (!this.isFirstChapter && this.isFirstPage) {
          this.currentChapterIndex--;
        } else if (!this.isFirstPage) {
          this.currentPage = 0;
        }
        break;
      case "first":
        this.currentChapterIndex = 0;
        this.currentPage = 0;
        break;
      case "last":
        this.currentChapterIndex = this.chapters.length - 1;
        this.currentPage = 0;
        break;
      default:
        break;
    }
    this.changePage();
    //render the new chapter
    if (oldChapterIndex !== this.currentChapterIndex) {
      this.renderChapter(this.currentChapterIndex);
    }

    // Binding click event on anchors to go to specific element
    this.handleClickOnAnchors();
  }

  /**
    Go to element when click on anchor by id (figures or footnotes)
  */
  goToElement(elementId: string, ev: any): void {
    ev?.stopPropagation();
    ev?.preventDefault();

    // Checking if clicked element inside footnote
    const footnote = $(ev?.target).closest(".footnote");

    if (footnote.length) {
      const id =
        $(ev?.target).closest("a").attr("id") ||
        $(ev?.target).closest("a").attr("href").split("#")[1];

      this.goToElement(id, null);
      return;
    }
    // console.log(elementSelector);

    const elementSelector = `#${
      elementId?.includes(".") ? elementId?.replace(".", "\\.") : elementId
    }`;
    // Check if it is in the same chapter (mainly user in footnotes)
    let targetEl;
    if ($(this.currentChapter.chapterEl).find(elementSelector).length) {
      targetEl = $(this.currentChapter.chapterEl).find(elementSelector);
      const firstWordInElementIndex = targetEl.find(`span:first-child`).length
        ? +targetEl.find(`span:first-child`).attr("n")
        : +targetEl.next("span[n]").attr("n") ||
          +targetEl.parent().find("span[n]:last-child").attr("n");

      this.goToPage(this.getPageNumberByWordIndex(firstWordInElementIndex));

      // Highlight element after render page.
      this.highlightSelectedElement($(elementSelector).parent()[0]);
      return;
    }

    // Looping in other chapters (mainly used in figures)
    $(UTILS.DOM_ELS.book).addClass("loading");
    this.chapters.forEach((chapter: HTMLElement, index: number) => {
      targetEl = $(chapter).find(elementSelector);
      if (targetEl.length) {
        this.renderChapter(index);

        const firstWordInElementIndex = targetEl.find(`span:first-child`).length
          ? +targetEl.find(`span:first-child`).attr("n")
          : +targetEl.next("span[n]").attr("n") ||
            +targetEl.parent().find("span[n]:last-child").attr("n");

        this.goToPage(this.getPageNumberByWordIndex(firstWordInElementIndex));

        // Highlight element after render page
        this.highlightSelectedElement($(elementSelector)[0]);
      }
    });
    $(UTILS.DOM_ELS.book).removeClass("loading");
  }

  /**
    Get element by id
  */
  highlightSelectedElement(el: HTMLElement): void {
    $(el).addClass("highlight-element");
    setTimeout(() => {
      $(el).removeClass("highlight-element");
    }, 1000);
  }

  /**
    Get element by id
  */
  getElement(selector: string): HTMLElement {
    let el: HTMLElement = null;
    selector = selector.includes(".") ? selector.replace(".", "\\.") : selector;
    // check if it is in the same chapter

    if ($(this.currentChapter.chapterEl).find(selector).length) {
      return $(this.currentChapter.chapterEl).find(selector)[0];
    }
    this.chapters.forEach((chapter: HTMLElement, index: number) => {
      if ($(chapter).find(selector).length) {
        el = $(chapter).find(selector)[0];
      }
    });

    return el;
  }

  /**
    Render specific chapter with chapter index
  */
  getPageNumberByWordIndex(wordIndex: number): number {
    let pageNo = 0;
    this.currentChapter.pagesContentRanges.forEach((page, pageIndex) => {
      const min = Math.min(page[0], page[1]),
        max = Math.max(page[0], page[1]);
      if (
        (wordIndex > min && wordIndex < max) ||
        wordIndex === min ||
        wordIndex === max
      ) {
        pageNo = pageIndex;
      }
    });

    return pageNo;
  }

  /**
    Render specific chapter with chapter index
  */
  renderChapter(chapterIndex: number): void {
    this.currentChapterIndex = Math.min(
      chapterIndex || 0,
      this.chapters.length - 1
    );

    this.currentChapter = new BookChapter(
      this.chapters[this.currentChapterIndex],
      this.bookId,
      this.currentChapterIndex,
      this.rootFolder
    );
    this.currentChapter.calcPagesContentRanges();
    this.changePage("first");

    setTimeout(() => {
      this.currentChapter.calcPagesContentRanges();
    }, 1000);
    this.handleClickOnAnchors();
  }

  /**
    Go to specific page
  */
  goToPage(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.changePage();
  }

  /**
   * Disables and enables the page and chapter navigation buttons depending on the current state of the current page and current chapter
   * @memberof Book
   */
  matchPageControlsWithState() {
    if (
      UTILS.DOM_ELS.prevChapterBtn &&
      UTILS.DOM_ELS.nextChapterBtn &&
      UTILS.DOM_ELS.prevPageBtn &&
      UTILS.DOM_ELS.nextPageBtn
    ) {
      if (UTILS.calcPageCount() < 2 && this.chapters.length < 2) {
        UTILS.DOM_ELS.prevChapterBtn.disabled = true;
        UTILS.DOM_ELS.nextChapterBtn.disabled = true;
        UTILS.DOM_ELS.prevPageBtn.disabled = true;
        UTILS.DOM_ELS.nextPageBtn.disabled = true;
      } else if (this.isFirstPage && this.isFirstChapter) {
        UTILS.DOM_ELS.prevChapterBtn.disabled = true;
        UTILS.DOM_ELS.nextChapterBtn.disabled = false;
        UTILS.DOM_ELS.prevPageBtn.disabled = true;
        UTILS.DOM_ELS.nextPageBtn.disabled = false;
      } else if (this.isLastPage && this.isLastChapter) {
        UTILS.DOM_ELS.prevChapterBtn.disabled = false;
        UTILS.DOM_ELS.nextChapterBtn.disabled = true;
        UTILS.DOM_ELS.prevPageBtn.disabled = false;
        UTILS.DOM_ELS.nextPageBtn.disabled = true;
      } else {
        UTILS.DOM_ELS.prevChapterBtn.disabled = false;
        UTILS.DOM_ELS.nextChapterBtn.disabled = false;
        UTILS.DOM_ELS.prevPageBtn.disabled = false;
        UTILS.DOM_ELS.nextPageBtn.disabled = false;
      }
      if (this.isLastChapter) UTILS.DOM_ELS.nextChapterBtn.disabled = true;
    }
  }

  /**
      Changes the current viewed page into a different one depending on the inputted mode
    */
  async changePage(mode?: "next" | "prev" | "first" | "last") {
    switch (mode) {
      case "next":
        if (!this.isLastPage) this.currentPage++;
        else if (this.isLastPage && !this.isLastChapter)
          this.changeChapter("next");
        break;
      case "prev":
        if (!this.isFirstPage) this.currentPage--;
        else if (this.isFirstPage && !this.isFirstChapter) {
          //go to prev chapter last page
          this.changeChapter("prev");
          this.currentPage = UTILS.calcPageCount() - 1;
        }
        break;
      case "first":
        this.currentPage = 0;
        break;
      case "last":
        this.currentPage = UTILS.calcPageCount() - 1;
        break;
      default:
        break;
    }
    //Update the state of chapter and page
    this.updateChapterPageState();
    //update scroll percentage
    this.currentScrollPercentage = this.currentPage / UTILS.calcPageCount();
    //scroll to the current page
    this.scrollToCurrentPage();
    //update the ID of first and last word in the current page
    this.updateStartEndWordID();
    //update DOM with page content percentage
    this.updateProgressPercentage();
    //disable or enable the pagination controls
    this.matchPageControlsWithState();
  }

  /**
    Updates the ID of first and last word in the current page
  */
  updateStartEndWordID() {
    this.currentPageFirstWordIndex =
      this.currentChapter.pagesContentRanges[this.currentPage][0];

    this.currentPageLastWordIndex =
      this.currentChapter.pagesContentRanges[this.currentPage][1];

    this.anchorWordIndex = this.currentPageFirstWordIndex;
  }

  /**
    Calculates the page where the anchor word resides depending on its location.  
  */
  calcAnchorWordPage(): number {
    let pageNo = 0;
    this.currentChapter.pagesContentRanges.forEach((page, pageIndex) => {
      const min = Math.min(page[0], page[1]),
        max = Math.max(page[0], page[1]);
      if (
        (this.anchorWordIndex > min && this.anchorWordIndex < max) ||
        this.anchorWordIndex === min ||
        this.anchorWordIndex === max
      ) {
        pageNo = pageIndex;
      }
    });

    return pageNo;
  }

  /**
      Changes the font size of the rendered book depending on the inputted mode
    */
  changeFontSize(mode?: "bigger" | "smaller" | "reset") {
    const fontStepPx = this.fontSizeStep * this.rootFontSize;
    const bookContainer = document.querySelector(
      ".book-container"
    ) as HTMLElement;
    switch (mode) {
      case "bigger":
        if (this.canIncreaseFont) {
          this.fontSize = this.fontSize + fontStepPx;
          bookContainer.style.fontSize = this.fontSize + "px";
        }
        break;
      case "smaller":
        if (this.canDecreaseFont) {
          this.fontSize = this.fontSize - fontStepPx;
          bookContainer.style.fontSize = this.fontSize + "px";
        }
        break;
      case "reset":
        this.fontSize = this.rootFontSize;
        bookContainer.style.fontSize = "";
      default:
        bookContainer.style.fontSize = this.fontSize + "px";
        break;
    }
    this.updateFontIncreaseDecreaseState();
  }

  /**
    Sets the color mode to the desired state
  */
  changeColorMode(colorMode: string) {
    this.colorMode = colorMode || "white";
    UTILS.DOM_ELS.colorModeBtns.forEach((item) => {
      document.body.classList.remove(item.dataset.value);
    });
    document.body.classList.add(this.colorMode);
    document
      .querySelector(`[data-value=${this.colorMode}]`)
      ?.classList.add("selected");
  }

  /**
    Sets the font family to the desired state
  */
  changeFontFamily(fontFamily: string) {
    this.fontFamily = fontFamily || "NotoNaskhArabic";
    UTILS.DOM_ELS.fontFamilyBtns.forEach((item) => {
      document.body.classList.remove(item.dataset.value);
    });
    (
      document.querySelector(".book-container") as HTMLElement
    ).style.fontFamily = this.fontFamily;

    const selectedFontFamily = document.querySelector(
      `[data-value=${this.fontFamily}]`
    ).textContent;
    UTILS.DOM_ELS.selectedFontFamily.textContent = `${selectedFontFamily}`;
    document
      .querySelector(`[data-value=${this.fontFamily}]`)
      ?.classList.add("selected");
  }

  /**
    Render bookmarks list into DOM
  */
  renderBookmarks() {
    const list = UTILS.DOM_ELS.bookmarksList;

    if (this.bookmarks) {
      $(list).html("");
      this.bookmarks.forEach((bookmark) => {
        $(list).append(
          `
          <li class="bookmark-item" data-chapter-index="${
            bookmark.chapterIndex
          }" data-anchor-word-index="${bookmark.anchorWordIndex}">
            <div>
              <h4>${bookmark.title}</h4>
              <p>${new Date(bookmark.createdOn).toUTCString()}</p>
            </div>
            <button class="btn-icon btn">
              <i class="f-icon trash-icon"></i>
            </button>
          </li>
          `
        );
      });
    }
  }

  /**
    Add book styles to the index.html head
  */
  addBookStyles() {
    const style = document.createElement("style");
    // style.textContent = this.bookCss
    //   .replaceAll("{", "\n{\n")
    //   .replaceAll("}", "\n}\n");
    style.textContent = this.bookCss;
    document.head.prepend(style);
  }

  /**
    Handle click on footnotes or any link that target element inside the book
  */
  handleClickOnAnchors(): void {
    document.querySelectorAll("a:not(.regular-link)").forEach((btn) => {
      const value =
        btn.getAttribute("href")?.split("#")[1] ||
        btn.getAttribute("href")?.split("#")[0];

      if (value) {
        btn.addEventListener("click", this.goToElement.bind(this, value));
      }
    });
  }

  /**
    Generating book table of content
  */
  generateBookTableOfContent() {
    if (!this.tableOfContents.length) {
      $(UTILS.DOM_ELS.showTableOfContenBtn).remove();
      return;
    }

    // Filling table of content with list of chapters
    $(UTILS.DOM_ELS.tableOfContentList).html("");
    this.tableOfContents.forEach((item, index) => {
      $(UTILS.DOM_ELS.tableOfContentList).append(
        ` <li data-chapter-index="${item.chapterIndex}">
            <h4>${item.chapterTitle}</h4>
            <span> ${index + 1} </span>
          </li>
        `
      );
    });

    // Binding the click event on each row
    UTILS.DOM_ELS.tableOfContentList.querySelectorAll("li")?.forEach((row) => {
      const chapterIndex = +row.getAttribute("data-chapter-index");
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        this.renderChapter(chapterIndex);
        $(UTILS.DOM_ELS.tableOfContentWrapper).removeClass(
          "book-content-list--show"
        );
      });
    });
  }
}
