import { fetchLines } from "../../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(lines) {
  const indexEmpty = lines.indexOf("");

  /** @type {string[]} */
  const stacksData = lines.slice(0, indexEmpty);
  const stacks = getStacks(stacksData);

  // On exécute les procedures
  const procedures = lines.slice(indexEmpty + 1);
  executeProcedures(stacks, procedures, false);

  return getCode(stacks);
}

function part2(lines) {
  const indexEmpty = lines.indexOf("");

  /** @type {string[]} */
  const stacksData = lines.slice(0, indexEmpty);
  const stacks = getStacks(stacksData);

  // On exécute les procedures
  const procedures = lines.slice(indexEmpty + 1);
  executeProcedures(stacks, procedures, true);

  return getCode(stacks);
}

function getNbCrates(crates) {
  // 3 = [x]
  // 4 = [x] with space
  return (crates[0].length - 3) / 4 + 1;
}

function getStacks(stacksData) {
  const length = getNbCrates(stacksData);
  /** @type {string[][]} */
  const stacks = Array.from({ length }, () => []);

  // Génère un tableau pour chaque pile
  stacksData.forEach((stack, iCrate) => {
    // ligne avec les chiffres
    if (iCrate === stacksData.length - 1) return;
    [...stack].forEach((crate, i) => {
      // On ajoute chaque lettre dans le tableau correspondant
      if ((i % 4) + 1 === 2 && crate !== " ") {
        const col = Math.floor(i / 4);
        stacks[col].push(crate);
      }
    });
  });

  // On met les caisses du dessus à la fin des tableaux
  stacks.map((stack) => stack.reverse());

  return stacks;
}

function executeProcedures(stacks, procedures, keepOrder) {
  procedures.map((procedure) => {
    const [nb, from, to] = procedure.match(/[\d\.]+/g).map(Number);
    let i = nb;
    let temp = [];
    while (i > 0) {
      i--;
      const last = stacks[from - 1].pop();
      temp.push(last);
    }
    if (keepOrder) temp.reverse();
    stacks[to - 1].push(...temp);
  });
}

/**
 * Concat les caisses du dessus de chaque pile
 * @param {string[][]} stacks
 */
function getCode(stacks) {
  return stacks.map((stack) => stack.pop()).join("");
}
