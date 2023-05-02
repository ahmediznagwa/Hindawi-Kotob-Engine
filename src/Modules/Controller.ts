import { Book } from "./Book";
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
      this?.userPreferences?.fontSize,
      this?.userPreferences?.chapter,
      this?.userPreferences?.page,
      this?.userPreferences?.colorMode,
      this?.userPreferences?.fontFamily
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
      this.book.currentPage,
      this.book.currentChapterIndex,
      this.book.fontSize,
      this.book.colorMode,
      this.book.fontFamily
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
    UTILS.DOM_ELS.colorModeBtns?.forEach((btn) => {
      btn.addEventListener("click", this.colorModeEventHandler.bind(this));
    });
    UTILS.DOM_ELS.fontFamilyBtns?.forEach((btn) => {
      btn.addEventListener("click", this.fontFamilyEventHandler.bind(this));
    });
  }

  /**
      Handles the window resize event
    */
  resizeEventHandler = () => {
    this.book.currentChapter.calcPagesContentRanges();
    this.changePageToCurrentPercentage();
    this.storeUserPreferences();
  };

  /**
      Changes current page to a page matching the current scroll percentage
    */
  changePageToCurrentPercentage() {
    this.book.changePage();
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
    this.changePageToCurrentPercentage();
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

  colorModeEventHandler(e: any) {
    UTILS.DOM_ELS.colorModeBtns?.forEach((btn) => {
      btn.classList.remove("selected");
    });
    e.target.classList.add("selected");
    this.setColorMode(e.target.dataset.value);
  }
  fontFamilyEventHandler(e) {
    UTILS.DOM_ELS.fontFamilyBtns?.forEach((btn) => {
      btn.classList.remove("selected");
    });
    e.target.classList.add("selected");
    this.setFontFamily(e.target.dataset.value);
  }
}
