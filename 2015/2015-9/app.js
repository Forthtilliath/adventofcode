import { fetchLines } from "../../lib/forth.js";

(async () => {
  const lines = await fetchLines();

  const distances = getAllDistance(lines);

  console.log("Part 1", part1(distances));
  console.log("Part 2", part2(distances));
})();

/**
 * It takes an array of strings, each string being a line of the input, and returns an array of
 * integers, each integer being the total distance of a possible route
 * @param lines - an array of strings, each string is a line from the input file
 * @returns An array of all possible distances between cities.
 */
function getAllDistance(lines) {
  const cities = new Set();
  const travels = [];

  lines.forEach((line) => {
    const [_, from, to, dist] = line.match(/(\w*) to (\w*) = (\d*)/);
    cities.add(from);
    cities.add(to);
    travels.push({ from, to, dist });
  });

  const combinaisons = getCombinaisons([...cities], cities.size);

  return combinaisons.map((cities) => getTotalDistance(cities, travels));
}

/**
 * `part1` takes an array of distances and returns the minimum distance
 * @param distances - an array of distances from the current point to each of the other points
 * @returns The minimum distance between the two points.
 */
function part1(distances) {
  return Math.min(...distances);
}


/**
 * `part2` returns the maximum value in the array `distances`
 * @param distances - an array of distances, where each distance is an array of two numbers.
 * @returns The maximum distance of the shortest path between any two points.
 */
function part2(distances) {
  return Math.max(...distances);
}

/**
 * It takes an array of cities and an array of travels, and returns the total distance between all the
 * cities in the order they appear in the cities array
 * @param cities - ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
 * "Q", "R", "S", "T",
 * @param travels - [{from: 'A', to: 'B', distance: 10}, {from: 'B', to: 'C', distance: 20}]
 * @returns The total distance of the trip.
 */
function getTotalDistance(cities, travels) {
  return cities.reduce((sum, city, i) => {
    if (i === cities.length - 1) return sum;
    return sum + getDistance(travels, city, cities[i + 1]);
  }, 0);
}


/**
 * It returns all the possible combinations of a list of elements, of a given size
 * @param list - the list of items to combine
 * @param [size] - the size of the combinations you want to get
 * @returns An array of arrays of all possible combinations of the input array.
 */
function getCombinaisons(list, size = list.length) {
  if (size > list.length) return [];
  if (size == 1) return list.map((d) => [d]);
  return list.flatMap((d) =>
    getCombinaisons(
      list.filter((a) => a !== d),
      size - 1
    ).map((item) => [d, ...item])
  );
}

/**
 * It returns the distance between two cities, if the distance is found in the travels array, otherwise
 * it returns 0.
 * @param travels - [{from: "A", to: "B", dist: 10}, {from: "B", to: "C", dist: 20}, {from: "C", to:
 * "D", dist: 30}]
 * @param from - "A"
 * @param to - "A"
 * @returns The distance between the two cities.
 */
function getDistance(travels, from, to) {
  return Number(
    travels.find(
      (travel) =>
        (travel.from === from && travel.to === to) ||
        (travel.from === to && travel.to === from)
    ).dist
  );
}
