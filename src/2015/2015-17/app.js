import { fetchLines } from "../../../lib/functions/index.js";
run();
async function run() {
    const lines = await fetchLines();
    const containers = lines.map(Number).sort((a, b) => b - a);
    console.log(containers);
    console.log("Part 1", part1(containers));
    console.log("Part 2", part2(containers));
}
function part1(containers) {
    return count(150, containers);
}
function part2(containers) {
    return countOnce(25, containers);
}
function count(quantity, containers, i = 0) {
    if (quantity === 0)
        return 1;
    if (i === containers.length || quantity < 0)
        return 0;
    return (count(quantity, containers, i + 1) +
        count(quantity - containers[i], containers, i + 1));
}
function countOnce(quantity, containers, n = 0, nb = 0) {
    const q = containers.pop();
    return nb;
}
