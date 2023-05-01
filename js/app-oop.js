// const prodRootUrl = "https://readersapp.nagwa.com/hindawi";
// const prodRootUrl = "https://ahmediznagwa.github.io/New-Hindawi-Reader";
const prodRootUrl = "..";
const nagwaReaders = (function () {

  //**      TYPE DEFINITIONS      **//


  /**
   * @property {HTMLElement[]=} chapters The chapters elements  extracted from the book element
   * @property {number=} bookWordsCount The amount of words in the book element
   */

  /**
   * @typedef {object} UserPreferencesState
   * @property {number} fontSize The previously used font size
   * @property {number} chapter The previously rendered chapter index
   * @property {number} page The previously rendered page 
   */

  /**
   * The message being posted to mobile environment when page updates
   * @typedef {object} PageUpdatedMessage
   * @property {boolean} isFirstPage Whether it's the first page or not
   * @property {boolean} isLastPage Whether it's the last page or not
   * @property {boolean} isFirstChapter Whether it's the first chapter or not
   * @property {boolean} isLastChapter Whether it's the first chapter or not
   * @property {number} chapterMaxPages The max amount of pages in the rendered chapter
   * @property {number} maxChapters Max amount of chapters in the current story
   * @property {number} percentage The current progress percentage
   * @property {number} currentPage The current page number
   * @property {number} currentChapter The current chapter number
   * @property {number} fontSize The current font size of the rendered story
   * @property {boolean} canIncreaseFont Whether you can increase font size or not
   * @property {boolean} canDecreaseFont Whether you can decrease font size or not
   */

  class UTILS {
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
      get barPercent() {
        return document.querySelector(".bar-percent");
      },
      get percent() {
        return document.querySelector(".pagination-percentage");
      },
      get darkModeChk() {
        return document.querySelector(".change-color-mode input");
      },
      get colorModeBtns() {
        return document.querySelectorAll(".change-color");
      },
      get fontFamilyBtns() {
        return document.querySelectorAll(".change-font-family");
      },
      get selectedFontFamily() {
        return document.querySelector(".selected-font-family");
      },
      get showFonts() {
        return document.querySelector(".show-fonts");
      },
      get hideFonts() {
        return document.querySelector(".hide-fonts");
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
      get words() {
        return document.querySelectorAll("span[n]");
      },
      get highlight() {
        return document.querySelectorAll(".highlight");
      },
      get unhighlight() {
        return document.querySelectorAll(".unhighlight");
      },
      get copy() {
        return document.querySelectorAll(".copy");
      },

    };

    static extractComputedStyleNumber(el, style) {
      const str = getComputedStyle(el)[style];
      return +str.substring(0, str.length - 2);
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
     * Extracts the story ID from the URL query params and falls back to the `data-story-id` tag on the section element with `story` id
     * @static
     * @return {string=} The extracted story ID
     * @memberof UTILS
     */
    static getBookId() {
      const searchingURLResult = window.location.search.match(/book_id=(.*)&?/)
      const bookFromURL = searchingURLResult && searchingURLResult[1] ? searchingURLResult[1] : undefined
      const bookId = bookFromURL || UTILS.DOM_ELS.book.dataset.bookId
      return bookId
    }
  }

  class HTMLExtractor {
    constructor(bookId) {
      this.bookId = bookId;
      this.chapters = [];
      this.bookNav = [];
    }

    /**
    * Sets the chapters order of the parsed book
    * @memberof HTMLExtractor
    */
    async setNav() {
      const res = await fetch(
        `${prodRootUrl}/packages/${this.bookId}/Navigation/nav.xhtml`
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

    /**
    * Sets the current XML document to the inputted XML string after parsing
    * @memberof HTMLExtractor
    */
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


    /**
    * Sets the current XML document to the inputted XML string after parsing
    * @param {string} name The chapter HTML name to be parsed
    * @return {Promise<HTMLDocument | undefined>} The parsed XML document
    * @memberof HTMLExtractor
    */
    async getHTMLDoc(name) {
      const res = await fetch(
        `${prodRootUrl}/packages/${this.bookId}/Content/${name}`
      );
      return await res.text();
    }
  }
  class UserPreferences {
    /**
    * Creates an instance of UserPreferences.
    * @param {string} bookId The ID of the book that we will keep its state
    * @memberof UserPreferences
    */
    constructor(bookId) {
      this.bookId = bookId;
      this.page = 0;
      this.chapter = 0;
      this.fontSize = 0;
      this.colorMode = null;
      this.fontFamily = null;

      this.localStorageKeys = {
        fontSize: `${this.bookId}_fontSize`,
        colorMode: "colorMode",
        fontFamily: "fontFamily",
        lastPosition: `${this.bookId}_lastPosition`, //its value in Localstorage will be a JSON containing chapter and page,
        page: "page",
        chapter: "chapter",
      };
    }

    /**
     * Saves the current app state in local storage or in memory
     * @param {number} currentPage The current rendered page 
     * @param {number} currentChapter The current rendered chapter index
     * @param {number} fontSize The current used font size
     * @param {boolean=} [saveToLocalStorage=true] Whether to save the data to local storage or not
     * @memberof UserPreferences
     */
    save(
      currentPage,
      currentChapter,
      fontSize,
      colorMode,
      fontFamily,
      saveToLocalStorage = true
    ) {
      this.page = currentPage;
      this.chapter = currentChapter;
      this.fontSize = fontSize;
      this.colorMode = colorMode;
      this.fontFamily = fontFamily;
      if (saveToLocalStorage) {
        localStorage.setItem(
          this.localStorageKeys.lastPosition,
          JSON.stringify({
            [this.localStorageKeys.chapter]: this.chapter,
            [this.localStorageKeys.page]: this.page,
          })
        );
        localStorage.setItem(this.localStorageKeys.fontSize, this.fontSize);
        localStorage.setItem(this.localStorageKeys.colorMode, this.colorMode);
        localStorage.setItem(this.localStorageKeys.fontFamily, this.fontFamily);
      }
    }

    /**
    * Loads the state of the app from the local storage
    * @return {UserPreferencesState} The loaded state from local storage
    * @memberof UserPreferences
    */

    load() {
      this.fontSize = +localStorage.getItem(this.localStorageKeys.fontSize);
      this.colorMode = localStorage.getItem(this.localStorageKeys.colorMode);
      this.fontFamily = localStorage.getItem(this.localStorageKeys.fontFamily);
      const lastPosition = JSON.parse(
        localStorage.getItem(this.localStorageKeys.lastPosition)
      );
      this.chapter = lastPosition?.chapter;
      this.page = lastPosition?.page;
      return {
        fontSize: this.fontSize,
        colorMode: this.colorMode,
        fontFamily: this.fontFamily,
        chapter: this.chapter,
        page: this.page,
      };
    }
  }

  //**           VIEW             **//
  /**
    * Creates a chapter and keeps track of pages content of the chapter
    * @class BookChapter
    */
  class BookChapter {
    /**
    * Creates and renders an instance of BookChapter.
    * @param {HTMLElement} chapterEl The chapter element extracted from the main book element in the HTML document
    * @memberof BookChapter
    */
    constructor(chapterEl, bookId) {
      this.bookId = bookId;
      this.chapterEl = chapterEl;
      /**
        * An array of arrays containing the index of the starting and ending words of each page for the current rendered chapter
        * @type {number[][]} `[[pageIndexStart, pageIndexEnd],...]`
        */
      this.pagesContentRanges = []
      this.page = 0;
      this.ROUNDING_TOLERANCE = 3
      this.bookContainerPadding = 0;
      this.exactColumnsGap = 0;
      this.exactColumnWidth = 0;
      this.columnWidth = 0;
      this.renderChapter();
    }

    /**
      * Searches for a span inside an element at a given order
      * @param {HTMLElement} el The parent element where we will search for a span
      * @param {"first" | "last"} order The order whether first word or last word
      * @return {HTMLElement} The desired span 
      * @memberof BookChapter
      */
    getSpan(el, order) {
      if (order === "first") return el.querySelector("span:first-child")
      else if (order === "last") return Array.from(el.querySelectorAll("span:last-child")).pop()
    }

    /**
      * Gets the highest parent that's below the main story element for a given child element
      * @param {HTMLElement} el The element that we need to get its parent
      * @return {HTMLElement} The desired parent 
      * @memberof BookChapter
      */
    getHighestParent(el) {
      let child = el
      let parent = child.parentElement
      while (parent !== UTILS.DOM_ELS.book.firstElementChild) {
        child = child.parentElement
        parent = child.parentElement
      }
      return child
    }


    /**
      * Calculates the left edge position of the page in the rendered HTML
      * @return {number}  the left edge position of the page
      * @memberof BookChapter
      */
    getPageLeft() {
      return Math.round(this.bookContainerPadding - this.page * (this.exactColumnWidth + this.exactColumnsGap));
    }

    /**
      * Calculates the right edge position of the page in the rendered HTML
      * @return {number}  the right edge position of the page
      * @memberof BookChapter
      */
    getPageRight() { return this.getPageLeft() + this.exactColumnWidth }

    /**
      * Checks whether an element is or is not in the current page 
      * @param {HTMLElement} el The element to be checked
      * @return {boolean} Is the element in another page
      * @memberof BookChapter
      */
    isInOtherPage(el) {
      return this.getPageRight() - (el?.offsetLeft + Math.min(el?.offsetWidth, this.columnWidth)) >= this.columnWidth - this.ROUNDING_TOLERANCE
    }

    /**
      * Loops over all the words in a given element and updates the pagesContentRanges according to words locations
      * @param {HTMLElement} el The element containing the words that we need to loop over
      * @memberof BookChapter
      */
    loopOverWords(el) {
      // Array.from(el.querySelectorAll("span[n]")).forEach((wordEl, i, wordArr) => {
      //   if (this.isInOtherPage(wordEl)) { // word is in another page
      //     console.log(wordEl);
      //     this.pagesContentRanges[this.page][1] = +wordArr[i - 1]?.getAttribute('n')
      //     this.page++
      //     this.pagesContentRanges[this.page][0] = +wordEl?.getAttribute('n')
      //   }
      //   if (i === wordArr.length - 1) { // last word in paragraph
      //     const nextParent = this.getHighestParent(wordEl)?.nextElementSibling
      //     if (this.isInOtherPage(nextParent)) {
      //       this.pagesContentRanges[this.page][1] = +wordEl?.getAttribute('n')
      //       this.page++
      //       this.pagesContentRanges[this.page][0] = +this.getSpan(nextParent, "first")?.getAttribute('n')
      //     }
      //   }
      // })
    }

    /**
         * Calculates the starting and ending words of each page for the current rendered chapter
         * @memberof BookChapter
         */
    calcPagesContentRanges() {
      // //update container values
      // this.page = 0
      // this.bookContainerPadding = UTILS.extractComputedStyleNumber(UTILS.DOM_ELS.book.parentElement, "padding-left")
      // this.exactColumnsGap = UTILS.extractComputedStyleNumber(UTILS.DOM_ELS.book, "column-gap")
      // this.exactColumnWidth = UTILS.extractComputedStyleNumber(UTILS.DOM_ELS.book, "width")
      // this.columnWidth = UTILS.DOM_ELS.book.offsetWidth
      // //reset the pagesContentRanges to empty state
      // this.pagesContentRanges = Array.from({ length: UTILS.calcPageCount() }, () => [])
      // //loop over the children of the rendered chapter

      // Array.from(UTILS.DOM_ELS.book.firstElementChild.children).forEach((child, i, childrenArr) => {
      //   //if there's only one child in the chapter
      //   if (childrenArr.length === 1) this.pagesContentRanges[this.page][0] = +this.getSpan(child, "first")?.getAttribute('n')
      //   // last element in chapter
      //   if (i === childrenArr.length - 1) {
      //     if (this.isInOtherPage(this.getSpan(child, "last"))) { // paragraph split into two pages
      //       this.loopOverWords(child)
      //     }
      //     this.pagesContentRanges[this.page][1] = +this.getSpan(child, "last")?.getAttribute('n')
      //   }
      //   //First Element in chapter
      //   else if (i === 0) {
      //     this.pagesContentRanges[this.page][0] = +this.getSpan(child, "first")?.getAttribute('n')
      //     this.loopOverWords(child)
      //   }
      //   //any other element
      //   else {
      //     if (this.isInOtherPage(child?.nextElementSibling)) {// paragraph at the end of the page
      //       if (this.isInOtherPage(this.getSpan(child, "last"))) this.loopOverWords(child) // paragraph split into two pages
      //       else { // paragraph didn't split into two pages
      //         this.pagesContentRanges[this.page][1] = +this.getSpan(child, "last")?.getAttribute('n')
      //         this.page++
      //         this.pagesContentRanges[this.page][0] = +this.getSpan(child?.nextElementSibling, "first")?.getAttribute('n')
      //       }
      //     }
      //   }
      // })
    }

    /**
     * Render selected chapter
     * @memberof BookChapter
     */
    renderChapter() {
      const section = document.createElement("section");
      section.classList.add("book-chapter");
      section.innerHTML = this.chapterEl?.innerHTML;
      UTILS.DOM_ELS.book.innerHTML = "";
      UTILS.DOM_ELS.book.append(section);
      this.calcPagesContentRanges();
      this.updateImagesPaths();
      this.bindClickEventOnAllWordsInChapter();
      this.imageInsertionHandler();
    }

    /**
    * Update chapter images relative to selected book folder
    * @memberof BookChapter
    */
    updateImagesPaths() {
      const images = UTILS.DOM_ELS.book.querySelectorAll("img");
      images.forEach((img) => {
        const currentSrc = img.attributes.src.value;
        img.src = currentSrc.replace(
          "../Images/",
          `${prodRootUrl}/packages/${this.bookId}/Images/`
        );
      });
    }

    /**
   * Highlight selected word
   * @param {target} target is the word that has been clicked on.
   * @memberof BookChapter
   */
    highlightWord(target) {
      $(target).closest(".actions-menu").addClass("has-highlight");
      $(target).addClass("highlighted");
      $(".actions-menu").remove();
      this.saveHighlightedWords();
    }

    /**
   * Unhighlight selected word
   * @param {target} target is the word that has been clicked on.
   * @memberof BookChapter
   */
    unhighlightWord(target) {
      $(target).closest(".actions-menu").removeClass("has-highlight");
      $(target).removeClass("highlighted");
      $(".actions-menu").remove();
    }

    saveHighlightedWords() {
      const highlightedWords = Array.from(
        document.querySelectorAll(".highlighted")
      );

      localStorage.setItem(
        "highlightedWords",
        JSON.stringify({
          chapter: this.currentChapterIndex,
          words: highlightedWords,
        })
      );
    }

    /**
   * Update chapter images relative to selected book folder
   * @param {target} target is the word that has been clicked on
   * @memberof BookChapter
   */
    copyText(target) {
      navigator.clipboard.writeText(target.textContent);
      $(".actions-menu").remove();
    }

    bindClickEventOnAllWordsInChapter() {
      UTILS.DOM_ELS.words?.forEach((word) => {
        word.addEventListener("click", this.wordEventHandler.bind(this));
      });
    }

    /**
    * Handling dropdown that show on word click
    * @param {target} e is the click event
    * @memberof BookChapter
    */
    wordEventHandler(e) {
      e.stopPropagation();
      $(".actions-menu").remove();
      const top = $(e.target).offset().top;
      const left = $(e.target).offset().left;
      const menu = document.createElement("div");
      menu.classList.add("actions-menu");
      const actionsMenu = `
        <ul>
          <li class="highlight"><a href="#">تلوين</a></li>
          <li class="unhighlight"><a href="#">الغاء التلوين</a></li>
          <li class="copy"><a href="#">نسخ</a></li>
        </ul>
      `;

      menu.innerHTML = actionsMenu;
      document.body.appendChild(menu);

      if ($(e.target).hasClass("highlighted")) {
        $(menu).addClass("has-highlight");
        $(menu).find(".highlight").remove();
      }

      // Positioning the appended menu according to word
      $(menu).css({
        position: "absolute",
        left: left + e.target.clientWidth / 2,
        transform: "translate(-50%,-120%)",
        top,
      });

      $(window).on("resize", function () {
        $(".actions-menu").remove();
      });

      // Binding click events on menu
      $(menu).on("click", function (e) {
        e.stopPropagation();
      });
      if (menu.querySelector(".highlight")) {
        menu
          .querySelector(".highlight")
          .addEventListener("click", this.highlightWord.bind(this, e.target));
      }
      if (menu.querySelector(".unhighlight")) {
        menu
          .querySelector(".unhighlight")
          .addEventListener("click", this.unhighlightWord.bind(this, e.target));
      }

      menu
        .querySelector(".copy")
        .addEventListener("click", this.copyText.bind(this, e.target));
    }

    imageInsertionHandler(e) {
      const book = $(UTILS.DOM_ELS.book);
      const el = book.find('#selected-word');
      const parent = el.parent();
      const bookHeight = book.outerHeight();
      if (el.length) {
        const allElementsOfChapter = document.querySelectorAll('*');
        allElementsOfChapter.forEach(item => {
          if ($(item).is(':visible')) {
            console.log(item);
          }
        });
        const image = `<div class="inserted-image" style="height: ${bookHeight}px"><img src="../image.jpg"></div>`;
        parent.after(image)
        $(image).css('height',)
      }
    }
  }




  class Book {
    /**
     * Creates an instance of Book.
     * @param {string=} bookId selected book ID
     * @param {string[]} chapters An list of the book chapters
     * @param {number} bookWordsCount The count of words in the whole book
     * @param {number=} [fontSize=18] The font size of the story
     * @param {number=} [currentChapterIndex=0] The initial chapter index for the story handler
     * @param {number=} [currentPage=0] The initial page index for the story handler
     * @memberof Book
     */
    constructor(
      bookId,
      chapters,
      fontSize = 18,
      bookWordsCount,
      currentChapterIndex = 0,
      currentPage = 0,
      colorMode = "white",
      fontFamily = "NotoNaskhArabic"
    ) {
      this.bookId = bookId;
      this.bookWordsCount = bookWordsCount;
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
      this.currentProgressPercent = 0;
      this.rootFontSize = 18;
      this.colorMode = colorMode;
      this.fontFamily = fontFamily;
      this.fontSizeStep = 0.15;
      this.fontSize = fontSize || this.rootFontSize;
      this.allBookTitles = [];
      this.changeFontSize();
      this.currentChapter.calcPagesContentRanges();
      this.changePage();
      this.changeColorMode(this.colorMode);
      this.changeFontFamily(this.fontFamily);
      this.addWholeBook();
    }

    /**
    * Updates the state corresponding to current page and current chapter. The updated values are: `isLastPage`, `isFirstPage`, `isLastChapter` and `isFirstChapter`
    * @memberof Book
    */
    updateChapterPageState() {
      this.isLastPage = this.currentPage >= UTILS.calcPageCount() - 1;
      this.isFirstPage = this.currentPage === 0;
      this.isLastChapter = this.currentChapterIndex >= this.chapters.length - 1;
      this.isFirstChapter = this.currentChapterIndex === 0;
    }
    /**
    * Updates the state corresponding to the current font size. The updated values are: `canIncreaseFont` and `canDecreaseFont`
    * @memberof Book
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
    * Adding whole book in the dom to calculate total pages number
    * @memberof Book
    */
    addWholeBook() {
      const section = document.createElement("section");
      section.classList = "book demo";
      section.innerHTML = "";
      this.chapters.forEach((chapter) => {
        section.innerHTML = section.innerHTML += chapter?.innerHTML;
      });
      const lastChapter = this.chapters[this.chapters.length - 1];
      const lastChapterAllSpans = lastChapter.querySelectorAll('span[n]');
      this.bookWordsCount = +lastChapterAllSpans[lastChapterAllSpans.length - 1].getAttribute('n');
      UTILS.DOM_ELS.bookWrapper.append(section);
      this.allBookTitles = UTILS.DOM_ELS.demoBook?.querySelectorAll("h1");
      setTimeout(() => {
        this.scrollToCurrentPage();
      }, 2000);
    }


    /**
    * Scrolls the view window into the current page
    * @memberof Book
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
      * Updates the DOM element representing the progress percentage value
      * @memberof Book
      */
    updateProgressPercentage() {
      // const pageLastWordIndex = this.currentChapter.pagesContentRanges[this.currentPage][1];
      // this.currentProgressPercent = Math.floor((pageLastWordIndex / this.storyWordsCount) * 100)
      // if (UTILS.DOM_ELS.percent) UTILS.DOM_ELS.percent.innerText = this.currentProgressPercent + "%"
      // if (UTILS.DOM_ELS.barPercent) UTILS.DOM_ELS.barPercent.querySelector("span").style.width = this.currentProgressPercent + "%"
    }

    /**
    * Changes the current rendered chapter into a different one depending on the inputted mode
    * @param {("next" | "prev" | "first" | "last")=} mode The way the chapter should be changed
    * @memberof Book
    */
    changeChapter(mode) {
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
          this.bookId
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
    * Changes the current viewed page into a different one depending on the inputted mode 
    * @param {("next" | "prev" | "first" | "last")=} mode The way the page should be changed
    * @memberof Book
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
      //Update the state of chapter and page
      this.updateChapterPageState();
      //scroll to the current page
      this.scrollToCurrentPage();
      //update DOM with page content percentage
      this.updateProgressPercentage()
      //disable or enable the pagination controls
      this.matchPageControlsWithState();
    }


    /**
    * Changes the font size of the rendered book depending on the inputted mode
    * @param {("bigger" | "smaller" | "reset")=} mode The way the font size should be changed
    * @memberof Book
    */
    changeFontSize = (mode) => {
      const fontStepPx = this.fontSizeStep * this.rootFontSize;
      switch (mode) {
        case "bigger":
          if (this.canIncreaseFont) {
            this.fontSize = this.fontSize + fontStepPx;
            document.querySelector(".book-container").style.fontSize =
              this.fontSize + "px";
          }
          break;
        case "smaller":
          if (this.canDecreaseFont) {
            this.fontSize = this.fontSize - fontStepPx;
            document.querySelector(".book-container").style.fontSize =
              this.fontSize + "px";
          }
          break;
        case "reset":
          this.fontSize = this.rootFontSize;
          document.querySelector(".book-container").style.fontSize = "";
        default:
          document.querySelector(".book-container").style.fontSize =
            this.fontSize + "px";
          break;
      }
      this.updateFontIncreaseDecreaseState();
    };


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
      document.querySelector(".book-container").style.fontFamily =
        this.fontFamily;

      const selectedFontFamily = document.querySelector(
        `[data-value=${this.fontFamily}]`
      ).textContent;
      UTILS.DOM_ELS.selectedFontFamily.textContent = `${selectedFontFamily}`;
      document
        .querySelector(`[data-value=${this.fontFamily}]`)
        ?.classList.add("selected");
    }
  }

  class Controller {
    /**
    * Creates an instance of Controller.
    * @memberof Controller
    */
    constructor() { }


    /**
     * Initiates the app asynchronously by tacking the book ID and fetching the HTML document
     * @param {string} bookId The ID of the book we want to initiate
     * @memberof Controller
     */
    async initWithBookId(bookId) {
      this.htmlExtractor = new HTMLExtractor(bookId);
      await this.htmlExtractor.extractChapters();
      this.detectUserPreferences(bookId);
      this.setupHandlers();
      this.setupEventListeners();
    }


    /**
    * Instantiates all the handlers required for the app to run 
    * @memberof Controller
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
    * Detects the previous state of the app the last time the user used it
    * @param {string} bookId The ID of the book we need to know the state of
    * @memberof Controller
    */
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
        this.book.colorMode,
        this.book.fontFamily
      );
    }

    /**
    * Sets up the event listeners needed for the app to run
    * @memberof Controller
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
    * Handles the window resize event
    * @memberof Controller
    */
    resizeEventHandler = () => {
      this.book.currentChapter.calcPagesContentRanges();
      this.changePageToCurrentPercentage();
      this.storeUserPreferences();
    };

    /**
    * Changes current page to a page matching the current scroll percentage 
    * @memberof Controller
    */
    changePageToCurrentPercentage() {
      this.book.changePage();
    }


    /**
    * Handles what happens after any navigation
    * @memberof Controller
    */
    postNavigationHandler() {
      this.storeUserPreferences();
    }


    /**
    * Handles what happens after any font resizing
    * @memberof Controller
    */
    postFontResizeHandler() {
      this.book.currentChapter.calcPagesContentRanges();
      this.changePageToCurrentPercentage();
      this.storeUserPreferences();
      $(".actions-menu").remove();
    }

    /**
         * Navigates to next page
         * @memberof Controller
         */
    goToNextPage() {
      this.book.changePage("next")
      this.postNavigationHandler()
    }

    /**
     * Navigates to previous page
     * @memberof Controller
     */
    goToPrevPage() {
      this.book.changePage("prev")
      this.postNavigationHandler()
    }

    /**
     * Navigates to first page
     * @memberof Controller
     */
    goToFirstPage() {
      this.book.changePage("first")
      this.postNavigationHandler()
    }

    /**
     * Navigates to last page
     * @memberof Controller
     */
    goToLastPage() {
      this.book.changePage("last")
      this.postNavigationHandler()
    }

    /**
     * Navigates to next chapter
     * @memberof Controller
     */
    goToNextChapter() {
      this.book.changeChapter("next")
      this.postNavigationHandler()
    }

    /**
     * Navigates to previous chapter
     * @memberof Controller
     */
    goToPrevChapter() {
      this.book.changeChapter("prev")
      this.postNavigationHandler()
    }

    /**
     * Navigates to first chapter
     * @memberof Controller
     */
    goToFirstChapter() {
      this.book.changeChapter("first")
      this.postNavigationHandler()
    }

    /**
     * Navigates to last chapter
     * @memberof Controller
     */
    goToLastChapter() {
      this.book.changeChapter("last")
      this.postNavigationHandler()
    }

    /**
     * Increments Font Size
     * @memberof Controller
     */
    increaseFontSize() {
      this.book.changeFontSize("bigger")
      this.postFontResizeHandler();
    }

    /**
     * Decrements font size
     * @memberof Controller
     */
    decreaseFontSize() {
      this.book.changeFontSize("smaller")
      this.postFontResizeHandler()
    }

    /**
     * Resets font size to default value
     * @memberof Controller
     */
    resetFontSize() {
      this.book.changeFontSize("reset")
      this.postFontResizeHandler()
    }

    /**
     * Sets font size to a desired value
     * @param {number} fontSize The required font size
     * @memberof Controller
     */
    setFontSize(fontSize) {
      this.book.fontSize = fontSize
      this.book.changeFontSize()
      this.postFontResizeHandler()
    }

    /**
      * Sets color mode to a desired value
      * @param {boolean} colorMode The required color mode value
      * @memberof Controller
      */
    setColorMode(colorMode) {
      this.book.changeColorMode(colorMode);
      this.storeUserPreferences();
    }
    /**
     * Sets font family to a desired value
     * @param {boolean} fontFamily The required font family value
     * @memberof Controller
     */
    setFontFamily(fontFamily) {
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

    colorModeEventHandler(e) {
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
  const controller = new Controller();
  window.addEventListener("load", () => {
    const bookId = UTILS.getBookId()
    if (bookId) {
      controller.initWithBookId(bookId)
    }
  })

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
    $(".actions-menu").remove();
    $(".bottom-bar").slideUp();
    $(".hide-fonts").trigger("click");
  }
});
$("body").click(function () {
  $(".actions-menu").remove();
  $(".dropdown").removeClass("show");
  $(".bottom-bar").slideToggle();
  $(".hide-fonts").trigger("click");
});
$(".dropdown,  .bottom-bar").click(function (e) {
  e.stopPropagation();
});
