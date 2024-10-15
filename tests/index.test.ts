import { ObjectId } from "mongodb";
import * as resolver from "../src";
describe("mongo-query-resolver-js", () => {
  test("mix", () => {
    expect(resolver.query(["name==tuan", "age>18", "age<30"])).toEqual({
      name: "tuan",
      age: {
        $gt: 18,
        $lt: 30,
      },
    });
  });

  test("eq", () => {
    expect(resolver.query(["name==tuan"])).toEqual({
      name: "tuan",
    });
  });

  test("ne", () => {
    expect(resolver.query(["name!=tuan"])).toEqual({
      name: { $ne: "tuan" },
    });
  });

  test("gt", () => {
    expect(resolver.query(["age>18"])).toEqual({
      age: { $gt: 18 },
    });
  });

  test("lt", () => {
    expect(resolver.query(["age<18"])).toEqual({
      age: { $lt: 18 },
    });
  });

  test("gte", () => {
    expect(resolver.query(["age>=18"])).toEqual({
      age: { $gte: 18 },
    });
  });

  test("lte", () => {
    expect(resolver.query(["age<=18"])).toEqual({
      age: { $lte: 18 },
    });
  });

  test("regex", () => {
    expect(resolver.query(["name*=t"])).toEqual({
      name: { $regex: new RegExp("t", "i") },
    });
  });

  test("auto number", () => {
    expect(resolver.valueResolver("1234")).toEqual(1234);
  });

  test("auto object id", () => {
    const id = new ObjectId();
    expect(resolver.valueResolver(id.toHexString())).toEqual(id);
  });
});
