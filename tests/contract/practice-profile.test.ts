/**
 * Practice-profile contract tests (work order phase-b-profiles.md §6, items 1-3): the sentinel
 * ("The Middle cannot publish a profile") throws at BOTH the loader and the store; a profile
 * with `non_exclusive !== true` is rejected by schema+validator; profile versions are
 * append-only (idempotent put, never overwritten).
 */

import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EditorialProfileAuthorViolation,
  hydrateMemoryStoreFromRepo,
  loadProfilesFromDir,
  MemoryStore,
  type StoredPracticeProfileVersion
} from "../../packages/domain/src/index.js";
import { validatePracticeProfile } from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(currentDir, "../../");
const PROFILES_DIR = path.join(REPO_ROOT, "fixtures/practice-profiles");

function validProfile(overrides?: Partial<StoredPracticeProfileVersion>): StoredPracticeProfileVersion {
  return {
    collective_id: "meridian",
    version: 1,
    public_name: "Meridian",
    self_description: "test",
    orientation: "scientific research practice.",
    primary_commitment: "evidence.",
    accountability_questions: ["What justifies this claim?"],
    typical_operations: ["propose"],
    admissible_outputs: ["a work"],
    characteristic_risks: ["fabrication"],
    non_exclusive: true,
    protocol_ref: "https://example.invalid/PROTOCOL.md",
    authored_by: "meridian",
    status: "draft",
    effective_from: "2026-07-15T00:00:00Z",
    provenance: { orientation: { spec_ref: "docs/spec-v2.1/... §3" } },
    ...overrides
  };
}

// ------------------------------------------------------------------------------------------
// 1. "The Middle cannot publish a profile" — sentinel throws at loader AND store.
// ------------------------------------------------------------------------------------------
describe("practice-profile contract 1 — The Middle cannot publish a profile", () => {
  it("the loader rejects (as a rejected/ignored record, never written) a profile authored_by an editorial actor", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "poisoned-profile-loader-"));
    const poisoned = validProfile({ authored_by: "the-middle-editor" });
    writeFileSync(path.join(dir, "poisoned.json"), JSON.stringify(poisoned), "utf8");

    const store = new MemoryStore();
    const summary = await loadProfilesFromDir(store, dir);

    expect(summary.loaded).toEqual([]);
    expect(summary.rejected.length).toBe(1);
    expect(summary.rejected[0]).toMatch(/ADR 0011/);
    expect(await store.getApplicableProfile("meridian")).toBeUndefined();
  });

  it("the loader also rejects the other editorial actor id, the-middle-importer", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "poisoned-profile-loader-2-"));
    const poisoned = validProfile({ authored_by: "the-middle-importer" });
    writeFileSync(path.join(dir, "poisoned.json"), JSON.stringify(poisoned), "utf8");

    const store = new MemoryStore();
    const summary = await loadProfilesFromDir(store, dir);
    expect(summary.loaded).toEqual([]);
    expect(summary.rejected.length).toBe(1);
  });

  it("the store's putPracticeProfileVersion throws even when the loader is bypassed entirely", async () => {
    const store = new MemoryStore();
    const poisoned = validProfile({ authored_by: "the-middle-editor" });
    await expect(store.putPracticeProfileVersion(poisoned)).rejects.toThrow(EditorialProfileAuthorViolation);
    await expect(store.putPracticeProfileVersion(poisoned)).rejects.toThrow(/ADR 0011/);
    expect(await store.getApplicableProfile("meridian")).toBeUndefined();
  });

  it("a profile authored by the practice's own actor succeeds at both the loader and the store", async () => {
    const store = new MemoryStore();
    const summary = await loadProfilesFromDir(store, PROFILES_DIR);
    expect(summary.rejected).toEqual([]);
    expect(summary.loaded.sort()).toEqual(["data-snack-plenum@1", "datavism@1", "ensemble@2", "frank@1", "meridian@2", "ulysses@2"]);
    for (const collectiveId of ["meridian", "ulysses", "ensemble", "frank", "data-snack-plenum", "datavism"]) {
      const applicable = await store.getApplicableProfile(collectiveId);
      expect(applicable?.collective_id).toBe(collectiveId);
    }
  });
});

