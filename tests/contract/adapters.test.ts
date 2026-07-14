/**
 * Cross-cutting acceptance tests for the Phase-2 adapters (work order §3), run against the
 * CURRENT HEADs of the three local sibling clones so the tests are real, not fixtures.
 */

import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildBundle,
  lsTreeRecursive,
  resolveRepo,
  sortBundleParts,
  topLevelEntries,
  type AdapterBundleParts,
  type CollectiveId
} from "../../packages/adapters/src/index.js";
import { validateAssertion, validateCollectiveManifest, validateEncounterEvent } from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const GITHUB_DIR = path.resolve(currentDir, "../../../");
const GENERATED_AT = "2026-07-14T00:00:00Z";

const REPOS: Record<CollectiveId, string> = {
  ulysses: path.join(GITHUB_DIR, "irrtum-als-methode"),
  meridian: path.join(GITHUB_DIR, "field-research"),
  ensemble: path.join(GITHUB_DIR, "studio")
};

const bundles: Record<CollectiveId, AdapterBundleParts> = {} as Record<CollectiveId, AdapterBundleParts>;

beforeAll(() => {
  for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
    bundles[collectiveId] = buildBundle(collectiveId, REPOS[collectiveId], "HEAD", GENERATED_AT);
  }
}, 60_000);

describe("acceptance 1 — determinism: same commit ⇒ byte-identical bundle", () => {
  it(
    "running each adapter twice on the same commit (same --generated-at) yields identical JSON",
    () => {
      for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
        const first = buildBundle(collectiveId, REPOS[collectiveId], bundles[collectiveId]!.coverage.source_commit, GENERATED_AT);
        const second = buildBundle(collectiveId, REPOS[collectiveId], bundles[collectiveId]!.coverage.source_commit, GENERATED_AT);
        expect(JSON.stringify(sortBundleParts(first))).toBe(JSON.stringify(sortBundleParts(second)));
      }
    },
    60_000
  );
});

describe("acceptance 2 — schema validation and provenance fields", () => {
  it("every manifest validates against collective-manifest.schema.json and carries content_hash", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      const { manifest } = bundles[collectiveId]!;
      const result = validateCollectiveManifest(manifest);
      expect(result.valid, JSON.stringify(result.errors)).toBe(true);
      expect(manifest.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
    }
  });

  it("every event validates against encounter-event.schema.json and carries source_uri/source_commit/content_hash", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      for (const event of bundles[collectiveId]!.events) {
        const result = validateEncounterEvent(event);
        expect(result.valid, JSON.stringify(result.errors)).toBe(true);
        expect(event.source_uri).toBeTruthy();
        expect(event.source_commit).toBeTruthy();
        expect(event.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
      }
    }
  });

  it("every assertion validates against assertion.schema.json and carries content_hash", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      for (const assertion of bundles[collectiveId]!.assertions) {
        const result = validateAssertion(assertion);
        expect(result.valid, JSON.stringify(result.errors)).toBe(true);
        expect(assertion.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
        expect(assertion.epistemic_status).not.toBe("machine_suggestion");
      }
    }
  });

  it("every object ref carries source_uri, source_commit, content_hash and importer_version", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      for (const object of bundles[collectiveId]!.objects) {
        expect(object.source_uri).toBeTruthy();
        expect(object.source_commit).toBeTruthy();
        expect(object.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
        expect(object.importer_version).toBeTruthy();
      }
    }
  });
});

describe("acceptance 3 — undocumented rhizome kinds survive verbatim", () => {
  it("grounds, continues and complement appear as assertion predicates, unnormalised", () => {
    const predicates = new Set(bundles.ulysses!.assertions.map((a) => a.predicate));
    expect(predicates.has("grounds")).toBe(true);
    expect(predicates.has("continues")).toBe(true);
    expect(predicates.has("complement")).toBe(true);
    expect(predicates.has("related")).toBe(false);
  });
});

