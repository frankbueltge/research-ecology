/**
 * Projection input/output shapes (work order §0 Locked decision "Projection engine").
 *
 * Deliberately NOT imported from `@research-ecology/domain`: this package must stay pure and
 * decoupled (no I/O, work order critical rule) — `packages/domain`'s stores are the only
 * thing that touches disk/network. These structural types are duck-type compatible with
 * `packages/domain`'s `Stored*` types (a superset), so `apps/project` can pass store records
 * straight through without any conversion step.
 */

export interface ProjectionEncounter {
  encounter_id: string;
  title?: string;
  editorial_proposition?: string;
  visibility: string;
  shared_resolution: string | null;
  resolution_note?: string;
}

export interface ProjectionParticipant {
  collective_id: string | null;
  actor_id: string;
  role: string;
  local_status?: string | null;
  local_status_rationale?: string;
}

export interface ProjectionEvent {
  event_id: string;
  event_type: string;
  issuer: { collective_id: string; actor_id: string };
  occurred_at: string;
  source_uri: string;
  source_commit?: string;
  payload: Record<string, unknown>;
  content_hash: string;
}

export interface ProjectionObject {
  id: string;
  collective_id: string;
  local_object_id: string;
  canonical_uri: string;
  local_object_type: string;
  interoperability_class?: string;
  title_cache?: string;
  summary_cache?: string;
  lifecycle_status: string;
  local_epistemic_status?: string;
  content_hash: string;
}

export interface ProjectionAssertion {
  assertion_id: string;
  author: { actor_id: string; collective_id?: string };
  subject: Record<string, unknown>;
  predicate: string;
  object: Record<string, unknown> | string | number | boolean;
  rationale?: string;
  epistemic_status: string;
  local_epistemic_status?: string;
  valid_from?: string;
  content_hash: string;
}

export interface ProjectionObligation {
  id: string;
  source_event_id: string;
  proposer_collective_id?: string | null;
  obligated_collective_id?: string | null;
  clause_text: string;
  status: string;
  prominence: string;
  active_from: string;
}

export interface ProjectionInput {
  encounter: ProjectionEncounter;
  participants: ProjectionParticipant[];
  events: ProjectionEvent[];
  objects: ProjectionObject[];
  assertions: ProjectionAssertion[];
  obligations: ProjectionObligation[];
}

/** Mirrors `docs/spec/schemas/lens.schema.json` / `LensDefinition` (packages/protocol)
 * structurally — again duck-type compatible without importing protocol's own type name. */
export interface ProjectionLens {
  lens_id: string;
  version: number;
  name: string;
  author: Record<string, unknown>;
  purpose: string;
  selection: {
    event_ids?: string[];
    object_ref_ids?: string[];
    assertion_ids?: string[];
    obligation_ids?: string[];
    [key: string]: unknown;
  };
  unknown_type_policy?: string;
  renderer: string;
  declared_exclusions: Record<string, unknown>[];
  implementation_hash: string;
}

export interface MapIncluded {
  events: string[];
  objects: string[];
  assertions: string[];
  obligations: string[];
  /** Structural compatibility with protocol's `MapManifestIncluded` (every schema-backed
   * protocol type declares `additionalProperties: true`). */
  [key: string]: unknown;
}

/** The deterministic, content-addressed part of a map version — `content_hash` covers exactly
 * this object (minus content_hash itself). `map_id`/`version` are assigned by the persistence
 * layer (apps/project / LoaderStore.insertMapVersion), deliberately OUTSIDE this basis, so that
 * "same records + lens version + watermark ⇒ identical content_hash" holds regardless of which
 * sequential version number a store later assigns it (epistemic contract test 9). */
export interface MapContent {
  encounter_id: string;
  lens: { lens_id: string; version: number };
  event_watermark: string;
  included: MapIncluded;
  projection: Record<string, unknown>;
  exclusions: Record<string, unknown>[];
  render_failures: Record<string, unknown>[];
  accessible_summary: string;
  renderer_version: string;
}

export interface MapVersionPayload extends MapContent {
  content_hash: string;
}
