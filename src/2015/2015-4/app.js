import { fetchData } from "../../../lib/forth.js";

(async () => {
  const data = await fetchData();

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(data) {
  return startsWith(data, 5);
}

function part2(data) {
  return startsWith(data, 6);
}

function startsWith(data, n) {
  let i = 0;
  let hash;
  do {
    i++;
    hash = CryptoJS.MD5(data + i).toString();
  } while (!hash.startsWith("0".repeat(n)));

  return i;
}
