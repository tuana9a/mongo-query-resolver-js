import { ObjectId } from "mongodb";
import { resolveValue } from "../src";

describe("resolveValue", () => {
    test("resolve number", () => {
        expect(resolveValue("1234")).toEqual(1234);
    });

    test("resolve string", () => {
        expect(resolveValue("1234abc")).toEqual("1234abc");
    });

    test("resolve ObjectId", () => {
        const id = new ObjectId();
        expect(resolveValue(id.toHexString())).toEqual(id);
    });
});
