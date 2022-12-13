import { fetchLines, chunkArray, convertToArray } from "../../lib/forth.js";

init();

async function init() {
  const lines = await fetchLines();
  const filteredLines = lines.filter((item) => item.length);

  console.log("Part 1", part1(filteredLines));
  console.log("Part 2", part2(filteredLines));
}

function part1(lines) {
  const pairs = chunkArray(lines, lines.length / 2);

  return pairs.reduce((n, pair, i) => (isRightOrder(pair) ? n + i + 1 : n), 0);
}

function part2(lines) {
  lines.sort((a, b) => compareArrays(JSON.parse(a), JSON.parse(b)));
  
  const firstDivider = findDividerIndex(lines, "[[2]]") + 1;
  const secondDivider = findDividerIndex(lines, "[[6]]") + 1;

  return firstDivider * secondDivider;
}

function isRightOrder(pair) {
  const [tab1, tab2] = pair.map(JSON.parse);
  return compareArrays(tab1, tab2) === -1;
}

/**
 *
 * @param {number|array} a First array to compare
 * @param {number|array} b Second array to compare
 * @returns 0 if the array are equals, -1 if a < b, else 1 if b > a
 */
function compareArrays(a, b) {
  a = convertToArray(a);
  b = convertToArray(b);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    // Si un tableau terminé
    if (a[i] === undefined) return -1;
    if (b[i] === undefined) return 1;

    // Si y'a un tableau => recursivité
    if (Array.isArray(a[i]) || Array.isArray(b[i])) {
      const res = compareArrays(a[i], b[i]);
      if (res === 0) continue;
      return res;
    }

    if (a[i] === b[i]) continue;

    return a[i] < b[i] ? -1 : 1;
  }

  return 0;
}

function findDividerIndex(lines, divider) {
  return lines.findIndex((line) => line === divider);
}
