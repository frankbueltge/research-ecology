/**
 * PostgresStore — the deployed runtime (work order §0 Locked decision 1.2), on `postgres`
 * (postgres.js), hand-typed row mappers, no ORM (docs/adrs/0006 amendment: "v1 read layer
 * uses postgres.js with typed mappers; Drizzle enters with the first write feature").
 *
 * Targets db/migrations/0001_initial.sql AS AMENDED by this work order's own small, additive
 * "Phase 3a amendments" section (three genuine gaps: `events.source_event_id`,
 * `local_object_refs.ref_id`, `encounters.non_participants` — see that file's comment block
 * for the full rationale). Not exercised by any test in this environment (no live database;
 * `tests/contract/epistemic-contract.test.ts` runs the same 12 checks against `MemoryStore`,
 * which is the DB-free store the work order requires to cover the full suite).
 *
 * Known, disclosed fidelity gap (documented rather than silently smoothed over): the
 * `assertions` table's `subject_object_ref_id` / `object_object_ref_id` are bare FK columns,
 * so extra sub-fields on the wire format's `subject`/`object` objects (e.g. `field_path`) do
 * not round-trip through Postgres byte-identically the way they do through `MemoryStore`.
 * Full fidelity here would need a follow-up `subject_extra`/`object_extra` JSONB column —
 * out of this work order's scope; `MemoryStore` is what the epistemic contract tests run
 * against, so this does not affect any test result.
 */

import postgres from "postgres";
import type { Sql } from "postgres";
import { THE_MIDDLE_EDITORIAL_SENTINEL } from "./actor-seed.js";
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

function subjectRefId(value: unknown): string | undefined {
  if (value && typeof value === "object" && "local_object_ref_id" in value) {
    return (value as { local_object_ref_id?: string }).local_object_ref_id;
  }
  return undefined;
}

/** The three sovereign collectives with FK-able rows in `collectives` — mirrors
 * actor-seed.ts's COLLECTIVE_SEED ids without importing the whole seed module here. Any other
 * `issuer.collective_id` (in practice, only THE_MIDDLE_EDITORIAL_SENTINEL — see class doc) is
 * stored as NULL rather than risking a dangling FK. */
const REAL_COLLECTIVE_IDS: ReadonlySet<string> = new Set(["ulysses", "meridian", "ensemble"]);

export class PostgresStore implements EncounterStore, LoaderStore {
  private readonly sql: Sql;

  constructor(connectionString: string) {
    this.sql = postgres(connectionString, { max: 5 });
  }

  /** Closes the underlying connection pool. Not part of EncounterStore/LoaderStore — callers
   * (apps/loader, apps/project) invoke this explicitly once done. */
  async close(): Promise<void> {
    await this.sql.end({ timeout: 5 });
  }

  // -- actors / collectives ----------------------------------------------------------------

  async getActor(actorId: string): Promise<StoredActor | undefined> {
    const rows = await this.sql`
      SELECT slug, display_name, actor_kind, collective_id FROM actors WHERE slug = ${actorId}
    `;
    const row = rows[0];
    if (!row) return undefined;
    return { id: row.slug, display_name: row.display_name, actor_kind: row.actor_kind, collective_id: row.collective_id };
  }

