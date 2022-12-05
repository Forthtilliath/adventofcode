import { fetchLines } from "../lib/forth.js";

const vowels = "aeiou";
const exceptions = ["ab", "cd", "pq", "xy"];

(async () => {
  const lines = await fetchLines();
  console.log(lines);

  console.log("Part 1", part1(lines));
  console.log("Part 2", part2(lines));
})();

function part1(lines) {
  return lines.reduce((sum, line) => {
    return (
      sum +
      Number(has3Vowels(line) && hasDoubleLetter(line) && !hasException(line))
    );
  }, 0);
}

function part2(lines) {
  return lines.reduce((sum, line) => {
    return sum + Number(hasDoublePairs(line) && letterBetweenSameLetter(line));
  }, 0);
}

function has3Vowels(line) {
  return [...line].reduce((sum, c) => sum + +vowels.includes(c), 0) >= 3;
}

function hasDoubleLetter(line) {
  let temp = "";
  let double = false;
  [...line].forEach((c) => {
    if (temp === c) {
      double = true;
      return;
    }
    temp = c;
  });
  return double;
}

function hasException(line) {
  return exceptions.some((exc) => line.includes(exc));
}

function hasDoublePairs(line) {
  // parcours par pair
  // check if after contient la pair
  return [...line].some((_, i, arr) => {
    // Dernière lettre, pas de pair possible
    if (i === arr.length - 1) return false;
    const pair = arr.slice(i, i + 2).join("");
    // Recherche la pair dans le reste de la chaine
    return line.slice(i + 2).includes(pair);
  });
}

function letterBetweenSameLetter(line) {
  let temp1 = "",
    temp2 = "";
  return [...line].some((c, i) => {
    // Tour 0, rempli temp1
    // Tour 1, rempli temp2
    // etc
    if (i % 2) {
      // Vérifie si l'ancien temp2 contient la lettre actuelle
      if (temp2 === c && temp1 !== "") return true;
      temp2 = c;
    } else {
      if (temp1 === c && temp2 !== "") return true;
      temp1 = c;
    }
    return false;
  });
}
