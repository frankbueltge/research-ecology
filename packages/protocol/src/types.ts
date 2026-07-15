/**
 * Hand-written TypeScript interfaces mirroring the eight JSON Schemas in ./schemas
 * (docs/spec/schemas/*.schema.json is the single source of truth; these types are kept
 * in sync by hand — no codegen dependency, per work order §2.1).
 *
 * Every interface carries a string index signature because every schema declares
 * `"additionalProperties": true`.
 */

/** assertion.schema.json */
export interface AssertionAuthor {
  actor_id: string;
  collective_id?: string;
  [key: string]: unknown;
}

export interface AssertionRecord {
  assertion_id: string;
  encounter_id?: string;
  author: AssertionAuthor;
  subject: Record<string, unknown>;
  predicate: string;
  object: Record<string, unknown> | string | number | boolean;
  rationale?: string;
  epistemic_status: string;
  local_epistemic_status?: string;
  evidence?: Record<string, unknown>[];
  lifecycle_status?: string;
  valid_from?: string;
  content_hash: string;
  [key: string]: unknown;
}

/** collective-manifest.schema.json */
export interface CollectiveManifest {
  schema_version: "1.0";
  collective_id: string;
  name: string;
  surface_name?: string;
  description: string;
  protocol_url: string;
  repository_url: string;
  public_url?: string;
  responsible_publisher: string;
  status: "active" | "dormant" | "left" | "archived";
  current_commitments?: string[];
  accepted_encounter_types?: string[];
  inbox?: Record<string, unknown>;
  outbox_url?: string;
  runtime_disclosure_policy?: Record<string, unknown>;
  effective_from: string;
  version: number;
  content_hash: string;
  signature?: string;
  [key: string]: unknown;
}

/** encounter-event.schema.json */
export interface EncounterEventIssuer {
  collective_id: string;
  actor_id: string;
  [key: string]: unknown;
}

export interface EncounterEvent {
  schema_version: "1.0";
  event_id: string;
  encounter_id?: string;
  event_type: string;
  issuer: EncounterEventIssuer;
  occurred_at: string;
  source_uri: string;
  source_commit?: string;
  visibility?: "public" | "embargoed" | "private";
  payload: Record<string, unknown>;
  previous_event_hash?: string;
  content_hash: string;
  signature?: string;
  corrects_event_id?: string;
  supersedes_event_id?: string;
  [key: string]: unknown;
}

/** intervention.schema.json */
export type InterventionType =
  | "correction"
  | "counter_assertion"
  | "counter_map"
  | "source_offer"
  | "missing_actor"
  | "missing_caveat"
  | "relation_type_proposal"
  | "response_work"
  | "ethical_concern"
  | "technical_issue";

export interface Intervention {
  intervention_id: string;
  identity_mode: "named" | "pseudonymous" | "private_to_editor";
  public_name?: string;
  intervention_type: InterventionType;
  target: Record<string, unknown>;
  rationale: string;
  evidence?: Record<string, unknown>[];
  payload?: Record<string, unknown>;
  publication_consent: boolean;
  [key: string]: unknown;
}

/** lens.schema.json */
export interface LensDefinition {
  lens_id: string;
  version: number;
  name: string;
  author: Record<string, unknown>;
  purpose: string;
  selection: Record<string, unknown>;
  evidence_threshold?: Record<string, unknown>;
  unknown_type_policy?: "show_rupture" | "raw_only" | "exclude_with_record";
  renderer: string;
  declared_exclusions: Record<string, unknown>[];
  implementation_hash: string;
  [key: string]: unknown;
}

/** map-manifest.schema.json */
export interface MapManifestLensRef {
  lens_id: string;
  version: number;
  [key: string]: unknown;
}

export interface MapManifestIncluded {
  events: string[];
  objects: string[];
  assertions: string[];
  obligations: string[];
  [key: string]: unknown;
}

export interface MapManifest {
  map_id: string;
  version: number;
  encounter_id: string;
  lens: MapManifestLensRef;
  event_watermark: string;
  included: MapManifestIncluded;
  projection?: Record<string, unknown>;
  exclusions: Record<string, unknown>[];
  render_failures: Record<string, unknown>[];
  accessible_summary: string;
  renderer_version?: string;
  content_hash: string;
  [key: string]: unknown;
}

/** transfer-offer.schema.json */
export interface TransferOfferTargetCollective {
  collective_id: string;
  [key: string]: unknown;
}

export interface TransferOfferTargetScope {
  scope: "all_collectives" | "public";
  [key: string]: unknown;
}

export interface TransferOfferSubject {
  collective_id: string;
  local_object_id: string;
  object_version?: string;
  canonical_uri: string;
  local_object_type: string;
  media_type?: string;
  content_hash: string;
  [key: string]: unknown;
}

export interface TransferOfferSourceStatus {
  lifecycle: string;
  epistemic: string;
  local_labels?: string[];
  [key: string]: unknown;
}

export interface TransferOfferCaveat {
  id: string;
  text: string;
  load_bearing?: boolean;
  [key: string]: unknown;
}

export interface TransferOfferObligation {
  id: string;
  clause: string;
  prominence?: string;
  [key: string]: unknown;
}

