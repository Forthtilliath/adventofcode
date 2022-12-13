import { fetchLines, chunkArray, convertToArray } from "../../lib/forth.js";

init();

async function init() {
  const lines = await fetchLines();

  console.log("Part 1", checkPackets(lines));
}

function checkPackets(lines, ignoreBlankLines = true) {
  lines = lines.filter((item) => item.length);
  const pairs = chunkArray(lines, lines.length / 2);
  let sumIndex = 0;

  const tabsRightOrder = pairs.filter((pair, i) => {
    const [tab1, tab2] = pair.map(JSON.parse);
    const a = compareArrays(tab1, tab2);
    console.log(tab1, tab2,a)
    if (a === 1) sumIndex += i + 1;
    return a;
  });

  console.log(tabsRightOrder);

  return sumIndex;
}

function compareArrays(a, b) {
  const arr1 = convertToArray(a);
  const arr2 = convertToArray(b);

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    // Si un tableau terminé
    if (arr1[i] === undefined) return 1;
    if (arr2[i] === undefined) return -1;

    // Si y'a un tableau => recursivité
    if (Array.isArray(arr1[i]) || Array.isArray(arr2[i])) {
      const res = compareArrays(arr1[i], arr2[i]);
      if (res === 0) continue;
      return res ? 1 : -1;
    }

    if (arr1[i] === arr2[i]) continue;

    return arr1[i] < arr2[i] ? 1 : -1;
  }

  return 0;
}
