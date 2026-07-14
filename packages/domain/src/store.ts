/**
 * `EncounterStore` (read) / `LoaderStore` (write) — the domain API (work order §0 Locked
 * decisions). Split deliberately: projections and any future UI code depend only on
 * `EncounterStore`; only the loader depends on `LoaderStore`. Two implementations share
 * both interfaces: `MemoryStore` (memory-store.ts, the no-DB dev/test store) and
 * `PostgresStore` (postgres-store.ts, the deployed runtime).
 *
 * Every read method is deliberately SCOPED (per encounter / per object / per author) —
 * epistemic contract test 1 (spec 09 §8): "no store method returns a global edge list".
 * There is no `listAllAssertions()` / `listAllEvents()` anywhere below; the two type-level
 * checks at the bottom of this file make that a compile error, not just a convention, if
 * anyone ever adds one back.
 */

import type {
  IdempotentResult,
  StoredActor,
  StoredAssertion,
  StoredCollective,
  StoredEncounter,
  StoredEvent,
  StoredImportRecord,
  StoredLensVersion,
  StoredMapVersion,
  StoredNonParticipant,
  StoredObjectRef,
  StoredObligation,
  StoredParticipant
} from "./types.js";

export interface EncounterStore {
  getActor(actorId: string): Promise<StoredActor | undefined>;
  getCollective(collectiveId: string): Promise<StoredCollective | undefined>;

  getEncounter(encounterId: string): Promise<StoredEncounter | undefined>;
  /** Every encounter The Middle currently holds. Not a "global edge list" (spec 09 §8 test 1
   * targets relations — assertions/events — not the bounded, already-public list of
   * encounters themselves, which is the same resource `/encounters` would list in 3b). */
  listEncounters(): Promise<StoredEncounter[]>;
  listParticipants(encounterId: string): Promise<StoredParticipant[]>;
  listNonParticipants(encounterId: string): Promise<StoredNonParticipant[]>;

  getEvent(eventId: string): Promise<StoredEvent | undefined>;
  listEventsForEncounter(encounterId: string): Promise<StoredEvent[]>;

  getObject(objectRefId: string): Promise<StoredObjectRef | undefined>;
  listObjectsForEncounter(encounterId: string): Promise<StoredObjectRef[]>;
  listObjectsForCollective(collectiveId: string): Promise<StoredObjectRef[]>;

  /** Scope 1/3: by encounter. Excludes epistemic_status "machine_suggestion" unconditionally
   * (contract test 6), independent of whatever the loader already enforced on the way in. */
  listAssertionsForEncounter(encounterId: string): Promise<StoredAssertion[]>;
  /** Scope 2/3: by the object a claim is made about (subject or object reference). */
  listAssertionsForObject(objectRefId: string): Promise<StoredAssertion[]>;
  /** Scope 3/3: by authoring collective — the only scope under which bundle-level assertions
   * with no encounter_id (e.g. Ulysses' rhizome edges) are reachable at all (contract test 11). */
  listAssertionsForAuthor(authorCollectiveId: string): Promise<StoredAssertion[]>;

  listObligationsForEncounter(encounterId: string): Promise<StoredObligation[]>;

  getLensVersion(lensId: string, version: number): Promise<StoredLensVersion | undefined>;
  listLensVersions(lensId: string): Promise<StoredLensVersion[]>;

  getMapVersion(mapId: string, version: number): Promise<StoredMapVersion | undefined>;
  listMapVersions(mapId: string): Promise<StoredMapVersion[]>;

  listImportRecords(collectiveId: string): Promise<StoredImportRecord[]>;
}

export interface LoaderStore {
  upsertActor(actor: StoredActor): Promise<IdempotentResult>;
  upsertCollective(collective: StoredCollective): Promise<IdempotentResult>;

  /** Idempotent on (encounter_id) — reloading the same fixture is a no-op after the first
   * load (work order §0 "idempotent upserts"). */
  upsertEncounter(encounter: StoredEncounter): Promise<IdempotentResult>;
  upsertParticipant(participant: StoredParticipant): Promise<IdempotentResult>;
  setNonParticipants(encounterId: string, nonParticipants: StoredNonParticipant[]): Promise<void>;

