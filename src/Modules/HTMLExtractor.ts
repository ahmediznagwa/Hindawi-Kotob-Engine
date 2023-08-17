export class HTMLExtractor {
  bookId: string;
  cssFiles: string[] = [];
  chapters: any[];
  rootFolder: string;
  constructor(bookId: string, rootFolder: string) {
    this.bookId = bookId;
    this.chapters = [];
    this.rootFolder = rootFolder;
  }
}
