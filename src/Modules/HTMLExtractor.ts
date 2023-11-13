import { IBookInfo } from "../Models/IBookInfo.model";

export class HTMLExtractor {
  bookInfo: IBookInfo;
  chapters: any[];
  rootFolder: string;
  tableOfContents: string[];
  constructor(bookInfo: IBookInfo, rootFolder: string, tableOfContents: string[]) {
    this.bookInfo = bookInfo;
    this.chapters = [];
    this.rootFolder = rootFolder;
    this.tableOfContents = tableOfContents
  }
}
