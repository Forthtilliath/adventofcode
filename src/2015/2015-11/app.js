import { fetchData, getFragmentsOfString } from "../../../lib/forth.js";

const alphabet = "abcdefghjkmnpqrstuvwxyz";
const exclusionLetters = "iol";

(async () => {
  const data = await fetchData();

  const password1 = nextValidPassword(data);
  console.log("Part 1", password1);
  console.log("Part 2", nextValidPassword(password1));
})();

function nextValidPassword(data) {
  let next = nextChar(data);
  while (!isValidPassword(next)) {
    next = nextChar(next);
  }
  return next;
}

/**
 * If the last character of the string is the last character of the alphabet, then the next character
 * is the first character of the alphabet, otherwise it's the next character in the alphabet
 * @param str - The string to increment.
 * @returns The next character in the alphabet.
 */
function nextChar(str) {
  if (str.length === 0) {
    return alphabet.at(0);
  }
  if (str.at(-1) === alphabet.at(-1)) {
    return nextChar(str.slice(0, -1)) + alphabet.at(0);
  } else {
    const index = alphabet.indexOf(str.at(-1));
    return str.slice(0, -1) + alphabet.at(index + 1);
  }
}

/**
 * requirements
 * - 8 caractères
 * - 3 lettres qui se suivent
 * - pas de i, o ou l
 * - 2 doubles différents
 */
function isValidPassword(data) {
  const hasNoExclusionLetter = exclusionLetters
    .split("")
    .every((l) => !data.includes(l));
  if (!hasNoExclusionLetter) return false;

  const at8Chars = data.length === 8;
  if (!at8Chars) return false;

  const lettersBy3 = getFragmentsOfString(alphabet, 3);
  const has3Letters = lettersBy3.some((str) => data.includes(str));
  if (!has3Letters) return false;

  const atLeast2Pairs = getUniquePairs(data).length >= 2;
  if (!atLeast2Pairs) return false;

  return true;
  // return at8Chars && has3Letters && atLeast2Pairs && hasNoExclusionLetter;
}

/**
 * It takes a string and returns an array of unique characters that appear twice in a row.
 * @param data - the string to be checked
 * @returns An array of unique letters that are repeated twice in a row.
 */
function getUniquePairs(data) {
  // console.log({ data },data.match(/(?<letter>[^iol])\1+/g))
  // const res = data.match(/(?<letter>[a-z])\1+/g).map((str) => str.slice(0, 1));
  const res =
    data.match(/(?<letter>[^iol])\1+/g)?.map((str) => str.slice(0, 1)) ?? [];
  // console.log(res)
  return [...new Set(res)];
}
