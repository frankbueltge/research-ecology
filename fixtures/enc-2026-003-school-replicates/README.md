# enc-2026-003-school-replicates — README

**Status: retroactive transcription, `approval: draft`** (Frank commissioned 2026-07-17 —
"man kann das doch auch rückwirkend mit aufnehmen" — wording not yet read by him). A LEAN
record by design: five events, one obligation; the nightly Middle Scribe appends from here.
Discipline as in enc-2026-002: every quote in QUOTE-MANIFEST.tsv is a byte-exact
(whitespace-normalized) substring of its pinned source; verify with
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates`.

Pinned commits: datavism/datavism.org @ df34d01219d5 · field-research @ f856a47f81bb ·
research-ecology @ d1d4ef66b2f8.

GAPs (honest): no per-file hashes for the 14 synced works (enumerated only); Meridian's
session-22 journal not quoted (the reframed downstream-commitments doc is the standing
source); ADR 002's own status is 'Entwurf — zur Freigabe durch Frank' and is recorded as
such.

**Update 2026-07-20 (Middle Scribe, append-only):** the field-sync pipeline (ADR 003) synced a
15th work — `2026-07-17-comparable-with-humans` (Meridian's instrument 015, shipped
field-research session 43, 2026-07-17), synced by `field-sync[bot]` the next morning (datavism.org
commit `3c3966d6`, 2026-07-18 07:11:37 UTC). One new event (`evt-06`) and one new object
(`datavism:field-works-comparable-with-humans`, real sha256) appended; `status.as_of` moved to
2026-07-20 and the synced-works count to 15. No existing record edited or deleted. ADR 002 is
still `Entwurf — zur Freigabe durch Frank`, unchanged.

**Update 2026-07-21 (Middle Scribe, append-only):** field-sync[bot] synced a 16th work —
`2026-07-20-coverage-not-custody` (Meridian, field-research session 46, dated 2026-07-20),
datavism.org commit `134cc45d`, 2026-07-21 07:43:56 UTC. One new event (`evt-07`) and one new
object (`datavism:field-works-coverage-not-custody`, real sha256) appended; `status.as_of` moved
to 2026-07-21 and the synced-works count to 16. HONEST GAP: this scribe's own fetch of
field-research (full history — main, protocol-v3, and all seven open-PR refs) does not contain
`works/2026-07-20-coverage-not-custody` at all, though the datavism-side copy is real, present,
and byte-verified against its own pinned commit. field-sync.mjs's own documented contract prunes
the mirror when a work "vanishes upstream"; whether that has already happened, or this scribe
simply could not reach the ref the sync itself read, is left open and recorded as a discrepancy
(evt-07's `gap_note`), not resolved here. No existing record edited or deleted.
