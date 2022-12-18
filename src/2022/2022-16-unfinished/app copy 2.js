import { fetchLines } from "../../../lib/forth.js";

/**
 * Represents a valve
 * @typedef {Object} Valve
 * @property {string} name - Valve name (to help to debug)
 * @property {number} flowrate - Flow rate
 * @property {Array<Valve>} valves - Valves to which the tunnel leads
 * @property {boolean} opened - If the valve is opened or not
 */

/**
 * Object with all valves
 * @typedef {Object.<string, Valve} ValvesObject
 */

const regex =
  /Valve (?<name>[A-Z]{2}) has flow rate=(?<flowrate>\d+); tunnels? leads? to valves? (?<valves>.*)+/;

const memoizedGoto = memoize(goto);

init();

async function init() {
  const lines = await fetchLines();
  const [data, valvesToOpen] = parseData(lines);
  assignValves(data);

  console.time("Part 1");
  console.log("Part 1:", part1(data, valvesToOpen));
  console.timeEnd("Part 1");

  console.log("");

  // console.time("Part 2");
  // console.log("Part 2:", part2(data, 4_000_000));
  // console.timeEnd("Part 2");
}

function part1(valves, valvesToOpen) {
  const firstValve = Object.values(valves)[0];

  /**
   * trouver toutes les routes possibles
   * calculer la pression
   * décompter 1 minute à chaque dépla/open
   */
  // const totalPressure = tryPath(firstValve, valvesToOpen);

  const totalPressure = memoizedGoto(firstValve);
  // const totalPressure = goto(firstValve);
  console.log({ totalPressure });

  // while (minutesLeft >= 0) {
  //   console.log({ minutesLeft });
  //   minutesLeft--;
  // }
  // Open
  /**
   * valve.opened = true;
   * minutesLeft--;
   */
}

/**
 * It takes an array of strings, and returns an array of objects
 * @param {Array<string>}lines - The array of lines from the text file.
 * @returns {ValvesObject} An array of valves
 */
function parseData(lines) {
  return lines
    .map((line) => line.match(regex))
    .reduce(
      ([obj, valvesWithRate], { groups }) => {
        const flowrate = Number(groups.flowrate);
        if (flowrate) valvesWithRate.push(groups.name);
        return [
          {
            ...obj,
            [groups.name]: {
              name: groups.name, // To help to debug
              flowrate,
              valves: groups.valves.split(", "),
              opened: false,
            },
          },
          valvesWithRate,
        ];
      },
      [{}, []]
    );
}
// function parseData(lines) {
//   return lines
//     .map((line) => line.match(regex))
//     .reduce(
//       (obj, { groups: { valve, rate, valves } }) => ({
//         ...obj,
//         [valve]: {
//           valve,
//           rate: Number(rate),
//           valves: valves.split(", "),
//           opened: false,
//         },
//       }),
//       {}
//     );
// }

/**
 * Assign directly valve instead of string to each valve
 * @param {ValvesObject} valvesObj
 */
function assignValves(valvesObj) {
  Object.values(valvesObj).forEach((currentValve) => {
    const subsValves = [];
    currentValve.valves.forEach((subValve) => {
      subsValves.push(valvesObj[subValve]);
    });
    currentValve.valves = subsValves;
  });
}

/**
 *
 * @param {Valve} current
 * @param {number} timeLeft
 * @param {string[]} valvesOpened
 * @returns
 */
function goto(current, timeLeft = 3, valvesOpened = new Set()) {
  console.log(
    current.name,
    { flow: current.flowrate },
    { timeLeft },
    valvesOpened
  );

  if (timeLeft <= 0) return 0;
  console.log("after first if");

  let pressures = 0;

  // let pressures = Math.max(
  //   ...current.valves.map((valve) =>
  //     memoizedGoto(valve, timeLeft - 1, valvesOpened)
  //   )
  // );

  if (current.flowrate > 0 && !valvesOpened.has(current.name)) {
    valvesOpened.add(current.name);
    pressures =
      (timeLeft - 1) * current.flowrate +
      memoizedGoto(current, timeLeft - 1, new Set(valvesOpened));
    // console.log((timeLeft - 1) * current.flowrate);
  }
  console.log("map", current.valves);
  console.log(
    [pressures,
    current.valves.map((valve) =>
      memoizedGoto(valve, timeLeft - 1, valvesOpened)
    ).flat()]
  );
  pressures = Math.max(
    pressures,
    ...current.valves.map((valve) =>
      memoizedGoto(valve, timeLeft - 1, valvesOpened)
    )
  );

  console.log("return", current.name, { pressures });
  return pressures;
}
function memoize(fn) {
  let cache = {};
  return (...args) => {
    const [{ name }, time, opened] = args;
    // const n = JSON.stringify([name, time, opened && Array.from(opened)])
    const n = JSON.stringify([name, time, opened && Array.from(opened)]);
    // console.log(n);
    if (n in cache) {
      return cache[n];
    } else {
      let result = fn(...args);
      cache[n] = result;
      return result;
    }
  };
}
// function goto(current, timeLeft = 30, valvesOpened = new Set()) {
//   // debugger;
//   if (timeLeft <= 0) return 0;

//   let pressures = Math.max(
//     ...current.valves.map((valve) => goto(valve, timeLeft - 1, valvesOpened))
//   );

//   if (current.flowrate > 0 && !valvesOpened.has(current.name)) {
//     valvesOpened.add(current.name);
//     pressures = Math.max(
//       pressures,
//       (timeLeft - 1) * current.flowrate + goto(current, timeLeft - 1,new Set(valvesOpened))
//     );
//     console.log({ pressures });
//   }
//   return pressures;
// }

// function goto(currentValve, timeLeft = 30) {
//   // debugger;
//   if (timeLeft <= 0) return 0;

//   let pressures = Math.max(
//     ...currentValve.valves.map((valve) => goto(valve, timeLeft - 1))
//   );

//   if (currentValve.flowrate > 0 && !currentValve.opened) {
//     currentValve.opened = true;
//     pressures = Math.max(
//       pressures,
//       (timeLeft - 1) * currentValve.flowrate + goto(currentValve, timeLeft - 1)
//     );
//     console.log({ pressures });
//   }
//   return pressures;
// }
