-- Federated Research Ecology / The Middle
-- Migration 0002 — practice profiles + research constellations (v2.1 delta).
-- Additive only: no existing table, column, route or contract file is touched. Work order:
-- docs/work-orders/phase-b-profiles.md §1; ADR 0010 (two products, one kernel), ADR 0011
-- (profiles are locally authored); docs/DELTA-AUDIT-V2.1.md §5.1-5.2; docs/spec-v2.1/
-- 01-FEDERATED-ECOLOGY-V2.1-IMPLEMENTATION-DELTA.md §3 (profile interface), §5.2
-- (constellation interface).

-- ============================================================================================
-- 1. practice_profile_versions (spec-v2.1 §3, ADR 0011)
-- ============================================================================================

CREATE TABLE practice_profile_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collective_id TEXT NOT NULL REFERENCES collectives(id),
  version INTEGER NOT NULL,
  public_name TEXT NOT NULL,
  self_description TEXT,
  orientation TEXT NOT NULL,
  primary_commitment TEXT NOT NULL,
  accountability_questions JSONB NOT NULL,
  typical_operations JSONB NOT NULL DEFAULT '[]'::jsonb,
  admissible_outputs JSONB NOT NULL DEFAULT '[]'::jsonb,
  characteristic_risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  non_exclusive BOOLEAN NOT NULL DEFAULT TRUE,
  protocol_ref TEXT,
  authored_by UUID REFERENCES actors(id),
  status TEXT NOT NULL DEFAULT 'draft',
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  effective_to TIMESTAMPTZ,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (collective_id, version),
  CONSTRAINT practice_profile_versions_non_exclusive_check CHECK (non_exclusive = true),
  CONSTRAINT practice_profile_versions_status_check CHECK (status IN ('draft', 'active', 'superseded')),
  CONSTRAINT practice_profile_versions_accountability_questions_nonempty_check
    CHECK (jsonb_typeof(accountability_questions) = 'array' AND jsonb_array_length(accountability_questions) >= 1)
);

CREATE INDEX practice_profile_versions_collective_idx ON practice_profile_versions(collective_id, status);

COMMENT ON TABLE practice_profile_versions IS
  'Versioned epistemic practice profiles (spec-v2.1 §3, ADR 0011): versions are append-only; '
  'supersede, never edit. authored locally, never by The Middle (ADR 0011) — the loader '
  '(packages/domain hydrate.ts) and the domain store both throw if authored_by names an '
  'editorial/Middle actor, mirroring the Phase 3a editorial-issuer sentinel for events.';

COMMENT ON COLUMN practice_profile_versions.non_exclusive IS
  'Always TRUE by CHECK constraint (ADR 0011 §3): non-exclusivity is enforced, not merely '
  'asserted — every practice may measure, think, design, speculate and research; the profile '
  'only states which commitment wins in conflict and what the practice is accountable for.';

COMMENT ON COLUMN practice_profile_versions.status IS
  'draft | active | superseded (ADR 0011 §2). A draft is compiled from the practice''s own '
  'protocol words (see provenance below), pending the practice''s own local confirmation; '
  'activation is steered by Frank via the practice''s own channel, never committed by The '
  'Middle into an engine repo.';

COMMENT ON COLUMN practice_profile_versions.provenance IS
  'Field -> source (ADR 0011 §2): for each profile field, either {file, commit, content_hash} '
  '(a byte-exact quote from the practice''s own protocol, hashed per ADR 0009) or {spec_ref} '
  'naming docs/spec-v2.1/01-FEDERATED-ECOLOGY-V2.1-IMPLEMENTATION-DELTA.md §3 as the '
  '(Frank-authored) source of the three initial commitment/accountability formulations.';

-- ============================================================================================
-- 2. constellations + constellation_encounters (spec-v2.1 §5.2) — populated in Phase D; no
--    store or UI code reads or writes these tables in Phase B, this migration only.
-- ============================================================================================

CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  initiated_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'forming',
  initiating_object_ref_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  participant_collective_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  selection_rationale TEXT NOT NULL,
  authored_by UUID REFERENCES actors(id),
  version INTEGER NOT NULL DEFAULT 1,
  -- The four interpretive fields (order / resistance-or-excess / contingent-arrival /
  -- temporary-stabilisation, spec-v2.1 §5.2) are each a single JSONB object of shape
  -- {text, authored_by, ...}, not a bare TEXT column — see the column comments below.
  order_present JSONB,
  resistance_or_excess JSONB,
  contingent_arrival JSONB,
  temporary_stabilisation JSONB,
  CONSTRAINT constellations_status_check CHECK (status IN ('forming', 'active', 'dormant', 'closed', 'reopened')),
  CONSTRAINT constellations_order_present_attributed_check
    CHECK (order_present IS NULL OR (order_present ? 'authored_by')),
  CONSTRAINT constellations_resistance_or_excess_attributed_check
    CHECK (resistance_or_excess IS NULL OR (resistance_or_excess ? 'authored_by')),
  CONSTRAINT constellations_contingent_arrival_attributed_check
    CHECK (contingent_arrival IS NULL OR (contingent_arrival ? 'authored_by')),
  CONSTRAINT constellations_temporary_stabilisation_attributed_check
    CHECK (temporary_stabilisation IS NULL OR (temporary_stabilisation ? 'authored_by'))
);

CREATE TABLE constellation_encounters (
  constellation_id UUID NOT NULL REFERENCES constellations(id) ON DELETE CASCADE,
  encounter_id UUID NOT NULL REFERENCES encounters(id),
  PRIMARY KEY (constellation_id, encounter_id)
);

COMMENT ON TABLE constellations IS
  'Research constellations (spec-v2.1 §5): a finite, versioned grouping of real encounters, '
  'objects and practices around a material, problem or tension — never a permanent team, a '
  'department, a programme imposed on all participants, or a synthetic final interpretation. '
  'populated in Phase D; this migration only, no store/UI code in Phase B.';

COMMENT ON TABLE constellation_encounters IS
  'n:m join between constellations and encounters (spec-v2.1 §5.2 encounterRefs). '
  'populated in Phase D; this migration only, no store/UI code in Phase B.';

COMMENT ON COLUMN constellations.order_present IS
  'interpretive fields are always attributed, never computed — contract test enforces this at '
  'load time. One of four interpretive notes (order-present / resistance-or-excess / '
  'contingent-arrival / temporary-stabilisation, spec-v2.1 §5.2); shape {text, authored_by, '
  '...}, enforced non-null ''authored_by'' by CHECK when the field itself is present.';

COMMENT ON COLUMN constellations.resistance_or_excess IS
  'interpretive fields are always attributed, never computed — contract test enforces this at '
  'load time. See practice_profile_versions.provenance-style shape note on order_present above.';

COMMENT ON COLUMN constellations.contingent_arrival IS
  'interpretive fields are always attributed, never computed — contract test enforces this at '
  'load time. See practice_profile_versions.provenance-style shape note on order_present above.';

COMMENT ON COLUMN constellations.temporary_stabilisation IS
  'interpretive fields are always attributed, never computed — contract test enforces this at '
  'load time. See practice_profile_versions.provenance-style shape note on order_present above.';
