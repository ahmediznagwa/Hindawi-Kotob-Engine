import { IBookmark } from "../Models/IBookmark.model";
import { PageUpdatedMessage } from "../Models/IPostMessage.model";
import { IUserPreferencesState } from "../Models/IUserPreferencesState.model";
import { Book } from "./Book";
import { BookChapter } from "./BookChapter";
import { HTMLExtractor } from "./HTMLExtractor";
import { UserPreferences } from "./UserPreferences";
import { UTILS } from "./Utils";

export class Controller {
  htmlExtractor: HTMLExtractor;
  book: Book;
  userPreferences: UserPreferences;
  midWordFirstPageTop: number;
  midWordTop: number;
  lastWordTop: number;
  midWordFirstPageLeft: number;
  midWordLeft: number;
  lastWordLeft: number;
  constructor() {}

  /**
    Initiates the app asynchronously by getting the chapters array
  */
  async initWithChapters(
    bookId: string,
    json: string,
    css: string,
    config?: IUserPreferencesState
  ) {
    try {
      alert("Function Init");
      let {
        anchorWordIndex,
        currentChapter,
        fontSize,
        colorMode,
        fontFamily,
        bookmarks,
      } = config || {};
      this.userPreferences = new UserPreferences(bookId);
      this.userPreferences.save(
        anchorWordIndex,
        currentChapter,
        fontSize,
        colorMode,
        fontFamily,
        bookmarks,
        false
      );
      this.htmlExtractor = new HTMLExtractor(bookId);
      const parser = new DOMParser();

      const chapters = json
        .replace("[", "")
        .replace("]", "")
        .trim()
        .split('<?xml version="1.0" encoding="UTF-8"?>');
      chapters.shift();

      this.htmlExtractor.chapters = chapters.map(
        (chapterString) =>
          parser
            .parseFromString(chapterString, "text/html")
            .querySelector("body").firstElementChild
      );

      alert("Got Chapters");

      this.htmlExtractor.cssFiles = css
        .replace("['", "")
        .replace("']", "")
        .split('@charset "UTF-8";');
      this.htmlExtractor.cssFiles.shift();

      alert("Got CSS");

      this.detectUserPreferences(bookId);
      this.setupHandlers();
      this.setupEventListeners();
    } catch (error) {
      alert(error);
    }
  }

