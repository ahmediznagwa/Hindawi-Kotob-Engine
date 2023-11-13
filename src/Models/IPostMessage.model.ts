export interface PageUpdatedMessage {
  isFirstPage: boolean;
  isLastPage: boolean;
  colorMode: string;
  isFirstChapter: boolean;
  isLastChapter: boolean;
  chapterMaxPages: number;
  maxChapters: number;
  percentage: number;
  currentPage: number;
  currentChapter: number;
  fontSize: number;
  canIncreaseFont: boolean;
  canDecreaseFont: boolean;
  anchorWordIndex: number;
}
