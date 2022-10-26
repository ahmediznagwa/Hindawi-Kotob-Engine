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
    constructor(chapterEl) {
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
    }
  }

  class Controller {
    constructor() {}

    async initWithBookId(bookId) {
      this.htmlExtractor = new HTMLExtractor(bookId);
      await this.htmlExtractor.extractChapters();
      this.setupHandlers();
      this.setupEventListeners();
    }

    setupHandlers() {
      this.book = new Book(this.htmlExtractor.chapters);
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
    }

    resizeEventHandler = () => {
      this.changePageToCurrentPercentage();
    };
    changePageToCurrentPercentage() {
      this.book.currentPage = Math.round(
        this.book.currentScrollPercentage * UTILS.calcPageCount()
      );
      this.book.changePage();
    }

    goToNextPage() {
      this.book.changePage("next");
    }

    goToPrevPage() {
      this.book.changePage("prev");
    }

    goToFirstPage() {
      this.book.changePage("first");
    }

    goToLastPage() {
      this.book.changePage("last");
    }

    goToNextChapter() {
      this.book.changeChapter("next");
    }

    goToPrevChapter() {
      this.book.changeChapter("prev");
    }

    goToFirstChapter() {
      this.book.changeChapter("first");
    }

    goToLastChapter() {
      this.book.changeChapter("last");
    }
  }

  class Book {
    constructor(
      chapters,
      fontSize = 18,
      currentChapterIndex = 0,
      currentPage = 0
    ) {
      this.chapters = chapters;
      this.currentChapterIndex = Math.min(
        currentChapterIndex || 0,
        this.chapters.length - 1
      );
      this.currentChapter = new BookChapter(
        this.chapters[this.currentChapterIndex]
      );
      this.currentPage = Math.min(currentPage || 0, UTILS.calcPageCount() - 1);
      this.currentScrollPercentage = 0;
      this.currentProgressPercent = 0;
      this.rootFontSize = 18;
      this.fontSizeStep = 0.15;
      this.fontSize = fontSize || this.rootFontSize;
      this.changePage();
    }
    updateChapterPageState() {
      this.isLastPage = this.currentPage >= UTILS.calcPageCount() - 1;
      this.isFirstPage = this.currentPage === 0;
      this.isLastChapter = this.currentChapterIndex >= this.chapters.length - 1;
      this.isFirstChapter = this.currentChapterIndex === 0;
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
          ]
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
  }
  const controller = new Controller();
  controller.initWithBookId("1708ecc3-7192-427b-8292-35c38bafbfae");
})();
