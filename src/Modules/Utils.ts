export class UTILS {
  static DOM_ELS = {
    get nextPageBtn(): HTMLButtonElement {
      return document.querySelector(".pagination-next-page");
    },
    get prevPageBtn(): HTMLButtonElement {
      return document.querySelector(".pagination-prev-page");
    },
    get nextChapterBtn(): HTMLButtonElement {
      return document.querySelector(".pagination-next-chapter");
    },
    get prevChapterBtn(): HTMLButtonElement {
      return document.querySelector(".pagination-prev-chapter");
    },
    get biggerFontBtn(): HTMLButtonElement {
      return document.getElementById(
        "pagination-font-bigger"
      ) as HTMLButtonElement;
    },
    get smallerFontBtn(): HTMLButtonElement {
      return document.getElementById(
        "pagination-font-smaller"
      ) as HTMLButtonElement;
    },
    get resetFontBtn(): HTMLButtonElement {
      return document.getElementById(
        "pagination-font-reset"
      ) as HTMLButtonElement;
    },
    get barPercent(): HTMLElement {
      return document.querySelector(".bar-percent");
    },
    get percent(): HTMLElement {
      return document.querySelector(".pagination-percentage");
    },
    get darkModeChk(): HTMLElement {
      return document.querySelector(".change-color-mode input");
    },
    get selectedFontFamily(): HTMLElement {
      return document.querySelector(".selected-font-family");
    },
    get showFonts(): HTMLElement {
      return document.querySelector(".show-fonts");
    },
    get hideFonts(): HTMLElement {
      return document.querySelector(".hide-fonts");
    },
    get book(): HTMLElement {
      return document.querySelector(".book:not(.demo)");
    },
    get demoBook(): HTMLElement {
      return document.querySelector(".book.demo");
    },
    get bookChapter(): HTMLElement {
      return document.querySelector(".book-chapter");
    },
    get bookContainer(): HTMLElement {
      return document.querySelector(".book-container");
    },
    get bookWrapper(): HTMLElement {
      return document.querySelector(".book-wrapper");
    },
    get addBookmarkBtn(): HTMLButtonElement {
      return document.querySelector(".add-bookmark-btn");
    },
    get bookmarksList(): HTMLElement {
      return document.querySelector(".bookmarks-list");
    },
    get highlightsList(): HTMLElement {
      return document.querySelector(".bookmarks-list--highlights");
    },
    get tableOfContentWrapper(): HTMLElement {
      return document.querySelector(".book-content");
    },
    get tableOfContentList(): HTMLElement {
      return document.querySelector(".book-content__list");
    },
    get showTableOfContenBtn(): HTMLElement {
      return document.querySelector(".show-book-content");
    },
    get hideTableOfContenBtn(): HTMLElement {
      return document.querySelector(".hide-book-content");
    },
    get words(): NodeListOf<HTMLElement> {
      return document.querySelectorAll("span[n]");
    },
    get highlight(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".highlight");
    },
    get unhighlight(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".unhighlight");
    },
    get copy(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".copy");
    },
    get colorModeBtns(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".change-color");
    },
    get fontFamilyBtns(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".change-font-family");
    },
    get bookmarksBtns(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".bookmark-item");
    },
    get highlightsBtns(): NodeListOf<HTMLElement> {
      return document.querySelectorAll(".highlight-item");
    },
  };

  /**
    Extracts the exact number value of a desired style of an element
  */
  static extractComputedStyleNumber(el: HTMLElement, style: string) {
    const str = getComputedStyle(el)[style];
    return +str.substring(0, str.length - 2);
  }

  /**
    Calculates the current amount of pages rendered
  */
  static calcPageCount(): number {
    const columnsGap =
      this.extractComputedStyleNumber(this.DOM_ELS.book, "column-gap") || 0;

    return Math.round(
      (this.DOM_ELS.book.scrollWidth + columnsGap) /
        (this.DOM_ELS.book.offsetWidth + columnsGap)
    );
  }

  /**
   * Extracts the book ID from the URL query params and falls back to the `data-book-id` tag on the section element with `book` id
   */
  static getBookId(): string {
    const searchingURLResult = window.location.search.match(/book_id=(.*)&?/);
    const bookFromURL =
      searchingURLResult && searchingURLResult[1]
        ? searchingURLResult[1]
        : undefined;
    const bookId = bookFromURL || UTILS.DOM_ELS.book.dataset.bookId;
    return bookId;
  }
}
