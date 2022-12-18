import { expect } from "chai";
import {
  chain,
  chain_from_iterable,
  combinations,
  compress,
  compress_from_iterable,
  count,
  cycle,
  flatten,
  permutations,
  product,
  range,
  repeat,
  zip,
  zip_longest,
} from "./index.js";

describe("Array", function () {
  describe("count", function () {
    const iterator = count(10);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 10 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 11 });
    });
  });

  describe("cycle", function () {
    const iterator = cycle("ABCD");
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "B" });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "C" });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "D" });
    });
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
  });

  describe("repeat", function () {
    const iterator = repeat(10, 3);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 10 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 10 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 10 });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("chain", function () {
    const iterator = chain("ABC", "DEF");
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "B" });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "C" });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "D" });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "E" });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "F" });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("flatten", function () {
    const iterator = flatten(["ABC", "DEF"]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "B" });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "C" });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "D" });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "E" });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "F" });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("chain_from_iterable", function () {
    const iterator = chain_from_iterable(["ABC", "DEF"]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "B" });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "C" });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "D" });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "E" });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "F" });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("zip_longest with 2 arrays of 3 elements", function () {
    const iterator = zip_longest([
      [1, 2, 3],
      ["sugar", "spice", "salt"],
    ]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [1, "sugar"] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [2, "spice"] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [3, "salt"] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("zip_longest with 2 arrays of different length", function () {
    const iterator = zip_longest([
      [1, 2, 3, 4],
      ["sugar", "spice", "salt"],
    ]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [1, "sugar"] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [2, "spice"] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [3, "salt"] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("zip_longest with 2 arrays of different length and fillValue", function () {
    const iterator = zip_longest(
      [
        [1, 2, 3, 4],
        ["sugar", "spice", "salt"],
      ],
      "-"
    );
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [1, "sugar"] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [2, "spice"] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [3, "salt"] });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [4, "-"] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("compress", function () {
    const iterator = compress("ABCDEF", [1, 0, 1, 0, 1, 1]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "A" });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "C" });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "E" });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: "F" });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("compress_from_iterable", function () {
    const iterator = compress_from_iterable(
      ["ABCDEF", "FGHIJK"],
      [1, 0, 1, 0, 1, 1]
    );
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["A", "F"] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["C", "H"] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["E", "J"] });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["F", "K"] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("range with no params", function () {
    const iterator = range();
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 0 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 1 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 2 });
    });
  });

  describe("range(5)", function () {
    const iterator = range(5);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 0 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 1 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 2 });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 3 });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 4 });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("range(5,8)", function () {
    const iterator = range(5, 8);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 5 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 6 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 7 });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("range(5, 10, 2)", function () {
    const iterator = range(5, 10, 2);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 5 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 7 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 9 });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe("range(5, 0, -1)", function () {
    const iterator = range(5, 0, -1);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 5 });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 4 });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 3 });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 2 });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 1 });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: 0 });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe('product(["ABCD", "xy"])', function () {
    const iterator = product(["ABCD", "xy"]);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["A", "x"] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["B", "x"] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["C", "x"] });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["D", "x"] });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["A", "y"] });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["B", "y"] });
    });
    it("should return the 7th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["C", "y"] });
    });
    it("should return the 8th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: ["D", "y"] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  describe('permutations', function () {
    const iterator = permutations([1, 2, 3], 2);
    it("should return the 1st iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [1, 2] });
    });
    it("should return the 2nd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [1, 3] });
    });
    it("should return the 3rd iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [2, 1] });
    });
    it("should return the 4th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [2, 3] });
    });
    it("should return the 5th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [3, 1] });
    });
    it("should return the 6th iteration", function () {
      expect(iterator.next()).to.eql({ done: false, value: [3, 2] });
    });
    it("should return the undefined iteration", function () {
      expect(iterator.next()).to.eql({ done: true, value: undefined });
    });
  });

  // describe('combinations', function () {
  //   const iterator = combinations([1, 2, 3], 2);
  //   it("should return the 1st iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [2, 1] });
  //   });
  //   it("should return the 2nd iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [1, 3] });
  //   });
  //   it("should return the 3rd iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [2, 1] });
  //   });
  //   it("should return the 4th iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [2, 3] });
  //   });
  //   it("should return the 5th iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [3, 1] });
  //   });
  //   it("should return the 6th iteration", function () {
  //     expect(iterator.next()).to.eql({ done: false, value: [3, 2] });
  //   });
  //   it("should return the undefined iteration", function () {
  //     expect(iterator.next()).to.eql({ done: true, value: undefined });
  //   });
  // });
});
