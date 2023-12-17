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
  let wordsNumber = selected.toString().trim().split(" ").length;
  const anchorElementIndex =
    +$(selected.focusNode.parentNode).attr("n") - wordsNumber + 1; // Deducting the focus word itself;
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
export function wrapHighlightedElements(
  words: HTMLElement[],
  type: "highlight" | "bookmark"
) {
  let highlightParent;
  let currentWordParent;
  let className = type === "highlight" ? "highlighted" : "bookmarked";

  if (type === "highlight" && $(words[0]).parent(".highlighted").length) {
    // window.getSelection()
    return;
  }
  // if (type === "bookmark" && $(words[0]).parent(".bookmarked").length) {
  //   return;
  // }
  words.forEach((word, index) => {
    word.textContent = `${
      index === words.length - 1 ? word.textContent : `${word.textContent} `
    }`;
    if (currentWordParent !== word.parentNode) {
      currentWordParent = word.parentNode;
      highlightParent = document.createElement("span");
      highlightParent.classList.add(className);
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
