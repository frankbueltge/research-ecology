import { describe, expect, it } from "vitest";
import { objectHref, parseObjectRefId } from "../../src/lib/object-ref.js";

describe("parseObjectRefId", () => {
  it("parses the <collective>:<local>@<sha> convention (packages/adapters)", () => {
    expect(parseObjectRefId("meridian:instrument-001@ae89e09")).toEqual({
      collectiveId: "meridian",
      localObjectId: "instrument-001",
      shortSha: "ae89e09"
    });
  });

  it("preserves colons inside the local id (e.g. a future namespaced id)", () => {
    expect(parseObjectRefId("meridian:claims-row-12@ae89e09")).toEqual({
      collectiveId: "meridian",
      localObjectId: "claims-row-12",
      shortSha: "ae89e09"
    });
  });
});

describe("objectHref", () => {
  it("builds a locale-prefixed /objects/[collective]/[localId] link", () => {
    expect(objectHref("ensemble:native-speaker@f6a9d8f", "")).toBe("/objects/ensemble/native-speaker");
    expect(objectHref("ensemble:native-speaker@f6a9d8f", "/de")).toBe("/de/objects/ensemble/native-speaker");
  });
});
