type CmpFn<T> = (a: T, b: T) => number;

/**
 * "It returns a function that compares two objects by comparing the values returned by the keyFn
 * function."
 * 
 * The keyFn function is a function that takes an object and returns a value that can be compared. The
 * keyFn function is used to extract a value from each object that can be compared
 * @param keyFn - (a:T) => string | number | boolean
 * @returns A function that takes two arguments and returns a number.
 */
export function keyToCmp<T>(keyFn: (a:T) => string | number | boolean): CmpFn<T> {
  return (a: T, b: T) => {
    let ka = keyFn(a);
    let kb = keyFn(b);
    
    if (typeof ka === "boolean" && typeof kb === "boolean") {
      return ka === kb ? 0 : !ka && kb ? -1 : 1;
    } else if (typeof ka === "number" && typeof kb === "number") {
      return ka - kb;
    } else if (typeof ka === "string" && typeof kb === "string") {
      return ka === kb ? 0 : ka < kb ? -1 : 1;
    } else {
      return -1;
    }
  };
}
