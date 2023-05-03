import { BookChapter } from "./BookChapter";
import { UTILS } from "./Utils";

export class Book {
  bookId: string;
  chapters: HTMLDivElement[];
  fontSize: number;
  currentChapterIndex: number;
  currentPage: number;
  bookWordsCount: number;
  colorMode: string;
  fontFamily: string;
  currentChapter: BookChapter;
  currentProgressPercent: number;
  currentScrollPercentage: number;
  rootFontSize: number;
  fontSizeStep: number;
  allBookTitles: NodeListOf<HTMLElement> | HTMLElement[];
  isLastPage: boolean;
  isFirstPage: boolean;
  isLastChapter: boolean;
  isFirstChapter: boolean;
  canIncreaseFont: boolean;
  canDecreaseFont: boolean;
  currentPageFirstWordId: number;
  currentPageLastWordId: number;

  constructor(
    bookId,
    chapters,
    fontSize = 18,
    currentChapterIndex = 0,
    currentPage = 0,
    colorMode = "white",
    fontFamily = "NotoNaskhArabic"
  ) {
    this.bookId = bookId;
    this.bookWordsCount = null;
    this.chapters = chapters;
    this.currentChapterIndex = Math.min(
      currentChapterIndex || 0,
      this.chapters.length - 1
    );
    this.currentChapter = new BookChapter(
      this.chapters[this.currentChapterIndex],
      this.bookId,
      this.currentChapterIndex
    );
    this.currentPage = Math.min(currentPage || 0, UTILS.calcPageCount() - 1);
    this.currentProgressPercent = 0;
    this.rootFontSize = 18;
    this.colorMode = colorMode;
    this.fontFamily = fontFamily;
    this.fontSizeStep = 0.15;
    this.fontSize = fontSize || this.rootFontSize;
    this.allBookTitles = [];
    this.changeFontSize();
    this.currentChapter.calcPagesContentRanges();
    this.changeColorMode(this.colorMode);
    this.changeFontFamily(this.fontFamily);
    this.addWholeBook();
    this.changePage();
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
      Adding whole book in the dom to calculate total pages number
    */
  addWholeBook() {
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
    UTILS.DOM_ELS.bookWrapper.append(section);
    this.allBookTitles = UTILS.DOM_ELS.demoBook?.querySelectorAll("h1");
    setTimeout(() => {
      this.scrollToCurrentPage();
    }, 2000);
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

    // Scrolling in the hidden book
    if (this.allBookTitles) {
      const currentChapter = this.allBookTitles[this.currentChapterIndex];
      const currentChapterPos = currentChapter?.offsetLeft - x;
      UTILS.DOM_ELS.demoBook?.scrollTo(currentChapterPos, 0);
    }
  }

  /**
      Updates the DOM element representing the progress percentage value
    */
  updateProgressPercentage() {
    const pageLastWordIndex =
      this.currentChapter.pagesContentRanges[this.currentPage][1];
    this.currentProgressPercent = Math.floor(
      (pageLastWordIndex / this.bookWordsCount) * 100
    );
    if (UTILS.DOM_ELS.percent)
      UTILS.DOM_ELS.percent.innerText = this.currentProgressPercent + "%";
    if (UTILS.DOM_ELS.barPercent)
      UTILS.DOM_ELS.barPercent.querySelector("span").style.width =
        this.currentProgressPercent + "%";
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
    //scroll to the current page
    this.scrollToCurrentPage();
    //update DOM with page content percentage
    this.updateProgressPercentage();
    //disable or enable the pagination controls
    this.matchPageControlsWithState();
    //update the ID of first and last word in the current page
    this.updateStartEndWordID();
  }

  /**
    Updates the ID of first and last word in the current page
  */
  updateStartEndWordID() {
    this.currentPageFirstWordId =
      this.currentChapter.pagesContentRanges[this.currentPage][0];
    this.currentPageLastWordId =
      this.currentChapter.pagesContentRanges[this.currentPage][1];
      console.log(this.currentPageFirstWordId);
      
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
   * Sets the color mode to the desired state
   * @param {string=} colorMode The current color mode state
   * @memberof Book
   */
  changeColorMode(colorMode) {
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
   * Sets the font family to the desired state
   * @param {string=} fontFamily The current font family state
   * @memberof Book
   */
  changeFontFamily(fontFamily) {
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
}
