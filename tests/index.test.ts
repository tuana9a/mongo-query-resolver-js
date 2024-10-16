import { resolveQuery } from "../src";

describe("mongo-query-resolver-js", () => {
  test("mix", () => {
    expect(resolveQuery("name==tuan,age>18,age<30")).toEqual({
      name: "tuan",
      age: {
        $gt: 18,
        $lt: 30,
      },
    });
  });

  test("eq", () => {
    expect(resolveQuery("name==tuan")).toEqual({
      name: "tuan",
    });
  });

  test("ne", () => {
    expect(resolveQuery("name!=tuan")).toEqual({
      name: { $ne: "tuan" },
    });
  });

  test("gt", () => {
    expect(resolveQuery("age>18")).toEqual({
      age: { $gt: 18 },
    });
  });

  test("lt", () => {
    expect(resolveQuery("age<18")).toEqual({
      age: { $lt: 18 },
    });
  });

  test("gte", () => {
    expect(resolveQuery("age>=18")).toEqual({
      age: { $gte: 18 },
    });
  });

  test("lte", () => {
    expect(resolveQuery("age<=18")).toEqual({
      age: { $lte: 18 },
    });
  });

  test("regex", () => {
    expect(resolveQuery("name*=t")).toEqual({
      name: { $regex: new RegExp("t", "i") },
    });
  });
});
