import { IBookmark } from "../Models/IBookmark.model";
import { IHighlight } from "../Models/IHighlight.model";

export class UserPreferences {
  bookId: string;
  anchorWordIndex: number;
  chapter: number;
  fontSize: number;
  colorMode: string;
  fontFamily: string;
  localStorageKeys: any;
  bookmarks: IBookmark;
  highlights: IHighlight;

  constructor(bookId) {
    this.bookId = bookId;
    this.anchorWordIndex = 0;
    this.chapter = 0;
    this.fontSize = 0;
    this.colorMode = null;
    this.fontFamily = null;
    this.bookmarks = null;
    this.highlights = null;

    this.localStorageKeys = {
      fontSize: `${this.bookId}_fontSize`,
      colorMode: "colorMode",
      fontFamily: "fontFamily",
      lastPosition: `${this.bookId}_lastPosition`, //its value in Localstorage will be a JSON containing chapter and page,
      anchorWordIndex: "anchorWordIndex",
      chapter: "chapter",
      bookmarks: `${this.bookId}_bookmarks`,
      highlights: `${this.bookId}_highlights`,
    };
  }

  /**
    Saves the current app state in local storage or in memory
  */
  save(
    anchorWordIndex: number,
    currentChapter: number,
    fontSize: number,
    colorMode: string,
    fontFamily: string,
    bookmarks: IBookmark,
    highlights: IHighlight,
    saveToLocalStorage = true
  ) {
    this.anchorWordIndex = anchorWordIndex;
    this.chapter = currentChapter;
    this.fontSize = fontSize;
    this.colorMode = colorMode;
    this.fontFamily = fontFamily;
    this.bookmarks = bookmarks;
    this.highlights = highlights;
    if (saveToLocalStorage) {
      localStorage.setItem(
        this.localStorageKeys.lastPosition,
        JSON.stringify({
          [this.localStorageKeys.chapter]: this.chapter,
          [this.localStorageKeys.anchorWordIndex]: this.anchorWordIndex,
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
      localStorage.setItem(
        this.localStorageKeys.highlights,
        JSON.stringify(this.highlights)
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
    this.highlights = JSON.parse(
      localStorage.getItem(this.localStorageKeys.highlights)
    );
    const lastPosition = JSON.parse(
      localStorage.getItem(this.localStorageKeys.lastPosition)
    );
    this.chapter = lastPosition?.chapter;
    this.anchorWordIndex = lastPosition?.anchorWordIndex;
    return {
      fontSize: this.fontSize,
      colorMode: this.colorMode,
      fontFamily: this.fontFamily,
      bookmarks: this.bookmarks,
      highlights: this.highlights,
      chapter: this.chapter,
      anchorWordIndex: this.anchorWordIndex,
    };
  }
}
