import { fetchLines } from "../../../lib/forth.js";

const LETTER = {
  START: "S",
  END: "E",
};

const EDGES = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

/**
 * @typedef Area
 * @type {object}
 * @property {number} x Position left or right
 * @property {number} y Position top or bottom
 * @property {boolean} visited
 * @property {number} elevation Value of the lettres
 * @property {number} distance Value of the lettres
 * @property {Area[]} edgeAreas Areas at edge of current Area
 */

init();

async function init() {
  const lines = await fetchLines();

  const [data, start, end] = parseData(lines);
  addConnections(data);
  console.log(data);

  console.log("Part 1", calculateShortestPath(end, start));
  reset(data);
  console.log("Part 2", calculateShortestPath(end, start, true));
}

/**
 * It takes a list of strings, and returns a list of lists of objects
 * @param {string[]} lines - an array of strings, each string representing a row of the map
 * @returns {Area[][]} A 2D array of objects.
 */
function parseData(lines) {
  let start, end;
  const data = lines.map((row, y) => {
    return row.split("").map((char, x) => {
      let area = {
        x,
        y,
        visited: false,
        elevation: char.charCodeAt(0) - 96, // 1 à 26
        distance: Infinity,
      };
      if (char == LETTER.START) {
        area.elevation = 0;
        start = area;
      }
      if (char == LETTER.END) {
        area.elevation = 27;
        end = area;
      }
      return area;
    });
  });
  return [data, start, end];
}

function addConnections(data) {
  data.forEach((row) => {
    row.forEach((area) => {
      let edgeAreas = [];
      for (let edge of EDGES) {
        if (!data[area.y + edge[1]]) continue;
        let edgeArea = data[area.y + edge[1]][area.x + edge[0]];
        // Add the area if not last row or column
        edgeArea && edgeAreas.push(edgeArea);
      }
      area.edgeAreas = edgeAreas;
    });
  });
}

/**
 * It resets the distance and visited properties of each Area in the grid
 * @param {Area[]} arr - The array of arrays that represents the grid.
 */
function reset(arr) {
  arr.forEach((row) => {
    row.forEach((area) => {
      area.distance = Infinity;
      area.visited = false;
    });
  });
}

/**
 * calculate the shortest path
 * @param {Area} start,end - The Area to start
 * @param {Area} end - The Area to end
 * @param {boolean} [part2=false] - Part 2
 * @returns The distance from the starting point to the first point on the edge of the map.
 */
function calculateShortestPath(start, end, part2 = false) {
  start.distance = 0;
  let areasToVisit = [start];
  while (areasToVisit.length) {
    let area = areasToVisit.pop();
    for (const edgeArea of area.edgeAreas) {
      if (isPosibleNextArea(area, edgeArea)) {
        let distance = area.distance + 1;
        if (isFinalArea(edgeArea, end, part2)) {
          return distance;
        } else {
          edgeArea.visited = true;
          edgeArea.distance = distance;
          areasToVisit.unshift(edgeArea);
        }
      }
    }
  }
  return Infinity;
}

function isPosibleNextArea(currentArea, edgeArea) {
  return !edgeArea.visited && currentArea.elevation - edgeArea.elevation < 2;
}

function isFinalArea(edgeArea, end, part2) {
  return (
    (edgeArea.x === end.x && edgeArea.y === end.y) ||
    (part2 && edgeArea.elevation === 1)
  );
}
