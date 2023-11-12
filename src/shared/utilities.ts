export function isObjEmpty(obj): boolean {
  return Object.keys(obj).length === 0;
}

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
