import { IBookmark } from "./IBookmark.model";
import { IHighlight } from "./IHighlight.model";

export interface IUserPreferencesState {
  anchorWordIndex: number;
  currentChapter: number;
  fontSize: number;
  colorMode: string;
  fontFamily: string;
  bookmarks: IBookmark;
  highlights: IHighlight;
}
