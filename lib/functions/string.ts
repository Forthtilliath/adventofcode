/**
 * Replace a character at a given index in a string with a given replacement string.
 * @param {string} str - The string to be modified
 * @param {number} index - The index of the character to replace.
 * @param {string} replacement - The string to replace the character at the specified index with.
 * @returns A function that takes a string and returns a string.
 */
export function replaceAt(str: string, index: number, replacement: string) {
  return (
    str.substring(0, index) +
    replacement +
    str.substring(index + replacement.length)
  );
}

/**
 * Split a string into an array of strings.
 * @param {string} str - The string to split
 * @param {number[]} indexes - The indexes where to split the string
 * @example
 * split("..@@@@.",[2,6,7])
 * //  ['..', '@@@@', '.', '']
 */
export function split(str: string, indexes: number[]): string[] {
  const res: Array<string> = [];
  let last = 0;
  let next = 0;
  while (indexes.length > 0) {
    next =indexes.shift()!;
    res.push(str.slice(last, next));
    last = next;
  }
  res.push(str.slice(last));
  return res;
}