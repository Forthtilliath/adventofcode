import { cycle, split } from "/lib/index.js";
import { getInput, logPart } from "/lib/browser/index.js";

const DEBUG = false;

const DIR = {
  LEFT: "<",
  RIGHT: ">",
  DOWN: "v",
} as const;

type RockLine = { from: number; to: number; length: number };
type RockPos = Record<number, RockLine>;
type Matrice = string[];
type RockShape = string[];
type Direction = typeof DIR[keyof typeof DIR];

const ROCKS: Array<RockShape> = [
  ["..@@@@."],
  ["...@...", "..@@@..", "...@..."],
  ["..@@@..", "....@..", "....@.."],
  ["..@....", "..@....", "..@....", "..@...."],
  ["..@@...", "..@@..."],
];
const input = getInput();

const LINE_SIZE = 7;
const getNewMatriceLine = () => ".".repeat(LINE_SIZE);

const parseInput = (input: string[]) => input[0].split("");
// const parseInput = (input: string[]) => input[0].split("").reverse();

const canMove = (matrice: Matrice, rock: RockPos, direction: Direction) => {
  return Object.entries(rock).every(([key, line], i) => {
    if (direction === DIR.RIGHT) {
      return matrice[Number(key)][line.to] === ".";
    }
    if (direction === DIR.LEFT) {
      return matrice[Number(key)][line.from - 1] === ".";
    }
    if (direction === DIR.DOWN) {
      if (!matrice[Number(key) - 1 - i]) return false;
      return matrice[Number(key) - 1 - i]
        .slice(line.from, line.to)
        .split("")
        .every((c) => {
          return c === ".";
        });
    }
  });
};

const part1 = (input: string[]) => {
  // Generation an infinite cycle for rocks
  const cycle_rocks = cycle(ROCKS);
  // Get actions
  const cycle_actions = cycle(parseInput(input) as Direction[]);
  // Start a matrice to move rocks
  const matrice: Matrice = [];

  /** Number rocks to fall */
  let nFall = 2022;
  /** Current rock */
  let rock: RockShape;
  /** State of the current rock. If `true`, the rock is falling */
  let isFalling: boolean;
  /** Position of the current rock */
  let rockPos: RockPos;
  /** Current action */
  let action: Direction = cycle_actions.next().value!;

  // NOTE: Only for tests, remove after !
  // cycle_rocks.next();
  // cycle_rocks.next();
  // cycle_rocks.next();
  // cycle_rocks.next();

  while (nFall) {
    DEBUG && console.log("The rock begins falling:");
    // new rock will appear so add 3 lines to matrice
    matrice.push(getNewMatriceLine());
    matrice.push(getNewMatriceLine());
    matrice.push(getNewMatriceLine());

    // APPEAR NEW ROCK: START
    rockPos = {};
    // new rock
    rock = cycle_rocks.next().value!;
    // add it at the matrice
    rock.forEach((rockLine) => {
      let from = rockLine.indexOf("@");
      let to = rockLine.indexOf(".", from + 1);

      matrice.push(rockLine);
      rockPos[matrice.length - 1] = { from, to, length: Math.abs(from - to) };
    });
    nFall--;
    DEBUG && console.table(matrice);
    // APPEAR NEW ROCK: END

    isFalling = true;
    while (isFalling) {
      switch (action) {
        case DIR.LEFT: {
          if (canMove(matrice, rockPos, DIR.LEFT)) {
            DEBUG && console.log("Jet of gas pushes rock left:");
            Object.entries(rockPos).forEach(([key, line]) => {
              // Move rock in the matrice
              /**
               * s1 = before
               * s2 = slot before the rock
               * s3 = rock
               * s4 = after
               */
              const [s1, s2, s3, s4] = split(matrice[Number(key)], [
                line.from - 1,
                line.from,
                line.to,
              ]);
              matrice[Number(key)] = s1 + s3 + s2 + s4;
              // Update the position
              line.from--;
              line.to--;
            });
          } else {
            DEBUG &&
              console.log("Jet of gas pushes rock left, but nothing happens:");
          }
          action = DIR.DOWN;
          // actions.push(DIR.DOWN);
          break;
        }
        case DIR.RIGHT: {
          if (canMove(matrice, rockPos, DIR.RIGHT)) {
            DEBUG && console.log("Jet of gas pushes rock right:");
            Object.entries(rockPos).forEach(([key, line]) => {
              // Move rock in the matrice
              /**
               * s1 = before
               * s2 = rock
               * s3 = slot after the rock
               * s4 = after
               */
              const [s1, s2, s3, s4] = split(matrice[Number(key)], [
                line.from,
                line.to,
                line.to + 1,
              ]);
              matrice[Number(key)] = s1 + s3 + s2 + s4;
              // Update the position
              line.from++;
              line.to++;
            });
          } else {
            DEBUG &&
              console.log("Jet of gas pushes rock right, but nothing happens:");
          }
          action = DIR.DOWN;
          // actions.push(DIR.DOWN);
          break;
        }
        case DIR.DOWN: {
          if (canMove(matrice, rockPos, DIR.DOWN)) {
            DEBUG && console.log("Rock falls 1 unit:");
            // console.log("rockPos-bef", JSON.stringify(rockPos));

            Object.entries(rockPos).forEach(([key, line]) => {
              // console.log(line)
              // Line under the current position
              const [s1, s2, s3] = split(matrice[Number(key) - 1], [
                line.from,
                line.to,
              ]);
              const [r1, r2, r3] = split(matrice[Number(key)], [
                line.from,
                line.to,
              ]);
              // console.log("S==", { s1, s2, s3 });
              // console.log("R==", { r1, r2, r3 });
              // update the matrice
              matrice[Number(key) - 1] = s1 + r2 + s3;
              matrice[Number(key)] = r1 + ".".repeat(line.length) + r3;
              // update the rock position
              rockPos[Number(key) - 1] = rockPos[Number(key)];
              delete rockPos[Number(key)];
            });

            // console.log("rockPos-aft", JSON.stringify(rockPos));
          } else {
            DEBUG &&
              console.log("Rock falls 1 unit, causing it to come to rest:");
            Object.entries(rockPos).forEach(([key, line]) => {
              const [s1, s2, s3] = split(matrice[Number(key)], [
                line.from,
                line.to,
              ]);
              matrice[Number(key)] = s1 + "#".repeat(line.length) + s3;
            });
            isFalling = false;
          }
          action = cycle_actions.next().value!;
          break;
        }
        default:
          console.log("Default");
          isFalling = false;
          break;
      }
      // Remove empty lines from the matrice
      while (true) {
        if (
          matrice
            .at(-1)
            ?.split("")
            .every((c) => c === ".")
        ) {
          matrice.pop();
        } else {
          break;
        }
      }
      DEBUG && console.table(matrice);
    }
  }

  console.table(matrice.reverse());
  return matrice.length;
};

logPart(1, part1(input));
