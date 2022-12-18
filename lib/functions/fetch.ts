/**
 * It fetches the data from the file and returns the text.
 * @returns A promise that resolves to the text of the file.
 */
export async function fetchData() {
  return await fetch("./data.txt").then((res) => res.text());
}
/**
 * It returns a promise that resolves to the JSON data from the file `data.json`
 * @returns A promise that resolves to the JSON data.
 */
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

export function getLines(data:string) {
  return data.split("\r\n");
}
