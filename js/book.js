const bookEl = document.querySelector(".book");
const bookChapterEl = document.querySelector(".book-chapter");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

/**
 * Creates an HTML extractor with all the tools to handle the HTML file
 * @class EpubExtractor
 */
class EpubExtractor {
  /**
   * Creates an instance of EpubExtractor.
   * @memberof EpubExtractor
   */
  constructor() {
    this.epubId = null;
    /** @type {HTMLElement}*/ this.bodyEl;
    this.chapters = [];
    this.language = "ar";
  }

  /**
   * Sets the current HTML document to the inputted HTML string after parsing
   * @param {string} htmlString The HTML string to be parsed
   * @return {HTMLDocument} The parsed HTML document
   * @memberof EpubExtractor
   */
  setHTMLDoc(htmlString) {
    const parser = new DOMParser();
    this.htmlDoc = parser.parseFromString(htmlString, "text/html");
    this.extractDataFromHTML();
    return this.htmlDoc;
  }

  /**
   * Fetches the HTML document corresponding to the input HTML id asynchronously
   * @param {string=} epubId The ID of the html to be fetched
   * @return {Promise<HTMLDocument | undefined>} The HTML document
   * @memberof EpubExtractor
   */
  async getHTMLDoc(epubId) {
    const res = await fetch(`../packages/${epubId}/chapter-1-4.xhtml`);
    const htmlTxt = await res.text();
    return this.setHTMLDoc(htmlTxt);
  }

  extractDataFromHTML() {
    this.bodyEl = this.htmlDoc.querySelector("body");
    this.chapters.push(this.bodyEl.firstElementChild);
    return {
      chapters: this.chapters,
      language: this.language,
    };
  }
}

/**
 * Creates a chapter and keeps track of pages content of the chapter
 * @class BookChapter
 */
class BookChapter {
  /**
   * Creates and renders an instance of BookChapter.
   * @param {HTMLElement} chapterEl The chapter element extracted from the main book element in the HTML document
   * @param {"en" | "ar"} language a string representing the language of the chapter
   * @memberof BookChapter
   */
  constructor(chapterEl, language) {
    this.chapterEl = chapterEl;
    /**
     * An array of arrays containing the index of the starting and ending words of each page for the current rendered chapter
     * @type {number[][]} `[[pageIndexStart, pageIndexEnd],...]`
     */
    this.language = language;
    this.page = 0;
    this.bookContainerPadding = 0;
    this.exactColumnsGap = 0;
    this.exactColumnWidth = 0;
    this.columnWidth = 0;
    this.renderChapter();
  }

  /**
   * Calculates the left edge position of the page in the rendered HTML
   * @return {number}  the left edge position of the page
   * @memberof BookChapter
   */
  getPageLeft() {
    return this.language === "ar"
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
   * Calculates the right edge position of the page in the rendered HTML
   * @return {number}  the right edge position of the page
   * @memberof BookChapter
   */
  getPageRight() {
    return this.getPageLeft() + this.exactColumnWidth;
  }

  /**
   * Checks whether an element is or is not in the current page
   * @param {HTMLElement} el The element to be checked
   * @return {boolean} Is the element in another page
   * @memberof BookChapter
   */
  isInOtherPage(el) {
    if (this.language === "ar")
      return (
        this.getPageRight() -
          (el?.offsetLeft + Math.min(el?.offsetWidth, this.columnWidth)) >=
        this.columnWidth - this.ROUNDING_TOLERANCE
      );
    return (
      el?.offsetLeft - this.getPageLeft() >=
      this.columnWidth - this.ROUNDING_TOLERANCE
    );
  }

  /**
   * Creates a section continuing everything inside the chapterEl and renderers it to the DOM
   * @memberof BookChapter
   */
  renderChapter() {
    const section = document.createElement("section");
    section.classList.add("book-chapter");
    section.innerHTML = this.chapterEl?.innerHTML;
    UTILS.DOM_ELS.book.innerHTML = "";
    UTILS.DOM_ELS.book.append(section);
  }
}

/**
 * A class containing all the utilities needed for the application to run
 * @class UTILS
 */
class UTILS {
  /**
   * An object containing all the DOM elements required for the app to run
   * @static
   * @memberof UTILS
   */
  static DOM_ELS = {
    get nextPageBtn() {
      return document.querySelector(".pagination-next-page");
    },
    get prevPageBtn() {
      return document.querySelector(".pagination-prev-page");
    },
    get nextChapterBtn() {
      return document.querySelector(".pagination-next-chapter");
    },
    get prevChapterBtn() {
      return document.querySelector(".pagination-prev-chapter");
    },
    get percent() {
      return document.querySelector(".pagination-percent");
    },
    get book() {
      return document.querySelector(".book");
    },
    get bookChapter() {
      return document.querySelector(".book-chapter");
    },
    get bookContainer() {
      return document.querySelector(".book-container");
    },
    get bookWrapper() {
      return document.querySelector(".book-wrapper");
    },
  };

