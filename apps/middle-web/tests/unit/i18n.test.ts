import { describe, expect, it } from "vitest";
import { dictionary, localizedPath } from "../../src/lib/i18n/index.js";

/** Flattens a nested dictionary object to a sorted list of dotted key paths. */
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj)) return [prefix];
  if (obj && typeof obj === "object") {
    return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
      keyPaths(value, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [prefix];
}

describe("i18n dictionary", () => {
  it("every string value is non-empty (EN-only, 2026-07-15: the ecology stack dropped German)", () => {
    const paths = keyPaths(dictionary.en);
    for (const path of paths) {
      const value = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], dictionary.en);
      if (typeof value === "string") {
        expect(value.trim().length, `en.${path} should not be empty`).toBeGreaterThan(0);
      }
    }
  });
});

describe("localizedPath", () => {
  it("is the identity function on paths (EN-only, no more /de prefix)", () => {
    expect(localizedPath("en", "/encounters/x")).toBe("/encounters/x");
    expect(localizedPath("en", "encounters/x")).toBe("/encounters/x");
  });
});
