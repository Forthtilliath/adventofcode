import { fetchData } from "../lib/forth.js";

(async () => {
  const data = await fetchData();
  console.log(data);

  console.log("Part 1", part1(data));
  console.log("Part 2", part2(data));
})();

function part1(data) {
  const houses = [];
  let santa = { x: 0, y: 0 };
  add(houses, santa);

  [...data].forEach((direction, i) => {
    switch (direction) {
      case "^":
        santa.y--;
        break;
      case "v":
        santa.y++;
        break;
      case "<":
        santa.x--;
        break;
      case ">":
        santa.x++;
        break;
      default:
    }
    add(houses, santa);
  });

  return houses.length;
}

function add(array, { x, y }) {
  const found = array.find((item) => item.x === x && item.y === y);
  if (!found) array.push({ x, y });
}

function part2(data) {
  const houses = [];
  let santa = { x: 0, y: 0 };
  let robo = { x: 0, y: 0 };
  add(houses, santa);

  [...data].forEach((direction, i) => {
    switch (direction) {
      case "^":
        i % 2 ? robo.y-- : santa.y--;
        break;
      case "v":
        i % 2 ? robo.y++ : santa.y++;
        break;
      case "<":
        i % 2 ? robo.x-- : santa.x--;
        break;
      case ">":
        i % 2 ? robo.x++ : santa.x++;
        break;
      default:
    }
    add(houses, i % 2 ? robo : santa);
  });

  return houses.length;
}
