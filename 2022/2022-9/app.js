import { fetchLines } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();
  const actions = parseActions(lines);

  console.log("Part 1", part1(actions));
  console.log("Part 2", part2(actions));
})();

/**
 * HTs same point
 * quand H bouge, T bouge, s reste ne bouge jamais
 * {x,y} pour H et T
 * verifier distance entre H et T
 * determiner nouvelle position de T après déplacement de H
 * save chaque case où passe T dans un Set()
 * à la fin compter ces cases
 */
function part1(actions) {
  const H = { x: 0, y: 0 };
  const T = { x: 0, y: 0 };
  const historyT = new Set([JSON.stringify(T)]);

  actions.split("").forEach((action) => {
    move(H, action);
    follow(T, H);
    historyT.add(JSON.stringify(T));
  });

  return historyT.size;
}

/**
 * HTs same point
 * quand H bouge, T1 bouge en fonction de H
 * T2 bouge en fonction de T1
 * ....
 * T9 bouge en fonction de T8
 * {x,y} pour H et T
 * verifier distance entre H et Tails
 * determiner nouvelle position de chaque T après déplacement de H
 * save chaque case où passe chaque T dans un Set()
 * à la fin compter ces cases
 */
function part2(actions) {
  const H = { x: 0, y: 0 };
  const tails = Array.from({ length: 9 }, () => ({ x: 0, y: 0 }));
  const historyT9 = new Set([JSON.stringify(tails.at(-1))]);

  actions.split("").forEach((action) => {
    move(H, action);
    tails.forEach((tail, i) => {
      // si premier queue, on suit la tete, sinon la queue précédente
      if (i === 0) follow(tail, H);
      else follow(tail, tails[i - 1]);
    });

    historyT9.add(JSON.stringify(tails.at(-1)));
  });

  return historyT9.size;
}

function parseActions(lines) {
  return lines
    .map((line) => {
      const [direction, movement] = line.split(" ");
      return direction.repeat(movement);
    })
    .join("");
}

function move(obj, direction) {
  if (direction === "R") obj.x++;
  else if (direction === "L") obj.x--;
  else if (direction === "D") obj.y++;
  else if (direction === "U") obj.y--;
}

/**
 *
 * @param {Position} a Follower
 * @param {Position} b Following
 */
function follow(a, b) {
  // Si seulement 1 case ou moins  de différence, pas besoin de bouger
  if (Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1) return;

  if (a.x === b.x) {
    move(a, a.y < b.y ? "D" : "U");
    return;
  }

  if (a.y === b.y) {
    move(a, a.x < b.x ? "R" : "L");
    return;
  }

  // Mouvement en diagonal
  move(a, a.y < b.y ? "D" : "U");
  move(a, a.x < b.x ? "R" : "L");
}
