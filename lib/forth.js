/**
 * It fetches the data from the file and returns the text.
 * @returns A promise that resolves to the text of the file.
 */
 export async function fetchData() {
  return await fetch("./data.txt").then((res) => res.text());
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
