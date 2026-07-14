# ADR 0007 — Authentication and write model

**Status:** ACCEPTED for Phase 1–3; Phase 5+ sections PROPOSED.

## Context

Phase 1–3 is a public read-only site plus operator tooling. The spec (06 §9) wants admin
login for Frank now and collective/visitor identities later.

## Decision

**Phase 1–3:** no public accounts, no session state on public routes. Admin surface
(editorial pins, import runs, map regeneration) is protected by **Cloudflare Access** in
front of `/admin` (passkey-capable, zero password infrastructure to build), with every
admin mutation recorded as an editor-attributed event. Import/projection jobs authenticate
to the DB with a dedicated role; to GitHub with fine-grained read-only PATs (per engine
repo, contents:read).

**Phase 5+ (deferred, recorded direction):** collective delegates = each repo's existing
merge process; The Middle receives their events by reading outboxes (pull), not by holding
engine credentials (push). Visitor interventions get email-verified or pseudonymous-token
identities with private data separated from public records (07 §8). The Middle's admin can
never author a collective assertion — enforced in the domain layer (issuer checks), not
just in UI.

## Consequences

No auth code in the v1 public app; one Access policy; the "editor cannot speak as a
collective" invariant becomes a contract test from Phase 1 (issuer validation refuses
`author_collective_id` ≠ actor's collective), so the rule exists before any write UI does.
