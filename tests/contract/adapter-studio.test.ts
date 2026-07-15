/**
 * Studio (studio / Ensemble) adapter-specific tests, against the current HEAD.
 */

import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildStudioBundle } from "../../packages/adapters/src/index.js";
import type { AdapterBundleParts } from "../../packages/adapters/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_PATH = path.resolve(currentDir, "../../../studio");
const GENERATED_AT = "2026-07-14T00:00:00Z";

let bundle: AdapterBundleParts;

beforeAll(() => {
  bundle = buildStudioBundle(REPO_PATH, "HEAD", GENERATED_AT);
});

describe("studio: works/ gate is the location itself", () => {
  it("imports native-speaker with its verbatim medium string", () => {
    const ref = bundle.objects.find((o) => o.local_object_id === "2026-07-13-native-speaker");
    expect(ref).toBeDefined();
    expect(ref!.local_object_type).toBe(
      "Interactive terminal — border gate (self-contained HTML, deterministic in-browser meter)"
    );
    expect(ref!.lifecycle_status).toBe("published (works/)");
  });
});

describe("studio: projects/ stays excluded and is never guessed into a stub from prose", () => {
  it("excludes projects/ as a local practice boundary", () => {
    const excl = bundle.exclusions.find((e) => e.path === "projects");
    expect(excl).toBeDefined();
    expect(excl!.kind).toBe("local practice boundary");
  });

  it("records why 'diminishing-returns' (killed session 5) was not stubbed as reference_only", () => {
    const record = bundle.importRecords.find((r) => r.path === "projects/diminishing-returns");
    expect(record).toBeDefined();
    expect(record!.reason).toMatch(/structured works\[\] array/);
  });

  it("no object ref for diminishing-returns exists", () => {
    const ref = bundle.objects.find((o) => o.local_object_id.includes("diminishing-returns"));
    expect(ref).toBeUndefined();
  });
});

describe("studio: memory/ and WORKBOARD.md excluded", () => {
  it("excludes memory and WORKBOARD.md", () => {
    const paths = bundle.exclusions.map((e) => e.path);
    expect(paths).toContain("memory");
    expect(paths).toContain("WORKBOARD.md");
  });
});

describe("studio: chronicle.json → events", () => {
  it("emits 14 chronicle.entry events at this commit, verdict values verbatim (incl. 'graduated', 'discarded')", () => {
    expect(bundle.events.length).toBe(14);
    const verdicts = new Set(bundle.events.map((e) => (e.payload as { verdict: string | null }).verdict));
    expect(verdicts.has("graduated")).toBe(true);
    expect(verdicts.has("discarded")).toBe(true);
  });
});

describe("studio: manifest omits public_url rather than inferring it", () => {
  it("has no public_url field and records why", () => {
    expect(bundle.manifest.public_url).toBeUndefined();
    const record = bundle.importRecords.find((r) => r.path === "README.md" && r.reason.includes("conditional/future-tense"));
    expect(record).toBeDefined();
  });
});
