/**
 * Hydration: turns `import/bundles/**`, `fixtures/enc-2026-001-.../` and `lenses/*.json` into
 * `LoaderStore` writes (work order §0 "Loader"). This is the loader's actual logic — the CLI
 * in apps/loader is a thin argv/store-selection wrapper around the functions below, so
 * `MemoryStore` can run the identical code path in tests, DB-free (work order §2).
 *
 * Every record is validated via packages/protocol before it is written; a record that fails
 * validation is never silently dropped — it becomes a `rejected` import_record instead
 * (spec 05 §3.17-adjacent honesty rule, work order integrity rules).
 */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  contentHash as protocolContentHash,
  validateAssertion,
  validateCollectiveManifest,
  validateEncounterEvent,
  validateLens
} from "../../protocol/src/index.js";
import type { EncounterEvent } from "../../protocol/src/index.js";
import { ACTOR_SEED, COLLECTIVE_SEED, EDITORIAL_ACTOR_IDS, THE_MIDDLE_EDITORIAL_SENTINEL } from "./actor-seed.js";
import { MemoryStore } from "./memory-store.js";
import type { LoaderStore } from "./store.js";
import type {
  StoredAssertion,
  StoredEncounter,
  StoredEvent,
  StoredImportRecord,
  StoredLensVersion,
  StoredObjectRef,
  StoredObligation,
  StoredParticipant
} from "./types.js";

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

// --------------------------------------------------------------------------------------------
// Issuer check: "The Middle never speaks as a collective" (design §6, critical integrity rule).
// --------------------------------------------------------------------------------------------

const REAL_COLLECTIVE_IDS: ReadonlySet<string> = new Set(COLLECTIVE_SEED.map((c) => c.id));

export class EditorialIssuerViolation extends Error {
  constructor(eventId: string, collectiveId: string) {
    super(
      `event ${eventId}: issuer.actor_id is an editorial actor but issuer.collective_id ` +
        `("${collectiveId}") names a sovereign collective — The Middle must never speak as a ` +
        `collective (design §6). Use ${THE_MIDDLE_EDITORIAL_SENTINEL} or leave the actor's own ` +
        `collective_id null instead.`
    );
    this.name = "EditorialIssuerViolation";
  }
}

/** The loader's "issuer check" (work order §0): throws if an editorial actor's event is
 * attributed to one of the three sovereign collectives. Applied to every event on the way in,
 * not only the synthesized editorial one — cheap, and a real safety net. */
export function assertIssuerNeverImpersonatesCollective(event: Pick<EncounterEvent, "event_id" | "issuer">): void {
  if (EDITORIAL_ACTOR_IDS.has(event.issuer.actor_id) && REAL_COLLECTIVE_IDS.has(event.issuer.collective_id)) {
    throw new EditorialIssuerViolation(event.event_id, event.issuer.collective_id);
  }
}

// --------------------------------------------------------------------------------------------
// Actors / collectives
// --------------------------------------------------------------------------------------------

export interface SeedSummary {
  actors: number;
  collectives: number;
}

export async function seedActorsAndCollectives(store: LoaderStore): Promise<SeedSummary> {
  let actors = 0;
  let collectives = 0;
  for (const entry of ACTOR_SEED) {
    const result = await store.upsertActor({
      id: entry.id,
      display_name: entry.display_name,
      actor_kind: entry.actor_kind,
      collective_id: entry.collective_id
    });
    if (result.inserted) actors += 1;
  }
  for (const collective of COLLECTIVE_SEED) {
    const result = await store.upsertCollective(collective);
    if (result.inserted) collectives += 1;
  }
  return { actors, collectives };
}

// --------------------------------------------------------------------------------------------
// Bundles (import/bundles/<collective>@<shortSha>/)
// --------------------------------------------------------------------------------------------

export interface BundleLoadSummary {
  collectiveId: string;
  sourceDir: string;
  objectsInserted: number;
  eventsInserted: number;
  assertionsInserted: number;
  importRecordsInserted: number;
  rejected: string[];
}

interface RawObjectRef extends StoredObjectRef {}

