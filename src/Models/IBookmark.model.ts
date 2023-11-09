import { IHighlighted } from "./IHighlighted.model";

export interface IBookmark {
  [key: string]: {
    bookmarks: IHighlighted[];
  };
}
