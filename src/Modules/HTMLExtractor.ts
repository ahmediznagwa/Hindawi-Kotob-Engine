import { prodRootUrl } from "./constants";

export class HTMLExtractor {
  bookId: string;
  chapters: any[];
  bookNav: string[];
  constructor(bookId: string) {
    this.bookId = bookId;
    this.chapters = [];
    this.bookNav = [];
  }

  /**
      Sets the chapters order of the parsed book
    */
  async setNav() {
    const res = await fetch(
      `${prodRootUrl}/packages/${this.bookId}/Navigation/nav.xhtml`
    );
    const htmlTxt = await res.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(htmlTxt, "text/html");
    const navList = html.querySelector("ol").querySelectorAll("a");
    navList.forEach((item) => {
      const chapterNameParts = item.getAttribute("href").split("/");
      this.bookNav.push(chapterNameParts[chapterNameParts.length - 1]);
    });
  }

  /**
      Sets the current XML document to the inputted XML string after parsing
    */
  async extractChapters() {
    await this.setNav();
    this.bookNav.forEach(async (name) => {
      this.chapters.push(this.getHTMLDoc(name));
    });
    this.chapters = await Promise.all([...this.chapters]);
    this.chapters = this.chapters.map((res) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(res, "text/html");
      const bodyEl = htmlDoc.querySelector("body");
      const chapter = bodyEl.firstElementChild;
      return chapter;
    });
  }

  /**
   * Sets the current XML document to the inputted XML string after parsing
   */
  async getHTMLDoc(name: string): Promise<string> {
    const res = await fetch(
      `${prodRootUrl}/packages/${this.bookId}/Content/${name}`
    );
    return await res.text();
  }
}