export async function loadCollectiveBundleFromDir(store: LoaderStore, dir: string): Promise<BundleLoadSummary> {
  const manifest = readJson<Record<string, unknown>>(path.join(dir, "manifest.json"));
  const rejected: string[] = [];

  const manifestResult = validateCollectiveManifest(manifest);
  if (!manifestResult.valid) {
    rejected.push(`manifest.json: ${JSON.stringify(manifestResult.errors)}`);
  }
  const collectiveId = String(manifest.collective_id);

  const objects = readJson<RawObjectRef[]>(path.join(dir, "objects.json"));
  let objectsInserted = 0;
  for (const object of objects) {
    if (!object.canonical_uri || !object.content_hash) {
      rejected.push(`objects.json ${object.id}: missing canonical_uri or content_hash`);
      continue;
    }
    const result = await store.upsertObjectRef(object);
    if (result.inserted) objectsInserted += 1;
  }

  const events = readJson<EncounterEvent[]>(path.join(dir, "events.json"));
  let eventsInserted = 0;
  for (const event of events) {
    const result = validateEncounterEvent(event);
    if (!result.valid) {
      rejected.push(`events.json ${event.event_id}: ${JSON.stringify(result.errors)}`);
      continue;
    }
    assertIssuerNeverImpersonatesCollective(event);
    const inserted = await store.insertEvent(event as StoredEvent);
    if (inserted.inserted) eventsInserted += 1;
  }

  const assertions = readJson<StoredAssertion[]>(path.join(dir, "assertions.json"));
  let assertionsInserted = 0;
  for (const assertion of assertions) {
    const result = validateAssertion(assertion);
    if (!result.valid) {
      rejected.push(`assertions.json ${assertion.assertion_id}: ${JSON.stringify(result.errors)}`);
      continue;
    }
    const inserted = await store.insertAssertion(assertion);
    if (inserted.inserted) assertionsInserted += 1;
  }

  let importRecordsInserted = 0;
  try {
    const importRecords = readJson<StoredImportRecord[]>(path.join(dir, "import-records.json"));
    for (const record of importRecords) {
      const inserted = await store.insertImportRecord(record);
      if (inserted.inserted) importRecordsInserted += 1;
    }
  } catch {
    // import-records.json is optional in a hand-built (e.g. synthetic test) bundle.
  }

  for (const reason of rejected) {
    await store.insertImportRecord({
      collective_id: collectiveId,
      kind: "rejected",
      path: dir,
      reason,
      source_commit: typeof manifest.protocol_url === "string" ? manifest.protocol_url : undefined
    });
  }

  return { collectiveId, sourceDir: dir, objectsInserted, eventsInserted, assertionsInserted, importRecordsInserted, rejected };
}

