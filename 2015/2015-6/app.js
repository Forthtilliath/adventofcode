import { fetchLines, sum } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(lines) {
  const ACTIONS = {
    toggle: (...args) => setLights(...args, (n) => Number(!n)),
    "turn on": (...args) => setLights(...args, () => 1),
    "turn off": (...args) => setLights(...args, () => 0),
  };
  return doActions(lines, ACTIONS);
}

function part2(lines) {
  const ACTIONS = {
    toggle: (...args) => setLights(...args, (n) => n + 2),
    "turn on": (...args) => setLights(...args, (n) => n + 1),
    "turn off": (...args) => setLights(...args, (n) => Math.max(n - 1, 0)),
  };
  return doActions(lines, ACTIONS);
}

function doActions(lines, ACTIONS) {
  const length = 1000;
  const lights = Array.from({ length }, (_) => Array(length).fill(0));

  lines.forEach((line) => {
    const regex = /([\D]+) ([\d]+),([\d]+) through ([\d]+),([\d]+)/;
    const [_, action, ...slots] = line.match(regex);
    ACTIONS[action](lights, ...slots);
  });
  return count(lights);
}

function setLights(arr, fromX, fromY, toX, toY, setter) {
  for (let i = fromX; i <= toX; i++) {
    for (let j = fromY; j <= toY; j++) {
      arr[j][i] = setter(arr[j][i]);
    }
  }
}

function count(arr) {
  return arr.reduce((acc, lightX) => acc + sum(lightX), 0);
}
