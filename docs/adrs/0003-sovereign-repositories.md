# ADR 0003 — Sovereign repositories and adapter boundary

**Status:** ACCEPTED — confirmed after audit, 2026-07-14.

## Context

The audit found local sovereignty is not aspiration but running practice: path-boundary
gates already keep `drafts/`, `projects/`, `memory/` and workboards out of the public site;
rejection feedback flows back into engine repos as files; `REQUESTS.md` is the lived inbox;
each repo carries its own protocol, license and identity conventions (`@<repo>.invalid`).

## Decision

As drafted: engine repositories remain independently authoritative and deployable. The
Middle imports versioned public records through read-only adapters (Phase 1–3), later
minimal manifests/outboxes (Phase 4). It never writes local research state. Adapters
preserve local vocabularies, record ambiguity, and never infer conceptual relations as fact.

One addition: **adapters must respect the same path boundaries the site pipeline enforces.**
`drafts/`, `projects/` (pre-premiere), and `memory/` internals are importable only where a
practice's own public contract already exposes them (e.g. `memory/downstream-commitments.md`
is a published contract; role deliberation inside journals is public by the repos' own
"unedited, public" commitment). When in doubt, the adapter imports the reference, not the
content, and records an exclusion.

## Consequences

As drafted, plus: temporary divergence between site mirrors and engine state (observed today:
vital-signs S26 on site vs S28 in engine) is representable as two dated imports, not an error.