// ------------------------------------------------------------------------------------------
// 2. non_exclusive !== true is rejected (schema + validator).
// ------------------------------------------------------------------------------------------
describe("practice-profile contract 2 — non_exclusive !== true is rejected", () => {
  it("validatePracticeProfile rejects non_exclusive: false", () => {
    const bad = { ...validProfile(), non_exclusive: false };
    const result = validatePracticeProfile(bad);
    expect(result.valid).toBe(false);
  });

  it("validatePracticeProfile rejects a missing non_exclusive field entirely", () => {
    const { non_exclusive, ...rest } = validProfile();
    const result = validatePracticeProfile(rest);
    expect(result.valid).toBe(false);
  });

  it("validatePracticeProfile accepts non_exclusive: true", () => {
    const result = validatePracticeProfile(validProfile());
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });

  it("validatePracticeProfile rejects an empty accountability_questions array", () => {
    const bad = validProfile({ accountability_questions: [] });
    const result = validatePracticeProfile(bad);
    expect(result.valid).toBe(false);
  });
});

// ------------------------------------------------------------------------------------------
// 3. Profile versions are append-only.
// ------------------------------------------------------------------------------------------
describe("practice-profile contract 3 — profile versions are append-only", () => {
  it("putPracticeProfileVersion is idempotent on (collective_id, version): a second put is ignored, never overwrites", async () => {
    const store = new MemoryStore();
    const v1 = validProfile();
    const first = await store.putPracticeProfileVersion(v1);
    expect(first.inserted).toBe(true);

    const mutated = validProfile({ public_name: "MUTATED — should never land" });
    const second = await store.putPracticeProfileVersion(mutated);
    expect(second.inserted).toBe(false);

    const stored = await store.getApplicableProfile("meridian");
    expect(stored?.public_name).toBe("Meridian");
    expect(stored?.public_name).not.toBe("MUTATED — should never land");
  });

  it("a genuinely new version number is accepted as an additional row, not a replacement", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(validProfile({ version: 1, status: "superseded" }));
    await store.putPracticeProfileVersion(validProfile({ version: 2, status: "active" }));

    const versions = await store.listProfileVersions("meridian");
    expect(versions).toHaveLength(2);
    expect(versions.map((v) => v.version)).toEqual([1, 2]);
  });
});

// ------------------------------------------------------------------------------------------
// Sanity: the real fixtures load through the exact same hydration path apps/middle-web uses.
// ------------------------------------------------------------------------------------------
describe("practice-profile fixtures hydrate through hydrateMemoryStoreFromRepo (profilesDir)", () => {
  let store: MemoryStore;

  beforeAll(async () => {
    const result = await hydrateMemoryStoreFromRepo({
      bundlesRootDir: path.join(REPO_ROOT, "import/bundles"),
      fixtureDir: path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels"),
      lensesDir: path.join(REPO_ROOT, "lenses"),
      profilesDir: PROFILES_DIR
    });
    store = result.store;
  });

  it("all practice profiles are retrievable as the applicable profile — drafts until each practice confirms locally (ADR 0011 §2; v1's 2026-07-15 activation covered v1 only)", async () => {
    for (const collectiveId of ["meridian", "ulysses", "ensemble", "frank", "data-snack-plenum", "datavism"]) {
      const profile = await store.getApplicableProfile(collectiveId);
      expect(profile).toBeDefined();
      expect(profile?.status).toBe("draft");
      expect(profile?.non_exclusive).toBe(true);
    }
  });

  it("omitting profilesDir (every pre-existing call site) loads zero profile versions, unchanged behaviour", async () => {
    const result = await hydrateMemoryStoreFromRepo({
      bundlesRootDir: path.join(REPO_ROOT, "import/bundles"),
      fixtureDir: path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels"),
      lensesDir: path.join(REPO_ROOT, "lenses")
    });
    expect(result.summary.profiles).toBeUndefined();
    expect(await result.store.getApplicableProfile("meridian")).toBeUndefined();
  });
});
