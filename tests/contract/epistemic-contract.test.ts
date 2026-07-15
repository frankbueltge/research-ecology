/**
 * The 12 epistemic contract tests (work order §1 — "executable subset of spec 09 §8 at data
 * layer"). Run entirely against `MemoryStore` — DB-free, per work order §2 ("MemoryStore
 * covers the full suite DB-free"). Numbered exactly as the work order lists them.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EPISTEMIC_COMPILE_CHECKS,
  hydrateMemoryStoreFromRepo,
  loadCollectiveBundleFromDir,
  MemoryStore,
  type StoredAssertion,
  type StoredEncounter,
  type StoredEvent,
  type StoredLensVersion,
  type StoredObjectRef,
  type StoredObligation,
  type StoredParticipant
} from "../../packages/domain/src/index.js";
import { project, PROJECTIONS_ENGINE_VERSION, type ProjectionInput, type ProjectionLens } from "../../packages/projections/src/index.js";
import { contentHash, validateMapManifest } from "../../packages/protocol/src/index.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(currentDir, "../../");
const ENCOUNTER_ID = "enc-2026-001-calibration-gap-travels";
const WATERMARK = "2026-07-14T00:00:00Z";
const EARLY_WATERMARK = "2026-07-12T00:00:00Z"; // before evt-02..07, after only evt-01

let store: MemoryStore;
let encounter: StoredEncounter;
let participants: StoredParticipant[];
let events: StoredEvent[];
let objects: StoredObjectRef[];
let assertions: StoredAssertion[];
let obligations: StoredObligation[];
let lensById: Map<string, StoredLensVersion>;

function buildRecords(overrides?: Partial<ProjectionInput>): ProjectionInput {
  return {
    encounter,
    participants,
    events,
    objects,
    assertions,
    obligations,
    ...overrides
  };
}

function projectWith(lensId: string, watermark = WATERMARK, overrides?: Partial<ProjectionInput>) {
  const lens = lensById.get(lensId);
  if (!lens) throw new Error(`test setup: lens not loaded: ${lensId}`);
  return project(buildRecords(overrides), lens as unknown as ProjectionLens, watermark, PROJECTIONS_ENGINE_VERSION);
}

beforeAll(async () => {
  const result = await hydrateMemoryStoreFromRepo({
    bundlesRootDir: path.join(REPO_ROOT, "import/bundles"),
    fixtureDir: path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels"),
    lensesDir: path.join(REPO_ROOT, "lenses")
  });
  store = result.store;

  const found = await store.getEncounter(ENCOUNTER_ID);
  if (!found) throw new Error("test setup: fixture encounter did not load");
  encounter = found;
  participants = await store.listParticipants(ENCOUNTER_ID);
  events = await store.listEventsForEncounter(ENCOUNTER_ID);
  objects = await store.listObjectsForEncounter(ENCOUNTER_ID);
  assertions = await store.listAssertionsForEncounter(ENCOUNTER_ID);
  obligations = await store.listObligationsForEncounter(ENCOUNTER_ID);

  lensById = new Map();
  for (const lensId of ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"]) {
    const versions = await store.listLensVersions(lensId);
    const latest = versions[versions.length - 1];
    if (!latest) throw new Error(`test setup: lens not loaded: ${lensId}`);
    lensById.set(lensId, latest);
  }
}, 30_000);

// ------------------------------------------------------------------------------------------
// 1. No store method returns a global edge list.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 1 — no global edge list", () => {
  it("compile-time guard: EncounterStore has no listAllAssertions/listAllEvents-shaped method", () => {
    expect(EPISTEMIC_COMPILE_CHECKS.noGlobalEdgeListMethod).toBe(true);
  });

  it("runtime: assertions are only queryable per encounter / per object / per author", async () => {
    const byEncounter = await store.listAssertionsForEncounter(ENCOUNTER_ID);
    const byObject = await store.listAssertionsForObject("meridian:claims-row-12@ae89e09");
    const byAuthor = await store.listAssertionsForAuthor("meridian");
    expect(byEncounter.length).toBeGreaterThan(0);
    expect(byObject.length).toBeGreaterThan(0);
    expect(byAuthor.length).toBeGreaterThan(0);
    // No global listing method exists on the store instance at all.
    expect((store as unknown as Record<string, unknown>).listAllAssertions).toBeUndefined();
    expect((store as unknown as Record<string, unknown>).listAssertions).toBeUndefined();
  });
});

// ------------------------------------------------------------------------------------------
// 2. A MapVersionPayload without lens version or exclusions cannot be constructed.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 2 — a map manifest without lens.version or exclusions is invalid", () => {
  const validManifest = {
    map_id: "map-test",
    version: 1,
    encounter_id: ENCOUNTER_ID,
    lens: { lens_id: "provenance-v1", version: 1 },
    event_watermark: WATERMARK,
    included: { events: [], objects: [], assertions: [], obligations: [] },
    exclusions: [],
    render_failures: [],
    accessible_summary: "test",
    content_hash: `sha256:${"a".repeat(64)}`
  };

  it("a well-formed manifest validates", () => {
    expect(validateMapManifest(validManifest).valid).toBe(true);
  });

  it("rejects a manifest whose lens has no version", () => {
    const bad = { ...validManifest, lens: { lens_id: "provenance-v1" } };
    expect(validateMapManifest(bad).valid).toBe(false);
  });

  it("rejects a manifest missing exclusions entirely", () => {
    const { exclusions, ...bad } = validManifest;
    expect(validateMapManifest(bad).valid).toBe(false);
  });
});

// ------------------------------------------------------------------------------------------
// 3. Participant statuses remain distinct through store round-trip and projection.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 3 — participant local_status stays distinct", () => {
  it("store round-trip: meridian and ensemble keep distinct, non-flattened local_status", () => {
    const meridian = participants.find((p) => p.collective_id === "meridian");
    const ensemble = participants.find((p) => p.collective_id === "ensemble");
    expect(meridian?.local_status).toBe("correction applied; register revised; obligations active");
    expect(ensemble?.local_status).toBe("premiered; live-status obligation active");
    expect(meridian?.local_status).not.toBe(ensemble?.local_status);
  });

  it("projection: the provenance-v1 accessible_summary carries both distinct statuses verbatim", () => {
    const map = projectWith("provenance-v1");
    expect(map.accessible_summary).toContain("correction applied; register revised; obligations active");
    expect(map.accessible_summary).toContain("premiered; live-status obligation active");
  });
});

// ------------------------------------------------------------------------------------------
// 4. contract.published renders as a record; an unregistered predicate becomes a rupture.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 4 — unknown types render, never drop or rename", () => {
  it("contract.published (unknown type) appears as a rendered ledger record in provenance-v1", () => {
    const map = projectWith("provenance-v1");
    const ledger = (map.projection as { ledger: Array<{ event_type: string; event_id: string }> }).ledger;
    const entry = ledger.find((e) => e.event_type === "contract.published");
    expect(entry).toBeDefined();
    expect(entry?.event_id).toBe("evt-enc2026001-01-contract-published");
    expect(map.render_failures.some((f) => (f as { event_id?: string }).event_id === entry?.event_id)).toBe(false);
  });

  it("an assertion predicate without a registered renderer form yields a render_failures rupture, never a drop", () => {
    const poisoned: StoredAssertion = {
      assertion_id: "assert-test-unregistered-predicate",
      encounter_id: ENCOUNTER_ID,
      author: { actor_id: "meridian", collective_id: "meridian" },
      subject: { local_object_ref_id: "meridian:instrument-001@ae89e09" },
      predicate: "holds-open-against", // deliberately not in either renderer's known-predicate map
      object: "an open, unresolved counter-position",
      epistemic_status: "interpretation",
      content_hash: `sha256:${"b".repeat(64)}`
    };
    const lens = lensById.get("meridian-position-v1")! as unknown as ProjectionLens;
    const lensWithPoisoned: ProjectionLens = {
      ...lens,
      selection: { ...lens.selection, assertion_ids: [...(lens.selection.assertion_ids ?? []), poisoned.assertion_id] }
    };
    const map = project(buildRecords({ assertions: [...assertions, poisoned] }), lensWithPoisoned, WATERMARK, PROJECTIONS_ENGINE_VERSION);

    // Never dropped: still present in included.assertions.
    expect(map.included.assertions).toContain(poisoned.assertion_id);
    // Never silently renamed/absorbed: a rupture entry names it and its actual predicate.
    const failure = map.render_failures.find((f) => (f as { assertion_id?: string }).assertion_id === poisoned.assertion_id);
    expect(failure).toBeDefined();
    expect((failure as { predicate?: string }).predicate).toBe("holds-open-against");
  });
});

// ------------------------------------------------------------------------------------------
// 5. Silence: Ulysses is no participant — absence stays absence.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 5 — Ulysses' absence renders as absence, never a synthesized signal", () => {
  it("none of the three lens maps mention ulysses anywhere", () => {
    for (const lensId of ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"]) {
      const map = projectWith(lensId);
      expect(JSON.stringify(map).toLowerCase()).not.toContain("ulysses");
    }
  });

  it("no participant row references ulysses for this encounter", () => {
    expect(participants.some((p) => p.collective_id === "ulysses")).toBe(false);
  });
});

// ------------------------------------------------------------------------------------------
// 6. Machine suggestions never surface through the accepted-assertion read methods.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 6 — machine_suggestion is filtered on read, independent of ingest", () => {
  it("a poisoned machine_suggestion record inserted straight into the store never comes back out", async () => {
    const poisoned: StoredAssertion = {
      assertion_id: "assert-test-poisoned-machine-suggestion",
      encounter_id: ENCOUNTER_ID,
      author: { actor_id: "fable", collective_id: "ulysses" },
      subject: { local_object_ref_id: "meridian:instrument-001@ae89e09" },
      predicate: "possibly-relates-to",
      object: "an unadmitted computational guess",
      epistemic_status: "machine_suggestion", // bypasses packages/protocol's validateAssertion on purpose
      content_hash: `sha256:${"c".repeat(64)}`
    };
    const inserted = await store.insertAssertion(poisoned);
    expect(inserted.inserted).toBe(true); // the store itself does not re-validate on write

    const byEncounter = await store.listAssertionsForEncounter(ENCOUNTER_ID);
    const byObject = await store.listAssertionsForObject("meridian:instrument-001@ae89e09");
    const byAuthor = await store.listAssertionsForAuthor("ulysses");
    for (const list of [byEncounter, byObject, byAuthor]) {
      expect(list.some((a) => a.assertion_id === poisoned.assertion_id)).toBe(false);
    }
  });
});

// ------------------------------------------------------------------------------------------
// 7. Source hashes + local terms round-trip store -> projection byte-identically.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 7 — hashes and local terms round-trip byte-identically", () => {
  it("DISCLOSED RECONSTRUCTION survives store retrieval and appears verbatim in the projection", async () => {
    const nativeSpeaker = await store.getObject("ensemble:native-speaker@f6a9d8f");
    expect(nativeSpeaker?.local_epistemic_status).toMatch(/DISCLOSED RECONSTRUCTION/);
    const map = projectWith("ensemble-transformation-v1");
    expect(JSON.stringify(map)).toContain("DISCLOSED RECONSTRUCTION");
  });

  it("the open, hyphenated predicate 'declines-to-carry' round-trips store -> projection unchanged", () => {
    const boundaryCase = assertions.find((a) => a.assertion_id === "assert-enc2026001-ensemble-boundary-case");
    expect(boundaryCase?.predicate).toBe("declines-to-carry");
    const map = projectWith("ensemble-transformation-v1");
    const band = (map.projection as { transformation_band: Array<{ label: string }> }).transformation_band;
    expect(band.some((b) => b.label === "declines-to-carry")).toBe(true);
  });

  it("'advance (outward)' survives a store round-trip of a bundle-level (non-encounter) event", async () => {
    // Looked up by its own content, not a pinned hash: bundles regenerate at the engines'
    // moving HEADs nightly, and a pinned id would break on every unrelated new chronicle
    // entry. The round-trip claim itself is unchanged — the open, parenthesised local term
    // must come back byte-identical from the store.
    const bundlesRoot = path.join(REPO_ROOT, "import/bundles");
    const meridianDir = readdirSync(bundlesRoot).find((d) => d.startsWith("meridian@"));
    expect(meridianDir).toBeDefined();
    const bundleEvents = JSON.parse(
      readFileSync(path.join(bundlesRoot, meridianDir!, "events.json"), "utf8")
    ) as Array<{ event_id: string; payload: { move?: string } }>;
    const advanceEntry = bundleEvents.find((e) => e.payload?.move === "advance (outward)");
    expect(advanceEntry).toBeDefined();
    const event = await store.getEvent(advanceEntry!.event_id);
    expect(event).toBeDefined();
    expect((event!.payload as { move?: string }).move).toBe("advance (outward)");
  });

  it("every fixture event's content_hash recomputes identically from the stored envelope", async () => {
    for (const event of events) {
      const { content_hash, ...rest } = event;
      expect(contentHash(rest)).toBe(content_hash);
    }
  });
});

// ------------------------------------------------------------------------------------------
// 8. Corrections are append-only at the store level.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 8 — corrections never mutate or delete the original event row", () => {
  it("compile-time guard: LoaderStore has no updateEvent/deleteEvent-shaped method", () => {
    expect(EPISTEMIC_COMPILE_CHECKS.noEventMutationMethod).toBe(true);
  });

  it("inserting a record.corrected-style event leaves the original event row byte-identical", async () => {
    const originalBefore = await store.getEvent("evt-enc2026001-05-correction-applied");
    expect(originalBefore).toBeDefined();
    const snapshot = JSON.parse(JSON.stringify(originalBefore));

    const correctionEvent: StoredEvent = {
      schema_version: "1.0",
      event_id: "evt-test-record-corrected-01",
      encounter_id: ENCOUNTER_ID,
      event_type: "record.corrected",
      corrects_event_id: "evt-enc2026001-05-correction-applied",
      issuer: { collective_id: "meridian", actor_id: "meridian" },
      occurred_at: "2026-07-15T00:00:00Z",
      source_uri: "https://github.com/frankbueltge/field-research/blob/ae89e09/memory/claims.md",
      payload: { corrected_field: "gauntlet_note", reason: "test-only synthetic correction" },
      content_hash: `sha256:${"d".repeat(64)}`
    };
    const result = await store.insertEvent(correctionEvent);
    expect(result.inserted).toBe(true);

    const originalAfter = await store.getEvent("evt-enc2026001-05-correction-applied");
    expect(originalAfter).toEqual(snapshot);

    const both = await store.listEventsForEncounter(ENCOUNTER_ID);
    expect(both.some((e) => e.event_id === "evt-enc2026001-05-correction-applied")).toBe(true);
    expect(both.some((e) => e.event_id === "evt-test-record-corrected-01")).toBe(true);
  });
});

// ------------------------------------------------------------------------------------------
// 9. Determinism: same inputs ⇒ identical hash; different watermark ⇒ new, non-destructive
//    version.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 9 — deterministic content_hash; watermark changes never overwrite", () => {
  it("identical records + lens version + watermark ⇒ identical content_hash", () => {
    const a = projectWith("provenance-v1", WATERMARK);
    const b = projectWith("provenance-v1", WATERMARK);
    expect(a.content_hash).toBe(b.content_hash);
    expect(a.content_hash).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it("a different watermark produces a different content_hash and fewer included events", () => {
    const full = projectWith("provenance-v1", WATERMARK);
    const early = projectWith("provenance-v1", EARLY_WATERMARK);
    expect(early.content_hash).not.toBe(full.content_hash);
    expect(early.included.events.length).toBeLessThan(full.included.events.length);
  });

  it("the store appends a new map version for a new watermark and never touches the prior one", async () => {
    const mapId = "map-test-determinism";
    const v1 = projectWith("provenance-v1", EARLY_WATERMARK);
    const v1Manifest = { map_id: mapId, version: await store.nextMapVersion(mapId), ...v1 };
    await store.insertMapVersion(v1Manifest);

    const v2 = projectWith("provenance-v1", WATERMARK);
    const v2Manifest = { map_id: mapId, version: await store.nextMapVersion(mapId), ...v2 };
    await store.insertMapVersion(v2Manifest);

    expect(v1Manifest.version).toBe(1);
    expect(v2Manifest.version).toBe(2);

    const versions = await store.listMapVersions(mapId);
    expect(versions).toHaveLength(2);
    const storedV1 = versions.find((v) => v.version === 1)!;
    expect(storedV1.content_hash).toBe(v1Manifest.content_hash);
    expect(storedV1.event_watermark).toBe(EARLY_WATERMARK);
  });
});

// ------------------------------------------------------------------------------------------
// 10. Every projected object carries its canonical_uri.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 10 — every projected object carries canonical_uri", () => {
  it("holds for all three lenses", () => {
    for (const lensId of ["provenance-v1", "ensemble-transformation-v1", "meridian-position-v1"]) {
      const map = projectWith(lensId);
      expect(map.included.objects.length).toBeGreaterThan(0);
      for (const objectId of map.included.objects) {
        const record = objects.find((o) => o.id === objectId);
        expect(record, `object ${objectId} missing from source records`).toBeDefined();
        expect(record!.canonical_uri).toBeTruthy();
        expect(record!.canonical_uri).toMatch(/^https:\/\//);
      }
    }
  });
});

// ------------------------------------------------------------------------------------------
// 11. Cockpit import readiness: rhizome-edge assertions stay Ulysses-attributed.
// ------------------------------------------------------------------------------------------
describe("epistemic contract 11 — rhizome-edge assertions from the ulysses bundle keep author_collective_id 'ulysses'", () => {
  it("every rhizome-edge-kind assertion authored by ulysses is never re-attributed", async () => {
    const rhizomeEdgeKinds = new Set(["elaborates", "swerve", "grounds", "continues", "complement", "bridge"]);
    const byAuthor = await store.listAssertionsForAuthor("ulysses");
    const rhizomeEdges = byAuthor.filter((a) => rhizomeEdgeKinds.has(a.predicate));
    expect(rhizomeEdges.length).toBeGreaterThan(0);
    for (const edge of rhizomeEdges) {
      expect(edge.author.collective_id).toBe("ulysses");
    }
  });
});

// ------------------------------------------------------------------------------------------
// 12. A fourth collective can be imported through loader + MemoryStore, no schema/migration
//     change (a synthetic object with a genuinely novel local_object_type).
// ------------------------------------------------------------------------------------------
describe("epistemic contract 12 — a fourth collective imports cleanly with zero schema changes", () => {
  it("loads a minimal synthetic 'test-fourth' bundle end to end", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "test-fourth-bundle-"));
    const manifest = {
      schema_version: "1.0",
      collective_id: "test-fourth",
      name: "Test Fourth",
      description: "A synthetic fourth collective used only to prove open vocabularies need no migration.",
      protocol_url: "https://example.invalid/test-fourth/protocol.json",
      repository_url: "https://example.invalid/test-fourth",
      responsible_publisher: "Frank Bültge",
      status: "active",
      effective_from: "2026-07-14T00:00:00Z",
      version: 1,
      content_hash: `sha256:${"e".repeat(64)}`
    };
    const novelType = "interpretive-dance-notation (a local vocabulary this system has never seen before)";
    const objectRef = {
      id: "test-fourth:novel-object@abc1234",
      collective_id: "test-fourth",
      local_object_id: "novel-object",
      object_version: "abc1234",
      canonical_uri: "https://example.invalid/test-fourth/blob/abc1234/novel-object",
      source_uri: "https://example.invalid/test-fourth/blob/abc1234/novel-object",
      local_object_type: novelType,
      lifecycle_status: "active",
      content_hash: `sha256:${"f".repeat(64)}`,
      source_commit: "abc1234",
      source_metadata: {},
      importer_version: "test-fourth-synthetic-1.0"
    };
    writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest), "utf8");
    writeFileSync(path.join(dir, "objects.json"), JSON.stringify([objectRef]), "utf8");
    writeFileSync(path.join(dir, "events.json"), JSON.stringify([]), "utf8");
    writeFileSync(path.join(dir, "assertions.json"), JSON.stringify([]), "utf8");

    const summary = await loadCollectiveBundleFromDir(store, dir);

    expect(summary.rejected).toEqual([]);
    expect(summary.objectsInserted).toBe(1);

    const stored = await store.getObject(objectRef.id);
    expect(stored).toBeDefined();
    expect(stored!.local_object_type).toBe(novelType);
    expect(stored!.collective_id).toBe("test-fourth");
  });
});
