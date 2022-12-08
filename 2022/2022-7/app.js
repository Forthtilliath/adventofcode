import { fetchLines } from "../../lib/forth.js";

// https://regex101.com/r/4iYZuP/1
const REGEX =
  /(^\$ )(?<command>\w*)( (?<arg>[\w.\/]*))?|(^dir (?<dirname>\w*))|(?<size>\d*) (?<filename>[\w.]*)/;

(async () => {
  const lines = await fetchLines();
  const commands = lines.map((line) => line.match(REGEX).groups);

  const tree = generateTree(commands);

  const sizes = {};
  getAllSizeDir(tree, sizes);

  console.log("Part 1", part1(sizes));
  console.log("Part 2", part2(sizes));
})();

function part1(sizes) {
  return Object.values(sizes).reduce(
    (sum, size) => (size > 100_000 ? sum : sum + size),
    0
  );
}

function part2(sizes) {
  const SIZES = {
    TOTAL: 70_000_000,
    NEEDED: 30_000_000,
  };
  const free_space = SIZES.TOTAL - sizes["/"];
  const needed_space = SIZES.NEEDED - free_space;

  return Math.min(
    ...Object.values(sizes).filter((size) => size >= needed_space)
  );
}

function generateTree(commands) {
  const tree = {
    name: "/",
    content: [],
  };
  /** Position in the tree */
  let currentTree;
  const historyTree = [];

  commands.forEach((line) => {
    if (line.command) {
      if (line.command === "cd") {
        switch (line.arg) {
          case "/":
            historyTree.length = 0;
            currentTree = tree;
            break;
          case "..":
            currentTree = historyTree.pop();
            break;
          default:
            historyTree.push(currentTree);
            currentTree = findDir(currentTree, line.arg);
        }
      } else if (line.command === "ls") {
        // next lines list the files and dir in the current path
      }
    } else {
      if (line.dirname) {
        const dir = { name: line.dirname, content: [] };
        addFile(currentTree, dir);
      } else {
        const file = {
          name: line.filename,
          size: Number(line.size),
        };
        addFile(currentTree, file);
      }
    }
  });

  return tree;
}

function addFile(tree, file) {
  tree.content.push(file);
}

function findDir(tree, name) {
  return tree.content.find((c) => c.name === name);
}

/**
 * It takes a tree, a sizes object, and a path string, and returns the size of the tree.
 * @param tree - the tree object
 * @param sizes - an object that will contain the size of each directory
 * @param path - the path to the directory
 * @returns The total size of the tree.
 */
function getAllSizeDir(tree, sizes, path = "/") {
  const size = tree.content.reduce((sum, item) => {
    if (Object.hasOwn(item, "content")) {
      return sum + getAllSizeDir(item, sizes, `${path}${item.name}/`);
    } else {
      return sum + item.size;
    }
  }, 0);
  sizes[path] = size;
  return size;
}
