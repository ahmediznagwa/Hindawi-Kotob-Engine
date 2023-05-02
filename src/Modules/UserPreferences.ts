export class UserPreferences {
  bookId: string;
  page: number;
  chapter: number;
  fontSize: number;
  colorMode: string;
  fontFamily: string;
  localStorageKeys: any;

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
    Saves the current app state in local storage or in memory
  */
  save(
    currentPage: number,
    currentChapter: number,
    fontSize: number,
    colorMode: string,
    fontFamily: string,
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
      localStorage.setItem(
        this.localStorageKeys.fontSize,
        String(this.fontSize)
      );
      localStorage.setItem(this.localStorageKeys.colorMode, this.colorMode);
      localStorage.setItem(this.localStorageKeys.fontFamily, this.fontFamily);
    }
  }

  /**
    Loads the state of the app from the local storage
  */

  load(): any {
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
