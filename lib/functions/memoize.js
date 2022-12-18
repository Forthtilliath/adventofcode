export function memoize(fn) {
    const cache = new Map();
    return (...args) => {
        const key = args.join();
        if (cache.has(key)) {
            return cache.get(key);
        }
        else {
            const val = fn(...args);
            cache.set(key, val);
            return val;
        }
    };
}
