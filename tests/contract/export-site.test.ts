/**
 * Determinism test for apps/export-site (work order phase-3e-plumbing.md §1: "Export zweimal
 * in Temp-Verzeichnisse ⇒ byte-identisch; entrance.json validiert gegen ... site-entrance.
 * schema.json"). Runs `runExport` twice, into two separate temp "site" directories, and asserts
 * every written file is byte-identical across the two runs, plus schema validation on the
 * emitted entrance.json.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExport, shortEncounterSlug, DEFAULT_ENCOUNTER_ID, type ExportResult } from "../../apps/export-site/src/export.js";
import { validateSiteEntrance } from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(currentDir, "../..");

let runA: ExportResult;
let runB: ExportResult;
let siteA: string;
let siteB: string;

beforeAll(async () => {
  siteA = mkdtempSync(path.join(tmpdir(), "export-site-a-"));
  siteB = mkdtempSync(path.join(tmpdir(), "export-site-b-"));
  runA = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: siteA });
  runB = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: siteB });
});

describe("export-site: determinism", () => {
  it("writes the same set of relative file paths on both runs", () => {
    expect(runA.files).toEqual(runB.files);
    expect(runA.files.length).toBeGreaterThan(0);
  });

  it("writes the four expected artifact kinds", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    expect(runA.files).toContain("src/data/begegnungen/entrance.json");
    expect(runA.files).toContain("src/data/begegnungen/README.md");
    expect(runA.files).toContain(`src/data/begegnungen/${slug}/narrative.json`);
    const mapFiles = runA.files.filter((f) => f.includes(`${slug}/maps/`));
    expect(mapFiles).toHaveLength(3);
  });

  it("every written file is byte-identical across two independent runs", () => {
    for (const relPath of runA.files) {
      const bytesA = readFileSync(path.join(siteA, relPath));
      const bytesB = readFileSync(path.join(siteB, relPath));
      expect(bytesB.equals(bytesA), `${relPath} differs between run A and run B`).toBe(true);
    }
  });

  it("watermark and encounter id agree across runs (both purely data-derived)", () => {
    expect(runA.watermark).toBe(runB.watermark);
    expect(runA.encounterId).toBe(runB.encounterId);
    expect(runA.researchEcologyCommit).toBe(runB.researchEcologyCommit);
  });

  it("entrance.json validates against site-entrance.schema.json", () => {
    const raw = readFileSync(path.join(siteA, "src/data/begegnungen/entrance.json"), "utf8");
    const entrance = JSON.parse(raw);
    const result = validateSiteEntrance(entrance);
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });

  it("entrance.json carries exactly six stations, mirroring the narrative's six beats", () => {
    const raw = readFileSync(path.join(siteA, "src/data/begegnungen/entrance.json"), "utf8");
    const entrance = JSON.parse(raw);
    expect(entrance.stations).toHaveLength(6);
    // the final station is the divergence miniature (no quote/akte_event_id), the rest are
    // quote beats with an akte_event_id linking back into the record.
    for (const station of entrance.stations.slice(0, 5)) {
      expect(typeof station.akte_event_id).toBe("string");
    }
    expect(entrance.stations[5].divergence).toBeDefined();
  });

  it("narrative.json is copied byte-for-byte from narratives/enc-2026-001.json", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const exported = readFileSync(path.join(siteA, "src", "data", "begegnungen", slug, "narrative.json"));
    const original = readFileSync(path.join(REPO_ROOT, "narratives", "enc-2026-001.json"));
    expect(exported.equals(original)).toBe(true);
  });
});