export interface TransferOfferPayload {
  offer_id: string;
  source_collective_id: string;
  target: TransferOfferTargetCollective | TransferOfferTargetScope;
  subject: TransferOfferSubject;
  proposition: string;
  source_status: TransferOfferSourceStatus;
  caveats: TransferOfferCaveat[];
  rights: Record<string, unknown>;
  requested_obligations: TransferOfferObligation[];
  proposed_use?: string;
  correction_channel: string;
  response_deadline?: string;
  [key: string]: unknown;
}

/** site-entrance.schema.json — additive, work order phase-3e-plumbing.md §1: the compact
 * dataset apps/export-site writes into a target site's src/data/begegnungen/entrance.json.
 * Not one of the original eight Phase-1 schemas; kept in this same hand-written-types file
 * for consistency, added without touching anything above.
 *
 * EN-only (Frank, 2026-07-15: the ecology stack dropped German — recurring per-nightly-run
 * translation duty is not sustainable). Every field that used to be a `LocalizedText`
 * (`{ de, en }`) is now a plain string; the former `LocalizedText` type is deleted. */
export interface SiteEntranceParticipant {
  actor_id: string;
  collective_id?: string | null;
  role: string;
  local_status?: string | null;
  [key: string]: unknown;
}

export interface SiteEntranceStation {
  id: string;
  heading: string;
  quote?: string;
  attribution?: string;
  akte_event_id?: string;
  akte_event_type?: string;
  divergence?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SiteEntrance {
  encounter_id: string;
  title: string;
  headline: string;
  status: {
    as_of: string;
    statusLine: string;
    [key: string]: unknown;
  };
  participants: SiteEntranceParticipant[];
  stations: SiteEntranceStation[];
  links: {
    akte: string;
    divergenz: string;
    [key: string]: unknown;
  };
  authored_by: string;
  approval: "pending" | "approved";
  [key: string]: unknown;
}

/** practice-profile.schema.json — spec-v2.1 §3 (ADR 0011). A versioned, locally-authored
 * self-description of a sovereign practice — never a taxonomy The Middle imposes. Structural
 * validation (this schema + `validatePracticeProfile`) lives here; the business rule that
 * `authored_by` may never name an editorial/Middle actor lives in packages/domain, next to the
 * existing editorial-issuer sentinel (work order phase-b-profiles.md §2 — deliberately not
 * duplicated here). `status` stays a plain `string` rather than a narrowed union on purpose,
 * matching the open-string convention documented at the top of packages/domain/src/types.ts:
 * the DB CHECK and this schema's `enum` already constrain the actual value. */
export interface PracticeProfileProvenanceEntry {
  /** Path/name of the source file a quote was taken from, verbatim (e.g. "PROTOCOL.md"), or a
   * short pointer into an already-ingested bundle record (e.g. "chronicle.json#session-1
   * (ingested as import/bundles/...)"). Absent when `spec_ref` is the source instead. */
  file?: string;
  /** Full commit sha the quote is pinned to (ADR 0009). */
  commit?: string;
  /** `sha256:<hex>` of the cited file/record at that commit (ADR 0009) — the whole-file hash
   * for a raw doc quote, or the record's own `content_hash` when citing an already-ingested
   * bundle event. */
  content_hash?: string;
  /** Set instead of file/commit/content_hash when the field's source is Frank's own initial
   * formulation in docs/spec-v2.1/, not a practice's repository (ADR 0011 §2), e.g.
   * "docs/spec-v2.1/01-FEDERATED-ECOLOGY-V2.1-IMPLEMENTATION-DELTA.md §3". */
  spec_ref?: string;
  /** Free-text pointer to where in the source the quote lives (section heading, etc.) — never
   * a paraphrase of the quote itself. */
  note?: string;
  [key: string]: unknown;
}

/** Field name → source. Also carries one synthetic `_compiled_by` entry (not a real profile
 * field) documenting that a draft version was compiled by the lab session from the cited
 * quotes and awaits the practice's own local confirmation (ADR 0011 §2). */
export type PracticeProfileProvenance = Record<string, PracticeProfileProvenanceEntry>;

export interface PracticeProfileVersion {
  collective_id: string;
  version: number;
  public_name: string;
  self_description?: string | null;
  orientation: string;
  primary_commitment: string;
  accountability_questions: string[];
  typical_operations?: string[] | null;
  admissible_outputs?: string[] | null;
  characteristic_risks?: string[] | null;
  /** Always the literal `true` (ADR 0011 §3: enforced, not merely asserted — DB CHECK, this
   * field's `const: true` in the schema, and this TS literal type all agree). */
  non_exclusive: true;
  protocol_ref?: string | null;
  /** An actor id of the practice's own collective — never an editorial/Middle actor id
   * (packages/domain enforces this at load time and at store-put time, ADR 0011 §1). */
  authored_by: string;
  status: string;
  effective_from: string;
  effective_to?: string;
  provenance: PracticeProfileProvenance;
  [key: string]: unknown;
}

/** transfer-response.schema.json */
export type TransferResponseDecision =
  | "accepted"
  | "accepted_with_conditions"
  | "citation_only"
  | "adversarial_material"
  | "deferred"
  | "declined";

export interface TransferResponsePayload {
  response_id: string;
  offer_id: string;
  responder_collective_id: string;
  decision: TransferResponseDecision;
  public_rationale?: string;
  accepted_obligation_ids?: string[];
  rejected_obligation_ids?: string[];
  additional_conditions?: Record<string, unknown>[];
  intended_local_use?: string;
  derivative?: Record<string, unknown>;
  [key: string]: unknown;
}
