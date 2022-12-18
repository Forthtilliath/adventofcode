import { fetchData } from "../../../lib/forth.js";

(async () => {
  const data = await fetchData();

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(data) {
  const res = lookAndSay(data, 40);
  return res.length;
}

function part2(data) {
  const res = lookAndSay(data, 50);
  return res.length;
}

function lookAndSay(line, n) {
  const arr = line.match(/(.)\1*/g);
  // = ['3', '11', '33', '22', '11', '3']
  const newLine = arr.map((n) => (n.length + n.at(0)).toString()).join("");

  if (n === 1) return newLine;
  return lookAndSay(newLine, --n);
}
