import { $ } from "./index.js";
export const getInput = (s = "pre") => {
    const el = $(s);
    return el?.innerText.trim().split("\n") ?? [];
};
export const logPart = (id, value) => {
    console.time(`Part ${id}`);
    console.log(`Part ${id}`, value);
    console.timeEnd(`Part ${id}`);
};
