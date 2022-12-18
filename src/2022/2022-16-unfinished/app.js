import { fetchLines } from "../../../lib/forth.js";
import { memoize } from "../../../lib/index.js";

init();

async function init() {
  const lines = await fetchLines();

  console.time("Part 1");
  console.log("Part 1:", part1(lines));
  console.timeEnd("Part 1");

  console.log("");

  // console.time("Part 2");
  // console.log("Part 2:", part2(data, 4_000_000));
  // console.timeEnd("Part 2");
}

const RE = /Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.*)/;

const parse = (input) =>
  new Map(
    input
      .map((line) => RE.exec(line))
      .map(([, valve, rate, valves]) => [
        valve,
        Number(rate),
        valves.split(", "),
      ])
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([valve, rate, valves], i, arr) => [
        1n << BigInt(i),
        [
          rate,
          valves.map(
            (v) => 1n << BigInt(arr.findIndex(([valve]) => v === valve))
          ),
          valve,
        ],
      ])
  );

const shortestPath = (graph) => {
  console.log(graph);
  const keys = [...graph.keys()];
  const distMap = new Map(
    keys.map((k) => [k, new Map(keys.map((l) => [l, Number.MAX_SAFE_INTEGER]))])
  );
  keys.forEach((u) => graph.get(u).map((v) => distMap.get(u).set(v, 1)));
  keys.forEach((k) => distMap.get(k).set(k, 0));
  keys.forEach((k) =>
    keys.forEach((i) =>
      keys.forEach((j) =>
        distMap
          .get(i)
          .set(
            j,
            Math.min(
              distMap.get(i).get(j),
              distMap.get(i).get(k) + distMap.get(k).get(j)
            )
          )
      )
    )
  );
  return distMap;
};

const evaluate = (input, time = 30, firstrun = false) => {
  const data = parse(input);
  console.log(data);
  const distMap = shortestPath(
    new Map([...data].map(([key, data]) => [key, data[1]]))
  );
  console.log(distMap);
  const keys = [...data.keys()];
  const flow = new Map(keys.map((k) => [k, data.get(k)[0]]));

  const START = 1n;
  const dfs = memoize((valve, minutes, open, firstrun) =>
    /* It's filtering out the keys that are already open, have no flow, or are too far away. */
    keys
      .filter(
        (k) => !(open & k) && flow.get(k) && distMap.get(valve).get(k) < minutes
      )
      .map((k) => {
        const d = distMap.get(valve).get(k) + 1;
        const timeleft = minutes - d;
        return timeleft * flow.get(k) + dfs(k, timeleft, open | k, firstrun);
      })
      /* It's taking the maximum value of the array. */
      .reduce(
        (max, v) => (max > v ? max : v),
        firstrun ? dfs(START, time, open, false) : 0
      )
  );
  return dfs(START, time, 0n, firstrun);
};

export const part1 = (input) => evaluate(input);
export const part2 = (input) => evaluate(input, 26, true);
