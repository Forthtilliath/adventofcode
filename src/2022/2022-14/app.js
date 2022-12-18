import { fetchLines } from "../../../lib/forth.js";

init();

async function init() {
  const lines = await fetchLines();
  const data = parseData(lines);

  console.log("Part 1", part1(data));
  // console.log("Part 2", part2(data));
}

function part1(lines) {}

function part2(lines) {}

function parseData(lines) {}
