import { fetchLines } from "../../../lib/forth.js";

const SHAPES = {
  ROCK: "ROCK",
  PAPER: "PAPER",
  SCISSORS: "SCISSORS",
};

const SHAPES_LETTER = {
  A: SHAPES.ROCK,
  B: SHAPES.PAPER,
  C: SHAPES.SCISSORS,
  X: SHAPES.ROCK,
  Y: SHAPES.PAPER,
  Z: SHAPES.SCISSORS,
};

const POINTS = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
};

const STATES = {
  LOSE: "X",
  DRAW: "Y",
  WIN: "Z",
};

(async () => {
  const lines = await fetchLines();

  const points = lines.reduce(
    ([oppTotal, meTotal], line) => {
      const [opp, me] = line.split(" ");
      const [oppPoints, mePoints] = getScores(
        SHAPES_LETTER[opp],
        SHAPES_LETTER[me]
      );
      return [oppTotal + oppPoints, meTotal + mePoints];
    },
    [0, 0]
  );

  console.log("Part one", points[1]);

  /**************************************************** */

  const points2 = lines.reduce(
    ([oppTotal, meTotal], line) => {
      const [opp, state] = line.split(" ");
      const me = getShape(SHAPES_LETTER[opp], state);
      const [oppPoints, mePoints] = getScores(SHAPES_LETTER[opp], me);
      return [oppTotal + oppPoints, meTotal + mePoints];
    },
    [0, 0]
  );

  console.log("Part two", points2[1]);
})();

function getScores(shapeA, shapeB) {
  const [spA, spB] = [POINTS[shapeA], POINTS[shapeB]];
  const [gpA, gpB] = getPoints(shapeA, shapeB);

  return [spA + gpA, spB + gpB];
}

/**
 * If the shapes are the same, return [3, 3]. If the first shape beats the second shape, return [6, 0].
 * Otherwise, return [0, 6]
 * @param a - The shape the player A chose
 * @param b - The shape that player B chose
 * @returns an array of two numbers.
 */
function getPoints(a, b) {
  if (a === b) return [3, 3];

  if (
    (a === SHAPES.ROCK && b === SHAPES.PAPER) ||
    (a === SHAPES.PAPER && b === SHAPES.SCISSORS) ||
    (a === SHAPES.SCISSORS && b === SHAPES.ROCK)
  ) {
    return [0, 6];
  }

  return [6, 0];
}

function getShape(shape, state) {
  if (state === STATES.DRAW) {
    return shape;
  }

  if (shape === SHAPES.ROCK && state === STATES.LOSE) {
    return SHAPES.SCISSORS;
  }
  if (shape === SHAPES.ROCK && state === STATES.WIN) {
    return SHAPES.PAPER;
  }

  if (shape === SHAPES.PAPER && state === STATES.LOSE) {
    return SHAPES.ROCK;
  }
  if (shape === SHAPES.PAPER && state === STATES.WIN) {
    return SHAPES.SCISSORS;
  }

  if (shape === SHAPES.SCISSORS && state === STATES.LOSE) {
    return SHAPES.PAPER;
  }
  if (shape === SHAPES.SCISSORS && state === STATES.WIN) {
    return SHAPES.ROCK;
  }
}
