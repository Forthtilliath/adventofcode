import { fetchLines, getMultiples, sum } from "../../../lib/forth.js";

const REGEX = /(?<noop>noop)|(?<addx>addx) (?<value>-?\d*)/;

(async () => {
  const lines = await fetchLines();
  const cycles = parseLines(lines);

  console.log("Part 1", part1(cycles));
  console.log("Part 2", part2(cycles));
})();

function part1(cycles) {
  console.log(cycles);
  // [20,60,100,140,180,220]
  // [420,1140,1800,2940,2880,3960] => 13140
  const signals = [20].concat(getMultiples(40, cycles.length, 20));
  return sum(signals.map((x) => getValueAfterCycle(x, cycles)));
}

function part2(cycles) {
  const signals = getMultiples(40, cycles.length);
  let spritePosition = 0;
  let spriteSize = 3;
  let str = "";
  let j = 0;

  cycles.forEach((cycle, i) => {
    j = (i % 40) + 1;
    spritePosition += cycle;
    const onSprite = j >= spritePosition && j < spritePosition + spriteSize;
    str += onSprite ? "#" : " ";
    if (signals.includes(j)) {
      console.log(str);
      str = "";
    }
  });
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

/**
 * @typedef Cycle
 * @type {object}
 * @property {number} cycle Durée du cycle
 * @property {number} value Valeur incrémentée à la fin du cycle
 */

/**
 * Calcule la somme des cycles d'une durée donnée
 * @param {number} n Durée des cycles à calculer
 * @param {number[]} cycles Liste des cycles
 * @returns {number} Somme des cycles
 * @example
 * getValueAfterCycle(4, [0,0,1,0,3,0,-5]);
 * // (1 + 0 + 0 + 1 + 0) * 4 => 8
 */
function getValueAfterCycle(n, cycles) {
  return sum(cycles.slice(0, n)) * n;
}
