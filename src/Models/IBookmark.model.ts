import { IHighlighted } from "./IHighlighted.model";

export interface IBookmark {
  [key: string]: {
    notes: IHighlighted[];
  };
}
