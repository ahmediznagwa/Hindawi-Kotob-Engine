export class HTMLExtractor {
  bookId: string;
  rootFolder: string;
  imagesFolder: string;
  cssFiles: string[] = [];
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
    const res = await fetch(`${this.bookId}/META-INF/container.xml`);
    const htmlTxt = await res.text();
    const parser = new DOMParser();
    const container = parser.parseFromString(htmlTxt, "text/html");
    const rootFilePath = container
      .querySelector("rootfile")
      .getAttribute("full-path");

    // Define Book Root Folder
    this.rootFolder = rootFilePath.split("/")[0];
    const packageRes = await fetch(`${this.bookId}/${rootFilePath}`);
    const packageTxt = await packageRes.text();
    const packageFile = parser.parseFromString(packageTxt, "text/html");

    // Define Book Images Folder
    this.imagesFolder = packageFile
      .querySelector("[media-type*='image']")
      .getAttribute("href")
      .split("/")[0];

    // Define Book CSS Files
    const files = packageFile.querySelectorAll("[media-type='text/css']");
    files.forEach((file) => {
      this.cssFiles.push(file.getAttribute("href"));
    });

    const manifestItems = packageFile.querySelectorAll("manifest item");
    const spineItemsRefs = packageFile.querySelectorAll("spine itemref");

    spineItemsRefs.forEach((ref) => {
      const refId = ref.getAttribute("idref");
      manifestItems.forEach((item) => {
        if (item.getAttribute("id") === refId) {
          this.bookNav.push(item.getAttribute("href"));
        }
      });
    });
  }

  /**
      Sets the current HTML document to the inputted HTML string after parsing
    */
  async extractChapters() {
    await this.setNav();
    this.bookNav.forEach(async (path) => {
      this.chapters.push(this.getHTMLDoc(path));
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
  async getHTMLDoc(path: string): Promise<string> {
    const res = await fetch(`${this.bookId}/${this.rootFolder}/${path}`);
    return await res.text();
  }
}