  /**
    Instantiates all the handlers required for the app to run
  */
  setupHandlers() {
    this.book = new Book(
      this.htmlExtractor.bookId,
      this.htmlExtractor.chapters,
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
    this.postPageUpdatedMessage();
  }

  /**
   * Posts a message for the pageUpdated message handler
   */
  postPageUpdatedMessage() {
    const messageObj: PageUpdatedMessage = {
      isFirstPage: this.book.isFirstPage,
      isLastPage: this.book.isLastPage,
      chapterMaxPages: UTILS.calcPageCount(),
      maxChapters: this.book.chapters.length - 1,
      percentage: Math.round(this.book.currentProgressPercent),
      currentPage: this.book.currentPage,
      currentChapter: this.book.currentChapterIndex,
      isFirstChapter: this.book.isFirstChapter,
      isLastChapter: this.book.isLastChapter,
      fontSize: this.book.fontSize,
      canIncreaseFont: this.book.canIncreaseFont,
      canDecreaseFont: this.book.canDecreaseFont,
      anchorWordIndex: this.book.anchorWordIndex,
    };
    this.postMessage("pageUpdated", messageObj);
    console.log("POSTED PAGE UPDATED MESSAGE");
  }

  /**
    Posts a message object as JSON object to mobile environments
  */
  postMessage(messageHandlerName: string, message: object) {
    const json = JSON.stringify(message);
    const win = window as any;
    if (win.webkit?.messageHandlers[messageHandlerName])
      win.webkit.messageHandlers[messageHandlerName].postMessage(json);
    if (win[messageHandlerName]) win[messageHandlerName].postMessage(json);
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
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn
        .querySelector(".btn")
        .addEventListener("click", this.removeBookmark.bind(this));
    });
    UTILS.DOM_ELS.colorModeBtns?.forEach((btn) => {
      btn.addEventListener("click", this.colorModeEventHandler.bind(this));
    });
    UTILS.DOM_ELS.fontFamilyBtns?.forEach((btn) => {
      btn.addEventListener("click", this.fontFamilyEventHandler.bind(this));
    });
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn.addEventListener("click", this.goToBookmark.bind(this));
    });
    this.wordPositionChangeHandler();
    document.fonts.onloadingdone = () => {
      this.resizeEventHandler();
    };
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
    Sets an infinite interval that checks for the middle and last words positions to detect any changes in them and applis logic
  */
  wordPositionChangeHandler() {
    setInterval(() => {
      const pagesContentRanges = this.book.currentChapter.pagesContentRanges;
      const lastWordIndexInChapter =
        pagesContentRanges[pagesContentRanges.length - 1][1];
      const firstWordIndexInChapter = pagesContentRanges[0][0];
      const lastWordIndexInFirstPage = pagesContentRanges[0][1];
      const middleWordIndexInFirstPage = Math.floor(
        (lastWordIndexInFirstPage - firstWordIndexInChapter) / 2
      );
      const middleWordIndexInChapter =
        Math.floor((lastWordIndexInChapter - firstWordIndexInChapter) / 2) +
        firstWordIndexInChapter;
      const lastWordInChapter = document.querySelector(
        `span[n="${lastWordIndexInChapter}"]`
      ) as HTMLElement;
      const middleWordInChapter = document.querySelector(
        `span[n="${middleWordIndexInChapter}"]`
      ) as HTMLElement;
      const middleWordInFirstPage = document.querySelector(
        `span[n="${middleWordIndexInFirstPage}"]`
      ) as HTMLElement;
      if (
        this.midWordFirstPageTop !== middleWordInFirstPage?.offsetTop ||
        this.midWordTop !== middleWordInChapter?.offsetTop ||
        this.lastWordTop !== lastWordInChapter?.offsetTop ||
        this.midWordFirstPageLeft !== middleWordInFirstPage?.offsetLeft ||
        this.midWordLeft !== middleWordInChapter?.offsetLeft ||
        this.lastWordLeft !== lastWordInChapter?.offsetLeft
      ) {
        this.midWordLeft = middleWordInChapter?.offsetLeft;
        this.lastWordLeft = lastWordInChapter?.offsetLeft;
        this.midWordTop = middleWordInChapter?.offsetTop;
        this.lastWordTop = lastWordInChapter?.offsetTop;
        this.midWordFirstPageTop = middleWordInFirstPage?.offsetTop;
        this.midWordFirstPageLeft = middleWordInFirstPage?.offsetLeft;
        this.resizeEventHandler();
      }
    });
  }

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
    Handles what happened after clicking on specific bookmark in the list
  */
  goToBookmark(e) {
    const el = e.target.closest("li") as HTMLElement;
    const chapterIndex = el.getAttribute("data-chapter-index");
    const anchorWordIndex = +el.getAttribute("data-anchor-word-index");

    this.book.currentChapter = new BookChapter(
      this.book.chapters[chapterIndex],
      this.book.bookId,
      this.book.currentChapterIndex
    );
    this.book.currentChapter.calcPagesContentRanges();

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
        setTimeout(() => {
          this.book.currentChapter.calcPagesContentRanges();
          this.book.changePage();
        }, 1000);
      }
    });
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
    if (bookmarks.some((e) => e.anchorWordIndex === bookmark.anchorWordIndex)) {
      return;
    }
    bookmarks.push(bookmark);
    this.book.bookmarks = bookmarks;
    this.book.renderBookmarks();

    // Appending event listeners to appended elements
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn.addEventListener("click", this.goToBookmark.bind(this));
    });
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn
        .querySelector(".btn")
        .addEventListener("click", this.removeBookmark.bind(this));
    });
    this.storeUserPreferences();
  }

  /**
      add bookmark for the current page
    */
  removeBookmark(e) {
    e.stopPropagation();
    const el = e.target.closest("li") as HTMLElement;
    const anchorWordIndex = +el.getAttribute("data-anchor-word-index");
    let bookmarks = this.book.bookmarks || [];
    bookmarks = bookmarks.filter((e) => e.anchorWordIndex !== anchorWordIndex);

    this.book.bookmarks = bookmarks;
    this.book.renderBookmarks();

    // Appending event listeners to appended elements
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn.addEventListener("click", this.goToBookmark.bind(this));
    });
    UTILS.DOM_ELS.bookmarksBtns?.forEach((btn) => {
      btn
        .querySelector(".btn")
        .addEventListener("click", this.removeBookmark.bind(this));
    });
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
}
