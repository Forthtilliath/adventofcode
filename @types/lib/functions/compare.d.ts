type CmpFn<T> = (a: T, b: T) => number;
export declare function keyToCmp<T>(keyFn: (a: T) => string | number | boolean): CmpFn<T>;
export {};
