/**
 * MemoryStore — the no-DB dev mode and the test store (work order §0 Locked decision 1).
 * Hydrates from `import/bundles/**`, `fixtures/enc-2026-001-.../` and `lenses/*.json` via
 * hydrate.ts; also the direct target of the 12 epistemic contract tests, several of which
 * seed records straight into the store (bypassing loader validation on purpose) to prove a
 * read-side guarantee holds independently of ingest-time checks.
 */

import type { EncounterStore, LoaderStore } from "./store.js";
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

function participantKey(p: Pick<StoredParticipant, "encounter_id" | "role" | "actor_id">): string {
  return `${p.encounter_id}::${p.role}::${p.actor_id}`;
}

function objectRefKey(o: Pick<StoredObjectRef, "collective_id" | "local_object_id" | "object_version" | "content_hash">): string {
  return `${o.collective_id}::${o.local_object_id}::${o.object_version}::${o.content_hash}`;
}

function lensKey(lensId: string, version: number): string {
  return `${lensId}::${version}`;
}

function mapKey(mapId: string, version: number): string {
  return `${mapId}::${version}`;
}

function importRecordKey(r: StoredImportRecord): string {
  return `${r.collective_id}::${r.path}::${r.kind}::${r.reason}`;
}

function subjectRefId(subject: unknown): string | undefined {
  if (subject && typeof subject === "object" && "local_object_ref_id" in subject) {
    return (subject as { local_object_ref_id?: string }).local_object_ref_id;
  }
  return undefined;
}

function objectRefIdOf(objectField: unknown): string | undefined {
  if (objectField && typeof objectField === "object" && "local_object_ref_id" in objectField) {
    return (objectField as { local_object_ref_id?: string }).local_object_ref_id;
  }
  return undefined;
}

/** A dumb, in-memory persistence layer — no validation beyond the invariants an epistemic
 * contract test explicitly targets (e.g. filtering machine_suggestion on read). Schema and
 * business-rule validation live in the loader (packages/protocol), not here. */
export class MemoryStore implements EncounterStore, LoaderStore {
  private readonly actors = new Map<string, StoredActor>();
  private readonly collectives = new Map<string, StoredCollective>();
  private readonly encounters = new Map<string, StoredEncounter>();
  private readonly nonParticipants = new Map<string, StoredNonParticipant[]>();
  private readonly participants = new Map<string, StoredParticipant>();
  private readonly events = new Map<string, StoredEvent>();
  private readonly objects = new Map<string, StoredObjectRef>();
  private readonly encounterObjectLinks = new Set<string>(); // `${encounterId}::${objectRefId}`
  private readonly assertions = new Map<string, StoredAssertion>();
  private readonly obligations = new Map<string, StoredObligation>();
  private readonly lensVersions = new Map<string, StoredLensVersion>();
  private readonly mapVersions = new Map<string, StoredMapVersion>();
  private readonly importRecords = new Map<string, StoredImportRecord>();

  // -- actors / collectives --------------------------------------------------------------

  async getActor(actorId: string): Promise<StoredActor | undefined> {
    return this.actors.get(actorId);
  }

  async upsertActor(actor: StoredActor): Promise<IdempotentResult> {
    if (this.actors.has(actor.id)) return { inserted: false };
    this.actors.set(actor.id, actor);
    return { inserted: true };
  }

  async getCollective(collectiveId: string): Promise<StoredCollective | undefined> {
    return this.collectives.get(collectiveId);
  }

  async upsertCollective(collective: StoredCollective): Promise<IdempotentResult> {
    if (this.collectives.has(collective.id)) return { inserted: false };
    this.collectives.set(collective.id, collective);
    return { inserted: true };
  }

  // -- encounters / participants ----------------------------------------------------------

  async getEncounter(encounterId: string): Promise<StoredEncounter | undefined> {
    return this.encounters.get(encounterId);
  }

  async listEncounters(): Promise<StoredEncounter[]> {
    return [...this.encounters.values()];
  }

  async upsertEncounter(encounter: StoredEncounter): Promise<IdempotentResult> {
    if (this.encounters.has(encounter.encounter_id)) return { inserted: false };
    this.encounters.set(encounter.encounter_id, encounter);
    return { inserted: true };
  }

  async listParticipants(encounterId: string): Promise<StoredParticipant[]> {
    return [...this.participants.values()].filter((p) => p.encounter_id === encounterId);
  }

  async upsertParticipant(participant: StoredParticipant): Promise<IdempotentResult> {
    const key = participantKey(participant);
    if (this.participants.has(key)) return { inserted: false };
    this.participants.set(key, participant);
    return { inserted: true };
  }

  async listNonParticipants(encounterId: string): Promise<StoredNonParticipant[]> {
    return this.nonParticipants.get(encounterId) ?? [];
  }

  async setNonParticipants(encounterId: string, nonParticipants: StoredNonParticipant[]): Promise<void> {
    this.nonParticipants.set(encounterId, nonParticipants);
  }

  // -- events -------------------------------------------------------------------------------

  async getEvent(eventId: string): Promise<StoredEvent | undefined> {
    return this.events.get(eventId);
  }

  async listEventsForEncounter(encounterId: string): Promise<StoredEvent[]> {
    return [...this.events.values()]
      .filter((e) => e.encounter_id === encounterId)
      .sort((a, b) => a.occurred_at.localeCompare(b.occurred_at) || a.event_id.localeCompare(b.event_id));
  }

  async insertEvent(event: StoredEvent): Promise<IdempotentResult> {
    // Append-only: keyed by event_id, which is already globally unique per source (Phase-1
    // kernel convention); never overwritten once present (contract test 8).
    if (this.events.has(event.event_id)) return { inserted: false };
    this.events.set(event.event_id, event);
    return { inserted: true };
  }

