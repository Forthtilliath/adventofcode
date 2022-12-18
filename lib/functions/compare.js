export function keyToCmp(keyFn) {
    return (a, b) => {
        let ka = keyFn(a);
        let kb = keyFn(b);
        if (typeof ka === "boolean" && typeof kb === "boolean") {
            return ka === kb ? 0 : !ka && kb ? -1 : 1;
        }
        else if (typeof ka === "number" && typeof kb === "number") {
            return ka - kb;
        }
        else if (typeof ka === "string" && typeof kb === "string") {
            return ka === kb ? 0 : ka < kb ? -1 : 1;
        }
        else {
            return -1;
        }
    };
}
