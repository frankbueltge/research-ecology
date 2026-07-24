> **status: HISTORICAL** (dated record, banner added 2026-07-24) — kept as audit trail;
> for what is current, see README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Review notes carried into Phase 3c (conceptual review)

Collected during strongest-model review of the Sonnet work packages. None are blockers;
all must be resolved or explicitly accepted in `CONCEPTUAL-IMPLEMENTATION-REVIEW.md`
BEFORE first deployment (map content hashes must be stable before stable citation URLs
exist).

1. **`encounters.non_participants` column (3a amendment):** review against the
   anti-pathology rule — documenting non-participation must remain an *editorial statement*
   ("Ulysses is not a participant; its non-participation is legible"), never drift into
   implying expected-but-missing participation. Check how 3b renders it; consider renaming
   to `editorial_non_participation_note` or moving into the encounter's editorial payload.
2. **PostgresStore fidelity gap (documented in its header):** assertion `subject`/`object`
   sub-fields (e.g. `field_path`) don't round-trip — add JSONB columns for the wire-format
   subject/object before deployment and a parity test MemoryStore↔PostgresStore.
3. **PostgresStore never executed against a live DB** — must run migration + loader + parity
   tests against Neon (or a local Postgres) as part of the deployment package.
4. **accessible_summary polish:** synthesized exclusion reasons repeat awkwardly
   ("Not selected by this lens's own scope." twice); fold counts into one sentence. Regenerate
   all map versions after the text settles (hash change is intended and final pre-publish).
5. **Adapter `work-note` type derivation** (fixed in Phase 2 review) — pattern to keep:
   adapter-assigned labels stay short; derivations live in `source_metadata.type_derivation`.
6. **Sentinel `the-middle-editorial` issuer** (3a): elegant enforcement; verify 3b renders
   editorial acts as clearly non-collective (apparatus voice) and that `/apparatus` explains
   the sentinel.
7. **Two `derivative.published` events** (studio graduation vs site-gate republication,
   66 s apart): make sure 3b's provenance chain labels the second as automation-issued
   (studio-integrate) — the apparatus in the chain, not a duplicate.
8. **Deferred:** per-entry atlas import; `/refusals` route (no published inter-practice
   refusal exists); bounded constellation renderer; Drizzle (first write feature); datavism/
   data-snack as future practices.
9. **`practice_profile_versions` PostgresStore (Phase B, work order phase-b-profiles.md §3):**
   `putPracticeProfileVersion`/`getApplicableProfile`/`listProfileVersions` are hand-written to
   mirror `MemoryStore`'s semantics exactly (same append-only idempotency key, same
   active-over-draft/superseded-never `getApplicableProfile` ordering, reproduced in SQL via
   `ORDER BY (status = 'active') DESC, version DESC`) but, like the rest of `PostgresStore`,
   never executed against a live DB in this environment — covered by note 3 above once a real
   Postgres exists. `constellations`/`constellation_encounters` (migration 0002) have no store
   code at all yet (deliberate, work order §1: "kein Store-/UI-Code dafür, nur die Migration
   selbst" — populated in Phase D).
