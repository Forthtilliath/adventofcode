import { fetchLines, isNumber } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  const op = init(lines);

  console.log("Part 1", part1(op));
  console.log("Part 2", part2(op));
})();

function part1(op) {
  return execute(op, "a");
}

function part2(op) {
  const a = op.a.value.toString();
  Object.values(op).forEach((key) => delete key.value);
  op.b.number = a;
  return part1(op);
}

/**
 * Tous les éléments contiennent une prop res
 *
 * |= ``res``
 *
 * |=== if ``number``, nothing ``else``
 *
 * |=== if ``not_operator`` then ``not_right``
 *
 * |=== if ``operator`` then ``right`` & ``left``
 */
function init(lines) {
  const op = {};
  lines.forEach((line) => {
    const regex =
      /((?<number>[\w]+)|(?<not_operator>NOT) (?<not_right>[\w]+)|(?<left>[\w]+) (?<operator>[A-Z]+) (?<right>[\w]+)) -> (?<res>[\w]+)/;
    const { groups } = line.match(regex);

    op[groups.res] = Object.entries(groups)
      .filter(([_key, val]) => val !== undefined)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
  });
  return op;
}

function execute(op, key) {
  const o = op[key];

  // Si la valeur est memoized, on la récupère
  if (o.hasOwnProperty("value")) {
    return o.value;
  }

  // On récupère la valeur et on la memoize !
  if (o.hasOwnProperty("number")) {
    op[key].value = getValue(o.number, op);
  } else if (o.hasOwnProperty("not_operator")) {
    op[key].value = ~execute(op, o.not_right) & 0xffff;
  } else {
    switch (o.operator) {
      case "AND":
        op[key].value = getValue(o.left, op) & getValue(o.right, op);
        break;
      case "OR":
        op[key].value = getValue(o.left, op) | getValue(o.right, op);
        break;
      case "LSHIFT":
        op[key].value = getValue(o.left, op) << getValue(o.right, op);
        break;
      case "RSHIFT":
        op[key].value = getValue(o.left, op) >> getValue(o.right, op);
        break;
    }
  }

  return op[key].value;
}

// Si c'est un nombre on retourne le nombre, sinon on récupère la valeur de la variable
function getValue(str, op) {
  return isNumber(str) ? Number(str) : execute(op, str);
}
