export function isObjEmpty(obj): boolean {
  return Object.keys(obj).length === 0;
}

export function getSentenceAfterWord(
  wordIndex: number,
  numberOfWords: number = 5
): string {
  let counter = wordIndex;
  let sentence = $(`span[n=${counter}]`).text();
  for (let index = 1; index < numberOfWords; index++) {
    sentence += ` ${$(`span[n=${counter + 1}]`).text()}`;
    counter++;
  }
  return sentence;
}
