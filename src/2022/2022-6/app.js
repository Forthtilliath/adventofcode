import { fetchData } from "../../../lib/forth.js";

(async () => {
  const data = await fetchData();

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(line) {
  return findNthDifferentLetters(line, 4);
}

function part2(line) {
  return findNthDifferentLetters(line, 14);
}

function findNthDifferentLetters(line, nth) {
  let index;
  for (let i = 0; i < line.length - nth + 1; i++) {
    const marker = line.slice(i, i + nth);
    if (isUnique(marker)) {
      index = i + nth;
      break;
    }
  }
  return index;
}

function isUnique(str) {
  return new Set(str).size == str.length;
}
