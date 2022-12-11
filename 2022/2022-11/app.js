import { fetchLines,  } from "../../lib/forth.js";

const REGEX = /(?<noop>noop)|(?<addx>addx) (?<value>-?\d*)/;

(async () => {
  const lines = await fetchLines();
  const cycles = parseLines(lines);

  console.log("Part 1", part1(cycles));
  console.log("Part 2", part2(cycles));
})();

function part1(cycles) {
}

function part2(cycles) {
}

/**
 *
 * @param {string[]} lines
 * @returns Le tableau de retour commence toujours par 1
 * @example
 * parseLines(['noop','addx 3','addx -5'])
 * // [1, 0, 0, 3, 0, -5]
 */
function parseLines(lines) {
  return lines
    .map((line) => line.match(REGEX).groups)
    .reduce(
      (acc, group) =>
        group.noop ? acc.concat(0) : acc.concat(0, Number(group.value)),
      [1]
    );
}