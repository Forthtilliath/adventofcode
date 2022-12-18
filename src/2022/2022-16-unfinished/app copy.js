import { fetchLines } from "../../../lib/forth.js";

/**
 * Represents a valve
 * @typedef {Object} Valve
 * @property {string} name - Valve name (to help to debug)
 * @property {number} flowrate - Flow rate
 * @property {Array<Valve>} valves - Valves to which the tunnel leads
 * @property {boolean} open - If the valve is open or not
 */

/**
 * Object with all valves
 * @typedef {Object.<string, Valve} ValvesObject
 */

const regex =
  /Valve (?<name>[A-Z]{2}) has flow rate=(?<flowrate>\d+); tunnels? leads? to valves? (?<valves>.*)+/;

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
  console.log(valves);
  console.log(valvesToOpen);

  const firstValve = Object.values(valves)[0];

  /**
   * trouver toutes les routes possibles
   * calculer la pression
   * décompter 1 minute à chaque dépla/open
   */
  const totalPressure = tryPath(firstValve, valvesToOpen);
  console.log({ totalPressure });

  // while (minutesLeft >= 0) {
  //   console.log({ minutesLeft });
  //   minutesLeft--;
  // }
  // Open
  /**
   * valve.open = true;
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
              open: false,
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
//           open: false,
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

function tryPath(start, valvesToOpen) {
  let aPressure = [];
  let totalPressure = 0;
  let minutesLeft = 30;
  let valvesToVisit = [start];

  while (valvesToVisit.length && minutesLeft > 0) {
    let valve = valvesToVisit.pop();
    console.log("currentValve",valve,{minutesLeft})
    for (const subValve of valve.valves) {
      minutesLeft--;
      if (valve.flowrate > 0) {
        minutesLeft--;
        valve.open = true;
        totalPressure += (minutesLeft - 1) * valve.flowrate;
        valvesToOpen = valvesToOpen.filter((name) => name === valve.name);
        console.log("open", valve.name, minutesLeft);
      }
      if (valvesToOpen.length) {
        valvesToVisit.unshift(subValve);
      } else {
        // return totalPressure;
        console.log(totalPressure);
        aPressure.push(totalPressure);
      }
    }
  }
  // return aPressure;
}
// function tryPath(valves, currentValve, minutesLeft = 30, totalPressure = 0) {
//   console.log("currentValve", currentValve);
//   if (minutesLeft === 0) {
//     return totalPressure;
//   }
//   let a = [];
//   currentValve.valves.forEach((valve) => {
//     if (valve.flowrate > 0) {
//       valve.open = true;
//       totalPressure += (minutesLeft - 1) * valve.flowrate;
//     }
//     tryPath(valves, valve, --minutesLeft, totalPressure);
//   });
// }
