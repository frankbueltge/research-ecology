# ADR 0002 — PostgreSQL event/assertion model

**Status:** ACCEPTED — confirmed after audit, 2026-07-14, with two Phase-1 amendments.

## Context

As drafted, plus audit evidence: the corpus is small (hundreds of objects, dozens of events
for the first encounter), transactional, and provenance-heavy — squarely relational-with-JSONB
territory. A graph database would add operations without adding truth.

## Decision

PostgreSQL 16+ as operational source of truth; events, assertions, obligations, references,
lenses and maps in separate tables; JSONB for open vocabularies; `db/0001_initial.sql` from
the spec is the Phase-1 baseline with two amendments:

1. **Import/ambiguity queue:** add an `import_records` table for inputs that fail envelope
   validation or parse ambiguously (spec 08 §4 requires visible queues; `events.validation_state`
   cannot hold what never became an event).
2. **Deterministic idempotency:** adapters compute `external_event_id =
   sha256(source_uri + content_hash + event_type)` (specified in the protocol package) so
   nightly re-imports are no-ops against `UNIQUE (issuer_collective_id, external_event_id)`.

`content_hash` is the primary durable identity; `source_commit` is a best-effort pointer
(see ADR 0009 — the field-research history rewrite proves SHAs mutate).

## Consequences

As drafted. Managed-Postgres provider choice is ADR 0006's concern, not this ADR's.
