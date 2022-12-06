import { fetchLines } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  const fullContain = lines.reduce((sum, line) => {
    const [elfA, elfB] = splitLineIntoElves(line);

    return sum + +isFullContained(elfA, elfB);
  }, 0);

  console.log("Part 1", fullContain);

  const overlapping = lines.reduce((sum, line) => {
    const [elfA, elfB] = splitLineIntoElves(line);

    return sum + +isOverlapping(elfA, elfB);
  }, 0);

  console.log("Part 2", overlapping);
})();

function splitLineIntoElves(line) {
  return line.split(",").map((s) => s.split("-").map(Number));
}

function isFullContained([minA, maxA], [minB, maxB]) {
  return (minA <= minB && maxA >= maxB) || (minB <= minA && maxB >= maxA);
}

function isOverlapping([minA, maxA], [minB, maxB]) {
  return (minA <= minB && maxA >= minB) || (minB <= minA && maxB >= minA);
}
