import { PageUpdatedMessage } from "../Models/IPostMessage.model";
import { Controller } from "./Controller";
import { UTILS } from "./Utils";
/**
 * A class extending the main {@link Controller} class with modifications for the mobile devices.
 */
export class MobileController extends Controller {
  oldAnchorWordIndex: number;

  /**
    Overrides the {@link Controller.setupEventListeners setupEventListeners} method to only setup resize event listener
*/
  setupEventListeners() {
    this.wordPositionChangeHandler();
    document.fonts.onloadingdone = () =>
      this.book.currentChapter.calcPagesContentRanges();
  }

  /**
   Overrides the {@link Controller.afterNavigationCallback afterNavigationCallback} method to post messages to mobile environment
*/
  afterNavigationCallback() {
    this.postPageUpdatedMessage();
  }

  /**
   Overrides the {@link Controller.afterFontResizeCallback afterFontResizeCallback} method to post messages to mobile environment
*/
  afterFontResizeCallback() {
    this.postPageUpdatedMessage();
  }

  /**
    Overrides the {@link Controller.afterWindowResizeCallback afterWindowResizeCallback} method to post messages to mobile environment
*/
  afterWindowResizeCallback() {
    this.postPageUpdatedMessage();
  }

  /**
    Overrides the {@link Controller.afterDarkModeChangeCallback afterDarkModeChangeCallback} method to post messages to mobile environment
*/
  afterDarkModeChangeCallback() {
    this.postPageUpdatedMessage();
  }

  /**
    Posts a message object as JSON object to mobile environments
*/
  postMessage(messageHandlerName: string, message: object) {
    const json = JSON.stringify(message);
    const win = window as any;
    if (win.webkit?.messageHandlers[messageHandlerName])
      win.webkit.messageHandlers[messageHandlerName].postMessage(json);
    if (win[messageHandlerName]) win[messageHandlerName].postMessage(json);
  }

  /**
   * Posts a message for the pageUpdated message handler. The message object interface: {@link PageUpdatedMessage}
   * @memberof MobileController
   */
  postPageUpdatedMessage() {
    /** @type {PageUpdatedMessage} */
    const messageObj: PageUpdatedMessage = {
      isFirstPage: this.book.isFirstPage,
      isLastPage: this.book.isLastPage,
      chapterMaxPages: UTILS.calcPageCount(),
      maxChapters: this.book.chapters.length - 1,
      percentage: Math.round(this.book.currentProgressPercent),
      currentPage: this.book.currentPage,
      currentChapter: this.book.currentChapterIndex,
      isFirstChapter: this.book.isFirstChapter,
      isLastChapter: this.book.isLastChapter,
      fontSize: this.book.fontSize,
      canIncreaseFont: this.book.canIncreaseFont,
      canDecreaseFont: this.book.canDecreaseFont,
      anchorWordIndex: this.book.anchorWordIndex,
    };
    this.postMessage("pageUpdated", messageObj);
    console.log("POSTED PAGE UPDATED MESSAGE");
  }
}
