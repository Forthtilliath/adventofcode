import { Primitive } from "./types.d";
export declare function getIterator(thing: any): any;
export declare function count(start?: number, step?: number): Generator<number, void, unknown>;
export declare function cycle<T>(iterable: Iterable<T>): Generator<T, void, undefined>;
export declare function repeat<T>(object: T, times?: number): Generator<T, void, unknown>;
export declare function chain<T>(...iterables: Array<T>): Generator<any, void, any>;
export declare function flatten<T>(iterableOfIterables: Iterable<Iterable<T>>): Generator<T, void, unknown>;
export declare function chain_from_iterable<T>(iterables: Iterable<T>[]): Generator<T, void, undefined>;
export declare function zip(iterables: Iterable<any>[], longest?: boolean): Generator<any[], void, unknown>;
export declare function zip_longest(iterables: Iterable<any>[], fillValue?: any): Generator<any[], void, unknown>;
export declare function compress(data: Iterable<any>, selectors: number[]): Generator<any, void, unknown>;
export declare function compress_from_iterable(iterables: Iterable<any>[], selectors: number[]): Generator<void | any[], void, unknown>;
export declare function range(start?: number, end?: number, step?: number): Generator<number, void, unknown>;
export declare function product<T extends Array<Iterable<any>>>(iterables: T): IterableIterator<{
    [K in keyof T]: T[K] extends Iterable<infer U> ? U : never;
}>;
export declare function permutations<T>(array: Array<T>, r: number): Generator<T[], void, unknown>;
export declare function combinations<T extends Array<any> | string | Iterable<any>>(arr: T, num: number): Generator<Array<T> | string>;
export declare function logIterable<T>(iterable: Generator<T>): void;
export declare function logIterableDebug<T>(iterable: Generator<T>): void;
export declare function logArray<T>(array: Array<T>): void;
export declare function sorted<T>(iterable: Iterable<T>, keyFn?: (a: T) => Primitive, reverse?: boolean): Array<T>;
export declare function convertToArray<T extends any>(arr: T | ArrayLike<T>): (T & any[]) | (T & string) | (T | ArrayLike<T>)[];
