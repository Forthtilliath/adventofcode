import { Primitive } from './types.d';

export function primitiveIdentity(x: any): Primitive {
    if (typeof x !== 'string' && typeof x !== 'number' && typeof x !== 'boolean') {
        throw new Error('Please provide a key function that can establish object identity');
    }
    return x;
}