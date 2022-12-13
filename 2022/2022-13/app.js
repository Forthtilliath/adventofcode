import { fetchLines, chunkArray, convertToArray } from "../../lib/forth.js";

init();

async function init() {
  const lines = await fetchLines();

  console.log("Part 1", checkPackets(lines));
}

function checkPackets(lines) {
  const linesFiltered = lines.filter((item) => item.length);
  const pairs = chunkArray(linesFiltered, linesFiltered.length / 2);
  let sumIndex = 0;

  const tabsRightOrder = pairs.filter((pair, i) => {
    const [tab1, tab2] = pair.map(JSON.parse);
    const a = compareArrays(tab1, tab2);
    if (a) sumIndex += i + 1;
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
    if (arr1[i] === undefined) return true;
    if (arr2[i] === undefined) return false;

    // Si y'a un tableau => recursivité
    if (Array.isArray(arr1[i]) || Array.isArray(arr2[i])) {
      const res = compareArrays(arr1[i], arr2[i]);
      if (res === null) continue;
      return res;
    }

    if (arr1[i] === arr2[i]) continue;

    return arr1[i] < arr2[i];
  }

  return null;
}
