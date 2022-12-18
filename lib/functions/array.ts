// https://docs.python.org/3/library/itertools.html
// https://github.com/abozhilov/ES-Iter/blob/master/src/Iter.js

import { keyToCmp } from "./compare.js";
import { Maybe, Primitive } from "./types.d";
import { primitiveIdentity } from "./types.js";

function isIterable(thing: any): boolean {
  return thing && typeof thing[Symbol.iterator] === "function";
}

export function getIterator(thing: any) {
  if (isIterable(thing)) {
    return thing[Symbol.iterator]();
  }
  throw new TypeError("Not iterable: " + thing);
}

/***********************************************************
 ***********************************************************
 ** Infinite iterators
 ***********************************************************
 ***********************************************************/

/**
 * Make an iterator that returns evenly spaced values starting with number start.
 * Often used as an argument to map() to generate consecutive data points. Also,
 * used with zip() to add sequence numbers.
 * @param {number} start The number to start
 * @param {number} step The step between each number
 * @example
 * count(10)
 * // 10 11 12 13 14 ...
 * count(2.5, 0.5)
 * // 2.5 3.0 3.5
 **/
export function* count(start: number = 0, step: number = 1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

/**
 * Make an iterator returning elements from the iterable and saving a copy of each.
 * When the iterable is exhausted, return elements from the saved copy. Repeats
 * indefinitely.
 * @param iterable
 * @example
 * cycle('ABCD')
 * // A B C D A B C D A B C D
 */
export function* cycle<T>(iterable: Iterable<T>) {
  const saved = [];
  for (let x of iterable) {
    yield x;
    saved.push(x);
  }
  while (saved) {
    yield* saved;
  }
}

/**
 * Make an iterator that returns object over and over again. Runs indefinitely unless the times argument is specified.
 * @param object Object to repeat
 * @param times Number of times to repeat
 * @example
 * repeat(10, 3)
 * // 10 10 10
 */
export function* repeat<T>(object: T, times: number = Infinity) {
  if (times === Infinity) {
    while (true) {
      yield object;
    }
  } else {
    for (let i = 0; i < times; i++) {
      yield object;
    }
  }
}

/***********************************************************
 ***********************************************************
 ** Iterators terminating on the shortest input sequence
 ***********************************************************
 ***********************************************************/

/**
 * Make an iterator that returns elements from the first iterable until it is exhausted,
 * then proceeds to the next iterable, until all of the iterables are exhausted. Used for
 * treating consecutive sequences as a single sequence.
 * @example
 * chain('ABC', 'DEF')
 * // A B C D E F
 */
export function* chain<T>(...iterables: Array<T>) {
  for (let it of iterables.map(getIterator)) {
    yield* it;
  }
}
export function* flatten<T>(iterableOfIterables: Iterable<Iterable<T>>) {
  for (let iterables of iterableOfIterables) {
    for (let it of iterables) {
      yield it;
    }
  }
}

/**
 * Alternate constructor for chain(). Gets chained inputs from a single iterable
 * argument that is evaluated lazily.
 */
export function* chain_from_iterable<T>(iterables: Iterable<T>[]) {
  for (let it of iterables) {
    yield* it;
  }
}

export function* zip(iterables: Iterable<any>[], longest = false) {
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
        // Leave a hole in the array so that you can distinguish an iterable
        // that's done (via `index in array == false`) from an iterable
        // yielding `undefined`.
        zipped.length++;
      } else {
        zipped.push(value);
      }
    }
    yield zipped;
  }
}

/**
 * Make an iterator that aggregates elements from each of the iterables. If the
 * iterables are of uneven length, missing values are filled-in with fillvalue. Iteration
 * continues until the longest iterable is exhausted.
 */
export function* zip_longest(iterables: Iterable<any>[], fillValue?: any) {
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
      } else {
        return;
      }
    }
    yield zipped;
  }
}

/**
 * Make an iterator that filters elements from data returning only those that have a
 * corresponding element in selectors that evaluates to True. Stops when either the
 * data or selectors iterables has been exhausted.
 * @example
 * compress('ABCDEF', [1,0,1,0,1,1])
 * // A C E F
 */
export function* compress(data: Iterable<any>, selectors: number[]) {
  const iter = getIterator(data);
  for (let selector of selectors) {
    const { value } = iter.next();
    if (selector) yield value;
  }
}

