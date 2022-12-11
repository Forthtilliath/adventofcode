import {
  arrayMax,
  fetchLines,
  isEmptyObject,
  multiply,
  partition,
} from "../../lib/forth.js";

// part 2 récupère la valeur des calories dans les groups
const REGEXS = {
  PART1:
    /(\w*): capacity (?<capacity>-?\d*), durability (?<durability>-?\d*), flavor (?<flavor>-?\d*), texture (?<texture>-?\d*), calories (-?\d*)/,
  PART2:
    /(\w*): capacity (?<capacity>-?\d*), durability (?<durability>-?\d*), flavor (?<flavor>-?\d*), texture (?<texture>-?\d*), calories (?<calories>-?\d*)/,
};

(async () => {
  const lines = await fetchLines();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(lines) {
  const data = parseData(lines, REGEXS.PART1);
  const ingredients = Object.entries(data);

  const scores = partition(Object.values(data)[0].length, 100).map((combi) => {
    return multiply(
      ingredients.map(([_key, amounts]) => {
        const score = amounts.reduce((acc, amount, i) => {
          return acc + amount * combi.at(i);
        }, 0);
        return score < 0 ? 0 : score;
      })
    );
  });

  return arrayMax(scores);
}

function part2(lines) {
  const data = parseData(lines, REGEXS.PART2);
  const ingredients = Object.entries(data);

  // Pour chaque combinaison de nombres
  const scores = partition(Object.values(data)[0].length, 100).map((combi) => {
    // On multiplie le résultat de chaque ingredient
    return multiply(
      ingredients.map(([key, amounts]) => {
        // On fait la somme de chaque ingredient
        const score = amounts.reduce((acc, amount, i) => {
          return acc + amount * combi.at(i);
        }, 0);
        // Si c'est calories et que le score ne vaut pas 500
        // on retourne 0 pour que le multiply vaut 0
        // sinon on retourne 1 pour que le calcul du multiply soit inchangé
        if (key === "calories") return score === 500 ? 1 : 0;
        return score < 0 ? 0 : score;
      })
    );
  });

  return arrayMax(scores);
}

/**
 * ? Le premier map permet d'avoir ce résultat
 * [
 *   {ingredient: 'Butterscotch', capacity: '-1', durability: '-2', flavor: '6', texture: '3'},
 *   {ingredient: 'Cinnamon', capacity: '2', durability: '3', flavor: '-2', texture: '-1'}
 * ]
 * ? Le résultat le transforme en ceci
 * {
 *   ingredient: ['Butterscotch', 'Cinnamon'],
 *   capacity: [-1, 2],
 *   durability: [-2, 3],
 *   flavor: [6, -2],
 *   texture: [3, -1]
 * }
 */
function parseData(lines, regex) {
  return lines
    .map((line) => line.match(regex).groups)
    .reduce((obj, ing) => {
      if (isEmptyObject(obj)) {
        Object.keys(ing).forEach((key) => (obj[key] = []));
      }
      Object.entries(ing).forEach(([k, v]) => obj[k].push(Number(v)));
      return obj;
    }, {});
}
