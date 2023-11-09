import { IBookInfo } from "../Models/IBookInfo.model";
import { IBookmark } from "../Models/IBookmark.model";
import { IHighlighted } from "../Models/IHighlighted.model";
import { PageUpdatedMessage } from "../Models/IPostMessage.model";
import { IUserPreferencesState } from "../Models/IUserPreferencesState.model";
import {
  extractWordsFromSelection,
  getSentenceAfterWord,
  isObjEmpty,
  wrapHighlightedElements,
} from "../shared/utilities";
import { Book } from "./Book";
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
    bookTitle: string,
    json: string,
    rootFolder: string,
    tableOfContent: string,
    config?: IUserPreferencesState
  ) {
    const bookInfo = {
      bookId,
      bookTitle,
    };
    try {
      // alert("Function Init");
      let {
        anchorWordIndex,
        currentChapter,
        fontSize,
        colorMode,
        fontFamily,
        bookmarks,
        highlights,
      } = config || {};
      this.userPreferences = new UserPreferences(bookInfo.bookId);
      this.userPreferences.save(
        anchorWordIndex,
        currentChapter,
        fontSize,
        colorMode,
        fontFamily,
        bookmarks,
        highlights,
        false
      );
      const parser = new DOMParser();

      // Getting table of content
      const toc = parser.parseFromString(tableOfContent, "text/xml");

      const tableOfContents = [];
      tableOfContents.push({
        chapterIndex: 0,
        chapterTitle: "الصفحة الرئيسية",
      });
      Array.from(toc.querySelectorAll("TOCItem")).forEach((item) => {
        tableOfContents.push({
          chapterTitle: item.querySelector("Title").textContent,
          chapterIndex: item.querySelector("ChapterIndex").textContent,
        });
      });

      this.htmlExtractor = new HTMLExtractor(
        bookInfo,
        rootFolder,
        tableOfContents
      );

      // Getting Chapters

      const chapters = json.trim()?.split("$Newchapter");
      chapters.shift();

      this.htmlExtractor.chapters = chapters.map(
        (chapterString: string, index: number) => {
          const chapterHTML = parser.parseFromString(
            chapterString,
            "text/html"
          );
          const bodyEl = chapterHTML.querySelector("body");
          if (index === 0) {
            return bodyEl;
          }

          if (bodyEl) {
            // Hindawi books first pages

            if (
              bodyEl.firstElementChild.classList.contains("center") ||
              bodyEl.children.length > 1
            ) {
              return bodyEl;
            }
            // checking if there is only one child for the whole book
            if (bodyEl.firstElementChild.children.length === 1) {
              return bodyEl.firstElementChild.children[0];
            }
            return bodyEl.firstElementChild;
          }

          return chapterHTML.firstElementChild.children.length <= 0
            ? chapterHTML.firstElementChild.firstElementChild
            : chapterHTML.firstElementChild;
        }
      );

      // alert("Got Chapters");

      this.detectUserPreferences(bookInfo.bookId);
      this.setupHandlers();
      this.setupEventListeners();

      // Triggering click on body to show navigation bar at initial
      $("body").trigger("click");
    } catch (error) {
      alert(error);
    }
  }

  /**
    Instantiates all the handlers required for the app to run
  */
  setupHandlers() {
    // alert("Book Init");
    this.book = new Book(
      this.htmlExtractor.bookInfo,
      this.htmlExtractor.chapters,
      this.htmlExtractor.rootFolder,
      this.htmlExtractor.tableOfContents,
      this?.userPreferences?.fontSize,
      this?.userPreferences?.chapter,
      this?.userPreferences?.anchorWordIndex,
      this?.userPreferences?.colorMode,
      this?.userPreferences?.fontFamily,
      this?.userPreferences?.bookmarks,
      this?.userPreferences?.highlights
    );
    // alert("Book Done");
    this.renderBookmarks();
    this.renderHighlights();

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    ["mouseup, taphold, selectionchange"].forEach((eventName) => {
      $(document).on(eventName, (event) => {
        if (window.getSelection().toString().length) {
          const elements = extractWordsFromSelection(window.getSelection());
          // Removing last extra element as selection gets extra not needed element
          elements.pop();

          this.wordsSelectionHandler(event, elements);
        }
      });
    });
  }

  /**
    Detects the previous state of the app the last time the user used it
  */
  detectUserPreferences(bookId: string) {
    this.userPreferences = new UserPreferences(bookId);
    this.userPreferences.load();
    // alert("detecting User Prefrences Done");
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
      this.book.bookmarks,
      this.book.highlights
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
      colorMode: this.book.colorMode,
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
    window.addEventListener("pageUpdated", (e) => console.log(e), false);
    window?.addEventListener("resize", () =>
      setTimeout(this.resizeEventHandler.bind(this), 0)
    );
    $(window).on("orientationchange", () =>
      setTimeout(this.resizeEventHandler.bind(this), 0)
    ); //The only jQuery line
    document.onfullscreenchange = () =>
      setTimeout(this.resizeEventHandler.bind(this), 0);

    // Mobile Event Listeners
    jQuery(window).on("swiperight", this.goToNextPage.bind(this));
    jQuery(window).on("swipeleft", this.goToPrevPage.bind(this));
    //DOM Elements event listeners
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowLeft") {
        this.goToNextPage();
      } else if (e.key == "ArrowUp") {
        this.goToPrevChapter();
      } else if (e.key == "ArrowRight") {
        this.goToPrevPage();
      } else if (e.key == "ArrowDown") {
        this.goToNextChapter();
      }
    });
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
    UTILS.DOM_ELS.showTableOfContenBtn?.addEventListener("click", () => {
      this.hideToolbar();
      $(UTILS.DOM_ELS.tableOfContentWrapper).addClass(
        "book-content-list--show"
      );
    });
    UTILS.DOM_ELS.hideTableOfContenBtn?.addEventListener("click", function () {
      $(UTILS.DOM_ELS.tableOfContentWrapper).removeClass(
        "book-content-list--show"
      );
    });
    this.wordPositionChangeHandler();
    document.fonts.onloadingdone = () => {
      this.resizeEventHandler();
    };

    // alert("Setup Event Listeners Done");
  }

  /**
    Handling dropdown that show on word click
  */
  wordsSelectionHandler(e, elements: HTMLElement[]) {
    e.stopPropagation();
    const anchorElement = elements[0];
    // this.book.currentChapter.hideActionsMenu();
    const top = $(anchorElement).offset().top;
    const menu = document.createElement("div");
    menu.classList.add("actions-menu");
    const actionsMenu = `
        <ul data-word-index="${anchorElement.getAttribute("n")}">
          <li class="highlight"><a href="#">تلوين</a></li>
          <li class="unhighlight"><a href="#">الغاء التلوين</a></li>
          <li class="bookmark"><a href="#">إضافة علامة متابعة القراءة</a></li>
        </ul>
        `;
    // <li class="copy"><a href="#">نسخ</a></li>

    menu.innerHTML = actionsMenu;
    document.body.appendChild(menu);

    // Positioning the appended menu according to word
    $(menu).css({
      position: "absolute",
      top,
    });

    // $('span[n]').removeClass("selected");
    // elements.forEach((element) => {
    //   $(element).addClass("selected");
    // });

    menu
      .querySelector(".highlight")
      .addEventListener(
        "click",
        this.addNote.bind(this, elements, "highlight")
      );
    menu
      .querySelector(".bookmark")
      .addEventListener("click", this.addNote.bind(this, elements, "bookmark"));
    // menu
    //   .querySelector(".copy")
    //   .addEventListener("click", this.copyText.bind(this, element));
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
        pagesContentRanges[pagesContentRanges.length - 1] &&
        pagesContentRanges[pagesContentRanges.length - 1][1];
      const firstWordIndexInChapter =
        pagesContentRanges[0] && pagesContentRanges[0][0];
      const lastWordIndexInFirstPage =
        pagesContentRanges[0] && pagesContentRanges[0][1];
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
    // document.body.scrollTop = 0;
  }

  /**
    Handles what happens after any font resizing
  */
  postFontResizeHandler() {
    this.book.currentChapter.calcPagesContentRanges();
    this.changePageToAnchorWordLocation();
    this.storeUserPreferences();
    this.book.currentChapter.hideActionsMenu();
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
    Handles what happened after clicking on specific note in the list
  */
  goToNote(anchorWordIndex: number, chapterIndex: number) {
    console.log(anchorWordIndex);
    console.log(chapterIndex);

    this.book.renderChapter(chapterIndex);

    // Detect anchor word page index
    this.book.goToPage(this.book.getPageNumberByWordIndex(anchorWordIndex));
  }

  /**
    add bookmark for the current page
  */
  addBookmark() {
    const el = $(`span[n=${this.book.anchorWordIndex}]`)[0];
    const index = +el.getAttribute("n");
    const bookmark: IHighlighted = {
      index,
      content: getSentenceAfterWord(index),
      createdOn: Date.now(),
      chapterTitle:
        this.book.tableOfContents[this.book.currentChapterIndex].chapterTitle,
    };
    const storedBookmarks = this.book.bookmarks || {};

    storedBookmarks[this.book.currentChapterIndex] = storedBookmarks[
      this.book.currentChapterIndex
    ]
      ? {
          notes: [
            ...storedBookmarks[this.book.currentChapterIndex].notes.filter(
              (x) => x.index !== bookmark.index
            ),
            bookmark,
          ],
        }
      : {
          notes: [bookmark],
        };

    this.book.bookmarks = storedBookmarks;
    this.renderBookmarks();
  }

  /**
      add bookmark for the current page
    */
  removeBookmark(e) {
    e.stopPropagation();
    const el = e.target.closest("li") as HTMLElement;
    const anchorWordIndex = +el.getAttribute("data-anchor-word-index");
    const chapterIndex = +el.getAttribute("data-chapter-index");
    const storedBookmarks = this.book.bookmarks || {};

    if (storedBookmarks[chapterIndex].notes.length > 1) {
      storedBookmarks[chapterIndex] = {
        notes: storedBookmarks[chapterIndex].notes.filter(
          (x) => x.index !== anchorWordIndex
        ),
      };
    } else {
      delete storedBookmarks[chapterIndex];
    }

    this.book.bookmarks = isObjEmpty(storedBookmarks) ? null : storedBookmarks;
    this.renderBookmarks();
  }

  /**
    Render bookmarks list into DOM
  */
  renderBookmarks() {
    const list = UTILS.DOM_ELS.bookmarksList;
    $(list).html("");

    // This is to handle old structure for bookmarks
    if (this.book.bookmarks instanceof Array) {
      this.book.bookmarks = null;
      this.storeUserPreferences();
    }
    if (this.book.bookmarks) {
      $(list).closest(".dropdown").removeClass("empty");
      Object.keys(this.book.bookmarks).forEach((key) => {
        (this.book.bookmarks[key].notes as IHighlighted[]).forEach((word) => {
          // <p>${new Date(word.createdOn).toUTCString()}</p>
          $(list).append(
            `
            <li class="bookmark-item" data-chapter-index="${key}" data-anchor-word-index="${word.index}">
              <div>
                <h4>${word.content}</h4>
                <p>${word.chapterTitle}</p>
              </div>
              <button class="btn-icon btn">
                <i class="f-icon trash-icon"></i>
              </button>
            </li>
            `
          );
        });
      });
    } else {
      $(list).closest(".dropdown").addClass("empty");
    }
    this.postRenderBookmarks();
  }

  /**
    Highlight selected word
  */
  addNote(words: HTMLElement[], type: "highlight" | "bookmark") {
    this.book.currentChapter.hideActionsMenu();

    if (type === "highlight") {
      wrapHighlightedElements(words);
    }

    const newNote: IHighlighted = {
      index: +words[0].getAttribute("n"),
      numberOfWords: words.length,
      content: getSentenceAfterWord(+words[0].getAttribute("n"), words.length),
      createdOn: Date.now(),
      chapterTitle:
        this.book.tableOfContents[this.book.currentChapterIndex].chapterTitle,
    };
    const storedData =
      type === "highlight"
        ? this.book.highlights || {}
        : this.book.bookmarks || {};

    storedData[this.book.currentChapterIndex] = storedData[
      this.book.currentChapterIndex
    ]
      ? {
          notes: [...storedData[this.book.currentChapterIndex].notes, newNote],
        }
      : {
          notes: [newNote],
        };

    if (type === "highlight") {
      this.book.highlights = storedData;
      this.renderHighlights();
      return;
    }
    this.book.bookmarks = storedData;
    this.renderBookmarks();
  }

  /**
    Unhighlight selected word
  */
  removeNote(
    anchorWordIndex: number,
    chapterIndex: number,
    type: "highlight" | "bookmark"
  ) {
    this.book.currentChapter.hideActionsMenu();
    const storedData =
      type === "highlight"
        ? this.book.highlights || {}
        : this.book.bookmarks || {};

    const highlightParent = $(`span[n=${anchorWordIndex}]`).closest(
      "span.highlighted"
    );
    const highlightParentCn = highlightParent.contents();
    highlightParent.replaceWith(highlightParentCn);

    if (storedData[chapterIndex].notes.length > 1) {
      storedData[chapterIndex] = {
        notes: storedData[chapterIndex].notes.filter(
          (x) => x.index !== anchorWordIndex
        ),
      };
    } else {
      delete storedData[chapterIndex];
    }

    if (type === "highlight") {
      this.book.highlights = isObjEmpty(storedData) ? null : storedData;
      this.renderHighlights();
      return;
    }
    this.book.bookmarks = isObjEmpty(storedData) ? null : storedData;
    this.renderBookmarks();
  }

  /**
    Handle after rendering bookmarks
  */
  postRenderBookmarks() {
    this.storeUserPreferences();
    // Appending event listeners to appended elements
    UTILS.DOM_ELS.bookmarksBtns?.forEach((listItem) => {
      const anchorWordIndex = +$(listItem).attr("data-anchor-word-index");
      const chapterIndex = +$(listItem).attr("data-chapter-index");
      $(listItem).on("click", () =>
        this.goToNote(anchorWordIndex, chapterIndex)
      );

      $(listItem)
        .find(".btn")
        .on("click", () =>
          this.removeNote(anchorWordIndex, chapterIndex, "bookmark")
        );
    });
  }

  /**
    Render highlights list into DOM
  */
  renderHighlights() {
    const list = UTILS.DOM_ELS.highlightsList;
    $(list).html("");
    if (this.book.highlights) {
      $(list).closest(".dropdown").removeClass("empty");
      Object.keys(this.book.highlights).forEach((key) => {
        (this.book.highlights[key].notes as IHighlighted[]).forEach((word) => {
          $(list).append(
            `
                <li class="highlight-item" data-chapter-index="${key}" data-anchor-word-index="${word.index}">
                  <div>
                    <h4>${word.content}</h4>
                    <p>${word.chapterTitle}</p>
                  </div>
                  <button class="btn-icon btn">
                    <i class="f-icon trash-icon"></i>
                  </button>
                </li>
            `
          );
        });
      });
    } else {
      $(list).closest(".dropdown").addClass("empty");
    }
    this.postRenderHighlight();
  }

  /**
    Handle after rendering bookmarks
  */
  postRenderHighlight() {
    this.storeUserPreferences();
    window.getSelection().empty();

    // Appending event listeners to appended elements
    UTILS.DOM_ELS.highlightsBtns?.forEach((listItem) => {
      const anchorWordIndex = +$(listItem).attr("data-anchor-word-index");
      const chapterIndex = +$(listItem).attr("data-chapter-index");
      console.log(chapterIndex, anchorWordIndex);

      $(listItem).on("click", () =>
        this.goToNote(anchorWordIndex, chapterIndex)
      );

      $(listItem)
        .find(".btn")
        .on("click", () =>
          this.removeNote(anchorWordIndex, chapterIndex, "highlight")
        );
    });
  }

  /**
    Update chapter images relative to selected book folder
  */
  copyText(target: HTMLElement) {
    navigator.clipboard.writeText(target.textContent);
    this.book.currentChapter.hideActionsMenu();
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

  hideToolbar() {
    $(".app-bar").removeClass("show");
    $(".dropdown").removeClass("show");
    $(".hide-fonts").trigger("click");
  }

  toggleOverlay() {
    $(".app-bar").toggleClass("show");
    $(".dropdown").removeClass("show");
    $(".hide-fonts").trigger("click");
  }
}
