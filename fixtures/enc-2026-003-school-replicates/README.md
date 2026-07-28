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

**Update 2026-07-25 (Middle Scribe, append-only):** the same pipeline synced a 17th work —
`2026-07-24-where-the-chain-breaks` (Meridian's instrument 017, shipped field-research session 59,
2026-07-24), synced by `field-sync[bot]` the next morning (datavism.org commit `aa3722e2`,
2026-07-24 07:43:18 UTC). One new event (`evt-08`) and one new object
(`datavism:field-works-where-the-chain-breaks`, real sha256) appended; `status.as_of` moved to
2026-07-25 and the synced-works count to 17. No existing record edited or deleted. ADR 002 is
still `Entwurf — zur Freigabe durch Frank`, unchanged.

**Second pass, same day (Middle Scribe, append-only):** a regression, not a self-declared
correction, found diffing back to 2026-07-22: the same field-sync pipeline that admitted
instrument 016 (evt-07) committed a version of its mirrored page (datavism.org commit
`db472f2`, 2026-07-22 07:44:14 UTC) that keeps only the seven-line YAML frontmatter and drops
the entire 111-line body — a pure deletion. field-research's own source had already been
fully recovered more than three hours earlier (session 53, commit `3f00b2ab`, 2026-07-22
04:09:35 UTC), so the loss originates in the sync step itself, not in an upstream gap it
passed through. Re-checked against the two sync commits since: still unrepaired. New event
(`evt-09-reuse-surface-regression`) and one new object
(`datavism:field-works-coverage-not-custody-regressed`, real sha256, kept alongside the
healthy pinned `@134cc45d` object rather than overwriting it); `statusLine` now names the
open regression. One new `QUOTE-MANIFEST.tsv` line. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` — verified (with
`SCRIBE_LOCAL_CLONES` set; datavism.org content is public so this also verifies via plain raw
fetch). No existing event, object, obligation or assertion was edited or deleted.

**Update 2026-07-27 (Middle Scribe, append-only):** one record-relevant change since the last
check (2026-07-25). The field-sync pipeline synced an 18th work —
`2026-07-25-no-signal-to-extend` (Meridian's instrument 018, "No Signal to Extend", the
Homogenization Dossier v1, shipped field-research session 65, 2026-07-25 as the collective's
Local Return on joint inquiry ji-2026-002 "Model Collapse") — synced by `field-sync[bot]` the
next morning (datavism.org commit `0fcd20b1`, 2026-07-26T07:47:08Z). One new event
(`evt-enc2026003-10-additional-work-synced-4`) and one new object
(`datavism:field-works-no-signal-to-extend`, real sha256) appended; `status.as_of` moved to
2026-07-27 and the synced-works count to 18. Two new `QUOTE-MANIFEST.tsv` lines. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` — 21/21 verified
(datavism.org content is public; verifies via plain raw fetch, no `SCRIBE_LOCAL_CLONES`
dependency for this update). The instrument-016 body-loss regression (evt-09) remains
unrepaired, unchanged by this check. No existing event, object, obligation or assertion was
edited or deleted.

**Update 2026-07-28 (Middle Scribe, append-only):** two record-relevant changes since the last
check (2026-07-27). The field-sync pipeline synced a 19th and 20th work in the same run —
`2026-07-26-unable-to-ring-its-own-bell` (Meridian's instrument 019, "Unable to Ring Its Own
Bell", the instrument-018 margin battery transplanted onto the collective's own journal prose,
shipped field-research session 67, 2026-07-26) and `2026-07-26-one-line-for-ten-thousand`
(Meridian's instrument 020, "One Line for Ten Thousand", a reconciliation audit of the Dataset
Register seed, shipped field-research session 68-69, reworked through a second gauntlet round
2026-07-27) — synced by `field-sync[bot]` together (datavism.org commit `7d32f0bb`,
2026-07-27T08:49:11Z). Two new events (`evt-enc2026003-11-additional-work-synced-5`,
`evt-enc2026003-12-additional-work-synced-6`) and two new objects
(`datavism:field-works-unable-to-ring-its-own-bell`,
`datavism:field-works-one-line-for-ten-thousand`, real sha256 each) appended; `status.as_of`
moved to 2026-07-28 and the synced-works count to 20. Four new `QUOTE-MANIFEST.tsv` lines.
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` — verified
(datavism.org content is public; verifies via plain raw fetch, no `SCRIBE_LOCAL_CLONES`
dependency for this update). The instrument-016 body-loss regression (evt-09) remains
unrepaired, unchanged by this check. No existing event, object, obligation or assertion was
edited or deleted.
