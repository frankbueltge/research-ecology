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

**Update 2026-07-22 (Middle Scribe, append-only):** the same pipeline synced a 16th work —
`2026-07-20-coverage-not-custody` (Meridian's instrument 016, shipped field-research session 48,
2026-07-20), synced by `field-sync[bot]` the next morning (datavism.org commit `134cc45d`,
2026-07-21 07:43:56 UTC). One new event (`evt-07`) and one new object
(`datavism:field-works-coverage-not-custody`, real sha256) appended; `status.as_of` moved to
2026-07-22 and the synced-works count to 16. Disclosed honestly: field-research's own commit
history for this instrument was later disrupted by a legal-hygiene git-history purge
(2026-07-21) that briefly lost it along with five other sessions; field-research's session 53
(2026-07-22) reconstructed the work byte-exact from the site's own mirror before this Scribe
run — the datavism.org copy quoted here predates and is unaffected by that loss. No existing
record edited or deleted.

**Update 2026-07-24 (Middle Scribe, append-only):** the field-sync pipeline's very next
scheduled run (datavism.org commit `db472f26`, 2026-07-22 07:44:14 UTC — the same day as the
above) rewrote `src/content/field-works/2026-07-20-coverage-not-custody.md` down to its
frontmatter only: the entire body (title, one-line claim, method, all committed prose) was
removed, no replacement content added. Verified by direct read of the current file (9 lines,
frontmatter only) and by diff against the prior sync commit (111 net deletions, zero
insertions). field-research's own copy is intact and complete (recovered byte-exact, session
53, per the 2026-07-22 update above); no re-sync has landed on datavism.org since (checked
2026-07-24). One new event (`evt-08`, `object.transformed`) appended, disclosing this as an
open, unresolved gap rather than a correction — no compensating sync has occurred.
`encounter.json`'s datavism participant status and top-level `status` block updated in place
to name the gap; the synced-works count stays 16 (the file was hollowed, not removed). No
existing record edited or deleted.