  /**
   * Extracts the exact number value of a desired style of an element
   * @param {HTMLElement} el The desired HTML element
   * @param {keyof CSSStyleDeclaration} style The string name of the style needed to be extracted
   * @return {number} The exact computed style number
   * @static
   * @memberof UTILS
   */
  static extractComputedStyleNumber(el, style) {
    const str = getComputedStyle(el)[style];
    return +str.substr(0, str.length - 2);
  }

  /**
   * Calculates the current amount of pages rendered
   * @return {number} the current amount of pages rendered
   * @static
   * @memberof UTILS
   */
  static calcPageCount() {
    const columnsGap =
      this.extractComputedStyleNumber(this.DOM_ELS.book, "column-gap") || 0;
    return Math.round(
      (this.DOM_ELS.book.scrollWidth + columnsGap) /
        (this.DOM_ELS.book.offsetWidth + columnsGap)
    );
  }

  /**
   * Extracts the book ID from the URL query params and falls back to the `data-book-id` tag on the section element with `book` id
   * @static
   * @return {string=} The extracted book ID
   * @memberof UTILS
   */
  static getBookId() {
    const searchingURLResult = window.location.search.match(/book_id=(.*)&?/);
    const bookFromURL =
      searchingURLResult && searchingURLResult[1]
        ? searchingURLResult[1]
        : undefined;
    const bookId = bookFromURL || UTILS.DOM_ELS.book.dataset.bookId;
    return bookId;
  }

  /**
   * Checks the browser's compatibility with scrollLeft value and checks whether it reaches negative values or not. This is happening because of chromium bug Number: `721759`, see: {@link https://bugs.chromium.org/p/chromium/issues/detail?id=721759 Chromium Bug 721759}
   * @readonly
   * @static
   * @return {boolean} Whether the scrollLeft in RTL mode goes to negative values or not
   * @memberof UTILS
   */
  static get isScrollLeftRTLNegative() {
    const parentTestDiv = document.createElement("div");
    parentTestDiv.dir = "rtl";
    parentTestDiv.style.visibility = "hidden";
    parentTestDiv.style.overflow = "hidden";
    parentTestDiv.style.width = "10px";
    parentTestDiv.style.position = "fixed";
    parentTestDiv.style.top = "-100vh";
    parentTestDiv.style.left = "-100vw";
    for (let i = 0; i < 2; i++) {
      const child = document.createElement("div");
      child.style.width = "20px";
      child.innerHTML = "&nbsp;";
      parentTestDiv.appendChild(child);
    }
    document.body.appendChild(parentTestDiv);
    parentTestDiv.scrollTo(-100, 0);
    const scrollValue = parentTestDiv.scrollLeft;
    document.body.removeChild(parentTestDiv);
    return scrollValue < 0;
  }
}

/**
 * Creates a controller that runs the whole application
 * @class Controller
 */
class Controller {
  /**
   * Creates an instance of Controller.
   * @memberof Controller
   */
  constructor() {
    this.touchMaxSwipeTime = 400; //maximum time in ms for a gesture to be considered a swipe
    this.touchMinSwipeDistance = 50; //minimum horizontal distance for a gesture to be considred swipe
    this.touchMaxVerticalSwipeDistance = 300; //maximum vertical distance for a gesture to be considred swipe
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.audioCurrentInterval = null;
    this.audioIntervalDuration = 100; //ms
  }

