-- Federated Research Ecology / The Middle
-- Initial PostgreSQL schema. Open vocabularies remain TEXT by design.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  display_name TEXT NOT NULL,
  actor_kind TEXT NOT NULL,
  collective_id TEXT,
  public_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  private_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  can_author_assertions BOOLEAN NOT NULL DEFAULT FALSE,
  can_issue_events BOOLEAN NOT NULL DEFAULT FALSE,
  active_from TIMESTAMPTZ,
  active_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collectives (
  id TEXT PRIMARY KEY,
  current_name TEXT NOT NULL,
  current_surface_name TEXT,
  repository_url TEXT,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  responsible_publisher_actor_id UUID REFERENCES actors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE actors
  ADD CONSTRAINT actors_collective_fk
  FOREIGN KEY (collective_id) REFERENCES collectives(id);

CREATE TABLE collective_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collective_id TEXT NOT NULL REFERENCES collectives(id),
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  surface_name TEXT,
  description TEXT NOT NULL,
  protocol_url TEXT,
  protocol_content_hash TEXT,
  repository_url TEXT,
  public_url TEXT,
  commitments JSONB NOT NULL DEFAULT '[]'::jsonb,
  accepted_encounter_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  inbox_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  outbox_url TEXT,
  runtime_disclosure_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  manifest_payload JSONB NOT NULL,
  issuer_actor_id UUID REFERENCES actors(id),
  source_uri TEXT NOT NULL,
  source_commit TEXT,
  content_hash TEXT NOT NULL,
  signature TEXT,
  effective_from TIMESTAMPTZ NOT NULL,
  superseded_at TIMESTAMPTZ,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collective_id, version),
  UNIQUE (collective_id, content_hash)
);

CREATE TABLE local_object_refs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collective_id TEXT NOT NULL REFERENCES collectives(id),
  local_object_id TEXT NOT NULL,
  object_version TEXT,
  canonical_uri TEXT NOT NULL,
  media_type TEXT,
  local_object_type TEXT NOT NULL,
  interoperability_class TEXT,
  title_cache TEXT,
  summary_cache TEXT,
  lifecycle_status TEXT,
  local_epistemic_status TEXT,
  content_hash TEXT NOT NULL,
  source_commit TEXT,
  source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  importer_version TEXT NOT NULL,
  validation_state TEXT NOT NULL DEFAULT 'valid',
  UNIQUE (collective_id, local_object_id, object_version, content_hash)
);

CREATE TABLE encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  editorial_proposition TEXT,
  proposition_author_actor_id UUID REFERENCES actors(id),
  initiating_event_id UUID,
  visibility TEXT NOT NULL DEFAULT 'public',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  pin_reason TEXT,
  pinned_by_actor_id UUID REFERENCES actors(id),
  pinned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dormant_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE TABLE encounter_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  collective_id TEXT REFERENCES collectives(id),
  actor_id UUID REFERENCES actors(id),
  participant_role TEXT NOT NULL,
  local_status TEXT,
  local_status_rationale TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  last_acknowledged_event_id UUID,
  response_expected BOOLEAN NOT NULL DEFAULT FALSE,
  CHECK (collective_id IS NOT NULL OR actor_id IS NOT NULL)
);

CREATE UNIQUE INDEX encounter_participant_collective_uq
  ON encounter_participants(encounter_id, participant_role, collective_id)
  WHERE collective_id IS NOT NULL AND actor_id IS NULL;

CREATE UNIQUE INDEX encounter_participant_actor_uq
  ON encounter_participants(encounter_id, participant_role, actor_id)
  WHERE actor_id IS NOT NULL AND collective_id IS NULL;

CREATE UNIQUE INDEX encounter_participant_collective_actor_uq
  ON encounter_participants(encounter_id, participant_role, collective_id, actor_id)
  WHERE actor_id IS NOT NULL AND collective_id IS NOT NULL;

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_event_id TEXT,
  encounter_id UUID REFERENCES encounters(id),
  event_type TEXT NOT NULL,
  issuer_collective_id TEXT REFERENCES collectives(id),
  issuer_actor_id UUID REFERENCES actors(id),
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_uri TEXT NOT NULL,
  source_commit TEXT,
  schema_version TEXT NOT NULL,
  payload JSONB NOT NULL,
  content_hash TEXT NOT NULL,
  previous_event_hash TEXT,
  signature TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  validation_state TEXT NOT NULL DEFAULT 'valid',
  validation_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  importer_version TEXT NOT NULL,
  corrects_event_id UUID REFERENCES events(id),
  supersedes_event_id UUID REFERENCES events(id),
  UNIQUE (issuer_collective_id, external_event_id),
  UNIQUE (content_hash, source_uri)
);

