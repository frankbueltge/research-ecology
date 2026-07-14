import { describe, expect, it } from "vitest";
import { dictionary, localizedPath, stripLocalePrefix } from "../../src/lib/i18n/index.js";

/** Flattens a nested dictionary object to a sorted list of dotted key paths, so `en`/`de` can
 * be compared structurally — a missing German string is a silent chrome regression otherwise
 * (falls back to `undefined` rendering as nothing, easy to miss visually). */
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
  it("has an identical key shape for en and de (work order: chrome dictionary, no missing translations)", () => {
    const enKeys = keyPaths(dictionary.en).sort();
    const deKeys = keyPaths(dictionary.de).sort();
    expect(deKeys).toEqual(enKeys);
  });

  it("every string value is non-empty in both locales", () => {
    for (const locale of ["en", "de"] as const) {
      const paths = keyPaths(dictionary[locale]);
      for (const path of paths) {
        const value = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], dictionary[locale]);
        if (typeof value === "string") {
          expect(value.trim().length, `${locale}.${path} should not be empty`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("German strings are not machine-literal copies of the English ones (spot check)", () => {
    // A very cheap but real signal: none of these should be byte-identical to English, since
    // German word order/vocabulary differs even for short chrome labels.
    expect(dictionary.de.nav.encounter).not.toBe(dictionary.en.nav.encounter);
    expect(dictionary.de.nav.apparatus).not.toBe(dictionary.en.nav.apparatus);
    expect(dictionary.de.common.noSharedResolution).not.toBe(dictionary.en.common.noSharedResolution);
    expect(dictionary.de.common.noSharedResolution).toContain("Keine gemeinsame Auflösung");
    expect(dictionary.de.encounter.nonParticipationHeading).not.toBe(dictionary.en.encounter.nonParticipationHeading);
  });

  it("German chrome avoids informal 'du' address (work order: neutral register)", () => {
    const paths = keyPaths(dictionary.de);
    for (const path of paths) {
      const value = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], dictionary.de);
      if (typeof value === "string") {
        expect(/\bdu\b|\bdein/i.test(value), `${path}: "${value}" should not address the visitor informally`).toBe(false);
      }
    }
  });
});

describe("localizedPath / stripLocalePrefix", () => {
  it("prefixes /de for the German locale and leaves English bare", () => {
    expect(localizedPath("en", "/encounters/x")).toBe("/encounters/x");
    expect(localizedPath("de", "/encounters/x")).toBe("/de/encounters/x");
    expect(localizedPath("de", "encounters/x")).toBe("/de/encounters/x");
  });

  it("round-trips: stripLocalePrefix undoes localizedPath('de', ...)", () => {
    const path = "/encounters/enc-2026-001-calibration-gap-travels/compare";
    expect(stripLocalePrefix(localizedPath("de", path))).toBe(path);
  });

  it("stripLocalePrefix leaves non-/de paths untouched", () => {
    expect(stripLocalePrefix("/encounters/x")).toBe("/encounters/x");
    expect(stripLocalePrefix("/de")).toBe("/");
  });
});
