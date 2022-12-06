import { chunkArray, fetchLines } from "../../lib/forth.js";

function getLetterFrom(i) {
  return String.fromCharCode(i);
}

const lowerLetters = Array.from(Array(26), (_, i) => getLetterFrom(i + 97));
const upperLetters = Array.from(Array(26), (_, i) => getLetterFrom(i + 65));
const alphabet = [...lowerLetters, ...upperLetters];

(async () => {
  const lines = await fetchLines();

  const sum = lines.reduce((sum, line) => {
    // Séparer les 2 sacs à dos
    const [part1, part2] = chunkArray(line, 2);
    // Trouver la lettre dans les 2 sacs à dos
    const letter = getTypeFrom2(part1, part2);
    return sum + getValue(letter);
  }, 0);

  console.log("Part 1", sum);

  /**************************************************** */

  const rucksacks = chunkArray(lines, lines.length / 3);

  const sum2 = rucksacks.reduce((sum, rucksack) => {
    const letter = getTypeFrom3(rucksack);
    return sum + getValue(letter);
  }, 0);

  console.log("Part 2", sum2);
})();

/**
 * It takes two strings and returns the first character that is in both strings
 * @param part1 - "abc"
 * @param part2 - "abcdefghijklmnopqrstuvwxyz"
 * @returns The first character in part1 that is also in part2.
 */
function getTypeFrom2(part1, part2) {
  return [...part1].find((char) => [...part2].indexOf(char) !== -1);
}

/**
 * It returns the first character in the first string that is also in the second and third strings
 * @returns The first character that is in both part2 and part3.
 */
function getTypeFrom3([part1, part2, part3]) {
  return [...part1].find(
    (char) => [...part2].indexOf(char) !== -1 && [...part3].indexOf(char) !== -1
  );
}

/**
 * It takes a letter as an argument, finds the index of that letter in the alphabet array, and returns
 * the index plus one.
 * @param letter - The letter to get the value of.
 * @returns The index of the letter in the alphabet array plus 1.
 */
function getValue(letter) {
  return alphabet.indexOf(letter) + 1;
}
