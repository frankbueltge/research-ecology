/**
 * Determinism test for apps/export-site (work order phase-3e-plumbing.md §1: "Export zweimal
 * in Temp-Verzeichnisse ⇒ byte-identisch; entrance.json validiert gegen ... site-entrance.
 * schema.json"). Runs `runExport` twice, into two separate temp "site" directories, and asserts
 * every written file is byte-identical across the two runs, plus schema validation on the
 * emitted entrance.json.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  runExport,
  shortEncounterSlug,
  selectEntranceEncounterId,
  listApprovedEncounterIds,
  driftsOnPremiere,
  DEFAULT_ENCOUNTER_ID,
  type ExportResult
} from "../../apps/export-site/src/export.js";
import { validateScoreExport, validateSiteEntrance } from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(currentDir, "../..");

let runA: ExportResult;
let runB: ExportResult;
let runC: ExportResult;
let siteA: string;
let siteB: string;
let siteC: string;

beforeAll(async () => {
  siteA = mkdtempSync(path.join(tmpdir(), "export-site-a-"));
  siteB = mkdtempSync(path.join(tmpdir(), "export-site-b-"));
  // siteC pins enc-2026-001 explicitly: the content-specific suite below documents THAT
  // encounter's editorial projection (its lanes, flows and divergence beat) and must not drift
  // when the rule-driven entrance advances to a newer scored encounter.
  siteC = mkdtempSync(path.join(tmpdir(), "export-site-c-"));
  runA = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: siteA });
  runB = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: siteB });
  runC = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: siteC, encounterId: DEFAULT_ENCOUNTER_ID });
});

describe("export-site: determinism", () => {
  it("writes the same set of relative file paths on both runs", () => {
    expect(runA.files).toEqual(runB.files);
    expect(runA.files.length).toBeGreaterThan(0);
  });

  it("writes the five expected artifact kinds", () => {
    // The entrance follows the advertised selection rule (newest approved score), not a
    // pinned id — the test derives its expectation from the same rule the export uses.
    const slug = shortEncounterSlug(selectEntranceEncounterId(REPO_ROOT));
    expect(runA.files).toContain("src/data/begegnungen/entrance.json");
    expect(runA.files).toContain("src/data/begegnungen/README.md");
    expect(runA.files).toContain("src/data/begegnungen/register.json");
    expect(runA.files).toContain(`src/data/begegnungen/${slug}/narrative.json`);
    expect(runA.files).toContain(`src/data/begegnungen/${slug}/score.json`);
    const mapFiles = runA.files.filter((f) => f.includes(`${slug}/maps/`));
    expect(mapFiles).toHaveLength(3);
  });

  it("draws EVERY approved encounter, not only the one holding the entrance", () => {
    // Until 2026-08-02 the export wrote per-encounter artefacts for the entrance alone. An
    // encounter that a newer one had already overtaken could therefore gain an approved
    // narrative and still never get a score.json — a silently unreachable drawing, exactly the
    // kind of quiet gap the rejected-records check above refuses to tolerate elsewhere. The
    // site's ledger glob reads src/data/begegnungen/*/score.json, so "approved" must mean
    // "drawn".
    const approved = listApprovedEncounterIds(REPO_ROOT);
    expect(approved.length).toBeGreaterThan(1);
    for (const encounterId of approved) {
      const slug = shortEncounterSlug(encounterId);
      expect(runA.files, `${encounterId} has an approved narrative but no score`).toContain(
        `src/data/begegnungen/${slug}/score.json`
      );
      expect(runA.files).toContain(`src/data/begegnungen/${slug}/narrative.json`);
      expect(runA.files.filter((f) => f.includes(`${slug}/maps/`))).toHaveLength(3);
    }
  });

  it("a pinned encounterId still exports that one encounter alone", () => {
    // runC pins enc-2026-001; the runbook's single-encounter run and the content suite below
    // both depend on the pin meaning "only this one", not "this one plus everything approved".
    const pinnedSlug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const scores = runC.files.filter((f) => f.endsWith("/score.json"));
    expect(scores).toEqual([`src/data/begegnungen/${pinnedSlug}/score.json`]);
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
    // quote beats carry an akte_event_id linking back into the record; a final divergence
    // miniature (001's shape) is one legal form of beat six, not a requirement of the rule.
    for (const station of entrance.stations.slice(0, 5)) {
      expect(typeof station.akte_event_id).toBe("string");
    }
  });

  it("the pinned enc-2026-001 entrance keeps its divergence miniature as station six", () => {
    const raw = readFileSync(path.join(siteC, "src/data/begegnungen/entrance.json"), "utf8");
    const entrance = JSON.parse(raw);
    expect(entrance.stations).toHaveLength(6);
    expect(entrance.stations[5].divergence).toBeDefined();
  });

  it("narrative.json is copied byte-for-byte from narratives/enc-2026-001.json", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const exported = readFileSync(path.join(siteC, "src", "data", "begegnungen", slug, "narrative.json"));
    const original = readFileSync(path.join(REPO_ROOT, "narratives", "enc-2026-001.json"));
    expect(exported.equals(original)).toBe(true);
  });

  it("score.json validates against score-export.schema.json", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const raw = readFileSync(path.join(siteC, "src/data/begegnungen", slug, "score.json"), "utf8");
    const score = JSON.parse(raw);
    const result = validateScoreExport(score);
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });

  it("score.json carries the operative ledger — editorial bookkeeping (assembly, the-middle correction.noted) excluded; ledger completeness lives in the fixture and the register", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const raw = readFileSync(path.join(siteC, "src/data/begegnungen", slug, "score.json"), "utf8");
    const score = JSON.parse(raw);
    // The count is DERIVED from the fixture, not pinned: this ledger is append-only, and the
    // literal 7 it once held made the scribe's honest appends read as a regression. What the
    // score owes is the fixture's events minus the editorial bookkeeping — say that, and the
    // assertion survives every future append while still catching a silently thinned ledger.
    const fixtureEvents = JSON.parse(
      readFileSync(path.join(REPO_ROOT, "fixtures", DEFAULT_ENCOUNTER_ID, "events.json"), "utf8")
    ) as Array<{ event_type: string; issuer?: { collective_id?: string } }>;
    const bookkeeping = fixtureEvents.filter(
      (e) => e.event_type === "correction.noted" && e.issuer?.collective_id === "the-middle"
    ).length;
    expect(bookkeeping).toBeGreaterThan(0); // else this test proves nothing about the exclusion
    expect(score.events).toHaveLength(fixtureEvents.length - bookkeeping);
    expect(score.events.map((e: { event_type: string }) => e.event_type)).not.toContain("correction.noted");
    expect(score.events.map((e: { event_type: string }) => e.event_type)).not.toContain("editorial.encounter_assembled");
    // 5 events are narrated (stations ①–⑤ on the map are 1,2,4,3,5 — narrative order != ledger
    // order for beats 3/4, docs/design/zeichengrammatik-2026-07-15.md §1); 2 (both
    // derivative.published) carry no narrative station.
    const stationed = score.events.filter((e: { station: number | null }) => e.station !== null);
    expect(stationed).toHaveLength(5);
    expect(new Set(stationed.map((e: { station: number }) => e.station))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it("score.json places the delegated correction-issued event on the conductor lane, not its issuing collective's lane", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const raw = readFileSync(path.join(siteC, "src/data/begegnungen", slug, "score.json"), "utf8");
    const score = JSON.parse(raw);
    const correctionIssued = score.events.find((e: { event_id: string }) => e.event_id === "evt-enc2026001-03-correction-issued");
    expect(correctionIssued.issuer.collective_id).toBe("ensemble");
    expect(correctionIssued.lane).toBe("conductor");
    expect(correctionIssued.infra).toBe(false);
    const infraEvent = score.events.find((e: { event_id: string }) => e.event_id === "evt-enc2026001-07-publication-site-gate");
    expect(infraEvent.infra).toBe(true);
    expect(infraEvent.attribution).toBe("studio-integrate (infrastructure)");
  });

  it("score.json's two obligations and three flows are both derived, not invented", () => {
    const slug = shortEncounterSlug(DEFAULT_ENCOUNTER_ID);
    const raw = readFileSync(path.join(siteC, "src/data/begegnungen", slug, "score.json"), "utf8");
    const score = JSON.parse(raw);
    expect(score.obligations).toHaveLength(2);
    for (const obligation of score.obligations) {
      expect(obligation.lane).toBe("ensemble"); // both obligated_collective_id === "ensemble" in the fixture
      expect(obligation.source_event_id).toBe("evt-enc2026001-02-object-admitted");
    }
    expect(score.flows).toHaveLength(3);
    expect(score.flows.filter((f: { direction: string }) => f.direction === "downstream")).toHaveLength(1);
    expect(score.flows.filter((f: { direction: string }) => f.direction === "upstream")).toHaveLength(2);
  });
});

