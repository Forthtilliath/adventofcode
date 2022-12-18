import { fetchLines, multiply } from "../../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

/**
 * [true, true, true, true, true]
 * [true, true, true, false, true]
 * [true, true, false, true, true]
 * [true, false, true, false, true]
 * [true, true, true, true, true]
 */
function part1(lines) {
  return lines
    .map((line, y) =>
      line.split("").map((_, x) => isVisibleFromEdge(lines, x, y))
    )
    .flat()
    .filter((b) => b).length;
}

function part2(lines) {
  return Math.max(
    ...lines
      .map((line, y) =>
        line.split("").map((_, x) => getScenicScore(lines, x, y))
      )
      .flat()
  );
}

function isVisibleFromEdge(arr, x, y) {
  const tree = Number(arr[y][x]);
  const edges = getAllTreesToEdge(arr, x, y);
  return edges.some((trees) => [...trees].every((t) => Number(t) < tree));
}

function getScenicScore(arr, x, y) {
  const tree = Number(arr[y][x]);
  const edges = getAllTreesToEdge(arr, x, y);
  let a = [];
  for (let trees of edges) {
    let b = 0;
    const arr = [...trees].map(Number);
    for (let t of arr) {
      b++;
      if (tree <= t) break;
    }
    a.push(b);
  }
  return multiply(a);
}

function getAllTreesToEdge(arr, x, y) {
  // inverse top et left
  const left = arr[y].slice(0, x).split("").reverse().join("");
  const right = arr[y].slice(x + 1);
  let [top, bot] = arr
    .map((row, i) => (i !== y ? row[x] : "x"))
    .join("")
    .split("x");
  top = top.split("").reverse().join("");
  return [left, right, top, bot];
}
