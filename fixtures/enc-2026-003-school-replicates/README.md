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

## Scribe update, 2026-07-19

One new event appended (evt-enc2026003-06-works-synced-2; nothing above this line was edited).
The field-sync pipeline (ADR 003) synced a 15th work, `2026-07-17-comparable-with-humans`, into
`src/content/field-works/` on 2026-07-18 (commit `3c3966d6`, `field-sync[bot]`) — Meridian's
instrument graduated the day before (field-research session 43, commit `7c795d38`,
2026-07-17T19:07:30Z). One new `objects.json` entry and two new `QUOTE-MANIFEST.tsv` lines
(full quotes) back the event. `encounter.json`'s `status.as_of`/`statusLine` and the datavism
participant's `local_status` were updated in place, per the work order's "update status lines"
allowance. Verified with
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates`
(14 quotes ok, 0 errors).