  /**
   * A callback function that runs after any navigation happens in the app. Note: this callback function can and will be overwritten by the children of this class
   * @memberof Controller
   */
  afterNavigationCallback() {}

  /**
   * A callback function that runs after any font size changes happen in the app. Note: this callback function can and will be overwritten by the children of this class
   * @memberof Controller
   */
  afterFontResizeCallback() {}

  /**
   * A callback function that runs after any window resizing happen in the app. Note: this callback function can and will be overwritten by the children of this class
   * @memberof Controller
   */
  afterWindowResizeCallback() {}

  /**
   * A callback function that runs after any changes in dark mode happen in the app. Note: this callback function can and will be overwritten by the children of this class
   * @memberof Controller
   */
  afterDarkModeChangeCallback() {}

  /**
   * A callback function that runs after changing diacritics type. Note: this callback function can and will be overwritten by the children of this class
   * @memberof Controller
   */
  afterDiacriticsTypeChangeCallback() {}

  /**
   * Initiates the app asynchronously by tacking the HTML ID and fetching the HTML document string
   * @param {string} htmlId The ID of the book we want to initiate
   * @memberof Controller
   */
  async initWithHTMLId(htmlId) {
    this.htmlExtractor = new EpubExtractor();
    await this.htmlExtractor.getHTMLDoc(htmlId);
    await document.fonts.ready;
    this.setupHandlers();
    this.setupEventListeners();
  }

  /**
   * Initiates the app locally and synchronously by tacking the HTML document string
   * @param {string} htmlString The string of the HTML document to be rendered
   * @memberof Controller
   */
  initWithHTMLString(htmlString) {
    this.htmlExtractor = new EpubExtractor();
    this.setupHandlers();
    this.setupEventListeners();
  }

  /**
   * Instantiates all the handlers required for the app to run
   * @memberof Controller
   */
  setupHandlers() {
    this.bookHandler = new BookHandler(
      this.htmlExtractor.chapters,
      this.htmlExtractor.language
    );
  }

  /**
   * Sets up the event listeners needed for the app to run
   * @memberof Controller
   */
  setupEventListeners() {
    UTILS.DOM_ELS.nextPageBtn?.addEventListener(
      "click",
      this.goToNextPage.bind(this)
    );
    UTILS.DOM_ELS.prevPageBtn?.addEventListener(
      "click",
      this.goToPrevPage.bind(this)
    );
  }

  /**
   * Navigates to next page
   * @memberof Controller
   */
  goToNextPage() {
    this.bookHandler.changePage("next");
  }

  /**
   * Navigates to previous page
   * @memberof Controller
   */
  goToPrevPage() {
    this.bookHandler.changePage("prev");
  }
}

/**
 * A class containing current chapter with all the controls needed to change the chapter and navigate its pages
 * @class BookHandler
 */
class BookHandler {
  /**
   * Creates an instance of BookHandler.
   * @param {HTMLElement[]} chapters An list of the book chapters
   * @param {"en"|"ar"} language The language of the book
   * @param {number=} [fontSize=18] The font size of the book
   * @param {number=} [currentChapterIndex=0] The initial chapter index for the book handler
   * @memberof BookHandler
   */
  constructor(chapters, language, fontSize = 100, currentChapterIndex = 0) {
    this.originalChapters = chapters;
    this.revertChapters();
    this.language = language;
    this.currentChapterIndex = Math.min(
      currentChapterIndex || 0,
      this.chapters.length - 1
    );
    this.renderCurrentChapter();
    this.currentScrollPercentage = 0;
    this.currentProgressPercent = 0;
    this.rootFontSize = 100; //PERCENT
    this.fontSizeStep = 15; //PERCENT
    this.maxFontSize = this.rootFontSize + 2 * this.fontSizeStep;
    this.minFontSize = this.rootFontSize - 2 * this.fontSizeStep;
    this.fontSize = fontSize
      ? Math.max(Math.min(fontSize, this.maxFontSize), this.minFontSize)
      : this.rootFontSize; //limits input fontSize between the min and max font sizes or falls back to rootFontSize
    this.changeFontSize();
    this.currentPage = 0;
  }

