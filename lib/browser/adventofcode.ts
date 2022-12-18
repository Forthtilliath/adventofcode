import { $ } from "./index.js";

export const getInput = (s = "pre") => {
  const el = $<HTMLElement>(s);
  return el?.innerText.trim().split("\n") ?? [];
};

export const logPart = (id: number, value: any) => {
  console.time(`Part ${id}`);
  console.log(`Part ${id}`, value);
  console.timeEnd(`Part ${id}`);
};
