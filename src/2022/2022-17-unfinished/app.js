import { cycle, split } from "/lib/index.js";
import { getInput, logPart } from "/lib/browser/index.js";
const DEBUG = false;
const DIR = {
    LEFT: "<",
    RIGHT: ">",
    DOWN: "v",
};
const ROCKS = [
    ["..@@@@."],
    ["...@...", "..@@@..", "...@..."],
    ["..@@@..", "....@..", "....@.."],
    ["..@....", "..@....", "..@....", "..@...."],
    ["..@@...", "..@@..."],
];
const input = getInput();
const LINE_SIZE = 7;
const getNewMatriceLine = () => ".".repeat(LINE_SIZE);
const parseInput = (input) => input[0].split("");
const canMove = (matrice, rock, direction) => {
    return Object.entries(rock).every(([key, line], i) => {
        if (direction === DIR.RIGHT) {
            return matrice[Number(key)][line.to] === ".";
        }
        if (direction === DIR.LEFT) {
            return matrice[Number(key)][line.from - 1] === ".";
        }
        if (direction === DIR.DOWN) {
            if (!matrice[Number(key) - 1 - i])
                return false;
            return matrice[Number(key) - 1 - i]
                .slice(line.from, line.to)
                .split("")
                .every((c) => {
                return c === ".";
            });
        }
    });
};
const part1 = (input) => {
    const cycle_rocks = cycle(ROCKS);
    const cycle_actions = cycle(parseInput(input));
    const matrice = [];
    let nFall = 2022;
    let rock;
    let isFalling;
    let rockPos;
    let action = cycle_actions.next().value;
    while (nFall) {
        DEBUG && console.log("The rock begins falling:");
        matrice.push(getNewMatriceLine());
        matrice.push(getNewMatriceLine());
        matrice.push(getNewMatriceLine());
        rockPos = {};
        rock = cycle_rocks.next().value;
        rock.forEach((rockLine) => {
            let from = rockLine.indexOf("@");
            let to = rockLine.indexOf(".", from + 1);
            matrice.push(rockLine);
            rockPos[matrice.length - 1] = { from, to, length: Math.abs(from - to) };
        });
        nFall--;
        DEBUG && console.table(matrice);
        isFalling = true;
        while (isFalling) {
            switch (action) {
                case DIR.LEFT: {
                    if (canMove(matrice, rockPos, DIR.LEFT)) {
                        DEBUG && console.log("Jet of gas pushes rock left:");
                        Object.entries(rockPos).forEach(([key, line]) => {
                            const [s1, s2, s3, s4] = split(matrice[Number(key)], [
                                line.from - 1,
                                line.from,
                                line.to,
                            ]);
                            matrice[Number(key)] = s1 + s3 + s2 + s4;
                            line.from--;
                            line.to--;
                        });
                    }
                    else {
                        DEBUG &&
                            console.log("Jet of gas pushes rock left, but nothing happens:");
                    }
                    action = DIR.DOWN;
                    break;
                }
                case DIR.RIGHT: {
                    if (canMove(matrice, rockPos, DIR.RIGHT)) {
                        DEBUG && console.log("Jet of gas pushes rock right:");
                        Object.entries(rockPos).forEach(([key, line]) => {
                            const [s1, s2, s3, s4] = split(matrice[Number(key)], [
                                line.from,
                                line.to,
                                line.to + 1,
                            ]);
                            matrice[Number(key)] = s1 + s3 + s2 + s4;
                            line.from++;
                            line.to++;
                        });
                    }
                    else {
                        DEBUG &&
                            console.log("Jet of gas pushes rock right, but nothing happens:");
                    }
                    action = DIR.DOWN;
                    break;
                }
                case DIR.DOWN: {
                    if (canMove(matrice, rockPos, DIR.DOWN)) {
                        DEBUG && console.log("Rock falls 1 unit:");
                        Object.entries(rockPos).forEach(([key, line]) => {
                            const [s1, s2, s3] = split(matrice[Number(key) - 1], [
                                line.from,
                                line.to,
                            ]);
                            const [r1, r2, r3] = split(matrice[Number(key)], [
                                line.from,
                                line.to,
                            ]);
                            matrice[Number(key) - 1] = s1 + r2 + s3;
                            matrice[Number(key)] = r1 + ".".repeat(line.length) + r3;
                            rockPos[Number(key) - 1] = rockPos[Number(key)];
                            delete rockPos[Number(key)];
                        });
                    }
                    else {
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
                    action = cycle_actions.next().value;
                    break;
                }
                default:
                    console.log("Default");
                    isFalling = false;
                    break;
            }
            while (true) {
                if (matrice
                    .at(-1)
                    ?.split("")
                    .every((c) => c === ".")) {
                    matrice.pop();
                }
                else {
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
