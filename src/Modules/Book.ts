import { IBookmark } from "../Models/IBookmark.model";
import { BookChapter } from "./BookChapter";
import { UTILS } from "./Utils";
import { prodRootUrl } from "./constants";

export class Book {
  bookId: string;
  chapters: HTMLDivElement[];
  imagesFolder: string;
  rootFolder: string;
  cssFiles: string[];
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

  constructor(
    bookId,
    chapters,
    imagesFolder,
    rootFolder,
    cssFiles,
    fontSize = 18,
    currentChapterIndex = 0,
    anchorWordIndex,
    colorMode = "white",
    fontFamily = "NotoNaskhArabic",
    bookmarks = []
  ) {
    this.bookId = bookId;
    this.bookWordsCount = null;
    this.chapters = chapters;
    this.imagesFolder = imagesFolder;
    this.rootFolder = rootFolder;
    this.cssFiles = cssFiles;
    this.currentChapterIndex = Math.min(
      currentChapterIndex || 0,
      this.chapters.length - 1
    );
    this.currentChapter = new BookChapter(
      this.chapters[this.currentChapterIndex],
      this.imagesFolder,
      this.rootFolder,
      this.bookId,
      this.currentChapterIndex
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
    this.currentChapter.calcPagesContentRanges();
    this.currentPage = this.calcAnchorWordPage();
    this.changePage();
    this.renderBookmarks();
    this.addBookStyles();
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
    const section = document.createElement("section") as HTMLElement;
    section.classList.add("book");
    section.classList.add("demo");
    section.innerHTML = "";
    this.chapters.forEach((chapter: HTMLDivElement) => {
      section.innerHTML = section.innerHTML += chapter.innerHTML;
    });
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
      (this.currentPageFirstWordIndex -
        1 +
        t *
          (this.currentPageLastWordIndex -
            this.currentPageFirstWordIndex +
            1)) /
      this.bookWordsCount;
    this.currentProgressPercent = (percentage || 0) * 100;

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
        if (!this.isFirstChapter && this.isFirstPage)
          this.currentChapterIndex--;
        else if (!this.isFirstPage) this.currentPage = 0;
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
    //render the new chapter
    if (oldChapterIndex !== this.currentChapterIndex)
      this.currentChapter = new BookChapter(
        this.chapters[
          Math.min(this.currentChapterIndex, this.chapters.length - 1)
        ],
        this.imagesFolder,
        this.rootFolder,
        this.bookId,
        this.currentChapterIndex
      );
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
  changePage(mode?: "next" | "prev" | "first" | "last") {
    //increment or decrement the current page
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
    console.log(this.currentPage);
    console.log(UTILS.calcPageCount);
    
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
    console.log(this.currentChapter.pagesContentRanges);

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

    if (this.bookmarks && this.bookmarks.length) {
      $(list).html("");
      this.bookmarks.forEach((bookmark) => {
        $(list).append(
          `
          <li class="bookmark-item" data-chapter-index="${
            bookmark.chapterIndex
          }" data-anchor-word-index="${bookmark.anchorWordIndex}">
            <h4>${bookmark.title}</h4>
            <p>${new Date(bookmark.createdOn).toUTCString()}</p>
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
    this.cssFiles.forEach((filePath) => {
      const link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = `${prodRootUrl}/packages/${this.bookId}/${this.rootFolder}/${filePath}`;
      document.head.prepend(link);
    });
  }
}