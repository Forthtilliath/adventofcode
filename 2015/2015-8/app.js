import { fetchLines } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

// function part1(lines) {
//   return lines.reduce((n, line) => {
//     const str = line
//       .replace(/^\"|\"$/g, "")
//       .replace(/\\\\|\\\"|\\x[\da-f]{2}/g, "_");
//     return n + line.length - str.length;
//   }, 0);
// }

function part1(lines) {
  return lines.reduce((n, line) => n + line.length - eval(line).length, 0);
}

function part2(lines) {
  return lines.reduce((n, line) => {
    return n + JSON.stringify(line).length - line.length;
  }, 0);
}
