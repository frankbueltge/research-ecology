/**
 * Atelier (irrtum-als-methode / Ulysses) adapter-specific tests, against the current HEAD.
 */

import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAtelierBundle } from "../../packages/adapters/src/index.js";
import type { AdapterBundleParts } from "../../packages/adapters/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_PATH = path.resolve(currentDir, "../../../irrtum-als-methode");
const GENERATED_AT = "2026-07-14T00:00:00Z";

let bundle: AdapterBundleParts;

beforeAll(() => {
  bundle = buildAtelierBundle(REPO_PATH, "HEAD", GENERATED_AT);
});

describe("atelier: works/ directories missing a 'medium' field fall back honestly", () => {
  it("2026-07-03-generation-loss, 2026-07-04-attractor, 2026-07-05-call-without-response fall back to 'work'", () => {
    const slugs = ["2026-07-03-generation-loss", "2026-07-04-attractor", "2026-07-05-call-without-response"];
    for (const slug of slugs) {
      const ref = bundle.objects.find((o) => o.local_object_id === slug);
      expect(ref, `missing object ref for ${slug}`).toBeDefined();
      expect(ref!.local_object_type).toBe("work");
      const record = bundle.importRecords.find((r) => r.path === `works/${slug}/meta.json`);
      expect(record, `missing import_record for ${slug}`).toBeDefined();
    }
  });

  it("does not fabricate an import_record for works/ directories that do carry a medium", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "2026-07-01-oscillogram");
    expect(ref!.local_object_type).toBe("Astro/SSG · seeded canvas line-chart animation, deterministic replay on click, no external data");
    const record = bundle.importRecords.find((r) => r.path === "works/2026-07-01-oscillogram/meta.json");
    expect(record).toBeUndefined();
  });
});

describe("atelier: bare markdown files directly under works/ get an honest, distinct type", () => {
  it("genealogie.md is not routed through the missing-medium fallback", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "genealogie");
    expect(ref).toBeDefined();
    expect(ref!.local_object_type).toMatch(/^work-note/);
    const spuriousRecord = bundle.importRecords.find((r) => r.path === "works/genealogie.md");
    expect(spuriousRecord).toBeUndefined();
  });

  it("all 21 fehlerkataster entries import as one object ref each", () => {
    const refs = bundle.objects.filter((o) => /^fehlerkataster-\d{3}$/.test(o.local_object_id));
    expect(refs.length).toBe(21);
  });
});

describe("atelier: rhizome node → work reference resolution never guesses", () => {
  it("flags the one 'work'-kind rhizome node whose id does not match any works/ path", () => {
    const record = bundle.importRecords.find(
      (r) => r.kind === "ambiguous" && r.reason.includes("w-2026-07-14-position-epistemic-thing")
    );
    expect(record, JSON.stringify(bundle.importRecords, null, 2)).toBeDefined();
  });

  it("resolves a normally-matching work node to a real object_ref pointer, not a literal", () => {
    const edge = bundle.assertions.find(
      (a) => a.predicate === "elaborates" && JSON.stringify(a.object).includes("named-the-glitch")
    );
    expect(edge).toBeDefined();
    expect((edge!.object as { local_object_ref_id?: string }).local_object_ref_id).toMatch(/^ulysses:2026-07-07-named-the-glitch@/);
  });
});

describe("atelier: pulse/vital-signs.json closures", () => {
  it("produces exactly one assertion per history entry (3 at this commit)", () => {
    const closures = bundle.assertions.filter((a) => a.predicate === "self-assessment.closure");
    expect(closures.length).toBe(3);
  });

  it("local_epistemic_status is the closure_note's own first word, verbatim", () => {
    const s28 = bundle.assertions.find((a) => a.assertion_id.endsWith(":closure-session-28@" + bundle.coverage.source_commit_short));
    expect(s28).toBeDefined();
    expect(s28!.local_epistemic_status).toBe("CONJECTURE.");
  });
});

describe("atelier: no events are fabricated (no chronicle.json in this repo)", () => {
  it("events.json is empty", () => {
    expect(bundle.events).toEqual([]);
  });
});
