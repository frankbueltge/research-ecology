# ADR 0011 — Practice profiles are locally authored

**Status:** ACCEPTED (2026-07-15), together with ADR 0010.

## Context

v2.1 §3 introduces versioned epistemic practice profiles (orientation, primary
commitment, accountability questions, typical operations, admissible outputs,
characteristic risks; `nonExclusive: true`). Profiles are situated constitutions —
self-descriptions of a sovereign practice — not a taxonomy The Middle may impose
(recentralisation risk 2, audit §9: "Profile ossifizieren zu Ressorts").

## Decision

1. **Authorship.** `authored_by` of a profile version is always an actor of the practice
   itself, never a Middle/editorial actor. Enforcement mirrors the editorial-issuer
   sentinel from Phase 3a: the loader and the domain store throw on Middle authorship.
   Contract test: "The Middle cannot publish a profile."
2. **Drafts are compiled, not invented.** Until each practice confirms its profile
   through its own channel, profile versions carry `status: 'draft'` plus a provenance
   block that records, per field, the byte-exact source quote (file, commit, content
   hash per ADR 0009) from the practice's own protocol words — or names
   `docs/spec-v2.1/` §3 as the (Frank-authored) source for the three initial
   commitment/accountability formulations. A draft is rendered as exactly that:
   "draft — compiled from the practice's protocol, pending local confirmation"
   (StatusChip, same pending pattern as the editorial narrative). Activation
   (`status: 'active'`) requires a documented local confirmation; it is steered by
   Frank via the practices' own channels, never committed by us into engine repos.
3. **Non-exclusivity is enforced, not asserted.** `non_exclusive` is a literal `true`:
   DB CHECK constraint, JSON-schema const, validator rule. Every practice may measure,
   think, design, speculate and research; the profile only states which commitment wins
   in conflict and what the practice is accountable for.
4. **Rendering never essentialises.** Encounter pages render "Position in this
   encounter: …" from the participant's applicable profile version — never a fixed
   department label, never a badge that types the practice globally (delta §7.1).
   Profile history stays visible (versioned, `effective_from/to`); superseded versions
   are never edited or deleted.

## Consequences

The Middle stays a renderer of self-descriptions. Profile churn is possible without
schema churn (new version rows). The three initial drafts unblock encounter-position
display in Phase B while remaining honest about their provisional status.

## Addendum (2026-07-15, evening) — activation by team amendment

Frank's decision, explicit and verbatim-approved in session: the role clarifications of
v2.1 §8.2–8.4 were adopted directly as **team amendments** in each engine's PROTOCOL.md
(clearly attributed "team decision (Frank Bültge)", amend-not-replace; commits:
irrtum-als-methode 22701dd, field-research 1223b02, studio 8ce6fc0). These documented
local events are the activation basis for the three v1 profiles (`status: active`,
`local_confirmation` provenance in each fixture). §2's clause "never committed by us
into engine repos" is narrowed accordingly: never **as the practice's voice** — clearly
attributed team amendments on Frank's explicit instruction are legitimate. The practices
may restate, adjust or contest the amendment in their own words in future sessions;
their record remains the source of truth.