/**
 * Make an iterator that filters elements from data returning only those that have a
 * corresponding element in selectors that evaluates to True. Stops when either the
 * data or selectors iterables has been exhausted.
 * @example
 * compress(["ABCDEF", "FGHIJK"], [1,0,1,0,1,1])
 * // AF CH EJ FK
 */
export function* compress_from_iterable(
  iterables: Iterable<any>[],
  selectors: number[]
) {
  const iters = zip(iterables);
  for (let selector of selectors) {
    const { value } = iters.next();
    if (selector) yield value;
  }
}

/**
 *
 * @param n Value at which to start
 * @param end Value at which to end
 * @example
 * range();
 * // 0 1 2 3 4 5
 * range(5)
 * // 0 1 2 3 4 5
 * range(5, 10);
 * // 5 6 7 8 9 10
 * range(5, 10, 2)
 * // 5 7 9
 * range(5, 0, -1)
 * // 5 4 3 2 1 0
 */
export function* range(
  start: number = 0,
  end: number = Infinity,
  step: number = 1
) {
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

export function* product<T extends Array<Iterable<any>>>(
  iterables: T
): IterableIterator<{
  [K in keyof T]: T[K] extends Iterable<infer U> ? U : never;
}> {
  if (iterables.length === 0) {
    return;
  }
  // make a list of iterators from the iterables
  const iterators = iterables.map((it) => it[Symbol.iterator]());
  const results = iterators.map((it) => it.next());
  if (results.some((r) => r.done)) {
    throw new Error("Input contains an empty iterator.");
  }

  for (let i = 0; ; ) {
    if (results[i].done) {
      // reset the current iterator
      iterators[i] = getIterator(iterables[i]);
      results[i] = iterators[i].next();
      // advance, and exit if we've reached the end
      if (++i >= iterators.length) {
        return;
      }
    } else {
      yield results.map(({ value }) => value) as any;
      i = 0;
    }
    results[i] = iterators[i].next();
  }
}

/***********************************************************
 ***********************************************************
 ** Combinatoric iterators
 ***********************************************************
 ***********************************************************/
export function* permutations<T>(array: Array<T>, r: number) {
  // Algorythm copied from Python `itertools.permutations`.
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
      } else {
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

export function* combinations<T extends Array<any> | string | Iterable<any>>(
  arr: T,
  num: number
): Generator<Array<T> | string> {
  const arr2 = convertToArray(arr);
  const r: Array<typeof arr2> = [];

  for (var i = 0; i < arr2.length; i++) {
    if (num === 1) yield [arr2[i]];
    else {
      Array.from(combinations(arr2.slice(i + 1), num - 1)).forEach(function (
        val: any
      ) {
        r.push([].concat(arr2[i], val));
      });
    }
  }
  for (let i of r) yield i;
}

/**
 * It takes an iterable and logs each value until the iterable is exhausted
 * @param iterable - Generator
 */
export function logIterable<T>(iterable: Generator<T>) {
  let next;
  do {
    next = iterable.next();
    console.log(next.value);
  } while (!next.done);
}
export function logIterableDebug<T>(iterable: Generator<T>) {
  let next;
  let i = 50;
  do {
    next = iterable.next();
    i--;
    console.log(next.value);
  } while (!next.done && i > 0);
}

/**
 * It takes an array of any type and logs the index and value of each element in the array
 * @param array - Array
 */
export function logArray<T>(array: Array<T>) {
  array.forEach((value, index) => console.log({ index, value }));
}

export function sorted<T>(
  iterable: Iterable<T>,
  keyFn: (a: T) => Primitive = primitiveIdentity,
  reverse: boolean = false
): Array<T> {
  const result = Array.from(iterable);
  result.sort(keyToCmp(keyFn)); // sort in-place

  if (reverse) {
    result.reverse(); // reverse in-place
  }

  return result;
}

/**
 * If the input is an array or string, return it. Otherwise, if it's iterable, return an array from it.
 * Otherwise, return an array containing the input
 * @param {T | ArrayLike<T>} arr - T | ArrayLike<T>
 * @returns An array of the same type as the input.
 */
export function convertToArray<T extends any>(arr: T | ArrayLike<T>) {
  if (Array.isArray(arr) || typeof arr === "string") return arr;

  if (Symbol.iterator in Object(arr)) {
    return Array.from(arr as ArrayLike<T>);
  }

  return [arr];
}


// logIterable(combinations("ABCD", 3));
// logIterable(combinations([0, 1, 2, 3], 3));
// logIterable(combinations(["A", "B", "C", "D"], 3));
// logIterable(combinations(range(4), 3));