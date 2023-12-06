import { IReaderConfig } from "../Models/IReaderConfig.model";


export class HTMLExtractor {
  readerConfig: IReaderConfig;
  chapters: any[];
  rootFolder: string;
  tableOfContents: string[];
  constructor(readerConfig: IReaderConfig, rootFolder: string, tableOfContents: string[]) {
    this.readerConfig = readerConfig;
    this.chapters = [];
    this.rootFolder = rootFolder;
    this.tableOfContents = tableOfContents
  }
}