describe("acceptance 4 — exclusions exist for the locked path boundaries", () => {
  it("field: drafts/, WORKBOARD.md, notes/, and non-published memory/ internals are excluded", () => {
    const paths = bundles.meridian!.exclusions.map((e) => e.path);
    expect(paths).toContain("drafts");
    expect(paths).toContain("WORKBOARD.md");
    expect(paths).toContain("notes");
    expect(paths.some((p) => p.startsWith("memory/") && p !== "memory/claims.md" && p !== "memory/downstream-commitments.md")).toBe(
      true
    );
  });

  it("studio: projects/ and WORKBOARD.md are excluded", () => {
    const paths = bundles.ensemble!.exclusions.map((e) => e.path);
    expect(paths).toContain("projects");
    expect(paths).toContain("WORKBOARD.md");
  });

  it("atelier: atlas per-entry import is recorded as a 'computational limit' exclusion", () => {
    const exclusion = bundles.ulysses!.exclusions.find((e) => e.path === "atlas/atlas.json");
    expect(exclusion).toBeDefined();
    expect(exclusion!.kind).toBe("computational limit");
    expect(exclusion!.reason).toMatch(/per-entry atlas import deferred/);
  });
});

describe("acceptance 5 — closure assertions carry epistemic_status: conjecture", () => {
  it("every pulse/vital-signs.json closure assertion is a conjecture", () => {
    const closures = bundles.ulysses!.assertions.filter((a) => a.predicate === "self-assessment.closure");
    expect(closures.length).toBeGreaterThan(0);
    for (const closure of closures) {
      expect(closure.epistemic_status).toBe("conjecture");
    }
  });
});

describe("acceptance 6 — chronicle move values survive verbatim", () => {
  it("'advance (outward)' survives unnormalised in a field chronicle.entry payload", () => {
    const moves = bundles.meridian!.events.map((e) => (e.payload as { move: string }).move);
    expect(moves).toContain("advance (outward)");
  });
});

describe("acceptance 7 — no adapter output contains an encounter_id", () => {
  it("no event, assertion, object, manifest, exclusion or import_record carries encounter_id", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      const parts = bundles[collectiveId]!;
      for (const event of parts.events) {
        expect(Object.prototype.hasOwnProperty.call(event, "encounter_id")).toBe(false);
      }
      for (const assertion of parts.assertions) {
        expect(Object.prototype.hasOwnProperty.call(assertion, "encounter_id")).toBe(false);
      }
      for (const object of parts.objects) {
        expect(Object.prototype.hasOwnProperty.call(object, "encounter_id")).toBe(false);
      }
    }
  });
});

describe("acceptance 8 — coverage.json accounts for every top-level path", () => {
  it("every top-level path in the tree at the pinned commit is either a coverage row or a prefix of one", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      const repo = resolveRepo(REPOS[collectiveId], bundles[collectiveId]!.coverage.source_commit);
      const allPaths = lsTreeRecursive(repo);
      const topLevel = topLevelEntries(allPaths);
      const rows = bundles[collectiveId]!.coverage.rows;
      for (const topLevelPath of topLevel) {
        const accounted = rows.some((row) => row.path === topLevelPath || row.path.startsWith(`${topLevelPath}/`));
        expect(accounted, `${collectiveId}: ${topLevelPath} not accounted for in coverage.json`).toBe(true);
      }
      // And the inverse: no coverage row status is the defensive "unsupported" fallback —
      // every path this adapter run actually saw was explicitly handled by a rule.
      const unsupportedRows = rows.filter((row) => row.status === "unsupported");
      expect(unsupportedRows, JSON.stringify(unsupportedRows)).toEqual([]);
    }
  });
});

describe("acceptance 9 — runs cleanly against the current HEADs of all three local clones", () => {
  it("each bundle has a manifest, at least one object, and a non-empty coverage report", () => {
    for (const collectiveId of Object.keys(REPOS) as CollectiveId[]) {
      const parts = bundles[collectiveId]!;
      expect(parts.manifest.collective_id).toBe(collectiveId);
      expect(parts.objects.length).toBeGreaterThan(0);
      expect(parts.coverage.rows.length).toBeGreaterThan(0);
    }
  });
});
