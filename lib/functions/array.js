import { keyToCmp } from "./compare.js";
import { primitiveIdentity } from "./types.js";
function isIterable(thing) {
    return thing && typeof thing[Symbol.iterator] === "function";
}
export function getIterator(thing) {
    if (isIterable(thing)) {
        return thing[Symbol.iterator]();
    }
    throw new TypeError("Not iterable: " + thing);
}
export function* count(start = 0, step = 1) {
    let n = start;
    while (true) {
        yield n;
        n += step;
    }
}
export function* cycle(iterable) {
    const saved = [];
    for (let x of iterable) {
        yield x;
        saved.push(x);
    }
    while (saved) {
        yield* saved;
    }
}
export function* repeat(object, times = Infinity) {
    if (times === Infinity) {
        while (true) {
            yield object;
        }
    }
    else {
        for (let i = 0; i < times; i++) {
            yield object;
        }
    }
}
export function* chain(...iterables) {
    for (let it of iterables.map(getIterator)) {
        yield* it;
    }
}
export function* flatten(iterableOfIterables) {
    for (let iterables of iterableOfIterables) {
        for (let it of iterables) {
            yield it;
        }
    }
}
export function* chain_from_iterable(iterables) {
    for (let it of iterables) {
        yield* it;
    }
}
export function* zip(iterables, longest = false) {
    if (!iterables.length) {
        return;
    }
    const iters = iterables.map(getIterator);
    const nbIters = iterables.length;
    let nbFinished = 0;
    let finished = false;
    while (!finished) {
        let zipped = [];
        for (let it of iters) {
            let { value, done } = it.next();
            if (done) {
                if (!longest) {
                    return;
                }
                if (++nbFinished == nbIters) {
                    finished = true;
                }
            }
            if (value === undefined) {
                zipped.length++;
            }
            else {
                zipped.push(value);
            }
        }
        yield zipped;
    }
}
export function* zip_longest(iterables, fillValue) {
    if (!iterables.length) {
        return;
    }
    const iters = iterables.map(getIterator);
    const numIters = iterables.length;
    let numFinished = 0;
    let finished = false;
    while (!finished) {
        let zipped = [];
        for (let it of iters) {
            let { value, done } = it.next();
            if (done) {
                if (fillValue === undefined) {
                    return;
                }
                if (++numFinished == numIters) {
                    finished = true;
                }
            }
            if (!finished) {
                zipped.push(value ?? fillValue);
            }
            else {
                return;
            }
        }
        yield zipped;
    }
}
export function* compress(data, selectors) {
    const iter = getIterator(data);
    for (let selector of selectors) {
        const { value } = iter.next();
        if (selector)
            yield value;
    }
}
export function* compress_from_iterable(iterables, selectors) {
    const iters = zip(iterables);
    for (let selector of selectors) {
        const { value } = iters.next();
        if (selector)
            yield value;
    }
}
export function* range(start = 0, end = Infinity, step = 1) {
    if (step === 0) {
        throw new Error("Step can't be null");
    }
    if (start !== 0 && end === Infinity) {
        end = start;
        start = 0;
    }
    for (; step > 0 ? start < end : end <= start; start += step) {
        yield start;
    }
}
export function* product(iterables) {
    if (iterables.length === 0) {
        return;
    }
    const iterators = iterables.map((it) => it[Symbol.iterator]());
    const results = iterators.map((it) => it.next());
    if (results.some((r) => r.done)) {
        throw new Error("Input contains an empty iterator.");
    }
    for (let i = 0;;) {
        if (results[i].done) {
            iterators[i] = getIterator(iterables[i]);
            results[i] = iterators[i].next();
            if (++i >= iterators.length) {
                return;
            }
        }
        else {
            yield results.map(({ value }) => value);
            i = 0;
        }
        results[i] = iterators[i].next();
    }
}
export function* permutations(array, r) {
    const n = array.length;
    if (r === undefined) {
        r = n;
    }
    if (r > n) {
        return;
    }
    let indices = [];
    for (var i = 0; i < n; i++) {
        indices.push(i);
    }
    var cycles = [];
    for (var i = n; i > n - r; i--) {
        cycles.push(i);
    }
    var res = [];
    for (var k = 0; k < r; k++) {
        res.push(array[indices[k]]);
    }
    yield res;
    var broken = false;
    while (n > 0) {
        for (var i = r - 1; i >= 0; i--) {
            cycles[i]--;
            if (cycles[i] === 0) {
                indices = indices
                    .slice(0, i)
                    .concat(indices.slice(i + 1).concat(indices.slice(i, i + 1)));
                cycles[i] = n - i;
                broken = false;
            }
            else {
                var j = cycles[i];
                var x = indices[i];
                indices[i] = indices[n - j];
                indices[n - j] = x;
                var res = [];
                for (var k = 0; k < r; k++) {
                    res.push(array[indices[k]]);
                }
                yield res;
                broken = true;
                break;
            }
        }
        if (broken === false) {
            break;
        }
    }
}
export function* combinations(arr, num) {
    const arr2 = convertToArray(arr);
    const r = [];
    for (var i = 0; i < arr2.length; i++) {
        if (num === 1)
            yield [arr2[i]];
        else {
            Array.from(combinations(arr2.slice(i + 1), num - 1)).forEach(function (val) {
                r.push([].concat(arr2[i], val));
            });
        }
    }
    for (let i of r)
        yield i;
}
export function logIterable(iterable) {
    let next;
    do {
        next = iterable.next();
        console.log(next.value);
    } while (!next.done);
}
export function logIterableDebug(iterable) {
    let next;
    let i = 50;
    do {
        next = iterable.next();
        i--;
        console.log(next.value);
    } while (!next.done && i > 0);
}
export function logArray(array) {
    array.forEach((value, index) => console.log({ index, value }));
}
export function sorted(iterable, keyFn = primitiveIdentity, reverse = false) {
    const result = Array.from(iterable);
    result.sort(keyToCmp(keyFn));
    if (reverse) {
        result.reverse();
    }
    return result;
}
export function convertToArray(arr) {
    if (Array.isArray(arr) || typeof arr === "string")
        return arr;
    if (Symbol.iterator in Object(arr)) {
        return Array.from(arr);
    }
    return [arr];
}
