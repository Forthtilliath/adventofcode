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
export function sum(arr, start = 0) {
  return arr.reduce((sum, n) => sum + n, start);
}

export function multiply(arr) {
  return arr.reduce((acc, n) => acc * n, 1);
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
export function getFragmentsOfArray(arr, n) {
  return arr
    .map((_, i) => [
      [arr.at(i), arr.at(i === 0 ? -1 : i - 1)],
      [arr.at(i), arr.at(i === arr.length - 1 ? 0 : i + 1)],
    ])
    .flat();
}
// export function getFragmentsOfArray(arr, n) {
//   return arr.map((_, i) => [arr.at(i), arr.at(i === 0 ? -1 : i - 1)]);
// }

/**
 * It returns all the possible combinations of a list of elements, of a given size
 * @param list - the list of items to combine
 * @param [size] - the size of the combinations you want to get
 * @returns An array of arrays of all possible combinations of the input array.
 * @example
 * getCombinaisons([1,2,3], 2);
 * // [[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]]
 */
export function getCombinaisons(list, size = list.length) {
  if (size > list.length) return [];
  if (size == 1) return list.map((d) => [d]);
  return list.flatMap((d) =>
    getCombinaisons(
      list.filter((a) => a !== d),
      size - 1
    ).map((item) => [d, ...item])
  );
}

export function getUniqueCombinaisons(a, n = a.length, s = [], t = []) {
  return a.reduce((p, c, i, a) => {
    n > 1
      ? getUniqueCombinaisons(
          a.slice(0, i).concat(a.slice(i + 1)),
          n - 1,
          p,
          (t.push(c), t)
        )
      : p.push((t.push(c), t).slice(0));
    t.pop();
    return p;
  }, s);
}

export function arrayMax(arr) {
  return arr.reduce((p, v) => (p > v ? p : v));
}

/**
 *
 * @param {number} d Dénominateur
 * @param {number} n Numérateur
 * @param {number} min Valeur de départ
 * @returns {number[]} Tableau contenant tous les multiples
 */
export function getMultiples(d, n, min = 0) {
  return Array.from({ length: n / d }, (_, i) => d * (i + 1) + min).filter(
    (x) => x <= n
  );
}

/**
 * It partitions a number into a sum of smaller numbers.
 * @param n - the number of items to partition
 * @param size - the size of the array
 * @returns An array of arrays of numbers.
 */
export function partition(n, size) {
  if (n === 0) return [];
  const arr = [];
  for (let i = 0; i <= size; i++) {
    const subArrs = partition(n - 1, size - i);
    if (subArrs.length === 0) arr.push([i]);
    else {
      for (let j = 0; j < subArrs.length; j++) {
        subArrs[j].unshift(size - sum(subArrs[j]));
        arr.push(subArrs[j]);
      }
    }
  }

  return setArray(arr);
}

/**
 * It creates an array of integers from `from` to `to` inclusive
 * @param from - The starting number of the sequence.
 * @param to - The number to stop at.
 * @returns An array of numbers from the first argument to the second argument.
 */
export function rangeInt(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => i + from);
}

/**
 * Remove duplicates from an array
 * @description Only works with ``numbers``, ``strings`` and ``booleans``
 * @param {(number|string|boolean)[]}arr - The array you want to remove duplicates from.
 * @returns An array of objects with unique values.
 */
export function setArray(arr) {
  return [...new Set(arr.map((i) => JSON.stringify(i)))].map((i) =>
    JSON.parse(i)
  );
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}


export function convertToArray(arr) {
  return  Array.isArray(arr) ? arr : [arr];
}