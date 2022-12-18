export async function fetchData() {
    return await fetch("./data.txt").then((res) => res.text());
}
export async function fetchJson() {
    return await fetch("./data.json").then((res) => res.json());
}
export async function fetchLines() {
    return await fetchData().then(getLines);
}
export function getLines(data) {
    return data.split("\r\n");
}
