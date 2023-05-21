export class HTMLExtractor {
  bookId: string;
  cssFiles: string[] = [];
  chapters: any[];
  constructor(bookId: string) {
    this.bookId = bookId;
    this.chapters = [];
  }
}
