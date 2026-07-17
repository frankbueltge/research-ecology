/**
 * Practice-profile unit tests (work order phase-b-profiles.md §6, items 4-5):
 *
 *   4. getApplicableProfile — asOf boundaries, active > draft priority, superseded never wins.
 *   5. Provenance quotes in fixtures/practice-profiles/*.json are hash-verified against the
 *      source repositories — the same pattern as narrative.test.ts's beat-quote verification
 *      (work order phase-3d §4), extended to reach into the pinned engine-repo commits
 *      themselves rather than only this repo's own fixture JSON.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MemoryStore, type StoredPracticeProfileVersion } from "@research-ecology/domain";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../../../");
const PROFILES_DIR = path.join(REPO_ROOT, "fixtures/practice-profiles");

// --------------------------------------------------------------------------------------------
// 4. getApplicableProfile
// --------------------------------------------------------------------------------------------

function profile(overrides: Partial<StoredPracticeProfileVersion>): StoredPracticeProfileVersion {
  return {
    collective_id: "meridian",
    version: 1,
    public_name: "Meridian",
    orientation: "scientific research practice.",
    primary_commitment: "evidence.",
    accountability_questions: ["What justifies this claim?"],
    non_exclusive: true,
    authored_by: "meridian",
    status: "draft",
    effective_from: "2026-01-01T00:00:00Z",
    provenance: {},
    ...overrides
  };
}

describe("getApplicableProfile", () => {
  it("returns undefined when no version exists for the collective", async () => {
    const store = new MemoryStore();
    expect(await store.getApplicableProfile("meridian")).toBeUndefined();
  });

  it("returns undefined when the only version's effective_from is still in the future of asOf", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(profile({ effective_from: "2030-01-01T00:00:00Z" }));
    expect(await store.getApplicableProfile("meridian", "2026-01-01T00:00:00Z")).toBeUndefined();
  });

  it("respects effective_to: a version is not applicable once past its effective_to", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(
      profile({ version: 1, effective_from: "2026-01-01T00:00:00Z", effective_to: "2026-06-01T00:00:00Z" })
    );
    expect(await store.getApplicableProfile("meridian", "2026-07-01T00:00:00Z")).toBeUndefined();
    const stillOpen = await store.getApplicableProfile("meridian", "2026-03-01T00:00:00Z");
    expect(stillOpen?.version).toBe(1);
  });

  it("prefers status active over draft even when the draft version is more recent", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(
      profile({ version: 1, status: "active", effective_from: "2026-01-01T00:00:00Z" })
    );
    await store.putPracticeProfileVersion(
      profile({ version: 2, status: "draft", effective_from: "2026-02-01T00:00:00Z" })
    );
    const applicable = await store.getApplicableProfile("meridian", "2026-07-01T00:00:00Z");
    expect(applicable?.version).toBe(1);
    expect(applicable?.status).toBe("active");
  });

  it("never returns a superseded version, even as the only candidate", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(
      profile({ version: 1, status: "superseded", effective_from: "2026-01-01T00:00:00Z" })
    );
    expect(await store.getApplicableProfile("meridian", "2026-07-01T00:00:00Z")).toBeUndefined();
  });

  it("among two active (or two draft) versions, picks the most recent version number", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(
      profile({ version: 1, status: "active", effective_from: "2026-01-01T00:00:00Z" })
    );
    await store.putPracticeProfileVersion(
      profile({ version: 2, status: "active", effective_from: "2026-02-01T00:00:00Z" })
    );
    const applicable = await store.getApplicableProfile("meridian", "2026-07-01T00:00:00Z");
    expect(applicable?.version).toBe(2);
  });

  it("a superseded later version never shadows an earlier active one", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(
      profile({ version: 1, status: "active", effective_from: "2026-01-01T00:00:00Z" })
    );
    await store.putPracticeProfileVersion(
      profile({ version: 2, status: "superseded", effective_from: "2026-02-01T00:00:00Z" })
    );
    const applicable = await store.getApplicableProfile("meridian", "2026-07-01T00:00:00Z");
    expect(applicable?.version).toBe(1);
  });

  it("defaults asOf to now when omitted: a past-dated real fixture version is applicable", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(profile({ effective_from: "2020-01-01T00:00:00Z" }));
    const applicable = await store.getApplicableProfile("meridian");
    expect(applicable?.version).toBe(1);
  });

  it("listProfileVersions returns the full history, oldest first, superseded included", async () => {
    const store = new MemoryStore();
    await store.putPracticeProfileVersion(profile({ version: 2, status: "active" }));
    await store.putPracticeProfileVersion(profile({ version: 1, status: "superseded" }));
    const versions = await store.listProfileVersions("meridian");
    expect(versions.map((v) => v.version)).toEqual([1, 2]);
  });
});

// --------------------------------------------------------------------------------------------
// 5. Provenance quotes hash-verified against the source repositories.
// --------------------------------------------------------------------------------------------

interface ProvenanceEntry {
  file?: string;
  commit?: string;
  content_hash?: string;
  spec_ref?: string;
  note?: string;
  [key: string]: unknown;
}

interface FixtureProfile extends StoredPracticeProfileVersion {
  provenance: Record<string, ProvenanceEntry>;
}

function loadFixtureProfiles(): FixtureProfile[] {
  return readdirSync(PROFILES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(path.join(PROFILES_DIR, f), "utf8")) as FixtureProfile);
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

const SIBLING_REPOS: Record<string, string> = {
  meridian: path.resolve(REPO_ROOT, "../field-research"),
  ulysses: path.resolve(REPO_ROOT, "../irrtum-als-methode"),
  ensemble: path.resolve(REPO_ROOT, "../studio"),
  "data-snack-plenum": path.resolve(REPO_ROOT, "../data-snack-plenum"),
  // frank + datavism source from this repo / the datavism repo (not a sibling clone in CI);
  // their hash checks run only where the source is resolvable.
  frank: REPO_ROOT
};

/** The three founding engine collectives — spec-v2.1 §3 formulations exist only for these. */
const ENGINE_IDS = new Set(["meridian", "ulysses", "ensemble"]);

