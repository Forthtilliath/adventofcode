import { fetchLines } from "../../../lib/forth.js";

/**
 * @typedef Range
 * @type {object}
 * @property {number} from
 * @property {number} to
 */

init();

async function init() {
  const lines = await fetchLines();
  const data = parseData(lines);

  console.time("Part 1");
  console.log("Part 1:", part1(data, 2_000_000));
  console.timeEnd("Part 1");

  console.log("")

  console.time("Part 2");
  console.log("Part 2:", part2(data, 4_000_000));
  console.timeEnd("Part 2");
}

function part1(data, row) {
  // point Signal et Beacon sur la ligne souhaitée
  const xPoints = new Set();

  const ranges = getRanges(data, row, xPoints);
  ranges.sort((a, b) => a.from - b.from);

  const joinedRanges = joinRanges(ranges);
  return countNotBeacon(joinedRanges, xPoints);
}

function part2(data, n) {
  for (let i = 0; i < n; i++) {
    const ranges = getRanges(data, i);
    ranges.sort((a, b) => a.from - b.from);
    const joinedRanges = joinRanges(ranges);

    if (joinedRanges.length > 1) {
      // la valeur du to est inclus, donc +1 pour avoir la valeur après la range
      return (joinedRanges[0].to + 1) * 4_000_000 + i;
    }
  }
}

function parseData(lines) {
  return lines.map((line) => line.match(/(-?\d+)/g).map(Number));
}

function getRanges(data, row, xPoints) {
  return data.reduce((arr, [sx, sy, bx, by]) => {
    if (xPoints) {
      if (sy === row) xPoints.add(sx);
      if (by === row) xPoints.add(bx);
    }
    // Distance entre Signal et Beacon
    const range = getRange(sx, sy, bx, by);
    // Distance entre Signal et la ligne souhaitée
    const rowRange = Math.abs(sy - row);
    // Si trop loin, on ignore
    if (rowRange > range) return arr;

    // ligne 10 = 9 - 3 => 6
    const xRange = range - rowRange;

    // Génère un tableau d'objet {from, to}
    return arr.concat([{ from: sx - xRange, to: sx + xRange }]);
  }, []);
}

/**
 * It returns the absolute value of the difference between the starting x and ending x coordinates,
 * plus the absolute value of the difference between the starting y and ending y coordinates
 * @param sx - The x coordinate of the starting point.
 * @param sy - The y coordinate of the starting point.
 * @param bx - The x coordinate of the bottom right corner of the rectangle.
 * @param by - The y-coordinate of the bottom-right corner of the rectangle.
 * @returns The distance between the two points.
 */
function getRange(sx, sy, bx, by) {
  return Math.abs(sx - bx) + Math.abs(sy - by);
}

function isInRange(range, sx) {
  return (
    (sx >= range.from && sx <= range.to) || (sx <= range.to && sx >= range.from)
  );
}

function countNotBeacon(ranges, xPoints) {
  let total = 0;
  for (let range of ranges) {
    // Vérifie si un signal ou un beacon est dans la range
    for (let x of xPoints) {
      if (isInRange(range, x)) {
        total -= 1;
        // Delete pour le compter qu'une fois
        xPoints.delete(x);
      }
    }
    // range {from: 0, to:2} => total + 3 (0 et 2 inclus)
    total += range.to - range.from + 1;
  }

  return total;
}

/**
 * Join all ranges to keep only unique values in each
 * @param {Array<Range>} ranges 
 * @returns {Array<Range>}
 */
function joinRanges(ranges) {
  const joinedRanges = [];

  ranges.forEach((range, i) => {
    if (!joinedRanges.length) {
      joinedRanges.push(range);
      return;
    }
    const lastRange = joinedRanges.at(-1);
    
    if (range.from <= lastRange.to) {
      lastRange.to = Math.max(lastRange.to, range.to);
    } else {
      joinedRanges.push(range);
    }
  });

  return joinedRanges;
}