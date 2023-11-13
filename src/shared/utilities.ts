import { BookChapter } from "../Modules/BookChapter";

/**
 Check if object is empty
*/
export function isObjEmpty(obj): boolean {
  return Object.keys(obj).length === 0;
}

/**
 Get full sentence starting from specific index
*/
export function getSentenceAfterWord(
  wordIndex: number,
  numberOfWords: number = 5
): string {
  let sentence = $(`span[n=${wordIndex}]`).text();
  for (let index = 1; index < numberOfWords; index++) {
    sentence += ` ${$(`span[n=${wordIndex + index}]`).text()}`;
  }
  return sentence;
}

/**
 Get elements array back from window selection
*/
export function extractWordsFromSelection(selected: Selection): HTMLElement[] {
  const anchorElementIndex = +$(selected.anchorNode.parentNode).attr("n");
  let wordsNumber = selected.toString().split(" ").length;
  const elementsArray: HTMLElement[] = [];
  let currentParent;
  let isSameParent = true;

  for (let index = 0; index <= wordsNumber; index++) {
    const wordParent = $(`span[n=${anchorElementIndex + index}]`)
      .parent()
      .get(0);
    if (currentParent && currentParent !== wordParent) {
      isSameParent = false;
    }
    currentParent = wordParent;
    elementsArray.push($(`span[n=${anchorElementIndex + index}]`)[0]);
  }

  if (isSameParent) {
    elementsArray.pop();
  }

  return elementsArray;
}

/**
 Highlight group os spans elements by wrapping them into new parent
*/
export function wrapHighlightedElements(words: HTMLElement[]) {
  let highlightParent;
  let currentWordParent;

  words.forEach((word, index) => {
    word.textContent = `${
      index === words.length - 1 ? word.textContent : `${word.textContent} `
    }`;
    if (currentWordParent !== word.parentNode) {
      currentWordParent = word.parentNode;
      highlightParent = document.createElement("span");
      highlightParent.classList.add("highlighted");
      $(highlightParent).insertBefore($(words[index]));
      $(highlightParent).append(word);
    } else {
      $(highlightParent).append(word);
    }
  });
}

/**
 Get page number according to specific word index
*/
export function getPageNumberByWordIndex(
  wordIndex: number,
  currentChapter: BookChapter
): number {
  let pageNo = 0;
  currentChapter?.pagesContentRanges.forEach((page, pageIndex) => {
    const min = Math.min(page[0], page[1]),
      max = Math.max(page[0], page[1]);
    if (
      (wordIndex > min && wordIndex < max) ||
      wordIndex === min ||
      wordIndex === max
    ) {
      pageNo = pageIndex;
    }
  });

  return pageNo;
}