export async function loadAllBundlesFromRoot(store: LoaderStore, bundlesRootDir: string): Promise<BundleLoadSummary[]> {
  const entries = readdirSync(bundlesRootDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
  const summaries: BundleLoadSummary[] = [];
  for (const entry of entries) {
    summaries.push(await loadCollectiveBundleFromDir(store, path.join(bundlesRootDir, entry)));
  }
  return summaries;
}

// --------------------------------------------------------------------------------------------
// Fixture encounter (fixtures/enc-2026-001-calibration-gap-travels/)
// --------------------------------------------------------------------------------------------

/** Verbatim from design §6 — the pending-approval pin state shown until Frank approves. */
export const PENDING_PIN_REASON =
  "Selected because: first fully evidenced inter-practice encounter of the lab · " +
  "Pinned by: Frank Bültge (pending approval — draft by the lab session of 2026-07-14)";

/** research-ecology has no `origin` remote configured yet locally (a brand-new repo); this
 * follows the exact `github.com/frankbueltge/<repo>` convention every sibling repo already
 * uses, naming where this editorial basis document lives once published — not a fabricated
 * exchange, just the same pointer convention applied one repo early. */
const RESEARCH_ECOLOGY_REPO_URL = "https://github.com/frankbueltge/research-ecology";

interface RawFixtureEncounter {
  encounter_id: string;
  slug: string;
  title?: string;
  editorial_proposition?: string;
  proposition_author?: { actor_id: string; note?: string };
  visibility: string;
  initiating_event_id?: string;
  created_at: string;
  dormant_at: string | null;
  archived_at: string | null;
  correlation_group: string | null;
  participants: Array<{
    collective_id: string | null;
    actor_id: string;
    role: string;
    local_status?: string | null;
    local_status_rationale?: string;
    joined_at: string;
    response_expected: boolean;
  }>;
  non_participants: Array<{ collective_id: string; note: string }>;
  shared_resolution: string | null;
  resolution_note?: string;
  source_note?: string;
}

export interface FixtureLoadSummary {
  encounterId: string;
  objectsInserted: number;
  eventsInserted: number;
  assertionsInserted: number;
  obligationsInserted: number;
  participantsInserted: number;
  assemblyEventId: string;
  rejected: string[];
}

/** Builds (but does not insert) the synthetic `editorial.encounter_assembled` event: an open
 * event type naming the assembly basis (docs/ENCOUNTER-INVENTORY.md, Candidate 1) and carrying
 * the pending-approval pin state, issued by the-middle-editor — never attributed to a
 * collective (work order §0 / design §6). */
export function buildEncounterAssembledEvent(encounter: RawFixtureEncounter): EncounterEvent {
  const withoutHash = {
    schema_version: "1.0" as const,
    // Mirrors the fixture's own id style exactly (evt-enc2026001-01-... .. -07-...): the
    // fixture's ids collapse "enc-2026-001-calibration-gap-travels" to "enc2026001", keeping
    // only the "enc" prefix and the first two dash-separated numeric segments.
    event_id: `evt-enc${encounter.encounter_id.replace(/^enc-/, "").split("-").slice(0, 2).join("")}-08-editorial-encounter-assembled`,
    encounter_id: encounter.encounter_id,
    event_type: "editorial.encounter_assembled",
    issuer: { collective_id: THE_MIDDLE_EDITORIAL_SENTINEL, actor_id: "the-middle-editor" },
    // After all 7 sourced events (latest 2026-07-12T22:22:01Z): the editorial assembly is a
    // Phase-1 lab-session act performed on top of the already-concluded encounter, not part of
    // the sourced chain itself (spec 05 §2.2 "non-canonical meaning").
    occurred_at: "2026-07-14T00:00:00Z",
    source_uri: `${RESEARCH_ECOLOGY_REPO_URL}/blob/main/docs/ENCOUNTER-INVENTORY.md`,
    visibility: "public" as const,
    payload: {
      assembly_basis: "docs/ENCOUNTER-INVENTORY.md, Candidate 1 (selected for the vertical slice)",
      encounter_slug: encounter.slug,
      pin_reason: PENDING_PIN_REASON,
      approval_state: "pending_approval",
      note:
        "Editorial act of The Middle (the shared apparatus), not any sovereign collective: " +
        "assembles participants/events/objects/obligations already recorded independently by " +
        "Meridian and Ensemble into one encounter record. Carries no interpretive claim beyond " +
        "the sourced record (encounter.json proposition_author note)."
    }
  };
  return { ...withoutHash, content_hash: protocolContentHash(withoutHash) };
}

export async function loadFixtureEncounter(store: LoaderStore, fixtureDir: string): Promise<FixtureLoadSummary> {
  const rejected: string[] = [];
  const encounter = readJson<RawFixtureEncounter>(path.join(fixtureDir, "encounter.json"));
  const objects = readJson<StoredObjectRef[]>(path.join(fixtureDir, "objects.json"));
  const events = readJson<EncounterEvent[]>(path.join(fixtureDir, "events.json"));
  const assertions = readJson<StoredAssertion[]>(path.join(fixtureDir, "assertions.json"));
  const obligations = readJson<StoredObligation[]>(path.join(fixtureDir, "obligations.json"));

  let objectsInserted = 0;
  for (const object of objects) {
    const result = await store.upsertObjectRef(object);
    if (result.inserted) objectsInserted += 1;
    await store.linkObjectToEncounter(encounter.encounter_id, object.id);
  }

  let eventsInserted = 0;
  for (const event of events) {
    const result = validateEncounterEvent(event);
    if (!result.valid) {
      rejected.push(`events.json ${event.event_id}: ${JSON.stringify(result.errors)}`);
      continue;
    }
    assertIssuerNeverImpersonatesCollective(event);
    const inserted = await store.insertEvent(event as StoredEvent);
    if (inserted.inserted) eventsInserted += 1;
  }

  const assemblyEvent = buildEncounterAssembledEvent(encounter);
  const assemblyValidation = validateEncounterEvent(assemblyEvent);
  if (!assemblyValidation.valid) {
    throw new Error(`synthesized editorial.encounter_assembled event failed validation: ${JSON.stringify(assemblyValidation.errors)}`);
  }
  assertIssuerNeverImpersonatesCollective(assemblyEvent);
  const assemblyInserted = await store.insertEvent(assemblyEvent as StoredEvent);
  if (assemblyInserted.inserted) eventsInserted += 1;

  let assertionsInserted = 0;
  for (const assertion of assertions) {
    const result = validateAssertion(assertion);
    if (!result.valid) {
      rejected.push(`assertions.json ${assertion.assertion_id}: ${JSON.stringify(result.errors)}`);
      continue;
    }
    const inserted = await store.insertAssertion(assertion);
    if (inserted.inserted) assertionsInserted += 1;
  }

  let obligationsInserted = 0;
  for (const obligation of obligations) {
    const inserted = await store.insertObligation(obligation);
    if (inserted.inserted) obligationsInserted += 1;
  }

  let participantsInserted = 0;
  for (const participant of encounter.participants) {
    const stored: StoredParticipant = {
      encounter_id: encounter.encounter_id,
      collective_id: participant.collective_id,
      actor_id: participant.actor_id,
      role: participant.role,
      local_status: participant.local_status ?? null,
      local_status_rationale: participant.local_status_rationale,
      joined_at: participant.joined_at,
      response_expected: participant.response_expected
    };
    const inserted = await store.upsertParticipant(stored);
    if (inserted.inserted) participantsInserted += 1;
  }
  await store.setNonParticipants(encounter.encounter_id, encounter.non_participants);

  const storedEncounter: StoredEncounter = {
    encounter_id: encounter.encounter_id,
    slug: encounter.slug,
    title: encounter.title,
    editorial_proposition: encounter.editorial_proposition,
    proposition_author: encounter.proposition_author,
    visibility: encounter.visibility,
    initiating_event_id: encounter.initiating_event_id,
    created_at: encounter.created_at,
    dormant_at: encounter.dormant_at,
    archived_at: encounter.archived_at,
    correlation_group: encounter.correlation_group,
    non_participants: encounter.non_participants,
    shared_resolution: encounter.shared_resolution,
    resolution_note: encounter.resolution_note,
    source_note: encounter.source_note,
    pin_state: "pending_approval",
    pin_reason: PENDING_PIN_REASON,
    pinned_by_actor_id: "the-middle-editor",
    assembly_event_id: assemblyEvent.event_id
  };
  await store.upsertEncounter(storedEncounter);

  for (const reason of rejected) {
    await store.insertImportRecord({
      collective_id: "the-middle-editorial",
      kind: "rejected",
      path: fixtureDir,
      reason
    });
  }

  return {
    encounterId: encounter.encounter_id,
    objectsInserted,
    eventsInserted,
    assertionsInserted,
    obligationsInserted,
    participantsInserted,
    assemblyEventId: assemblyEvent.event_id,
    rejected
  };
}

// --------------------------------------------------------------------------------------------
// Lenses (lenses/*.json)
// --------------------------------------------------------------------------------------------

export interface LensLoadSummary {
  loaded: string[];
  rejected: string[];
}

export async function loadLensesFromDir(store: LoaderStore, lensesDir: string): Promise<LensLoadSummary> {
  const files = readdirSync(lensesDir).filter((f) => f.endsWith(".json")).sort();
  const loaded: string[] = [];
  const rejected: string[] = [];
  for (const file of files) {
    const lens = readJson<StoredLensVersion>(path.join(lensesDir, file));
    const result = validateLens(lens);
    if (!result.valid) {
      rejected.push(`${file}: ${JSON.stringify(result.errors)}`);
      continue;
    }
    await store.upsertLensVersion(lens);
    loaded.push(`${lens.lens_id}@${lens.version}`);
  }
  return { loaded, rejected };
}

// --------------------------------------------------------------------------------------------
// Full bootstrap (used by both apps/loader and apps/project's no-DB dev mode)
// --------------------------------------------------------------------------------------------

export interface FullLoadSummary {
  seed: SeedSummary;
  bundles: BundleLoadSummary[];
  fixture: FixtureLoadSummary;
  lenses: LensLoadSummary;
}

export interface HydrationPaths {
  bundlesRootDir: string;
  fixtureDir: string;
  lensesDir: string;
}

/** Runs every hydration step, in the only order that satisfies referential dependencies
 * (actors/collectives before anything that references them; bundles and the fixture before
 * lenses, though lenses have no data dependency — kept last for readability only). Shared by
 * `apps/loader` (targets whatever store the CLI was given) and `apps/project`'s no-DB dev mode
 * (always builds a fresh `MemoryStore`, since there is no persistent process between CLI runs
 * — work order §0 "MemoryStore ... doubles as the no-DB local dev mode"). */
export async function runFullLoad(store: LoaderStore, paths: HydrationPaths): Promise<FullLoadSummary> {
  const seed = await seedActorsAndCollectives(store);
  const bundles = await loadAllBundlesFromRoot(store, paths.bundlesRootDir);
  const fixture = await loadFixtureEncounter(store, paths.fixtureDir);
  const lenses = await loadLensesFromDir(store, paths.lensesDir);
  return { seed, bundles, fixture, lenses };
}

/** Convenience for the no-DB dev mode: a fresh, fully-hydrated `MemoryStore` plus the same
 * summary `runFullLoad` returns. */
export async function hydrateMemoryStoreFromRepo(
  paths: HydrationPaths
): Promise<{ store: MemoryStore; summary: FullLoadSummary }> {
  const store = new MemoryStore();
  const summary = await runFullLoad(store, paths);
  return { store, summary };
}