  /** Idempotent on the Phase-1 unique key (collective_id, local_object_id, object_version,
   * content_hash) — db/migrations/0001_initial.sql `local_object_refs`. */
  upsertObjectRef(objectRef: StoredObjectRef): Promise<IdempotentResult>;
  /** Links an already-upserted object into an encounter's visible set (`encounter_object_refs`,
   * spec 05 §3.4). Idempotent on (encounter_id, object_ref_id). */
  linkObjectToEncounter(encounterId: string, objectRefId: string, introducedByEventId?: string): Promise<IdempotentResult>;

  /**
   * Append-only. Idempotent on (issuer_collective_id, external_event_id) — the deterministic
   * key from `@research-ecology/protocol`'s `externalEventId()` (db/migrations `events` table).
   * There is deliberately no `updateEvent`/`deleteEvent` here (contract test 8): a correction
   * is always a NEW event (`corrects_event_id` pointing back), never a mutation.
   */
  insertEvent(event: StoredEvent): Promise<IdempotentResult>;

  /** Idempotent on assertion_id. Stores whatever the caller passes — schema/business-rule
   * validation (rejecting epistemic_status "machine_suggestion") is the LOADER's job via
   * packages/protocol's validateAssertion, deliberately not re-done here, so contract test 6
   * can seed a poisoned record straight into the store and prove the READ-side filter still
   * holds independently. */
  insertAssertion(assertion: StoredAssertion): Promise<IdempotentResult>;

  insertObligation(obligation: StoredObligation): Promise<IdempotentResult>;

  upsertLensVersion(lens: StoredLensVersion): Promise<IdempotentResult>;

  /** Append-only. Idempotent on (map_id, version) AND globally unique on content_hash
   * (db/migrations `map_versions` UNIQUE(content_hash)) — a re-projection of identical inputs
   * at the same version is a no-op; a new watermark always becomes a NEW version, never an
   * overwrite (contract test 9). */
  insertMapVersion(map: StoredMapVersion): Promise<IdempotentResult>;
  /** The next sequential version number for a given map_id (1 if none exist yet) — the only
   * store-side sequencing packages/projections' pure `project()` itself never performs. */
  nextMapVersion(mapId: string): Promise<number>;

  insertImportRecord(record: StoredImportRecord): Promise<IdempotentResult>;
}

// ---------------------------------------------------------------------------------------
// Compile-time epistemic contract checks (spec 09 §8 / work order §1).
// ---------------------------------------------------------------------------------------

/** No method on the read API returns an unscoped, global relation list. If this widens to
 * `false`, `npm run typecheck` fails: `_noGlobalEdgeListMethod` would no longer be
 * assignable to `true`. */
type ForbiddenGlobalMethodNames =
  | "listAllAssertions"
  | "listAssertions"
  | "getAllAssertions"
  | "allAssertions"
  | "listAllEvents"
  | "getAllEvents"
  | "assertionEdges"
  | "edges";
type HasNoGlobalEdgeListMethod<T> = Extract<keyof T, ForbiddenGlobalMethodNames> extends never ? true : false;
const _noGlobalEdgeListMethod: HasNoGlobalEdgeListMethod<EncounterStore> = true;

/** Events are append-only at the store-interface level: no method exists to mutate or
 * delete a stored event row (contract test 8 — corrections are always new rows). */
type ForbiddenEventMutationMethodNames = "updateEvent" | "deleteEvent" | "patchEvent" | "mutateEvent" | "removeEvent";
type HasNoEventMutationMethod<T> = Extract<keyof T, ForbiddenEventMutationMethodNames> extends never ? true : false;
const _noEventMutationMethod: HasNoEventMutationMethod<LoaderStore> = true;

/** Exported so contract tests can assert on these at runtime too (work order §1 test 1: "at
 * the type level ... AND at runtime"). Both are always `true` once this module type-checks —
 * the interesting failure mode is a build break, not a runtime `false`. */
export const EPISTEMIC_COMPILE_CHECKS = {
  noGlobalEdgeListMethod: _noGlobalEdgeListMethod,
  noEventMutationMethod: _noEventMutationMethod
} as const;
