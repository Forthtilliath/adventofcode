import { fetchLines } from "../lib/forth.js";

(async () => {
  const lines = await fetchLines();
  console.log(lines);

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(lines) {
  return lines.reduce((sum, line) => {
    const [l, w, h] = line.split("x").map(Number);
    const values = [l * w, l * h, w * h];
    const min = Math.min(...values);

    return sum + 2 * values.reduce((sum, n) => sum + n) + min;
  }, 0);
}

function part2(lines) {
  return lines.reduce((sum, line) => {
    const [l, w, h] = line.split("x").map(Number);
    const max = Math.max(l, w, h);
    const mins = [l, w, h].filter((n) => n !== max);
    if (mins.length === 0) {
      mins.push(max, max);
    }
    if (mins.length === 1) {
      mins.push(max);
    }
    const [a, b] = mins;

    return sum + a + a + b + b + l * w * h;
  }, 0);
}