const allSiblingReposPresent = Object.values(SIBLING_REPOS).every((p) => existsSync(p));
const describeIfSiblingRepos = allSiblingReposPresent ? describe : describe.skip;

function showFileAtCommit(repoPath: string, commit: string, filePath: string): string {
  return execFileSync("git", ["-C", repoPath, "show", `${commit}:${filePath}`], { encoding: "utf8" });
}

function sha256HexOfShow(repoPath: string, commit: string, filePath: string): string {
  const bytes = execFileSync("git", ["-C", repoPath, "show", `${commit}:${filePath}`]);
  return execFileSync("shasum", ["-a", "256"], { input: bytes }).toString("utf8").split(/\s+/)[0]!;
}

describe("practice-profile fixtures: structural provenance shape", () => {
  const fixtures = loadFixtureProfiles();

  it("loads exactly six profiles — three engines at v2 (post-migration, draft until locally confirmed), three admitted 2026-07-17 at v1", () => {
    expect(fixtures.map((f) => f.collective_id).sort()).toEqual(
      ["data-snack-plenum", "datavism", "ensemble", "frank", "meridian", "ulysses"]
    );
    for (const fixture of fixtures) {
      expect(fixture.version).toBe(ENGINE_IDS.has(fixture.collective_id) ? 2 : 1);
      // v2 refresh (protocol migrations 2026-07-16/17) and the three admissions are drafts:
      // a profile activates only through the practice's own confirmation (ADR 0011 §2);
      // v1's 2026-07-15 activation basis covered v1 only and lives on in git history.
      expect(fixture.status).toBe("draft");
      expect(fixture.non_exclusive).toBe(true);
    }
  });

  it("every non-spec-ref provenance entry names a file, commit and sha256 content_hash", () => {
    for (const fixture of fixtures) {
      for (const [field, entry] of Object.entries(fixture.provenance)) {
        if (field === "_compiled_by") continue;
        if (entry.spec_ref) continue;
        expect(entry.file, `${fixture.collective_id}.provenance.${field}.file`).toBeTruthy();
        expect(entry.commit, `${fixture.collective_id}.provenance.${field}.commit`).toMatch(/^[0-9a-f]{40}$/);
        expect(entry.content_hash, `${fixture.collective_id}.provenance.${field}.content_hash`).toMatch(/^sha256:[a-f0-9]{64}$/);
      }
    }
  });

  it("orientation/primary_commitment/accountability_questions of the ENGINE profiles are sourced from spec-v2.1 §3, not a repository", () => {
    for (const fixture of fixtures.filter((f) => ENGINE_IDS.has(f.collective_id))) {
      for (const field of ["orientation", "primary_commitment", "accountability_questions"]) {
        expect(fixture.provenance[field]?.spec_ref, `${fixture.collective_id}.provenance.${field}`).toMatch(/spec-v2\.1/);
      }
    }
  });
});

