import { fetchLines } from "../../../lib/forth.js";

const REGEX =
  /Sue (?<index>\d+): (?<compound_1>[a-z]+): (?<quantity_1>\d+), (?<compound_2>[a-z]+): (?<quantity_2>\d+), (?<compound_3>[a-z]+): (?<quantity_3>\d+)/;

const TICKET = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

(async () => {
  const lines = await fetchLines();
  const data = parseData(lines);

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(lines) {
  return (
    lines.findIndex((line) => {
      return Object.entries(line).every(([k, v]) => TICKET[k] === v);
    }) + 1
  );
}

function part2(lines) {
  return (
    lines.findIndex((line) => {
      return Object.entries(line).every(([k, v]) => {
        if (["cats", "trees"].includes(k)) return TICKET[k] < v;
        if (["pomeranians", "goldfish"].includes(k)) return TICKET[k] > v;
        return TICKET[k] === v;
      });
    }) + 1
  );
}

function parseData(lines) {
  return lines.map((line) => {
    const { groups } = line.match(REGEX);
    return {
      [groups.compound_1]: Number(groups.quantity_1),
      [groups.compound_2]: Number(groups.quantity_2),
      [groups.compound_3]: Number(groups.quantity_3),
    };
  });
}
