import { IHighlightedWord } from "./IHighlightedWord.model";

export interface IBookmark {
  [key: string]: {
    bookmarks: IHighlightedWord[];
  };
}
