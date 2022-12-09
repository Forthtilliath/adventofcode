import { fetchJson } from "../../lib/forth.js";

(async () => {
  const lines = await fetchJson();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(obj) {
  return sumNumbersFromArray(Object.values(obj));
}

function part2(obj) {
  return sumNumbersFromArray2(Object.values(obj));}

function sumNumbersFromArray(arr) {
  return arr.reduce((sum, val) => {
    if (Array.isArray(val)) {
      return sum + sumNumbersFromArray(val);
    }
    if (typeof val === "object") {
      return sum + sumNumbersFromArray(Object.values(val));
    }
    if (typeof val === 'number') {
      return sum + val;
    }
    return sum;
  }, 0);
}

function sumNumbersFromArray2(arr) {
  return arr.reduce((sum, val) => {
    if (Array.isArray(val)) {
      return sum + sumNumbersFromArray2(val);
    }
    if (typeof val === "object") {
      if (Object.values(val).includes("red")) return sum;
      return sum + sumNumbersFromArray2(Object.values(val));
    }
    if (typeof val === 'number') {
      return sum + val;
    }
    return sum;
  }, 0);
}
