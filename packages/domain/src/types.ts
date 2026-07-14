/**
 * Domain record shapes (work order: phase-3a-domain-loader-projections.md).
 *
 * These mirror the Phase-1 protocol wire types (packages/protocol/src/types.ts) and the
 * Phase-2 bundle types (packages/adapters/src/types.ts) closely on purpose: the store does
 * not reshape or rename anything the loader validated — it only adds the handful of
 * store-managed fields spec 05 describes (encounter_id linkage, editorial pin state,
 * append-only bookkeeping). Every open-string field from the wire types (event_type,
 * predicate, local_object_type, local_epistemic_status, ...) stays `string` here too —
 * narrowing them to an enum would silently reject the next unknown type spec 05 §11.6/§11.11
 * requires the system to survive.
 */

import type {
  AssertionRecord,
  EncounterEvent,
  LensDefinition,
  MapManifest
} from "../../protocol/src/index.js";
import type { LocalObjectRef } from "../../adapters/src/index.js";

/** spec 05 §3.3 — accountable sources of events and assertions. */
export type ActorKind =
  | "human"
  | "collective"
  | "persona"
  | "model_runtime"
  | "automation"
  | "visitor"
  | "institution"
  | "system_component"
  | "unknown";

export interface StoredActor {
  id: string;
  display_name: string;
  actor_kind: ActorKind;
  /** null for actors that do not belong to one of the three sovereign collectives
   * (frank-bueltge, the-middle-editor, the-middle-importer, fable, ...). */
  collective_id: string | null;
  note?: string;
}

/** spec 05 §3.1 — stable federation identity. Distinct from `StoredActor`: a collective is a
 * sovereign practice, not an accountable individual event/assertion issuer, even though one
 * of its personas (meridian/ensemble/ulysses) also appears as an actor of kind "collective"
 * or "persona" for issuer/author attribution. */
export interface StoredCollective {
  id: string;
  current_name: string;
  status: "active" | "dormant" | "left" | "archived";
  repository_url?: string;
  public_url?: string;
}

/** A `local_object_refs` row — reuses the Phase-2 bundle shape verbatim (work order §0). */
export type StoredObjectRef = LocalObjectRef;

/** An `events` row: the Phase-1 wire event, plus the encounter linkage a bundle-level event
 * never carries (adapters deliberately never emit `encounter_id`, work order §0). */
export type StoredEvent = EncounterEvent & { encounter_id?: string };

/** An `assertions` row: the Phase-1 wire assertion, unchanged in shape. Bundle-level
 * assertions (e.g. Ulysses' rhizome edges) carry no `encounter_id`; fixture assertions do. */
export type StoredAssertion = AssertionRecord;

/** An `obligations` row (spec 05 §3.10), matching the fixture's obligations.json shape. */
export interface StoredObligation {
  id: string;
  encounter_id: string;
  source_event_id: string;
  proposer_collective_id?: string | null;
  obligated_collective_id?: string | null;
  clause_text: string;
  clause_source?: string;
  instantiation_quote?: string;
  instantiation_source?: string;
  status: "proposed" | "active" | "fulfilled" | "breached" | "disputed" | "expired" | "superseded";
  prominence: string;
  accepted_by_event_id?: string;
  evidence_events: string[];
  active_from: string;
  active_until?: string | null;
  note?: string;
  [key: string]: unknown;
}

/** spec 05 §3.6 — participant linkage; matches the fixture's `encounter.json` participants[]. */
export interface StoredParticipant {
  encounter_id: string;
  collective_id: string | null;
  actor_id: string;
  role: string;
  local_status?: string | null;
  local_status_rationale?: string;
  joined_at: string;
  response_expected: boolean;
}

export interface StoredNonParticipant {
  collective_id: string;
  note: string;
}

/** spec 05 §3.5 — bounded shared history, plus the store-managed editorial pin state design
 * §6 describes (never present in the immutable fixture JSON itself — the loader adds it). */
export interface StoredEncounter {
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
  non_participants: StoredNonParticipant[];
  shared_resolution: string | null;
  resolution_note?: string;
  source_note?: string;
  /** Store-managed editorial pin state (design §6), set by the loader — never read from the
   * fixture JSON, which carries no pin fields at all. */
  pin_state: "pending_approval" | "approved";
  pin_reason: string;
  pinned_by_actor_id: string;
  /** The synthesized `editorial.encounter_assembled` event id (see hydrate.ts). */
  assembly_event_id: string;
}

/** A `lens_versions` row — the Phase-1 wire lens definition, unchanged in shape. */
export type StoredLensVersion = LensDefinition;

/** A `map_versions` row — the projection engine's output plus store-assigned identity
 * (map_id/version are NOT part of the content_hash basis; see packages/projections). */
export type StoredMapVersion = MapManifest;

/** spec 05 §3.15 — first-class declaration of what a bundle path could not become a record. */
export interface StoredImportRecord {
  collective_id: string;
  /** Matches db/migrations/0001_initial.sql `import_records.state` CHECK exactly — a superset
   * of the Phase-2 adapter `ImportRecord.kind` ("ambiguous" | "unsupported") because the
   * loader itself can also produce "rejected" (failed packages/protocol validation) and,
   * later, "superseded" rows. */
  kind: "ambiguous" | "unsupported" | "rejected" | "superseded";
  path: string;
  reason: string;
  detail?: string;
  source_commit?: string;
}

export interface IdempotentResult {
  /** false when an existing row with the same Phase-1 unique key already satisfied the
   * upsert (`ON CONFLICT ... DO NOTHING`, work order §0) — never an error. */
  inserted: boolean;
}
