import { IBookmark } from "../Models/IBookmark.model";
import { Book } from "./Book";
import { BookChapter } from "./BookChapter";
import { HTMLExtractor } from "./HTMLExtractor";
import { UserPreferences } from "./UserPreferences";
import { UTILS } from "./Utils";

export class Controller {
  htmlExtractor: HTMLExtractor;
  book: Book;
  userPreferences: UserPreferences;
  constructor() {}

  /**
    Initiates the app asynchronously by tacking the book ID and fetching the HTML document
  */
  async initWithBookId(bookId: string) {
    this.htmlExtractor = new HTMLExtractor(bookId);
    await this.htmlExtractor.extractChapters();
    this.detectUserPreferences(bookId);
    this.setupHandlers();
    this.setupEventListeners();
  }

  /**
    Instantiates all the handlers required for the app to run
  */
  setupHandlers() {
    this.book = new Book(
      this.htmlExtractor.bookId,
      this.htmlExtractor.chapters,
      this.htmlExtractor.imagesFolder,
      this.htmlExtractor.rootFolder,
      this.htmlExtractor.cssFiles,
      this?.userPreferences?.fontSize,
      this?.userPreferences?.chapter,
      this?.userPreferences?.anchorWordIndex,
      this?.userPreferences?.colorMode,
      this?.userPreferences?.fontFamily,
      this?.userPreferences?.bookmarks
    );
  }

  /**
    Detects the previous state of the app the last time the user used it
  */
  detectUserPreferences(bookId: string) {
    this.userPreferences = new UserPreferences(bookId);
    this.userPreferences.load();
  }

  /**
    Stores the current state of the app
  */
  storeUserPreferences() {
    this?.userPreferences?.save(
      this.book.anchorWordIndex,
      this.book.currentChapterIndex,
      this.book.fontSize,
      this.book.colorMode,
      this.book.fontFamily,
      this.book.bookmarks
    );
  }

