import { IHighlightedWord } from "./IHighlightedWord.model";

export interface IHighlight {
  [key: string]: {
    highlights: IHighlightedWord[];
  };
}