// ------------------------------------------------------------------------------------------
// Observed receiver-work layer ("Beobachten & anstoßen", 2026-07-17). A self-contained fake
// engines dir (no dependency on the site's real clones) proves that, given engine ground truth,
// the register gains a machine-observed premiere status and drift is reported — while the
// editorial fixture is never touched. The determinism suite above is unaffected: it passes no
// enginesRoot, so no `observed` field is emitted and its output stays byte-identical.
// ------------------------------------------------------------------------------------------
interface ObservedRegisterEntry {
  encounter_id: string;
  title: string | null;
  observed?: { premiered: boolean; work_dir: string | null; premiered_on: string | null; engine_repo: string };
}

describe("export-site: observed receiver-work status", () => {
  let site: string;
  let result: ExportResult;
  let register: ObservedRegisterEntry[];

  beforeAll(async () => {
    // Fake engine ground truth: the studio has both its works graduated to works/. The dir names
    // carry the premiere dates the assertions read — data-carried, no wall clock.
    const engines = mkdtempSync(path.join(tmpdir(), "engines-"));
    for (const dir of ["2026-07-13-native-speaker", "2026-07-17-no-way-of-knowing"]) {
      mkdirSync(path.join(engines, "studio", "works", dir), { recursive: true });
    }
    site = mkdtempSync(path.join(tmpdir(), "export-site-obs-"));
    result = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: site, enginesRoot: engines });
    register = JSON.parse(readFileSync(path.join(site, "src/data/begegnungen/register.json"), "utf8"));
  });

  const entry = (id: string): ObservedRegisterEntry => register.find((e) => e.encounter_id.startsWith(id))!;

  it("marks enc-2026-002's receiver work premiered, read from the studio works/ dir name", () => {
    const obs = entry("enc-2026-002").observed!;
    expect(obs.premiered).toBe(true);
    expect(obs.work_dir).toBe("2026-07-17-no-way-of-knowing");
    expect(obs.premiered_on).toBe("2026-07-17");
    expect(obs.engine_repo).toBe("studio");
  });

  it("the drift rule fires on a premiered work whose record still reads 'premiere pending'", () => {
    // Asserted on the rule itself, not through a fixture. The old test watched enc-2026-002
    // for the positive case, which meant it only stayed green while that record stayed WRONG;
    // when the scribe recorded the premiere on 2026-08-01 — the mechanism doing its job — the
    // test went red. A drift detector must be tested on its own inputs.
    expect(driftsOnPremiere("… — premiere pending", true)).toBe(true);
    expect(driftsOnPremiere("… — PREMIERE PENDING", true)).toBe(true);
    expect(driftsOnPremiere("… — premiere pending", false)).toBe(false); // not premiered yet
    expect(driftsOnPremiere("… — premiered 2026-07-17", true)).toBe(false); // record caught up
    expect(driftsOnPremiere(null, true)).toBe(false);
  });

  it("reports no drift once a record has caught up to its premiere — the signal clears itself", () => {
    // Both enc-2026-001 and enc-2026-002 have premiered receiver works AND records that now
    // say so (enc-2026-002's caught up on 2026-08-01). Nothing should be prompting the scribe.
    for (const id of ["enc-2026-001", "enc-2026-002"]) {
      expect(entry(id).observed!.premiered).toBe(true);
      expect(entry(id).title).not.toMatch(/premiere pending/i);
      expect(result.driftWarnings.some((w) => w.includes(id))).toBe(false);
    }
  });

  it("leaves non-engine receivers (datavism, data-snack) unobserved rather than guessed", () => {
    expect(entry("enc-2026-003").observed).toBeUndefined();
    expect(entry("enc-2026-004").observed).toBeUndefined();
  });

  it("never mutates the editorial title — the register carries each fixture's own wording verbatim", () => {
    // The claim is "the export does not rewrite the scribe's prose", so compare against the
    // fixture rather than against one remembered sentence: the old test pinned enc-2026-002's
    // then-current "premiere pending" wording, so it failed the moment the scribe legitimately
    // rewrote it — testing the sentence instead of the rule.
    for (const dir of readdirSync(path.join(REPO_ROOT, "fixtures")).filter((d) => d.startsWith("enc-"))) {
      const fixture = JSON.parse(
        readFileSync(path.join(REPO_ROOT, "fixtures", dir, "encounter.json"), "utf8")
      ) as { encounter_id: string; title?: string };
      expect(entry(fixture.encounter_id).title).toBe(fixture.title ?? null);
    }
  });
});