  /**
    Sets up the event listeners needed for the app to run
  */
  setupEventListeners() {
    window?.addEventListener("resize", () =>
      setTimeout(this.resizeEventHandler.bind(this), 0)
    );
    $(window).on("orientationchange", () =>
      setTimeout(this.resizeEventHandler.bind(this), 0)
    ); //The only jQuery line
    document.onfullscreenchange = () =>
      setTimeout(this.resizeEventHandler.bind(this), 0);
    //DOM Elements event listeners
    UTILS.DOM_ELS.nextPageBtn?.addEventListener(
      "click",
      this.goToNextPage.bind(this)
    );
    UTILS.DOM_ELS.prevPageBtn?.addEventListener(
      "click",
      this.goToPrevPage.bind(this)
    );
    UTILS.DOM_ELS.nextChapterBtn?.addEventListener(
      "click",
      this.goToNextChapter.bind(this)
    );
    UTILS.DOM_ELS.prevChapterBtn?.addEventListener(
      "click",
      this.goToPrevChapter.bind(this)
    );
    UTILS.DOM_ELS.biggerFontBtn?.addEventListener(
      "click",
      this.increaseFontSize.bind(this)
    );
    UTILS.DOM_ELS.smallerFontBtn?.addEventListener(
      "click",
      this.decreaseFontSize.bind(this)
    );
    UTILS.DOM_ELS.resetFontBtn?.addEventListener(
      "click",
      this.resetFontSize.bind(this)
    );
    UTILS.DOM_ELS.showFonts?.addEventListener(
      "click",
      this.showFontFamilies.bind(this)
    );
    UTILS.DOM_ELS.hideFonts?.addEventListener(
      "click",
      this.hideFontFamilies.bind(this)
    );
    UTILS.DOM_ELS.addBookmarkBtn?.addEventListener(
      "click",
      this.addBookmark.bind(this)
    );
    UTILS.DOM_ELS.colorModeBtns?.forEach((btn) => {
      btn.addEventListener("click", this.colorModeEventHandler.bind(this));
    });
    UTILS.DOM_ELS.fontFamilyBtns?.forEach((btn) => {
      btn.addEventListener("click", this.fontFamilyEventHandler.bind(this));
    });
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn.addEventListener("click", this.bookmarkEventHandler.bind(this));
    });
  }

  /**
    Handles the window resize event
  */
  resizeEventHandler = () => {
    this.book.currentChapter.calcPagesContentRanges();
    this.changePageToAnchorWordLocation();
    this.storeUserPreferences();
  };

  /**
    Changes current page to a page matching the current scroll percentage
  */
  changePageToCurrentPercentage() {
    this.book.currentPage = Math.round(
      this.book.currentScrollPercentage * UTILS.calcPageCount()
    );

    this.book.changePage();
  }

  /**
    Changes current page to a page matching the location where the anchor word resides
  */
  changePageToAnchorWordLocation() {
    this.book.currentPage = this.book.calcAnchorWordPage();
    this.book.changePage();
  }

  /**
    add bookmark for the current page
  */
  addBookmark() {
    const bookmarks = this.book.bookmarks || [];
    const bookmark: IBookmark = {
      title: this.book.currentChapter.chapterEl.querySelector("h1").textContent,
      chapterIndex: this.book.currentChapterIndex,
      anchorWordIndex: this.book.anchorWordIndex,
      createdOn: Date.now(),
    };
    bookmarks.push(bookmark);
    this.book.bookmarks = bookmarks;
    this.book.renderBookmarks();

    // Appending event listeners to appended elements
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn.addEventListener("click", this.bookmarkEventHandler.bind(this));
    });
    this.storeUserPreferences();
  }

  /**
    Handles what happens after any navigation
  */
  postNavigationHandler() {
    this.storeUserPreferences();
  }

  /**
    Handles what happens after any font resizing
  */
  postFontResizeHandler() {
    this.book.currentChapter.calcPagesContentRanges();
    this.changePageToAnchorWordLocation();
    this.storeUserPreferences();
    $(".actions-menu").remove();
  }

  /**
    Navigates to next page
  */
  goToNextPage() {
    this.book.changePage("next");
    this.postNavigationHandler();
  }

  /**
    Navigates to previous page
  */
  goToPrevPage() {
    this.book.changePage("prev");
    this.postNavigationHandler();
  }

  /**
    Navigates to first page
  */
  goToFirstPage() {
    this.book.changePage("first");
    this.postNavigationHandler();
  }

  /**
    Navigates to last page
  */
  goToLastPage() {
    this.book.changePage("last");
    this.postNavigationHandler();
  }

  /**
    Navigates to next chapter
  */
  goToNextChapter() {
    this.book.changeChapter("next");
    this.postNavigationHandler();
  }

  /**
    Navigates to previous chapter
  */
  goToPrevChapter() {
    this.book.changeChapter("prev");
    this.postNavigationHandler();
  }

  /**
    Navigates to first chapter
  */
  goToFirstChapter() {
    this.book.changeChapter("first");
    this.postNavigationHandler();
  }

  /**
    Navigates to last chapter
  */
  goToLastChapter() {
    this.book.changeChapter("last");
    this.postNavigationHandler();
  }

  /**
    Increments Font Size
  */
  increaseFontSize() {
    this.book.changeFontSize("bigger");
    this.postFontResizeHandler();
  }

  /**
    Decrements font size
  */
  decreaseFontSize() {
    this.book.changeFontSize("smaller");
    this.postFontResizeHandler();
  }

  /**
    Resets font size to default value
  */
  resetFontSize() {
    this.book.changeFontSize("reset");
    this.postFontResizeHandler();
  }

  /**
    Sets font size to a desired value
  */
  setFontSize(fontSize: number) {
    this.book.fontSize = fontSize;
    this.book.changeFontSize();
    this.postFontResizeHandler();
  }

  /**
    Sets color mode to a desired value
  */
  setColorMode(colorMode: string) {
    this.book.changeColorMode(colorMode);
    this.storeUserPreferences();
  }

  /**
    Sets font family to a desired value
  */
  setFontFamily(fontFamily: string) {
    this.book.changeFontFamily(fontFamily);
    this.storeUserPreferences();
  }

  showFontFamilies() {
    $(".view-config").slideUp(300);
    $(".fonts").slideDown(300);
  }
  hideFontFamilies() {
    $(".view-config").slideDown(300);
    $(".fonts").slideUp(300);
  }

  /**
    Handles what happened after changing theme color
  */
  colorModeEventHandler(e: any) {
    UTILS.DOM_ELS.colorModeBtns?.forEach((btn) => {
      btn.classList.remove("selected");
    });
    e.target.classList.add("selected");
    this.setColorMode(e.target.dataset.value);
  }

  /**
    Handles what happened after changing font family
  */
  fontFamilyEventHandler(e) {
    UTILS.DOM_ELS.fontFamilyBtns?.forEach((btn) => {
      btn.classList.remove("selected");
    });
    e.target.classList.add("selected");
    this.setFontFamily(e.target.dataset.value);
  }

  /**
    Handles what happened after clicking on specific bookmark in the list
  */
  bookmarkEventHandler(e) {
    const el = e.target.closest("li") as HTMLElement;
    const chapterIndex = el.getAttribute("data-chapter-index");
    const anchorWordIndex = +el.getAttribute("data-anchor-word-index");

    this.book.currentChapter = new BookChapter(
      this.book.chapters[chapterIndex],
      this.book.imagesFolder,
      this.book.rootFolder,
      this.book.bookId,
      this.book.currentChapterIndex
    );

    // Detect anchor word page index
    this.book.currentChapter.pagesContentRanges.forEach((page, pageIndex) => {
      const min = Math.min(page[0], page[1]),
        max = Math.max(page[0], page[1]);
      if (
        (anchorWordIndex > min && anchorWordIndex < max) ||
        anchorWordIndex === min ||
        anchorWordIndex === max
      ) {
        this.book.currentPage = pageIndex;
        this.book.changePage();
      }
    });
  }
}
