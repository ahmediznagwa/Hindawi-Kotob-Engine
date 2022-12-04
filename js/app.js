const nagwaReaders = (function () {
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
      get biggerFontBtn() {
        return document.getElementById("pagination-font-bigger");
      },
      get smallerFontBtn() {
        return document.getElementById("pagination-font-smaller");
      },
      get resetFontBtn() {
        return document.getElementById("pagination-font-reset");
      },
      get percent() {
        return document.querySelector(".pagination-percent");
      },
      get currentPageOfAllPages() {
        return document.querySelector(".pagination-current-page");
      },
      get allPages() {
        return document.querySelector(".pagination-pages");
      },
      get darkModeChk() {
        return document.querySelector(".change-color-mode input");
      },
      get book() {
        return document.querySelector(".book:not(.demo)");
      },
      get demoBook() {
        return document.querySelector(".book.demo");
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

    static extractComputedStyleNumber(el, style) {
      const str = getComputedStyle(el)[style];
      return +str.substring(0, str.length - 2);
    }

    static calcPageCount() {
      const columnsGap =
        this.extractComputedStyleNumber(this.DOM_ELS.book, "column-gap") || 0;

      return Math.round(
        (this.DOM_ELS.book.scrollWidth + columnsGap) /
          (this.DOM_ELS.book.offsetWidth + columnsGap)
      );
    }
  }

  class HTMLExtractor {
    constructor(bookId) {
      this.bookId = bookId;
      this.chapters = [];
      this.bookNav = [];
    }

    async setNav() {
      const res = await fetch(
        `../packages/${this.bookId}/Navigation/nav.xhtml`
      );
      const htmlTxt = await res.text();
      const parser = new DOMParser();
      const html = parser.parseFromString(htmlTxt, "text/html");
      const navList = html.querySelector("ol").querySelectorAll("a");
      navList.forEach((item) => {
        const chapterNameParts = item.getAttribute("href").split("/");
        this.bookNav.push(chapterNameParts[chapterNameParts.length - 1]);
      });
    }

    async extractChapters() {
      await this.setNav();
      this.bookNav.forEach(async (name) => {
        this.chapters.push(this.getHTMLDoc(name));
      });
      this.chapters = await Promise.all([...this.chapters]);
      this.chapters = this.chapters.map((res) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(res, "text/html");
        const bodyEl = htmlDoc.querySelector("body");
        const chapter = bodyEl.firstElementChild;
        return chapter;
      });
    }

    async getHTMLDoc(name) {
      const res = await fetch(`../packages/${this.bookId}/Content/${name}`);
      return await res.text();
    }
  }

  class BookChapter {
    constructor(chapterEl, bookId) {
      this.bookId = bookId;
      this.chapterEl = chapterEl;
      this.page = 0;
      this.storyContainerPadding = 0;
      this.exactColumnsGap = 0;
      this.exactColumnWidth = 0;
      this.columnWidth = 0;
      this.renderChapter();
    }
    renderChapter() {
      const section = document.createElement("section");
      section.classList.add("book-chapter");
      section.innerHTML = this.chapterEl?.innerHTML;
      UTILS.DOM_ELS.book.innerHTML = "";
      UTILS.DOM_ELS.book.append(section);
      this.updateImagesPaths();
    }

    updateImagesPaths() {
      const images = UTILS.DOM_ELS.book.querySelectorAll("img");
      images.forEach((img) => {
        const currentSrc = img.attributes.src.value;
        img.src = currentSrc.replace(
          "../Images/",
          `../packages/${this.bookId}/Images/`
        );
      });
    }
  }

  class UserPreferences {
    constructor(bookId) {
      this.bookId = bookId;
      this.page = 0;
      this.chapter = 0;
      this.fontSize = 0;
      this.isDarkMode = false;

      this.localStorageKeys = {
        fontSize: `${this.bookId}_fontSize`,
        isDarkMode: "isDarkMode",
        lastPosition: `${this.bookId}_lastPosition`, //its value in Localstorage will be a JSON containing chapter and page,
        page: "page",
        chapter: "chapter",
      };
    }

    save(
      currentPage,
      currentChapter,
      fontSize,
      isDarkMode,
      saveToLocalStorage = true
    ) {
      this.page = currentPage;
      this.chapter = currentChapter;
      this.fontSize = fontSize;
      this.isDarkMode = isDarkMode;
      if (saveToLocalStorage) {
        localStorage.setItem(
          this.localStorageKeys.lastPosition,
          JSON.stringify({
            [this.localStorageKeys.chapter]: this.chapter,
            [this.localStorageKeys.page]: this.page,
          })
        );
        localStorage.setItem(this.localStorageKeys.fontSize, this.fontSize);
        localStorage.setItem(this.localStorageKeys.isDarkMode, this.isDarkMode);
      }
    }

    load() {
      this.fontSize = +localStorage.getItem(this.localStorageKeys.fontSize);
      this.isDarkMode = JSON.parse(
        localStorage.getItem(this.localStorageKeys.isDarkMode)
      );
      const lastPosition = JSON.parse(
        localStorage.getItem(this.localStorageKeys.lastPosition)
      );
      this.chapter = lastPosition?.chapter;
      this.page = lastPosition?.page;
      return {
        fontSize: this.fontSize,
        isDarkMode: this.isDarkMode,
        chapter: this.chapter,
        page: this.page,
      };
    }
  }
  class Controller {
    constructor() {}

    async initWithBookId(bookId) {
      this.htmlExtractor = new HTMLExtractor(bookId);
      await this.htmlExtractor.extractChapters();
      this.detectUserPreferences(bookId);
      this.setupHandlers();
      this.setupEventListeners();
    }

    setupHandlers() {
      this.book = new Book(
        this.htmlExtractor.bookId,
        this.htmlExtractor.chapters,
        this?.userPreferences?.fontSize,
        this?.userPreferences?.chapter,
        this?.userPreferences?.page,
        this?.userPreferences?.isDarkMode
      );
    }

    detectUserPreferences(bookId) {
      this.userPreferences = new UserPreferences(bookId);
      this.userPreferences.load();
    }

    /**
     * Stores the current state of the app
     * @memberof Controller
     */
    storeUserPreferences() {
      this?.userPreferences?.save(
        this.book.currentPage,
        this.book.currentChapterIndex,
        this.book.fontSize,
        this.book.isDarkMode
      );
    }

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
      UTILS.DOM_ELS.darkModeChk?.addEventListener(
        "input",
        this.darkModeCheckInputEventHandler.bind(this)
      );
    }

    resizeEventHandler = () => {
      this.changePageToCurrentPercentage();
      this.storeUserPreferences();
    };
    changePageToCurrentPercentage() {
      this.book.currentPage = Math.round(
        this.book.currentScrollPercentage * UTILS.calcPageCount()
      );
      this.book.changePage();
    }

    postNavigationHandler() {
      this.storeUserPreferences();
    }

    postFontResizeHandler() {
      this.changePageToCurrentPercentage();
      this.storeUserPreferences();
    }

    goToNextPage() {
      this.book.changePage("next");
      this.postNavigationHandler();
    }

    goToPrevPage() {
      this.book.changePage("prev");
      this.postNavigationHandler();
    }

    goToFirstPage() {
      this.book.changePage("first");
      this.postNavigationHandler();
    }

    goToLastPage() {
      this.book.changePage("last");
      this.postNavigationHandler();
    }

    goToNextChapter() {
      this.book.changeChapter("next");
      this.postNavigationHandler();
    }

    goToPrevChapter() {
      this.book.changeChapter("prev");
      this.postNavigationHandler();
    }

    goToFirstChapter() {
      this.book.changeChapter("first");
      this.postNavigationHandler();
    }

    goToLastChapter() {
      this.book.changeChapter("last");
      this.postNavigationHandler();
    }

    increaseFontSize() {
      this.book.changeFontSize("bigger");
      this.postFontResizeHandler();
    }

    decreaseFontSize() {
      this.book.changeFontSize("smaller");
      this.postFontResizeHandler();
    }

    resetFontSize() {
      this.book.changeFontSize("reset");
      this.postFontResizeHandler();
    }
    setDarkMode(isDarkMode) {
      this.book.changeDarkMode(isDarkMode);
      this.storeUserPreferences();
    }

    darkModeCheckInputEventHandler() {
      this.setDarkMode(/* Don't pass anything so it can fallback to the checkbox value */);
    }
  }

  class Book {
    constructor(
      bookId,
      chapters,
      fontSize = 18,
      currentChapterIndex = 0,
      currentPage = 0,
      isDarkMode = null
    ) {
      this.bookId = bookId;
      this.chapters = chapters;
      this.currentChapterIndex = Math.min(
        currentChapterIndex || 0,
        this.chapters.length - 1
      );
      this.currentChapter = new BookChapter(
        this.chapters[this.currentChapterIndex],
        this.bookId
      );
      this.currentPage = Math.min(currentPage || 0, UTILS.calcPageCount() - 1);
      this.currentScrollPercentage = 0;
      this.currentProgressPercent = 0;
      this.rootFontSize = 18;
      this.isDarkMode = isDarkMode;
      this.fontSizeStep = 0.15;
      this.fontSize = fontSize || this.rootFontSize;
      this.changeFontSize();
      this.changePage();
      this.changeDarkMode(this.isDarkMode);
      this.updateAllPagesNumber();
    }
    updateChapterPageState() {
      this.isLastPage = this.currentPage >= UTILS.calcPageCount() - 1;
      this.isFirstPage = this.currentPage === 0;
      this.isLastChapter = this.currentChapterIndex >= this.chapters.length - 1;
      this.isFirstChapter = this.currentChapterIndex === 0;
    }
    updateFontIncreaseDecreaseState() {
      this.canIncreaseFont =
        this.fontSize <=
        this.rootFontSize + this.rootFontSize * this.fontSizeStep;
      this.canDecreaseFont =
        this.fontSize >=
        this.rootFontSize - this.rootFontSize * this.fontSizeStep;
    }
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

      const titles = UTILS.DOM_ELS.demoBook?.querySelectorAll("h1");
      if (titles) {
        const currentChapter = titles[this.currentChapterIndex];
        const currentChapterPos = currentChapter.offsetLeft - x;
        UTILS.DOM_ELS.demoBook?.scrollTo(currentChapterPos, 0);
        this.updateCurrentPageOfAllPages();
      }
    }

    // updateProgressPercentage() {
    //   const pageLastWordIndex =
    //     this.currentChapter.pagesContentRanges[this.currentPage][1];
    //   this.currentProgressPercent = Math.floor(
    //     (pageLastWordIndex / this.storyWordsCount) * 100
    //   );
    //   if (UTILS.DOM_ELS.percent)
    //     UTILS.DOM_ELS.percent.innerText = this.currentProgressPercent + "%";
    // }

    updateCurrentPageOfAllPages() {
      this.userPreferences = new UserPreferences(this.bookId);
      const wholeBook = UTILS.DOM_ELS.demoBook;
      const currentChapter = UTILS.DOM_ELS.book;
      const columnWidth = UTILS.extractComputedStyleNumber(
        UTILS.DOM_ELS.book,
        "width"
      );
      const columnsGap = UTILS.extractComputedStyleNumber(
        UTILS.DOM_ELS.book,
        "column-gap"
      );
      const titles = UTILS.DOM_ELS.demoBook?.querySelectorAll("h1");
      if (titles) {
        const scrollValue = (columnWidth - columnsGap) * this.currentPage;
        const currentChapter = titles[this.currentChapterIndex];
        console.log("total scroll value", wholeBook.scrollLeft);
        console.log("CurrentChapterPosition", currentChapter.offsetLeft);
        // console.log(
        //   "Progress Value",
        //   Math.abs(
        //     (currentChapter.offsetLeft -
        //       (columnWidth - columnsGap) * this.currentPage ) /
        //       wholeBook.scrollWidth
        //   ) * 100
        // );
        console.log(
          "Current Page Number",
          wholeBook.scrollWidth / currentChapter.offsetLeft
        );
      }
      UTILS.DOM_ELS.currentPageOfAllPages.innerText = this.currentPage;
    }
    updateAllPagesNumber() {
      const section = document.createElement("section");
      section.classList = "book demo";
      section.innerHTML = "";
      this.chapters.forEach((chapter) => {
        section.innerHTML = section.innerHTML += chapter?.innerHTML;
      });
      UTILS.DOM_ELS.bookWrapper.append(section);

      const columnWidth = UTILS.extractComputedStyleNumber(
        UTILS.DOM_ELS.book,
        "width"
      );
      const columnsGap = UTILS.extractComputedStyleNumber(
        UTILS.DOM_ELS.book,
        "column-gap"
      );
      const pagesNo = section.scrollWidth / (columnWidth + columnsGap);
      UTILS.DOM_ELS.allPages.textContent = Math.round(pagesNo);
      this.scrollToCurrentPage();
    }

    changeChapter(mode) {
      const oldChapterIndex = this.currentChapterIndex;
      //increment or decrement the current page
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
          this.bookId
        );
      this.changePage();
    }

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
      //Update the state of chapter and page
      this.updateChapterPageState();
      //update scroll percentage
      this.currentScrollPercentage = this.currentPage / UTILS.calcPageCount();
      //scroll to the current page
      this.scrollToCurrentPage();
      //update DOM with page content percentage
      // this.updateProgressPercentage();
      //disable or enable the pagination controls
      // this.matchPageControlsWithState();
      //update the ID of first and last word in the current page
      // this.updateStartEndWordID();
    }

    changeFontSize = (mode) => {
      const fontStepPx = this.fontSizeStep * this.rootFontSize;
      switch (mode) {
        case "bigger":
          if (this.canIncreaseFont) {
            this.fontSize = this.fontSize + fontStepPx;
            document.body.style.fontSize = this.fontSize + "px";
          }
          break;
        case "smaller":
          if (this.canDecreaseFont) {
            this.fontSize = this.fontSize - fontStepPx;
            document.body.style.fontSize = this.fontSize + "px";
          }
          break;
        case "reset":
          this.fontSize = this.rootFontSize;
          document.body.style.fontSize = "";
        default:
          document.body.style.fontSize = this.fontSize + "px";
          break;
      }
      this.updateFontIncreaseDecreaseState();
    };

    changeDarkMode(isDarkMode) {
      if (UTILS.DOM_ELS.darkModeChk) {
        //if there was a checkbox for dark mode, fallback to its value if nothing was inputted to the function
        this.isDarkMode = isDarkMode ?? UTILS.DOM_ELS.darkModeChk?.checked;
        UTILS.DOM_ELS.darkModeChk.checked = this.isDarkMode;
      } else {
        //if there is no checkbox and nothing was inputted fallback to the old dark mode state
        this.isDarkMode = isDarkMode ?? this.isDarkMode;
      }

      if (this.isDarkMode) {
        document.body.classList.remove("darkmode");
        document.body.classList.add("darkmode");
      } else {
        document.body.classList.remove("darkmode");
      }
    }
  }
  const controller = new Controller();

  // 1708ecc3-7192-427b-8292-35c38bafbfae
  // 26dd5f00-0c75-4367-adea-537ece731385
  controller.initWithBookId("26dd5f00-0c75-4367-adea-537ece731385");
})();

// Dropdown Menu
initDropdowns();
function initDropdowns() {
  $(".dropdown-toggle").each(function () {
    const dropdownToggle = $(this);
    const dropdownContainer = dropdownToggle.closest(".dropdown");
    dropdownToggle.on("click", function () {
      _showDropdownMenu(dropdownContainer);
    });
  });
}

function _showDropdownMenu(dropdownContainer) {
  if (dropdownContainer.hasClass("show")) {
    dropdownContainer.removeClass("show");
    return;
  }
  $(".dropdown").removeClass("show");
  dropdownContainer.addClass("show");
}

$(document).keydown(function (e) {
  if (e.keyCode == 27) {
    $(".dropdown").removeClass("show");

    $(".bottom-bar").slideToggle();
  }
});
$("body").click(function () {
  $(".dropdown").removeClass("show");

  $(".bottom-bar").slideToggle();
});
$(
  ".dropdown,  .bottom-bar"
).click(function (e) {
  e.stopPropagation();
});
