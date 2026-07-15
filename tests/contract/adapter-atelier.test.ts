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

describe("atelier: work title_cache is populated verbatim from meta.json (phase-c1 §1 finding)", () => {
  it("every work referenced by a rhizome 'elaborates'/'bridge'/'complement'/'grounds' edge carries its own title", () => {
    const expected: Record<string, string> = {
      "2026-07-13-generative-unknowing": "Generative Unknowing",
      "2026-07-07-named-the-glitch": "Named, the Glitch Is No More",
      "2026-07-14-differential-reproduction": "Differential Reproduction",
      "2026-07-14-negative-knowledge": "Negative Knowledge",
      "2026-07-03-generation-loss": "Generation Loss",
      "2026-07-11-the-closing-loop": "The Closing Loop",
      "2026-07-12-low-background": "Low-Background"
    };
    for (const [slug, title] of Object.entries(expected)) {
      const ref = bundle.objects.find((o) => o.local_object_id === slug);
      expect(ref, `missing object ref for ${slug}`).toBeDefined();
      expect(ref!.title_cache).toBe(title);
    }
  });

  it("does not fabricate a title_cache for a work directory whose meta.json genuinely lacks one (none observed at this commit — every meta.json has a title)", () => {
    const withoutTitle = bundle.objects.filter(
      (o) => o.local_object_type !== "work-note" && o.local_object_type !== "session-journal" && !o.title_cache
    );
    // Doc refs (protocol/readme/requests/site-api/license/atlas) legitimately have no title_cache
    // (buildDocObjectRef never sets one) — only work-directory refs are asserted here.
    const workDirRefs = withoutTitle.filter((o) => o.lifecycle_status === "published (works/)");
    expect(workDirRefs).toEqual([]);
  });
});

describe("atelier: rhizome edge 'session' carries verbatim from pulse/rhizome.json (phase-c1 §1 finding)", () => {
  it("all 19 edges import; session present only where the source edge has one", () => {
    const edges = bundle.assertions.filter((a) => a.assertion_id.includes(":rhizome-edge-"));
    expect(edges.length).toBe(19);
    const withSession = edges.filter((a) => typeof (a as { session?: unknown }).session === "number");
    const withoutSession = edges.filter((a) => (a as { session?: unknown }).session === undefined);
    // 14 sourced edges carry a session (26/27/28); the 5 "elaborates" edges carry none.
    expect(withSession.length).toBe(14);
    expect(withoutSession.length).toBe(5);
    for (const edge of withoutSession) {
      expect(edge.predicate).toBe("elaborates");
    }
  });

  it("session-27 grounds edge (Gerstgrasser → Differential Reproduction) carries session 27, not fabricated as null", () => {
    const edge = bundle.assertions.find((a) => a.predicate === "grounds");
    expect(edge).toBeDefined();
    expect((edge as { session?: unknown }).session).toBe(27);
  });
});
