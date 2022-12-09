import {
  arrayMax,
  fetchLines,
  getCombinaisons,
  getFragmentsOfArray,
} from "../../lib/forth.js";

const REGEX =
  /(?<first>^\w*) would (?<effect>gain|lose) (?<n>\d*) happiness units by sitting next to (?<second>\w*)./;

(async () => {
  const lines = await fetchLines();
  const data = parseData(lines);

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(data) {
  /** Liste des joueurs */
  const players = getPlayers(data);
  /** Liste des combinaisons possible d'installation des joueurs */
  const combinaisons = getCombinaisons(players);

  return getBestScore(combinaisons, data);
}

function part2(data) {
  /** Liste des joueurs */
  const players = [...getPlayers(data), "Me"];
  /** Liste des combinaisons possible d'installation des joueurs */
  const combinaisons = getCombinaisons(players);

  return getBestScore(combinaisons, data);}

function parseData(lines) {
  // possibilité : object avec key: [first-second], value: affinity
  return lines.map((line) => line.match(REGEX).groups);
}

function getPlayers(data) {
  const players = new Set();
  data.forEach((line) => players.add(line.first).add(line.second));
  return [...players];
}

function getAffinity([p1, p2], data) {
  return data.find((line) => p1 === line.first && p2 === line.second)??{n:0};
}

function getScoreTable(table, data) {
  /** Pair de voisins autour de la table */
  const pairs = getFragmentsOfArray(table, 2);
  /** Calcule la somme des affinés de chacun avec son voisin */
  return pairs.reduce((sum, pair) => {
    const line = getAffinity(pair, data);
    const affinity = line.effect === "gain" ? +line.n : +line.n * -1;
    return sum + affinity;
  }, 0);
}

function getBestScore(tables, data) {
  /** Score de chaque table */
  const scores = tables.map((table) => getScoreTable(table, data));

  // Math.max était trop lent et faisait crash
  return arrayMax(scores);
}