describeIfSiblingRepos("practice-profile fixtures: quotes hash-verified against the pinned source commits", () => {
  const fixtures = loadFixtureProfiles();

  it("every PROTOCOL.md-sourced content_hash matches sha256 of the file at the pinned commit", () => {
    for (const fixture of fixtures) {
      const repoPath = SIBLING_REPOS[fixture.collective_id]!;
      for (const [field, entry] of Object.entries(fixture.provenance)) {
        if (!entry.file || entry.file !== "PROTOCOL.md" || !entry.commit || !entry.content_hash) continue;
        const recomputed = `sha256:${sha256HexOfShow(repoPath, entry.commit, "PROTOCOL.md")}`;
        expect(recomputed, `${fixture.collective_id}.provenance.${field}`).toBe(entry.content_hash);
      }
    }
  });

  it("protocol_ref's commit matches the same pinned PROTOCOL.md content_hash", () => {
    for (const fixture of fixtures) {
      const repoPath = SIBLING_REPOS[fixture.collective_id];
      const selfDescriptionEntry = fixture.provenance.self_description;
      // Only profiles whose self_description is PROTOCOL.md-sourced in a resolvable repo —
      // frank/datavism source from governance documents instead (their refs point there).
      if (!repoPath || !selfDescriptionEntry?.commit || selfDescriptionEntry.file !== "PROTOCOL.md") continue;
      expect(fixture.protocol_ref).toContain(selfDescriptionEntry.commit);
      const recomputed = `sha256:${sha256HexOfShow(repoPath, selfDescriptionEntry.commit, "PROTOCOL.md")}`;
      expect(recomputed).toBe(selfDescriptionEntry.content_hash);
    }
  });

  it("self_description is a genuine (whitespace-normalized) substring of PROTOCOL.md at the pinned commit", () => {
    for (const fixture of fixtures) {
      const entry = fixture.provenance.self_description;
      if (!entry?.file || !entry.commit || entry.file !== "PROTOCOL.md") continue;
      const repoPath = SIBLING_REPOS[fixture.collective_id]!;
      const source = normalizeWhitespace(showFileAtCommit(repoPath, entry.commit, "PROTOCOL.md"));
      expect(source).toContain(normalizeWhitespace(fixture.self_description ?? ""));
    }
  });

  it("public_name's PROTOCOL.md-sourced quote note is a genuine substring (meridian, ulysses)", () => {
    for (const collectiveId of ["meridian", "ulysses"]) {
      const fixture = fixtures.find((f) => f.collective_id === collectiveId)!;
      const entry = fixture.provenance.public_name!;
      expect(entry.file).toBe("PROTOCOL.md");
      const repoPath = SIBLING_REPOS[collectiveId]!;
      const source = normalizeWhitespace(showFileAtCommit(repoPath, entry.commit!, "PROTOCOL.md"));
      // The provenance note wraps the quote in single quotes after the section label; extract
      // the quoted portion rather than assuming the whole note string is the quote.
      const quoteMatch = entry.note?.match(/'([^']+)'\s*$/);
      expect(quoteMatch, `${collectiveId} provenance.public_name.note should end in a '...' quote`).toBeTruthy();
      expect(source).toContain(normalizeWhitespace(quoteMatch![1]!));
    }
  });

  it("every typical_operations / admissible_outputs / characteristic_risks item is a genuine substring of PROTOCOL.md", () => {
    for (const fixture of fixtures) {
      const repoPath = SIBLING_REPOS[fixture.collective_id]!;
      for (const field of ["typical_operations", "admissible_outputs", "characteristic_risks"] as const) {
        const entry = fixture.provenance[field];
        if (!entry?.file || entry.file !== "PROTOCOL.md" || !entry.commit) continue;
        const source = normalizeWhitespace(showFileAtCommit(repoPath, entry.commit, "PROTOCOL.md"));
        const items = (fixture[field] as string[] | undefined) ?? [];
        expect(items.length, `${fixture.collective_id}.${field} should be non-empty (material was found)`).toBeGreaterThan(0);
        for (const item of items) {
          expect(source, `${fixture.collective_id}.${field}: ${JSON.stringify(item)}`).toContain(normalizeWhitespace(item));
        }
      }
    }
  });

  it("ensemble's public_name quote is verified against chronicle.json at the pinned commit (bundle pointers are regenerable and may dangle, ADR 0009)", () => {
    const fixture = fixtures.find((f) => f.collective_id === "ensemble")!;
    const entry = fixture.provenance.public_name!;
    expect(entry.file).toMatch(/chronicle\.json/);
    const hash = sha256HexOfShow(SIBLING_REPOS.ensemble, entry.commit!, "chronicle.json");
    expect(`sha256:${hash}`).toBe(entry.content_hash);
    const raw = showFileAtCommit(SIBLING_REPOS.ensemble, entry.commit!, "chronicle.json");
    const chronicle = JSON.parse(raw) as Array<{ collective_session: number; summary: string }>;
    const founding = chronicle.find((e) => e.collective_session === 1);
    expect(founding).toBeDefined();
    expect(founding!.summary).toContain("the collective named itself Ensemble");
  });
});
