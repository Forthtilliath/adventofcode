export const between = (num, a, b, inclusiveA = true, inclusiveB = true) => {
    if (a > b)
        [a, b, inclusiveA, inclusiveB] = [b, a, inclusiveB, inclusiveA];
    if (a == b && (inclusiveA || inclusiveB))
        [inclusiveA, inclusiveB] = [true, true];
    return (inclusiveA ? num >= a : num > a) && (inclusiveB ? num <= b : num < b);
};
