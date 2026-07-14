import { describe, it, expect } from "vitest";
import { canonicalJson, CanonicalJsonError } from "../../packages/protocol/src/index.js";

describe("canonicalJson", () => {
  it("sorts object keys in code-unit order", () => {
    expect(canonicalJson({ b: 1, a: 2, ab: 3, Z: 4 })).toBe('{"Z":4,"a":2,"ab":3,"b":1}');
  });

  it("is independent of the input key order (determinism)", () => {
    const first = canonicalJson({ z: 1, a: { d: 4, c: 3 }, m: [3, 1, 2] });
    const second = canonicalJson({ m: [3, 1, 2], a: { c: 3, d: 4 }, z: 1 });
    expect(first).toBe(second);
  });

  it("keeps array element order as given (arrays are not sorted)", () => {
    expect(canonicalJson([3, 1, 2])).toBe("[3,1,2]");
  });

  it("produces no insignificant whitespace", () => {
    const json = canonicalJson({ a: 1, b: [1, 2] });
    expect(json).not.toMatch(/[\n\t ]/);
  });

  it("serialises nested structures recursively", () => {
    expect(canonicalJson({ b: { d: 1, c: 2 }, a: [{ y: 1, x: 2 }] })).toBe(
      '{"a":[{"x":2,"y":1}],"b":{"c":2,"d":1}}'
    );
  });

  it("serialises strings, booleans and null via JSON.stringify defaults", () => {
    expect(canonicalJson({ s: "hi\"there", t: true, f: false, n: null })).toBe(
      '{"f":false,"n":null,"s":"hi\\"there","t":true}'
    );
  });

  it("rejects undefined at the top level", () => {
    expect(() => canonicalJson(undefined)).toThrow(CanonicalJsonError);
  });

  it("rejects undefined nested inside an object", () => {
    expect(() => canonicalJson({ a: undefined })).toThrow(CanonicalJsonError);
  });

  it("rejects undefined nested inside an array", () => {
    expect(() => canonicalJson([1, undefined, 3])).toThrow(CanonicalJsonError);
  });

  it("rejects NaN", () => {
    expect(() => canonicalJson({ a: Number.NaN })).toThrow(CanonicalJsonError);
  });

  it("rejects Infinity and -Infinity", () => {
    expect(() => canonicalJson({ a: Number.POSITIVE_INFINITY })).toThrow(CanonicalJsonError);
    expect(() => canonicalJson({ a: Number.NEGATIVE_INFINITY })).toThrow(CanonicalJsonError);
  });

  it("rejects functions", () => {
    expect(() => canonicalJson({ a: () => 1 })).toThrow(CanonicalJsonError);
  });
});