  /**
   * Gets the true current chapter index ignoring all the chapters with data-type "SPLIT" before the current chapter
   * @readonly
   * @memberof BookHandler
   */
  get trueCurrentChapterIndex() {
    //counts all the temporary chapters before the current chapter
    let tempChaptersCount = 0;
    for (let i = this.currentChapterIndex; i >= 0; i--)
      if (this.chapters[i]?.dataset?.type) tempChaptersCount++;
    return this.currentChapterIndex - tempChaptersCount;
  }

  /**
   * Reverts the chapters to the original chapters extracted from the HTML document
   * @memberof BookHandler
   */
  revertChapters() {
    this.currentChapterIndex = this.trueCurrentChapterIndex;
    this.chapters = this.originalChapters.map((el) => el.cloneNode(true));
    this.renderCurrentChapter();
  }

  /**
   * Renders the current chapter
   * @memberof BookHandler
   */
  renderCurrentChapter() {
    this.currentChapter = new BookChapter(
      this.chapters[
        Math.min(this.currentChapterIndex, this.chapters.length - 1)
      ],
      this.language
    );
  }

  /**
   * Whether font can be increased or not
   * @readonly
   * @memberof BookHandler
   */
  get canIncreaseFont() {
    return this.fontSize < this.maxFontSize;
  }

  /**
   * Whether font can be decreased or not
   * @readonly
   * @memberof BookHandler
   */
  get canDecreaseFont() {
    return this.fontSize > this.minFontSize;
  }

  /**
   * Scrolls the view window into the current page
   * @memberof BookHandler
   */
  scrollToCurrentPage() {
    const columnWidth = UTILS.extractComputedStyleNumber(
      UTILS.DOM_ELS.book,
      "width"
    );
    let x = columnWidth * this.currentPage;
    if (this.language === "ar") {
      if (UTILS.isScrollLeftRTLNegative) x = -x;
      else x = columnWidth * (UTILS.calcPageCount() - (this.currentPage + 1));
    }
    UTILS.DOM_ELS.book.scrollTo(x, 0);
    console.log(x);
  }

  /**
   * Changes the current viewed page into a different one depending on the inputted mode
   * @param {("next" | "prev" | "first" | "last")=} mode The way the page should be changed
   * @memberof BookHandler
   */
  changePage(mode) {
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
    //update scroll percentage
    this.currentScrollPercentage = this.currentPage / UTILS.calcPageCount();

    //scroll to the current page
    this.scrollToCurrentPage();
  }

  /**
   * Changes the font size of the rendered book depending on the inputted mode
   * @param {("bigger" | "smaller" | "reset")=} mode The way the font size should be changed
   * @memberof BookHandler
   */
  changeFontSize = (mode) => {
    switch (mode) {
      case "bigger":
        if (this.canIncreaseFont) {
          this.fontSize = this.fontSize + this.fontSizeStep;
          UTILS.DOM_ELS.book.style.fontSize = this.fontSize + "%";
        }
        break;
      case "smaller":
        if (this.canDecreaseFont) {
          this.fontSize = this.fontSize - this.fontSizeStep;
          UTILS.DOM_ELS.book.style.fontSize = this.fontSize + "%";
        }
        break;
      case "reset":
        this.fontSize = this.rootFontSize;
        UTILS.DOM_ELS.book.style.fontSize = "";
      default:
        UTILS.DOM_ELS.book.style.fontSize = this.fontSize + "%";
        break;
    }
  };
}

const controller = new Controller();
controller.initWithHTMLId("1708ecc3-7192-427b-8292-35c38bafbfae");
