import { fetchLines } from "../../lib/forth.js";

const REGEX =
  /(?<reindeer>^\w*) can fly (?<speed>\d*) km\/s for (?<flyDuration>\d*) seconds, but then must rest for (?<restDuration>\d*) seconds./;

(async () => {
  const lines = await fetchLines();
  const data = parseData(lines);

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(lines) {
  return getFaster(lines, 2503);
}

function part2(lines) {
  const scores = {};
  for (let s = 1; s <= 2503; s++) {
    const fasters = getFasters(lines, s);
    fasters.forEach(([name]) => (scores[name] = (scores[name] ?? 0) + 1));
  }

  return getMorePoints(scores);
}

function parseData(lines) {
  return lines.map((line) => line.match(REGEX).groups);
}

function getDistance(duration, { speed, flyDuration, restDuration }) {
  const cycleDuration = +flyDuration + +restDuration;
  const completeCycle = Math.floor(+duration / cycleDuration);

  const leftDuration = +duration % cycleDuration;

  return (
    completeCycle * +speed * +flyDuration +
    Math.min(leftDuration, +flyDuration) * +speed
  );
}

function getFaster(lines, duration) {
  const distances = lines.map((line) => getDistance(duration, line));

  return Math.max(...distances);
}

function getFasters(lines, duration) {
  const distances = lines.map((line) => [
    line.reindeer,
    getDistance(duration, line),
  ]);
  const maxDistance = distances.reduce((max, [name, dist]) => {
    return max > dist ? max : dist;
  },0);

  return distances.filter(([_, dist]) => dist >= maxDistance);
}

function getMorePoints(scores) {
  return Object.values(scores).reduce((p, v) => ( p > v ? p : v ));
}