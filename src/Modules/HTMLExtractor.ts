export class HTMLExtractor {
  bookId: string;
  chapters: any[];
  rootFolder: string;
  tableOfContents: string[];
  bookCss: string;
  constructor(bookId: string, rootFolder: string, tableOfContents: string[], bookCss: string) {
    this.bookId = bookId;
    this.chapters = [];
    this.rootFolder = rootFolder;
    this.tableOfContents = tableOfContents;
    this.bookCss = bookCss;
  }
}