ALTER TABLE encounters
  ADD CONSTRAINT encounters_initiating_event_fk
  FOREIGN KEY (initiating_event_id) REFERENCES events(id);

ALTER TABLE encounter_participants
  ADD CONSTRAINT encounter_participants_last_event_fk
  FOREIGN KEY (last_acknowledged_event_id) REFERENCES events(id);

CREATE TABLE encounter_object_refs (
  encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
  local_object_ref_id UUID NOT NULL REFERENCES local_object_refs(id),
  encounter_role TEXT NOT NULL,
  introduced_by_event_id UUID REFERENCES events(id),
  PRIMARY KEY (encounter_id, local_object_ref_id, encounter_role)
);

CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID UNIQUE NOT NULL REFERENCES events(id),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  source_collective_id TEXT NOT NULL REFERENCES collectives(id),
  target_collective_id TEXT REFERENCES collectives(id),
  subject_object_ref_id UUID REFERENCES local_object_refs(id),
  proposition TEXT NOT NULL,
  source_epistemic_status TEXT,
  source_lifecycle_status TEXT,
  caveats JSONB NOT NULL DEFAULT '[]'::jsonb,
  rights JSONB NOT NULL DEFAULT '{}'::jsonb,
  requested_obligations JSONB NOT NULL DEFAULT '[]'::jsonb,
  proposed_use TEXT,
  response_deadline TIMESTAMPTZ,
  delivery_state TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID UNIQUE NOT NULL REFERENCES events(id),
  offer_id UUID NOT NULL REFERENCES offers(id),
  responder_collective_id TEXT NOT NULL REFERENCES collectives(id),
  admission_decision TEXT NOT NULL,
  public_rationale TEXT,
  accepted_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  rejected_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  intended_local_use TEXT,
  derivative_object_ref_id UUID REFERENCES local_object_refs(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  source_event_id UUID NOT NULL REFERENCES events(id),
  proposer_collective_id TEXT REFERENCES collectives(id),
  obligated_collective_id TEXT REFERENCES collectives(id),
  clause_text TEXT NOT NULL,
  rule_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  prominence TEXT NOT NULL DEFAULT 'normal',
  accepted_by_event_id UUID REFERENCES events(id),
  evidence_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  active_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_until TIMESTAMPTZ,
  superseded_by UUID REFERENCES obligations(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assertions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_assertion_id TEXT,
  encounter_id UUID REFERENCES encounters(id),
  author_collective_id TEXT REFERENCES collectives(id),
  author_actor_id UUID REFERENCES actors(id),
  subject_object_ref_id UUID REFERENCES local_object_refs(id),
  predicate TEXT NOT NULL,
  object_object_ref_id UUID REFERENCES local_object_refs(id),
  object_literal JSONB,
  rationale TEXT,
  epistemic_status TEXT NOT NULL,
  local_epistemic_status TEXT,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  originating_event_id UUID REFERENCES events(id),
  source_uri TEXT,
  content_hash TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public',
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  superseded_at TIMESTAMPTZ,
  UNIQUE (author_collective_id, external_assertion_id),
  CHECK (object_object_ref_id IS NOT NULL OR object_literal IS NOT NULL)
);

CREATE TABLE assertion_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assertion_id UUID NOT NULL REFERENCES assertions(id),
  responder_collective_id TEXT REFERENCES collectives(id),
  responder_actor_id UUID REFERENCES actors(id),
  response_type TEXT NOT NULL,
  rationale TEXT,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  originating_event_id UUID REFERENCES events(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lenses (
  id TEXT PRIMARY KEY,
  current_name TEXT NOT NULL,
  owner_collective_id TEXT REFERENCES collectives(id),
  owner_actor_id UUID REFERENCES actors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lens_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lens_id TEXT NOT NULL REFERENCES lenses(id),
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  config JSONB NOT NULL,
  declared_exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  renderer_type TEXT NOT NULL,
  implementation_hash TEXT NOT NULL,
  authored_by_actor_id UUID REFERENCES actors(id),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  superseded_at TIMESTAMPTZ,
  UNIQUE (lens_id, version)
);

CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  slug TEXT UNIQUE NOT NULL,
  created_by_actor_id UUID REFERENCES actors(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE map_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES maps(id),
  version INTEGER NOT NULL,
  lens_version_id UUID NOT NULL REFERENCES lens_versions(id),
  event_watermark TIMESTAMPTZ NOT NULL,
  source_event_ids JSONB NOT NULL,
  included_object_ref_ids JSONB NOT NULL,
  included_assertion_ids JSONB NOT NULL,
  included_obligation_ids JSONB NOT NULL,
  projection_payload JSONB NOT NULL,
  accessible_summary TEXT NOT NULL,
  exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  render_failures JSONB NOT NULL DEFAULT '[]'::jsonb,
  renderer_version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (map_id, version),
  UNIQUE (content_hash)
);

CREATE TABLE machine_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  generated_by_actor_id UUID REFERENCES actors(id),
  suggestion_type TEXT NOT NULL,
  input_refs JSONB NOT NULL,
  suggested_payload JSONB NOT NULL,
  confidence_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  prompt_config_hash TEXT,
  review_state TEXT NOT NULL DEFAULT 'unreviewed',
  admitted_assertion_id UUID REFERENCES assertions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES encounters(id),
  target_object_ref_id UUID REFERENCES local_object_refs(id),
  target_assertion_id UUID REFERENCES assertions(id),
  author_actor_id UUID REFERENCES actors(id),
  identity_mode TEXT NOT NULL,
  intervention_type TEXT NOT NULL,
  title TEXT,
  rationale TEXT NOT NULL,
  payload JSONB NOT NULL,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  moderation_state TEXT NOT NULL DEFAULT 'pending',
  admission_state TEXT NOT NULL DEFAULT 'not_reviewed',
  visibility TEXT NOT NULL DEFAULT 'private_pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX events_encounter_time_idx ON events(encounter_id, occurred_at);
CREATE INDEX events_type_idx ON events(event_type);
CREATE INDEX events_payload_gin_idx ON events USING GIN(payload);
CREATE INDEX local_object_refs_collective_idx ON local_object_refs(collective_id, local_object_id);
CREATE INDEX local_object_refs_title_trgm_idx ON local_object_refs USING GIN(title_cache gin_trgm_ops);
CREATE INDEX assertions_encounter_idx ON assertions(encounter_id, lifecycle_status);
CREATE INDEX assertions_predicate_idx ON assertions(predicate);
CREATE INDEX assertions_evidence_gin_idx ON assertions USING GIN(evidence);
CREATE INDEX obligations_encounter_status_idx ON obligations(encounter_id, status);
CREATE INDEX interventions_moderation_idx ON interventions(moderation_state, submitted_at);

COMMENT ON TABLE events IS 'Append-only operational record. Meaning belongs in assertions, not event edges.';
COMMENT ON TABLE assertions IS 'Authored, contestable claims and relations. Never a canonical global graph.';
COMMENT ON TABLE machine_suggestions IS 'Unadmitted computational proposals, isolated from collective assertions.';

-- ============================================================================================
-- Phase 1 amendments (ADR 0002 — PostgreSQL event/assertion model, accepted 2026-07-14)
-- ============================================================================================
--
-- 1. Import/ambiguity queue: inputs that fail envelope validation or parse ambiguously never
--    become an `events` row, so `events.validation_state` has nothing to hold for them. This
--    table gives those inputs a visible home (spec 08 §4 requires visible queues).
-- 2. `events.external_event_id` (added below) carries the deterministic idempotency key
--    computed by the protocol package's `externalEventId()`, documented in the column comment.

CREATE TABLE import_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_uri TEXT NOT NULL,
  source_commit TEXT,
  adapter TEXT NOT NULL,
  adapter_version TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'ambiguous',
  reason TEXT NOT NULL,
  raw_excerpt JSONB,
  content_hash TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT import_records_state_check CHECK (state IN ('ambiguous', 'unsupported', 'rejected', 'superseded'))
);

CREATE INDEX import_records_state_idx ON import_records(state, imported_at);

COMMENT ON TABLE import_records IS
  'Import/ambiguity queue (ADR 0002 amendment 1): inputs that failed envelope validation or '
  'parsed ambiguously and therefore never became an `events` row. States: ambiguous '
  '(needs a human/adapter decision) | unsupported (no adapter handles this shape yet) | '
  'rejected (validated as invalid, kept for audit) | superseded (a corrected re-import replaced '
  'this record).';

COMMENT ON COLUMN events.external_event_id IS
  'Deterministic idempotency key (ADR 0002 amendment 2): '
  'sha256hex(source_uri + "\n" + content_hash + "\n" + event_type), computed once by '
  '@research-ecology/protocol''s externalEventId(sourceUri, contentHash, eventType) so every '
  'adapter and nightly re-import job derives the identical value and UNIQUE '
  '(issuer_collective_id, external_event_id) makes re-imports a no-op rather than a duplicate '
  'row. `content_hash` is the primary durable identity of the event; `source_commit` is a '
  'best-effort pointer that may dangle after a source history rewrite (ADR 0009).';

-- ============================================================================================
-- Phase 3a amendments (work order: phase-3a-domain-loader-projections.md) — purely additive,
-- backward-compatible (ADD COLUMN with a default; no existing column/table/row touched).
-- ============================================================================================
--
-- Three genuine gaps surfaced wiring PostgresStore (packages/domain) against this file exactly
-- as it stood after Phase 1/2: none of them are schema/migration changes needed for a NEW
-- collective's own vocabulary (that already works with zero changes, spec 05 §11.11) — they are
-- places this file had no column at all for a concept Phase 3 depends on.
--
-- 1. `events.source_event_id`: the JSON envelope's OWN stable id (e.g.
--    "evt-enc2026001-02-object-admitted", as fixtures/.../events.json and obligations.json's
--    `source_event_id` field reference it) has no column here — `external_event_id` is already
--    documented above as the sha256 IDEMPOTENCY KEY, a different value. Obligations,
--    `encounters.initiating_event_id`-style back-references and `corrects_event_id` all need to
--    resolve the plain envelope id, not the hash. Nullable + partially unique so Phase 1/2 rows
--    (none of which exist yet outside this work order's own loader) are unaffected either way.
-- 2. `local_object_refs.ref_id`: the Phase-2 bundle format's own composed object id
--    (`<collective_id>:<local_object_id>@<shortSha>`, packages/adapters/src/types.ts
--    `LocalObjectRef.id`) — this table has a UUID primary key but no column carrying that
--    string, which every bundle/fixture object.json file and every cross-reference
--    (assertions' subject/object, events' `*_object_ref_id` payload fields) uses as THE id.
-- 3. `encounters.non_participants`: spec 05's "documented non-relation" requirement (audit §4
--    "Documented silences", fixture `encounter.json` `non_participants[]`, contract test 5 —
--    Ulysses' absence from this encounter must render as absence, never a synthesized "missing
--    participant" signal) — there was no column anywhere on `encounters` for this at all.

ALTER TABLE events ADD COLUMN source_event_id TEXT;
CREATE UNIQUE INDEX events_source_event_id_uq ON events(source_event_id) WHERE source_event_id IS NOT NULL;
COMMENT ON COLUMN events.source_event_id IS
  'The JSON envelope''s own `event_id` string (Phase 3a amendment) — distinct from '
  '`external_event_id` (a sha256 idempotency key, see comment above). Nullable because it is '
  'optional envelope metadata, not every caller has one; unique when present.';

ALTER TABLE local_object_refs ADD COLUMN ref_id TEXT;
CREATE UNIQUE INDEX local_object_refs_ref_id_uq ON local_object_refs(ref_id) WHERE ref_id IS NOT NULL;
COMMENT ON COLUMN local_object_refs.ref_id IS
  'The Phase-2 bundle format''s own composed object id, `<collective_id>:<local_object_id>@'
  '<shortSha>` (packages/adapters/src/types.ts LocalObjectRef.id) — Phase 3a amendment, so '
  'PostgresStore can resolve the same string every bundle/fixture JSON file and every '
  'cross-reference (assertions, event payloads) already uses as THE object identity.';

ALTER TABLE encounters ADD COLUMN non_participants JSONB NOT NULL DEFAULT '[]'::jsonb;
COMMENT ON COLUMN encounters.non_participants IS
  'Documented non-relations (spec 05 "what must not be inferred automatically" / audit §4
  "Documented silences") — Phase 3a amendment. Rendered as-is, verbatim; never synthesized '
  'from absence and never treated as a rejection or a gap to fill.';
