import { permutations } from "../../../lib/functions/array.js";
import { fetchLines } from "../../../lib/functions/index.js";

run();

async function run() {
  const lines = await fetchLines();
  const containers = lines.map(Number).sort((a, b) => b - a);
  console.log(containers);
  // const data = parseData(lines);

  console.log("Part 1", part1(containers));
  console.log("Part 2", part2(containers));
}

function part1(containers: number[]) {
  return count(150, containers);
}

function part2(containers: number[]) {
  return countOnce(25, containers);
}

function count(quantity: number, containers: number[], i = 0): number {
  // Quantité complétée
  if (quantity === 0) return 1;
  // Plus de container ou quantité en trop
  if (i === containers.length || quantity < 0) return 0;
  // On passe au container suivant
  return (
    count(quantity, containers, i + 1) +
    count(quantity - containers[i], containers, i + 1)
  );
}

function countOnce(
  quantity: number,
  containers: number[],
  n = 0,
  nb = 0
): number {
  const q = containers.pop();

  /**
   * je prend le premier
   */

  return nb;
}


// console.log(permutations<number>([1,2,3,4],2))
// console.log(Array.from(combinations<number>([1,2,3,4],2)))