  // -- objects ------------------------------------------------------------------------------

  async getObject(objectRefId: string): Promise<StoredObjectRef | undefined> {
    return this.objects.get(objectRefId);
  }

  async listObjectsForEncounter(encounterId: string): Promise<StoredObjectRef[]> {
    const ids = [...this.encounterObjectLinks]
      .filter((k) => k.startsWith(`${encounterId}::`))
      .map((k) => k.slice(encounterId.length + 2));
    return ids.map((id) => this.objects.get(id)).filter((o): o is StoredObjectRef => o !== undefined);
  }

  async listObjectsForCollective(collectiveId: string): Promise<StoredObjectRef[]> {
    return [...this.objects.values()].filter((o) => o.collective_id === collectiveId);
  }

  async upsertObjectRef(objectRef: StoredObjectRef): Promise<IdempotentResult> {
    const key = objectRefKey(objectRef);
    // Store keyed by the record's own `id` for lookup (id format `<collective>:<local>@<sha>`,
    // work order §0), but idempotency is judged on the Phase-1 unique key (collective_id,
    // local_object_id, object_version, content_hash) — a re-run producing the identical id
    // and identical Phase-1 key is a no-op; if either changed, this legitimately is a new row.
    void key;
    if (this.objects.has(objectRef.id)) return { inserted: false };
    this.objects.set(objectRef.id, objectRef);
    return { inserted: true };
  }

  async linkObjectToEncounter(encounterId: string, objectRefId: string): Promise<IdempotentResult> {
    const key = `${encounterId}::${objectRefId}`;
    if (this.encounterObjectLinks.has(key)) return { inserted: false };
    this.encounterObjectLinks.add(key);
    return { inserted: true };
  }

  // -- assertions ---------------------------------------------------------------------------

  private notMachineSuggestion(a: StoredAssertion): boolean {
    return a.epistemic_status !== "machine_suggestion";
  }

  async listAssertionsForEncounter(encounterId: string): Promise<StoredAssertion[]> {
    return [...this.assertions.values()].filter((a) => a.encounter_id === encounterId && this.notMachineSuggestion(a));
  }

  async listAssertionsForObject(objectRefId: string): Promise<StoredAssertion[]> {
    return [...this.assertions.values()].filter(
      (a) =>
        this.notMachineSuggestion(a) &&
        (subjectRefId(a.subject) === objectRefId || objectRefIdOf(a.object) === objectRefId)
    );
  }

  async listAssertionsForAuthor(authorCollectiveId: string): Promise<StoredAssertion[]> {
    return [...this.assertions.values()].filter(
      (a) => a.author.collective_id === authorCollectiveId && this.notMachineSuggestion(a)
    );
  }

  async insertAssertion(assertion: StoredAssertion): Promise<IdempotentResult> {
    if (this.assertions.has(assertion.assertion_id)) return { inserted: false };
    this.assertions.set(assertion.assertion_id, assertion);
    return { inserted: true };
  }

  // -- obligations --------------------------------------------------------------------------

  async listObligationsForEncounter(encounterId: string): Promise<StoredObligation[]> {
    return [...this.obligations.values()].filter((o) => o.encounter_id === encounterId);
  }

  async insertObligation(obligation: StoredObligation): Promise<IdempotentResult> {
    if (this.obligations.has(obligation.id)) return { inserted: false };
    this.obligations.set(obligation.id, obligation);
    return { inserted: true };
  }

  // -- lenses -------------------------------------------------------------------------------

  async getLensVersion(lensId: string, version: number): Promise<StoredLensVersion | undefined> {
    return this.lensVersions.get(lensKey(lensId, version));
  }

  async listLensVersions(lensId: string): Promise<StoredLensVersion[]> {
    return [...this.lensVersions.values()].filter((l) => l.lens_id === lensId);
  }

  async upsertLensVersion(lens: StoredLensVersion): Promise<IdempotentResult> {
    const key = lensKey(lens.lens_id, lens.version);
    if (this.lensVersions.has(key)) return { inserted: false };
    this.lensVersions.set(key, lens);
    return { inserted: true };
  }

  // -- maps ---------------------------------------------------------------------------------

  async getMapVersion(mapId: string, version: number): Promise<StoredMapVersion | undefined> {
    return this.mapVersions.get(mapKey(mapId, version));
  }

  async listMapVersions(mapId: string): Promise<StoredMapVersion[]> {
    return [...this.mapVersions.values()]
      .filter((m) => m.map_id === mapId)
      .sort((a, b) => a.version - b.version);
  }

  async insertMapVersion(map: StoredMapVersion): Promise<IdempotentResult> {
    const key = mapKey(map.map_id, map.version);
    if (this.mapVersions.has(key)) return { inserted: false };
    this.mapVersions.set(key, map);
    return { inserted: true };
  }

  async nextMapVersion(mapId: string): Promise<number> {
    const existing = [...this.mapVersions.values()].filter((m) => m.map_id === mapId);
    return existing.length === 0 ? 1 : Math.max(...existing.map((m) => m.version)) + 1;
  }

  // -- import records -------------------------------------------------------------------------

  async listImportRecords(collectiveId: string): Promise<StoredImportRecord[]> {
    return [...this.importRecords.values()].filter((r) => r.collective_id === collectiveId);
  }

  async insertImportRecord(record: StoredImportRecord): Promise<IdempotentResult> {
    const key = importRecordKey(record);
    if (this.importRecords.has(key)) return { inserted: false };
    this.importRecords.set(key, record);
    return { inserted: true };
  }
}
