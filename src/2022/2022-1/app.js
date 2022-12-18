import { fetchLines } from "../../../lib/forth.js";

(async () => {
  const lines = await fetchLines();
  const elves = getElves(lines);

  console.log("top 1", top1(elves));
  console.log("top 3", top3(elves));
})();

function getElves(lines) {
  return lines.reduce(
    (arr, line) => {
      if (line === "") {
        arr.push(0);
      } else {
        arr[arr.length - 1] += +line;
      }
      return arr;
    },
    [0]
  );
}

function top1(elves) {
  return Math.max(...elves);
}

function top3(elves) {
  const topElves = [0, 0, 0];
  elves.forEach((elf) => {
    if (topElves.some((top) => elf > top)) {
      topElves[0] = elf;
      topElves.sort();
    }
  });
  return topElves.reduce((acc, elf) => acc + elf);
}
