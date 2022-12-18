/**
 * It takes a function and returns a new function that caches the results of the original function
 * @param {Function} fn - The function to be memoized.
 * @returns A function that takes in any number of arguments and returns the result of the function
 * passed in.
 */
export function memoize(fn: Function) {
  const cache = new Map();
  return (...args: any[]) => {
    const key = args.join();
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const val = fn(...args);
      cache.set(key, val);
      return val;
    }
  };
}
