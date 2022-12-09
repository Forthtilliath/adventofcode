/**
 * It fetches the data from the file and returns the text.
 * @returns A promise that resolves to the text of the file.
 */
export async function fetchData() {
  return await fetch("./data.txt").then((res) => res.text());
}
export async function fetchJson() {
  return await fetch("./data.json").then((res) => res.json());
}

/**
 * It fetches the data.txt file, then returns the text content of the file, then returns the lines of
 * the text content.
 * @returns An array of lines.
 */
export async function fetchLines() {
  return await fetchData().then(getLines);
}

export function getLines(data) {
  return data.split("\r\n");
}

/**
 * It takes an array and a number, and returns an array of arrays, each of which is a chunk of the
 * original array
 * @param arr - The array to be chunked
 * @param n - The number of chunks you want to split the array into.
 * @returns An array of arrays.
 */
export function chunkArray(arr, n) {
  var chunkLength = Math.max(arr.length / n, 1);
  var chunks = [];
  for (var i = 0; i < n; i++) {
    if (chunkLength * (i + 1) <= arr.length)
      chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
  }
  return chunks;
}

/**
 * It takes an array of numbers and returns the sum of all the numbers in the array.
 * @param arr - The array to sum
 * @returns The sum of all the numbers in the array.
 */
export function sum(arr) {
  return arr.reduce((sum, n) => sum + n);
}

export function isNumber(str) {
  return isFinite(str);
}

/**
 * It splits the string into an array of characters, then reduces the array into an array of substrings
 * of length n, then filters the array to only include substrings of length n
 * @param str - The string to be split into fragments.
 * @param n - the length of the fragments
 * @example
 * getFragmentsOfString(["abcd"], 2)
 * // ["ab", "bc", "cd"]
 * @returns An array of all the substrings of length n in the string.
 */
export function getFragmentsOfString(str, n) {
  return str
    .split("")
    .reduce((arr, _, i) => arr.concat(str.slice(i, i + n)), [])
    .filter((s) => s.length === n);
}
