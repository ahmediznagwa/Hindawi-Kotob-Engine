import { IBookmark } from "./IBookmark.model";

export interface IUserPreferencesState {
  anchorWordIndex: number;
  currentChapter: number;
  fontSize: number;
  colorMode: string;
  fontFamily: string;
  bookmarks: IBookmark[];
}
