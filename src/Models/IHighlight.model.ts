import { IHighlighted } from "./IHighlighted.model";

export interface IHighlight {
  [key: string]: {
    notes: IHighlighted[];
  };
}
