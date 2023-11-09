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

  for (let index = 0; index <= wordsNumber; index++) {
    elementsArray.push($(`span[n=${anchorElementIndex + index}]`)[0]);
  }

  return elementsArray;
}
