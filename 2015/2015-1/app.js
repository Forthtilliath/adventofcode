import { fetchData } from "../../lib/forth.js";

(async () => {
  const data = await fetchData();

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(data) {
  return [...data].reduce((sum, c) => sum + level(c), 0);
}

function part2(data) {
  let floor = 0;
  let i = 0;
  do {
    floor += level(data.slice(i, i + 1));
    i++;
  } while (floor >= 0 && i < data.length);
  return floor < 0 ? i : -1;
}

function level(parenthesis) {
  if (parenthesis === "(") return 1;
  if (parenthesis === ")") return -1;
  throw new Error("Error parenthesis");
}
