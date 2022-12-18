export function replaceAt(str, index, replacement) {
    return (str.substring(0, index) +
        replacement +
        str.substring(index + replacement.length));
}
export function split(str, indexes) {
    const res = [];
    let last = 0;
    let next = 0;
    while (indexes.length > 0) {
        next = indexes.shift();
        res.push(str.slice(last, next));
        last = next;
    }
    res.push(str.slice(last));
    return res;
}
