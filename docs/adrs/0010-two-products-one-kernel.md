# ADR 0010 — Two products, one kernel (Atelier as its own app)

**Status:** ACCEPTED (2026-07-15). Frank delegated the architecture decision on the
Phase-A delta audit to the lab session ("dein Architektur-Go zum Audit", 2026-07-15);
this ADR records that go after review of `docs/DELTA-AUDIT-V2.1.md` against
`docs/spec-v2.1/`.

## Context

The v2.1 amendment (spec-v2.1 §2, §4) re-opens the first task of the old Cartographic
Research Machine: a sovereign, local cartographic research surface for Ulysses. The
Middle deliberately became a contact zone *between* practices (v2) and must not
retroactively absorb both tasks — "beide Oberflächen … dürfen nicht zu einer gemeinsamen
Leitwarte verschmelzen" (spec-v2.1 §Produktgrenze). The delta audit (§4, §6) found the
v2 kernel reusable without breaking any table, contract or route.

## Decision

1. **`apps/atelier` is a separate SvelteKit app** next to `apps/middle-web`. The Atelier
   is not The Middle and not the Cockpit. It answers "how does Ulysses develop problems,
   materials, operations, works, maps and self-critique inside its own practice"; The
   Middle answers "what happens when practices meet".
2. **Shared kernel, no renames.** Both apps consume the existing packages. The v2.1
   package names are satisfied by mapping, not by churn: `packages/protocol` +
   `packages/domain` ≙ research-core; `packages/projections` ≙ cartography-core. New
   packages are limited to `packages/profiles` (if extraction proves worthwhile during
   Phase B — a folder inside `packages/domain` is acceptable) and `apps/atelier`.
3. **UI primitives are extracted on first real use.** RecordFrame, LensManifestPanel,
   AuthoredStroke, Rupture blocks, DoorwayLink, StatusChip, CorrectionOverlay move from
   `apps/middle-web` into a shared package only when the Atelier actually consumes them
   (Phase C), never preemptively.
4. **Explicitly NO shared visual grammar** (delta §9.4). The design session designs the
   Atelier aesthetic independently; a shared kernel must not enforce a shared aesthetic.
   Guard: the design brief for the Atelier is a separate mandate, and no cross-app
   stylesheet or theme package is created.
5. **Delivery location is deferred.** Whether the Atelier ships under
   frankbueltge.de/atelier (path routing) or a subdomain is part of the deployment
   package (with ADR 0006); until then it runs locally. Existing public URLs
   (`/atelier/*` incl. `/atelier/cockpit`) remain stable regardless of the outcome.
6. **Recentralisation guards** (audit §9): the Middle homepage stays the
   encounter/constellation entrance and renders no Atelier content (test-enforced in
   Phase C); ADR 0008's replacement path is triggered as designed — the Cockpit becomes
   a dated artefact under `/atelier/archive/cockpit` once Slice C is accepted (see
   ADR 0008 amendment note).

## Consequences

Phase B (profiles, migration 0002) may start immediately; Phase C (Atelier slice) stays
blocked on the design session so the Atelier does not become the third "billig" case.
The kernel gains a second consumer, which will surface hidden middle-web assumptions —
that is desirable and cheaper now than later.
