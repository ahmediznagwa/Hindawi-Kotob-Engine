import { IHighlighted } from "./IHighlighted.model";

export interface IHighlight {
  [key: string]: {
    highlights: IHighlighted[];
  };
}
