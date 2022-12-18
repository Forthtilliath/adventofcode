import { assert } from "chai";
import { replaceAt } from "./index.js";
describe("String", function () {
    describe("replaceAt", function () {
        it("should return 'He!!o World'", function () {
            const str = replaceAt("Hello World", 2, "!!");
            assert.strictEqual(str, "He!!o World");
        });
        it("should return '****'", function () {
            const str = replaceAt("", 2, "****");
            assert.strictEqual(str, "****");
        });
    });
});
