import { IBookmark } from "../Models/IBookmark.model";

export class UserPreferences {
  bookId: string;
  page: number;
  chapter: number;
  fontSize: number;
  colorMode: string;
  fontFamily: string;
  localStorageKeys: any;
  bookmarks: IBookmark[];

  constructor(bookId) {
    this.bookId = bookId;
    this.page = 0;
    this.chapter = 0;
    this.fontSize = 0;
    this.colorMode = null;
    this.fontFamily = null;
    this.bookmarks = [];

    this.localStorageKeys = {
      fontSize: `${this.bookId}_fontSize`,
      colorMode: "colorMode",
      fontFamily: "fontFamily",
      lastPosition: `${this.bookId}_lastPosition`, //its value in Localstorage will be a JSON containing chapter and page,
      page: "page",
      chapter: "chapter",
      bookmarks: "bookmarks",
    };
  }

  /**
    Saves the current app state in local storage or in memory
  */
  save(
    currentPage: number,
    currentChapter: number,
    fontSize: number,
    colorMode: string,
    fontFamily: string,
    bookmarks: IBookmark[],
    saveToLocalStorage = true
  ) {
    this.page = currentPage;
    this.chapter = currentChapter;
    this.fontSize = fontSize;
    this.colorMode = colorMode;
    this.fontFamily = fontFamily;
    this.bookmarks = bookmarks;
    if (saveToLocalStorage) {
      localStorage.setItem(
        this.localStorageKeys.lastPosition,
        JSON.stringify({
          [this.localStorageKeys.chapter]: this.chapter,
          [this.localStorageKeys.page]: this.page,
        })
      );
      localStorage.setItem(
        this.localStorageKeys.fontSize,
        String(this.fontSize)
      );
      localStorage.setItem(this.localStorageKeys.colorMode, this.colorMode);
      localStorage.setItem(this.localStorageKeys.fontFamily, this.fontFamily);
      localStorage.setItem(
        this.localStorageKeys.bookmarks,
        JSON.stringify(this.bookmarks)
      );
    }
  }

  /**
    Loads the state of the app from the local storage
  */

  load(): any {
    this.fontSize = +localStorage.getItem(this.localStorageKeys.fontSize);
    this.colorMode = localStorage.getItem(this.localStorageKeys.colorMode);
    this.fontFamily = localStorage.getItem(this.localStorageKeys.fontFamily);
    this.bookmarks = JSON.parse(
      localStorage.getItem(this.localStorageKeys.bookmarks)
    );
    const lastPosition = JSON.parse(
      localStorage.getItem(this.localStorageKeys.lastPosition)
    );
    this.chapter = lastPosition?.chapter;
    this.page = lastPosition?.page;
    return {
      fontSize: this.fontSize,
      colorMode: this.colorMode,
      fontFamily: this.fontFamily,
      bookmarks: this.bookmarks,
      chapter: this.chapter,
      page: this.page,
    };
  }
}
