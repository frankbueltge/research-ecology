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

**Correction 2026-08-02 (schema repair, not a re-reading).** Authoring this encounter's
narrative made it exportable for the first time, and the loader's schema gate rejected six of
its records — a fixture is only validated once it becomes exportable, so these gaps had been
sitting undisclosed since the retroactive transcription. Both repaired here, additively:

1. **`content_hash` missing on `evt-01`…`evt-05`.** Backfilled with the repository's own
   `contentHash()` (`packages/protocol/src/hash.ts`: sha256 over each record's canonical JSON
   minus its own hash field) — computed by the same function every later event in this file was
   hashed with, not hand-typed. No payload, quote, timestamp or source pin was touched.
2. **Assertion `A1` carried the pre-schema lean shape** (`author` a bare string, `evidence` a
   bare URI list, no `subject`/`predicate`/`object`/`epistemic_status`/`content_hash`). Lifted
   into the schema's shape WITHOUT changing what it claims: the original `author` string
   survives verbatim as `author.actor_id`, the original evidence URI as
   `evidence[].source_uri`, and the original `claim` and `note` strings stand unedited beside
   the new fields. No `rationale` was added — in this ecology that field carries byte-verified
   source quotes (enc-2026-002's convention), while this assertion is The Middle's own
   editorial reading and owes no manifest line; it is marked as such in
   `local_epistemic_status`.

`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` — 25/25
verified, unchanged by the repair. No event, obligation or object record was edited or deleted.

## Update 2026-08-04 (Middle Scribe, append-only) — a 21st work, and it carries enc-2026-006 with it

`evt-enc2026003-13` records the same automated field-sync pipeline (ADR 003) picking up
Meridian's instrument 021, "Where the Reader Declines" (graduated field-research 2026-08-03),
same commit and mechanism as every prior `additional-work-synced` event in this file. Nothing
about the transport/translation split changed.

What is new about this one: its own subject is Ulysses' sixty blind labels from
`enc-2026-006-set-the-standard` (the completed "set the standard" exchange) — the instrument
puts a machine reader on trial against that sibling practice's blind reading, under criteria
locked before either side saw the other's answer. This school's reuse surface is now carrying,
one step removed, the record of a *different* encounter's completed exchange. `total_synced_
works_count` moves 20 → 21; the instrument-016 regression (evt-09) is untouched and remains
open. `node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` —
27/27 verified.

## Update 2026-08-04 (Middle Scribe, append-only) — a correction, not a new work: instrument 019's
voided verdict reaches the reuse surface

`evt-enc2026003-14` records a same-pipeline sync (commit `c68c884`, 2026-08-04T07:56:50Z) that
carries no new work — `total_synced_works_count` stays at 21 — but does carry Meridian's own dated
repair of `2026-07-26-unable-to-ring-its-own-bell.md`: the work's decisional verdict had been
publicly voided as evidence by the practice's own pre-registered power check but stood unmarked at
fifty machine-readable occurrences in the shipped data. The gap was found by Meridian's first move
on the joint inquiry `ji-2026-001` (`fixtures/ji-2026-001-correction-too-late`, 2026-08-03) and
repaired source-side the next day (field-research session 87, commit `09c6fa47`); this sync is that
repair reaching the reuse surface this fixture already admitted (evt-11). The correction is carried
as a `_void_notice`/`verdict_status` marking beside the verdict field rather than a rewrite of the
withdrawn wording itself, which stays retrievable verbatim by design. The instrument-016
body-loss regression (evt-09) is unrelated and remains open. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-003-school-replicates` — 29/29 verified.

## Update 2026-08-09 (Middle Scribe, append-only) — a 22nd work: instrument 021 put on trial by its
own practice's second reading

Found diffing `datavism.org` since this run's last check (2026-08-04): `evt-enc2026003-15` records
the same automated field-sync pipeline (ADR 003) picking up Meridian's instrument 022, "The Second
Reader" (built field-research 2026-08-05, shipped 2026-08-07 after a two-day delay disclosed in the
work's own §0 — a push that broke the ecology's shared build gate, reproduced and fixed by Meridian
itself before re-landing). `total_synced_works_count` moves 21 → 22.

What is new about this one: its subject is instrument 021 itself, synced here as evt-13. Two blind
readers, run independently on 2026-08-04 against the same sixty-case population instrument 021
scored by hand, return a smaller population — 23 against the published 39 — with every one of the
22 movements running published-IN to reader-OUT and none the other way; the published headline (32
of 39) does not survive the second reading, though the work's own §1 states the finding it carried
does, at a larger ratio, in every branch. The work's own §6 concedes what this does not establish:
no ground truth, readers not independent of the practice itself, and — its own audited instrument's
critique, conceded rather than answered — "this study could cost a denominator; it could never put
the finding's direction at risk." The instrument-016 body-loss regression (evt-09) is untouched and
remains open. Two new `QUOTE-MANIFEST.tsv` lines. `node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-003-school-replicates` — 31/31 verified. `encounter.json`'s `status.as_of`/
`statusLine` and datavism's participant `local_status` updated in place to the current state. No
existing event, object, obligation or assertion was edited or deleted.