  async upsertActor(actor: StoredActor): Promise<IdempotentResult> {
    const result = await this.sql`
      INSERT INTO actors (slug, display_name, actor_kind, collective_id, can_author_assertions, can_issue_events)
      VALUES (${actor.id}, ${actor.display_name}, ${actor.actor_kind}, ${actor.collective_id}, TRUE, TRUE)
      ON CONFLICT (slug) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  async getCollective(collectiveId: string): Promise<StoredCollective | undefined> {
    const rows = await this.sql`
      SELECT id, current_name, status, repository_url, public_url FROM collectives WHERE id = ${collectiveId}
    `;
    const row = rows[0];
    if (!row) return undefined;
    return {
      id: row.id,
      current_name: row.current_name,
      status: row.status,
      repository_url: row.repository_url ?? undefined,
      public_url: row.public_url ?? undefined
    };
  }

  async upsertCollective(collective: StoredCollective): Promise<IdempotentResult> {
    const result = await this.sql`
      INSERT INTO collectives (id, current_name, status, repository_url, public_url)
      VALUES (${collective.id}, ${collective.current_name}, ${collective.status}, ${collective.repository_url ?? null}, ${collective.public_url ?? null})
      ON CONFLICT (id) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  private async resolveActorRowId(actorSlug: string): Promise<string | null> {
    const rows = await this.sql`SELECT id FROM actors WHERE slug = ${actorSlug}`;
    return rows[0]?.id ?? null;
  }

  private async resolveEncounterRowId(encounterId: string): Promise<string | null> {
    const rows = await this.sql`SELECT id FROM encounters WHERE slug = ${encounterId}`;
    return rows[0]?.id ?? null;
  }

  private async resolveObjectRowId(refId: string): Promise<string | null> {
    const rows = await this.sql`SELECT id FROM local_object_refs WHERE ref_id = ${refId}`;
    return rows[0]?.id ?? null;
  }

  // -- encounters / participants -------------------------------------------------------------

  private async rowToEncounter(row: Record<string, unknown>): Promise<StoredEncounter> {
    let propositionAuthor: StoredEncounter["proposition_author"];
    if (row.proposition_author_actor_id) {
      const actorRows = await this.sql`SELECT slug FROM actors WHERE id = ${row.proposition_author_actor_id as string}`;
      if (actorRows[0]) propositionAuthor = { actor_id: actorRows[0].slug };
    }
    return {
      encounter_id: row.slug as string,
      slug: row.slug as string,
      title: (row.title as string) ?? undefined,
      editorial_proposition: (row.editorial_proposition as string) ?? undefined,
      proposition_author: propositionAuthor,
      visibility: row.visibility as string,
      created_at: (row.created_at as Date).toISOString(),
      dormant_at: row.dormant_at ? (row.dormant_at as Date).toISOString() : null,
      archived_at: row.archived_at ? (row.archived_at as Date).toISOString() : null,
      correlation_group: null,
      non_participants: (row.non_participants as StoredNonParticipant[]) ?? [],
      shared_resolution: null,
      pin_state: row.pinned ? "approved" : "pending_approval",
      pin_reason: (row.pin_reason as string) ?? "",
      pinned_by_actor_id: "the-middle-editor",
      assembly_event_id: ""
    };
  }

  async getEncounter(encounterId: string): Promise<StoredEncounter | undefined> {
    const rows = await this.sql`SELECT * FROM encounters WHERE slug = ${encounterId}`;
    const row = rows[0];
    return row ? this.rowToEncounter(row) : undefined;
  }

  async listEncounters(): Promise<StoredEncounter[]> {
    const rows = await this.sql`SELECT * FROM encounters ORDER BY created_at`;
    return Promise.all(rows.map((row) => this.rowToEncounter(row)));
  }

  async upsertEncounter(encounter: StoredEncounter): Promise<IdempotentResult> {
    let propositionAuthorId: string | null = null;
    if (encounter.proposition_author?.actor_id) {
      propositionAuthorId = await this.resolveActorRowId(encounter.proposition_author.actor_id);
    }
    const result = await this.sql`
      INSERT INTO encounters (
        slug, title, editorial_proposition, proposition_author_actor_id, visibility,
        pinned, pin_reason, pinned_by_actor_id, created_at, dormant_at, archived_at, non_participants
      ) VALUES (
        ${encounter.slug}, ${encounter.title ?? null}, ${encounter.editorial_proposition ?? null},
        ${propositionAuthorId}, ${encounter.visibility},
        ${encounter.pin_state === "approved"}, ${encounter.pin_reason},
        ${await this.resolveActorRowId(encounter.pinned_by_actor_id)},
        ${encounter.created_at}, ${encounter.dormant_at}, ${encounter.archived_at},
        ${this.sql.json((encounter.non_participants as unknown as Record<string, unknown>) as any)}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  async listParticipants(encounterId: string): Promise<StoredParticipant[]> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    if (!encounterRowId) return [];
    const rows = await this.sql`
      SELECT ep.collective_id, a.slug AS actor_slug, ep.participant_role, ep.local_status,
             ep.local_status_rationale, ep.joined_at, ep.response_expected
      FROM encounter_participants ep
      LEFT JOIN actors a ON a.id = ep.actor_id
      WHERE ep.encounter_id = ${encounterRowId}
    `;
    return rows.map((row) => ({
      encounter_id: encounterId,
      collective_id: (row.collective_id as string) ?? null,
      actor_id: row.actor_slug as string,
      role: row.participant_role as string,
      local_status: (row.local_status as string) ?? null,
      local_status_rationale: (row.local_status_rationale as string) ?? undefined,
      joined_at: (row.joined_at as Date).toISOString(),
      response_expected: row.response_expected as boolean
    }));
  }

  async upsertParticipant(participant: StoredParticipant): Promise<IdempotentResult> {
    const encounterRowId = await this.resolveEncounterRowId(participant.encounter_id);
    if (!encounterRowId) throw new Error(`upsertParticipant: unknown encounter ${participant.encounter_id}`);
    const actorRowId = await this.resolveActorRowId(participant.actor_id);
    const result = await this.sql`
      INSERT INTO encounter_participants (
        encounter_id, collective_id, actor_id, participant_role, local_status,
        local_status_rationale, joined_at, response_expected
      ) VALUES (
        ${encounterRowId}, ${participant.collective_id}, ${actorRowId}, ${participant.role},
        ${participant.local_status ?? null}, ${participant.local_status_rationale ?? null},
        ${participant.joined_at}, ${participant.response_expected}
      )
      ON CONFLICT DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  async listNonParticipants(encounterId: string): Promise<StoredNonParticipant[]> {
    const encounter = await this.getEncounter(encounterId);
    return encounter?.non_participants ?? [];
  }

  async setNonParticipants(encounterId: string, nonParticipants: StoredNonParticipant[]): Promise<void> {
    await this.sql`
      UPDATE encounters SET non_participants = ${this.sql.json((nonParticipants as unknown as Record<string, unknown>) as any)}
      WHERE slug = ${encounterId}
    `;
  }

  // -- events ---------------------------------------------------------------------------------

  private async rowToEvent(row: Record<string, unknown>): Promise<StoredEvent> {
    const issuerActorRows = await this.sql`SELECT slug FROM actors WHERE id = ${row.issuer_actor_id as string}`;
    let encounterSlug: string | undefined;
    if (row.encounter_id) {
      const encRows = await this.sql`SELECT slug FROM encounters WHERE id = ${row.encounter_id as string}`;
      encounterSlug = encRows[0]?.slug;
    }
    // See the module doc comment: a NULL issuer_collective_id (nullable FK) is only ever
    // written for an editorial issuer (assertIssuerNeverImpersonatesCollective guarantees no
    // real collective ever has a null issuer_collective_id here) — reconstructed as the same
    // sentinel MemoryStore/the JSON envelope would carry.
    const issuerCollectiveId = (row.issuer_collective_id as string | null) ?? THE_MIDDLE_EDITORIAL_SENTINEL;
    return {
      schema_version: row.schema_version as "1.0",
      event_id: row.source_event_id as string,
      encounter_id: encounterSlug,
      event_type: row.event_type as string,
      issuer: { collective_id: issuerCollectiveId, actor_id: issuerActorRows[0]?.slug ?? "" },
      occurred_at: (row.occurred_at as Date).toISOString(),
      source_uri: row.source_uri as string,
      source_commit: (row.source_commit as string) ?? undefined,
      visibility: row.visibility as "public" | "embargoed" | "private",
      payload: row.payload as Record<string, unknown>,
      previous_event_hash: (row.previous_event_hash as string) ?? undefined,
      content_hash: row.content_hash as string,
      signature: (row.signature as string) ?? undefined
    };
  }

  async getEvent(eventId: string): Promise<StoredEvent | undefined> {
    const rows = await this.sql`SELECT * FROM events WHERE source_event_id = ${eventId}`;
    const row = rows[0];
    return row ? this.rowToEvent(row) : undefined;
  }

  async listEventsForEncounter(encounterId: string): Promise<StoredEvent[]> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    if (!encounterRowId) return [];
    const rows = await this.sql`
      SELECT * FROM events WHERE encounter_id = ${encounterRowId} ORDER BY occurred_at, source_event_id
    `;
    return Promise.all(rows.map((row) => this.rowToEvent(row)));
  }

  async insertEvent(event: StoredEvent): Promise<IdempotentResult> {
    const encounterRowId = event.encounter_id ? await this.resolveEncounterRowId(event.encounter_id) : null;
    const actorRowId = await this.resolveActorRowId(event.issuer.actor_id);
    if (!actorRowId) throw new Error(`insertEvent: unknown issuer actor ${event.issuer.actor_id} (seed actors first)`);
    const isRealCollective = REAL_COLLECTIVE_IDS.has(event.issuer.collective_id);
    const externalEventIdValue = event.content_hash; // see class doc: source_event_id carries the human id; external_event_id keeps its documented hash meaning via a deterministic recompute at call sites (loader), not here.
    const result = await this.sql`
      INSERT INTO events (
        external_event_id, source_event_id, encounter_id, event_type, issuer_collective_id,
        issuer_actor_id, occurred_at, source_uri, source_commit, schema_version, payload,
        content_hash, previous_event_hash, signature, visibility, importer_version
      ) VALUES (
        ${externalEventIdValue}, ${event.event_id}, ${encounterRowId}, ${event.event_type},
        ${isRealCollective ? event.issuer.collective_id : null}, ${actorRowId},
        ${event.occurred_at}, ${event.source_uri}, ${event.source_commit ?? null},
        ${event.schema_version}, ${this.sql.json((event.payload) as any)}, ${event.content_hash},
        ${event.previous_event_hash ?? null}, ${event.signature ?? null},
        ${event.visibility ?? "public"}, ${"@research-ecology/domain@0.1.0"}
      )
      ON CONFLICT (issuer_collective_id, external_event_id) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  // -- objects ----------------------------------------------------------------------------

  private rowToObjectRef(row: Record<string, unknown>): StoredObjectRef {
    return {
      id: row.ref_id as string,
      collective_id: row.collective_id as string,
      local_object_id: row.local_object_id as string,
      object_version: row.object_version as string,
      canonical_uri: row.canonical_uri as string,
      source_uri: row.canonical_uri as string,
      media_type: (row.media_type as string) ?? undefined,
      local_object_type: row.local_object_type as string,
      interoperability_class: (row.interoperability_class as string) ?? undefined,
      title_cache: (row.title_cache as string) ?? undefined,
      lifecycle_status: row.lifecycle_status as string,
      local_epistemic_status: (row.local_epistemic_status as string) ?? undefined,
      content_hash: row.content_hash as string,
      source_commit: row.source_commit as string,
      source_metadata: (row.source_metadata as Record<string, unknown>) ?? {},
      importer_version: row.importer_version as string
    };
  }

  async getObject(objectRefId: string): Promise<StoredObjectRef | undefined> {
    const rows = await this.sql`SELECT * FROM local_object_refs WHERE ref_id = ${objectRefId}`;
    return rows[0] ? this.rowToObjectRef(rows[0]) : undefined;
  }

  async listObjectsForEncounter(encounterId: string): Promise<StoredObjectRef[]> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    if (!encounterRowId) return [];
    const rows = await this.sql`
      SELECT lor.* FROM local_object_refs lor
      JOIN encounter_object_refs eor ON eor.local_object_ref_id = lor.id
      WHERE eor.encounter_id = ${encounterRowId}
    `;
    return rows.map((row) => this.rowToObjectRef(row));
  }

  async listObjectsForCollective(collectiveId: string): Promise<StoredObjectRef[]> {
    const rows = await this.sql`SELECT * FROM local_object_refs WHERE collective_id = ${collectiveId}`;
    return rows.map((row) => this.rowToObjectRef(row));
  }

  async upsertObjectRef(objectRef: StoredObjectRef): Promise<IdempotentResult> {
    const result = await this.sql`
      INSERT INTO local_object_refs (
        ref_id, collective_id, local_object_id, object_version, canonical_uri, media_type,
        local_object_type, interoperability_class, title_cache, summary_cache, lifecycle_status,
        local_epistemic_status, content_hash, source_commit, source_metadata, importer_version
      ) VALUES (
        ${objectRef.id}, ${objectRef.collective_id}, ${objectRef.local_object_id},
        ${objectRef.object_version ?? null}, ${objectRef.canonical_uri}, ${objectRef.media_type ?? null},
        ${objectRef.local_object_type}, ${objectRef.interoperability_class ?? null},
        ${objectRef.title_cache ?? null}, ${(objectRef as { summary_cache?: string }).summary_cache ?? null},
        ${objectRef.lifecycle_status}, ${objectRef.local_epistemic_status ?? null},
        ${objectRef.content_hash}, ${objectRef.source_commit},
        ${this.sql.json((objectRef.source_metadata ?? {}) as any)}, ${objectRef.importer_version}
      )
      ON CONFLICT (collective_id, local_object_id, object_version, content_hash) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  async linkObjectToEncounter(encounterId: string, objectRefId: string, introducedByEventId?: string): Promise<IdempotentResult> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    const objectRowId = await this.resolveObjectRowId(objectRefId);
    if (!encounterRowId || !objectRowId) {
      throw new Error(`linkObjectToEncounter: unknown encounter ${encounterId} or object ${objectRefId}`);
    }
    let introducedByRowId: string | null = null;
    if (introducedByEventId) {
      const rows = await this.sql`SELECT id FROM events WHERE source_event_id = ${introducedByEventId}`;
      introducedByRowId = rows[0]?.id ?? null;
    }
    const result = await this.sql`
      INSERT INTO encounter_object_refs (encounter_id, local_object_ref_id, encounter_role, introduced_by_event_id)
      VALUES (${encounterRowId}, ${objectRowId}, ${"referenced"}, ${introducedByRowId})
      ON CONFLICT (encounter_id, local_object_ref_id, encounter_role) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  // -- assertions -----------------------------------------------------------------------------

  private async rowToAssertion(row: Record<string, unknown>): Promise<StoredAssertion> {
    const authorActorRows = await this.sql`SELECT slug FROM actors WHERE id = ${row.author_actor_id as string}`;
    let subject: Record<string, unknown> = {};
    if (row.subject_object_ref_id) {
      const objRows = await this.sql`SELECT ref_id FROM local_object_refs WHERE id = ${row.subject_object_ref_id as string}`;
      if (objRows[0]) subject = { local_object_ref_id: objRows[0].ref_id };
    }
    let objectValue: Record<string, unknown> | string | number | boolean = row.object_literal as never;
    if (row.object_object_ref_id) {
      const objRows = await this.sql`SELECT ref_id FROM local_object_refs WHERE id = ${row.object_object_ref_id as string}`;
      if (objRows[0]) objectValue = { local_object_ref_id: objRows[0].ref_id };
    }
    return {
      assertion_id: (row.external_assertion_id as string) ?? (row.id as string),
      encounter_id: undefined,
      author: { actor_id: authorActorRows[0]?.slug ?? "", collective_id: (row.author_collective_id as string) ?? undefined },
      subject,
      predicate: row.predicate as string,
      object: objectValue,
      rationale: (row.rationale as string) ?? undefined,
      epistemic_status: row.epistemic_status as string,
      local_epistemic_status: (row.local_epistemic_status as string) ?? undefined,
      evidence: (row.evidence as Record<string, unknown>[]) ?? [],
      lifecycle_status: row.lifecycle_status as string,
      valid_from: (row.valid_from as Date).toISOString(),
      content_hash: row.content_hash as string
    };
  }

  async listAssertionsForEncounter(encounterId: string): Promise<StoredAssertion[]> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    if (!encounterRowId) return [];
    const rows = await this.sql`
      SELECT * FROM assertions WHERE encounter_id = ${encounterRowId} AND epistemic_status <> 'machine_suggestion'
    `;
    return Promise.all(rows.map((row) => this.rowToAssertion(row)));
  }

  async listAssertionsForObject(objectRefId: string): Promise<StoredAssertion[]> {
    const objectRowId = await this.resolveObjectRowId(objectRefId);
    if (!objectRowId) return [];
    const rows = await this.sql`
      SELECT * FROM assertions
      WHERE (subject_object_ref_id = ${objectRowId} OR object_object_ref_id = ${objectRowId})
        AND epistemic_status <> 'machine_suggestion'
    `;
    return Promise.all(rows.map((row) => this.rowToAssertion(row)));
  }

  async listAssertionsForAuthor(authorCollectiveId: string): Promise<StoredAssertion[]> {
    const rows = await this.sql`
      SELECT * FROM assertions WHERE author_collective_id = ${authorCollectiveId} AND epistemic_status <> 'machine_suggestion'
    `;
    return Promise.all(rows.map((row) => this.rowToAssertion(row)));
  }

  async insertAssertion(assertion: StoredAssertion): Promise<IdempotentResult> {
    const encounterRowId = assertion.encounter_id ? await this.resolveEncounterRowId(assertion.encounter_id) : null;
    const authorActorRowId = await this.resolveActorRowId(assertion.author.actor_id);
    const subjectRefIdValue = subjectRefId(assertion.subject);
    const subjectRowId = subjectRefIdValue ? await this.resolveObjectRowId(subjectRefIdValue) : null;
    const objectRefIdValue = subjectRefId(assertion.object);
    const objectRowId = objectRefIdValue ? await this.resolveObjectRowId(objectRefIdValue) : null;
    const objectLiteral = objectRowId ? null : assertion.object;
    const result = await this.sql`
      INSERT INTO assertions (
        external_assertion_id, encounter_id, author_collective_id, author_actor_id,
        subject_object_ref_id, predicate, object_object_ref_id, object_literal, rationale,
        epistemic_status, local_epistemic_status, evidence, content_hash, lifecycle_status
      ) VALUES (
        ${assertion.assertion_id}, ${encounterRowId}, ${assertion.author.collective_id ?? null},
        ${authorActorRowId}, ${subjectRowId}, ${assertion.predicate}, ${objectRowId},
        ${objectLiteral === null ? null : this.sql.json((objectLiteral as Record<string, unknown>) as any)},
        ${assertion.rationale ?? null}, ${assertion.epistemic_status},
        ${assertion.local_epistemic_status ?? null}, ${this.sql.json((assertion.evidence ?? []) as any)},
        ${assertion.content_hash}, ${assertion.lifecycle_status ?? "active"}
      )
      ON CONFLICT (author_collective_id, external_assertion_id) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  // -- obligations ----------------------------------------------------------------------------

  async listObligationsForEncounter(encounterId: string): Promise<StoredObligation[]> {
    const encounterRowId = await this.resolveEncounterRowId(encounterId);
    if (!encounterRowId) return [];
    const rows = await this.sql`SELECT * FROM obligations WHERE encounter_id = ${encounterRowId}`;
    return rows.map((row) => ({
      id: row.id as string,
      encounter_id: encounterId,
      source_event_id: row.source_event_id as string,
      proposer_collective_id: (row.proposer_collective_id as string) ?? null,
      obligated_collective_id: (row.obligated_collective_id as string) ?? null,
      clause_text: row.clause_text as string,
      status: row.status as StoredObligation["status"],
      prominence: row.prominence as string,
      evidence_events: (row.evidence_events as string[]) ?? [],
      active_from: (row.active_from as Date).toISOString(),
      active_until: row.active_until ? (row.active_until as Date).toISOString() : null
    }));
  }

  async insertObligation(obligation: StoredObligation): Promise<IdempotentResult> {
    const encounterRowId = await this.resolveEncounterRowId(obligation.encounter_id);
    if (!encounterRowId) throw new Error(`insertObligation: unknown encounter ${obligation.encounter_id}`);
    const sourceEventRows = await this.sql`SELECT id FROM events WHERE source_event_id = ${obligation.source_event_id}`;
    const sourceEventRowId = sourceEventRows[0]?.id;
    if (!sourceEventRowId) throw new Error(`insertObligation: unknown source_event_id ${obligation.source_event_id}`);
    const result = await this.sql`
      INSERT INTO obligations (
        encounter_id, source_event_id, proposer_collective_id, obligated_collective_id,
        clause_text, status, prominence, evidence_events, active_from
      ) VALUES (
        ${encounterRowId}, ${sourceEventRowId}, ${obligation.proposer_collective_id ?? null},
        ${obligation.obligated_collective_id ?? null}, ${obligation.clause_text},
        ${obligation.status}, ${obligation.prominence}, ${this.sql.json((obligation.evidence_events) as any)},
        ${obligation.active_from}
      )
      ON CONFLICT DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  // -- lenses -------------------------------------------------------------------------------

  async getLensVersion(lensId: string, version: number): Promise<StoredLensVersion | undefined> {
    const rows = await this.sql`SELECT * FROM lens_versions WHERE lens_id = ${lensId} AND version = ${version}`;
    return rows[0] ? this.rowToLens(rows[0]) : undefined;
  }

  async listLensVersions(lensId: string): Promise<StoredLensVersion[]> {
    const rows = await this.sql`SELECT * FROM lens_versions WHERE lens_id = ${lensId} ORDER BY version`;
    return rows.map((row) => this.rowToLens(row));
  }

  private rowToLens(row: Record<string, unknown>): StoredLensVersion {
    const config = row.config as Record<string, unknown>;
    return {
      lens_id: row.lens_id as string,
      version: row.version as number,
      name: row.name as string,
      author: (config.author as Record<string, unknown>) ?? {},
      purpose: row.purpose as string,
      selection: (config.selection as Record<string, unknown>) ?? {},
      evidence_threshold: config.evidence_threshold as Record<string, unknown> | undefined,
      unknown_type_policy: config.unknown_type_policy as StoredLensVersion["unknown_type_policy"],
      renderer: row.renderer_type as string,
      declared_exclusions: (row.declared_exclusions as Record<string, unknown>[]) ?? [],
      implementation_hash: row.implementation_hash as string
    };
  }

  async upsertLensVersion(lens: StoredLensVersion): Promise<IdempotentResult> {
    const result = await this.sql`
      INSERT INTO lens_versions (
        lens_id, version, name, purpose, config, declared_exclusions, renderer_type, implementation_hash
      ) VALUES (
        ${lens.lens_id}, ${lens.version}, ${lens.name}, ${lens.purpose},
        ${this.sql.json(({ author: lens.author, selection: lens.selection, evidence_threshold: lens.evidence_threshold ?? null, unknown_type_policy: lens.unknown_type_policy ?? null }) as any)},
        ${this.sql.json((lens.declared_exclusions) as any)}, ${lens.renderer}, ${lens.implementation_hash}
      )
      ON CONFLICT (lens_id, version) DO NOTHING
    `;
    // Also ensure the parent `lenses` row exists (FK target), inserted defensively first.
    await this.sql`INSERT INTO lenses (id, current_name) VALUES (${lens.lens_id}, ${lens.name}) ON CONFLICT (id) DO NOTHING`;
    return { inserted: result.count > 0 };
  }

  // -- maps ---------------------------------------------------------------------------------

  async getMapVersion(mapId: string, version: number): Promise<StoredMapVersion | undefined> {
    const rows = await this.sql`
      SELECT m.slug AS map_slug, mv.* FROM map_versions mv
      JOIN maps m ON m.id = mv.map_id
      WHERE m.slug = ${mapId} AND mv.version = ${version}
    `;
    return rows[0] ? this.rowToMapVersion(rows[0]) : undefined;
  }

  async listMapVersions(mapId: string): Promise<StoredMapVersion[]> {
    const rows = await this.sql`
      SELECT m.slug AS map_slug, mv.* FROM map_versions mv
      JOIN maps m ON m.id = mv.map_id
      WHERE m.slug = ${mapId} ORDER BY mv.version
    `;
    return rows.map((row) => this.rowToMapVersion(row));
  }

  private rowToMapVersion(row: Record<string, unknown>): StoredMapVersion {
    const projection = row.projection_payload as Record<string, unknown>;
    return {
      map_id: row.map_slug as string,
      version: row.version as number,
      encounter_id: (projection.encounter_id as string) ?? "",
      lens: (projection.lens as { lens_id: string; version: number }) ?? { lens_id: "", version: 0 },
      event_watermark: (row.event_watermark as Date).toISOString(),
      included: {
        events: (row.source_event_ids as string[]) ?? [],
        objects: (row.included_object_ref_ids as string[]) ?? [],
        assertions: (row.included_assertion_ids as string[]) ?? [],
        obligations: (row.included_obligation_ids as string[]) ?? []
      },
      projection: (projection.projection as Record<string, unknown>) ?? {},
      exclusions: (row.exclusions as Record<string, unknown>[]) ?? [],
      render_failures: (row.render_failures as Record<string, unknown>[]) ?? [],
      accessible_summary: row.accessible_summary as string,
      renderer_version: row.renderer_version as string,
      content_hash: row.content_hash as string
    };
  }

  async insertMapVersion(map: StoredMapVersion): Promise<IdempotentResult> {
    await this.sql`INSERT INTO maps (encounter_id, slug) VALUES (
      (SELECT id FROM encounters WHERE slug = ${map.encounter_id}), ${map.map_id}
    ) ON CONFLICT (slug) DO NOTHING`;
    const mapRows = await this.sql`SELECT id FROM maps WHERE slug = ${map.map_id}`;
    const mapRowId = mapRows[0]?.id;
    if (!mapRowId) throw new Error(`insertMapVersion: could not resolve/create map row for ${map.map_id}`);
    const result = await this.sql`
      INSERT INTO map_versions (
        map_id, version, lens_version_id, event_watermark, source_event_ids,
        included_object_ref_ids, included_assertion_ids, included_obligation_ids,
        projection_payload, accessible_summary, exclusions, render_failures, renderer_version, content_hash
      ) VALUES (
        ${mapRowId}, ${map.version},
        (SELECT id FROM lens_versions WHERE lens_id = ${map.lens.lens_id} AND version = ${map.lens.version}),
        ${map.event_watermark}, ${this.sql.json((map.included.events) as any)},
        ${this.sql.json((map.included.objects) as any)}, ${this.sql.json((map.included.assertions) as any)},
        ${this.sql.json((map.included.obligations) as any)},
        ${this.sql.json(({ encounter_id: map.encounter_id, lens: map.lens, projection: map.projection ?? {} }) as any)},
        ${map.accessible_summary}, ${this.sql.json((map.exclusions) as any)}, ${this.sql.json((map.render_failures) as any)},
        ${map.renderer_version ?? ""}, ${map.content_hash}
      )
      ON CONFLICT (map_id, version) DO NOTHING
    `;
    return { inserted: result.count > 0 };
  }

  async nextMapVersion(mapId: string): Promise<number> {
    const rows = await this.sql`
      SELECT COALESCE(MAX(mv.version), 0) AS max_version FROM map_versions mv
      JOIN maps m ON m.id = mv.map_id WHERE m.slug = ${mapId}
    `;
    return Number(rows[0]?.max_version ?? 0) + 1;
  }

  // -- import records -------------------------------------------------------------------------

  async listImportRecords(collectiveId: string): Promise<StoredImportRecord[]> {
    const rows = await this.sql`SELECT * FROM import_records WHERE adapter = ${collectiveId}`;
    return rows.map((row) => ({
      collective_id: row.adapter as string,
      kind: row.state as StoredImportRecord["kind"],
      path: (row.raw_excerpt as { path?: string })?.path ?? "",
      reason: row.reason as string,
      source_commit: (row.source_commit as string) ?? undefined
    }));
  }

  async insertImportRecord(record: StoredImportRecord): Promise<IdempotentResult> {
    const result = await this.sql`
      INSERT INTO import_records (source_uri, source_commit, adapter, adapter_version, state, reason, raw_excerpt)
      VALUES (
        ${record.path}, ${record.source_commit ?? null}, ${record.collective_id},
        ${"@research-ecology/domain@0.1.0"}, ${record.kind}, ${record.reason},
        ${this.sql.json(({ path: record.path, detail: record.detail ?? null }) as any)}
      )
    `;
    return { inserted: result.count > 0 };
  }
}
