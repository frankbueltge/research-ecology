/**
 * Field (field-research / Meridian) adapter-specific tests, against the current HEAD.
 */

import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFieldBundle } from "../../packages/adapters/src/index.js";
import type { AdapterBundleParts } from "../../packages/adapters/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_PATH = path.resolve(currentDir, "../../../field-research");
const GENERATED_AT = "2026-07-14T00:00:00Z";

let bundle: AdapterBundleParts;

beforeAll(() => {
  bundle = buildFieldBundle(REPO_PATH, "HEAD", GENERATED_AT);
});

describe("field: chronicle.json → events, one per entry, verbatim payload", () => {
  it("emits one chronicle.entry event per chronicle.json entry", () => {
    expect(bundle.events.length).toBeGreaterThan(0);
    expect(bundle.events.every((e) => e.event_type === "chronicle.entry")).toBe(true);
  });

  it("preserves a genuine source quirk verbatim: verdict 'null' the STRING vs null the JSON value", () => {
    const stringNullEvent = bundle.events.find((e) => (e.payload as { collective_session: number }).collective_session === 35);
    const jsonNullEvent = bundle.events.find((e) => (e.payload as { collective_session: number }).collective_session === 26);
    expect(stringNullEvent).toBeDefined();
    expect(jsonNullEvent).toBeDefined();
    expect((stringNullEvent!.payload as { verdict: unknown }).verdict).toBe("null");
    expect((jsonNullEvent!.payload as { verdict: unknown }).verdict).toBeNull();
  });

  it("uses midnight UTC for occurred_at and records the precision loss once", () => {
    for (const event of bundle.events) {
      expect(event.occurred_at).toMatch(/T00:00:00Z$/);
    }
    const record = bundle.importRecords.find((r) => r.path === "chronicle.json");
    expect(record).toBeDefined();
    expect(record!.reason).toMatch(/date only/);
  });
});

describe("field: published memory/ files are imported, the rest excluded", () => {
  it("memory/claims.md imports as a claims-ledger object ref", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "claims-ledger");
    expect(ref).toBeDefined();
    expect(ref!.local_object_type).toBe("claims-ledger");
  });

  it("memory/downstream-commitments.md imports as a downstream-contract object ref", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "downstream-commitments-doc");
    expect(ref).toBeDefined();
    expect(ref!.local_object_type).toBe("downstream-contract");
  });

  it("memory/discarded.md, memory/open-questions.md and memory/dossiers are excluded", () => {
    const paths = bundle.exclusions.map((e) => e.path);
    expect(paths).toContain("memory/discarded.md");
    expect(paths).toContain("memory/open-questions.md");
    expect(paths).toContain("memory/dossiers");
    for (const path of ["memory/discarded.md", "memory/open-questions.md", "memory/dossiers"]) {
      const excl = bundle.exclusions.find((e) => e.path === path);
      expect(excl!.kind).toBe("local practice boundary");
    }
  });
});

describe("field: journal session numbers all parse cleanly at this commit", () => {
  it("no journal-parsing import_record at the current HEAD", () => {
    const failures = bundle.importRecords.filter((r) => r.path.startsWith("journal/"));
    expect(failures).toEqual([]);
  });

  it("field-research/journal/2026-07-11.md resolves to session 24, not the body annotation's 25", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "2026-07-11");
    expect(ref).toBeDefined();
    expect((ref!.source_metadata as { sessions: number[] }).sessions).toEqual([24]);
  });
});

describe("field: works/ medium strings survive verbatim", () => {
  it("split-seal's long, punctuation-heavy medium string is untouched", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "2026-07-11-split-seal");
    expect(ref).toBeDefined();
    expect(ref!.local_object_type).toMatch(/^Astro \/ dual-seal specimen register/);
  });
});
