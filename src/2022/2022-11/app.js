import { fetchLines, multiply } from "../../../lib/forth.js";

const REGEX = {
  // monkey: /Monkey (?<monkey>\d+)/,
  items: /  Starting items: (?<items>(\d+(, )*)*)/,
  operation: /  Operation: new = (?<operation>[\w *+]+)/,
  // test: /a/,
  // iftrue:/a/,
  // iffalse:/a/,
  number: /(?<number>\d+)/,
};

const LINE = {
  MONKEY: 0,
  ITEMS: 1,
  OPERATION: 2,
  TEST: 3,
  IFTRUE: 4,
  IFFALSE: 5,
};

(async () => {
  const lines = await fetchLines();
  const data = parseLines(lines);

  // console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(lines) {
  run(lines, 20);

  const inspected = Object.values(lines).map((line) => line.inspected);
  const top2 = inspected.sort((a, b) => b - a).slice(0, 2);

  return multiply(top2);
}

function part2(lines) {
  window.lines = lines;
  window.n = 10_000;
  // run2(lines, 10_000);
  run2();

  const inspected = Object.values(lines).map((line) => line.inspected);
  const top2 = inspected.sort((a, b) => b - a).slice(0, 2);

  return multiply(top2);
}

/**
 * ? Data reçue
 * @example
 * [
 *   "Monkey 0:",
 *   "  Starting items: 79, 98",
 *   "  Operation: new = old * 19",
 *   "  Test: divisible by 23",
 *   "    If true: throw to monkey 2",
 *   "    If false: throw to monkey 3"
 * ]
 *
 * ? Data envoyée
 * @example
 * {
 *   [monkeyIndex] : {
 *     inspected: 0,
 *     items: [79, 98],
 *     operation: (old) => old * 19,
 *     test: {
 *       denominator: 23,
 *       ifTrue: 2,
 *       ifFalse: 3
 *     },
 *   }
 * }
 */
function parseLines(lines) {
  let currentMonkey;
  return lines.reduce((obj, line, i) => {
    switch (i % 7) {
      case LINE.MONKEY: {
        const { number } = line.match(REGEX.number).groups;
        currentMonkey = number;
        obj[currentMonkey] = {
          inspected: 0,
        };
        break;
      }

      case LINE.ITEMS: {
        const items = line
          .match(REGEX.items)
          .groups.items.split(", ")
          .map(Number);
        obj[currentMonkey] = {
          ...obj[currentMonkey],
          items,
        };
        break;
      }

      case LINE.OPERATION: {
        const group = line.match(REGEX.operation).groups;
        const op = group.operation.split(" ");

        const operation = (old) => {
          if (op[1] === "+") return sum(getN(op[0], old), getN(op[2], old));
          if (op[1] === "*") return mult(getN(op[0], old), getN(op[2], old));
        };
        obj[currentMonkey] = {
          ...obj[currentMonkey],
          operation,
        };
        break;
      }

      case LINE.TEST: {
        const { number } = line.match(REGEX.number).groups;

        obj[currentMonkey] = {
          ...obj[currentMonkey],
          test: {
            denominator: Number(number),
          },
        };
        break;
      }

      case LINE.IFTRUE: {
        const { number } = line.match(REGEX.number).groups;

        obj[currentMonkey] = {
          ...obj[currentMonkey],
          test: {
            ...obj[currentMonkey].test,
            ifTrue: Number(number),
          },
        };
        break;
      }

      case LINE.IFFALSE: {
        const { number } = line.match(REGEX.number).groups;

        obj[currentMonkey] = {
          ...obj[currentMonkey],
          test: {
            ...obj[currentMonkey].test,
            ifFalse: Number(number),
          },
        };
        break;
      }

      default: {
      }
    }
    return obj;
  }, {});
}

function getN(str, n) {
  return str === "old" ? n : Number(str);
}

function sum(a, b) {
  return a + b;
}

function mult(a, b) {
  return a * b;
}

function test(n, { denominator, ifTrue, ifFalse }) {
  return n % denominator ? ifFalse : ifTrue;
}

function run(lines, n) {
  if (n === 0) return;

  Object.values(lines).forEach((line) => {
    line.items.forEach((item) => {
      const worryLevel = Math.floor(line.operation(item) / 3);
      const sendItemTo = test(worryLevel, line.test);
      lines[sendItemTo].items.push(worryLevel);
    });
    line.inspected += line.items.length;
    line.items = [];
  });

  run(lines, n - 1);
}

/**
 * J'ai rencontré de gros problème pour faire tourner cette fonction 10000 fois
 *
 * ``RangeError: Maximum call stack size exceeded``
 *
 * Pour remédier à cela, utilisation de `window` plutot que des arguments.
 */
function run2() {
  if (window.n === 0) return;

  // const d = Object.values(window.lines).reduce(
  //   (m, { test }) => m * test.denominator,
  //   1
  // );

  Object.values(window.lines).forEach((line) => {
    line.items.forEach((item) => {
      const worryLevel = line.operation(item) % 9_699_690; // 9_699_690
      const sendItemTo = test(worryLevel, line.test);
      window.lines[sendItemTo].items.push(worryLevel);
    });
    line.inspected += line.items.length;
    line.items = [];
  });

  window.n -= 1;

  run2();
}
