# enc-2026-004-diner-re-cooks — README

**Status: retroactive transcription, `approval: draft`** (Frank commissioned 2026-07-17;
wording not yet read by him). LEAN record: five events, one obligation, six hashed objects;
the nightly Middle Scribe appends from here. Verify:
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks`.

Pinned commits: frankbueltge/data-snack.com @ 72bae294d923 · field-research @ f856a47f81bb
· research-ecology @ d1d4ef66b2f8.

PRIVATE-SOURCE NOTE (honest): the source repo frankbueltge/data-snack.com is PRIVATE —
the pinned quotes verify via authenticated fetch (the verifier's token fallback), not
publicly. The publicly checkable faces of these objects are the live Quick Snacks on
https://data-snack.com; whether the source files should gain a public mirror is an open
question for the practice, recorded here, not decided here.

GAPs (honest): whether each Quick Snack ran the Plenum's gate is NOT evidenced in the
pinned sources (the cook workflow gates future specials; the six existing files carry
provenance frontmatter but no gate record) — no gate obligation is claimed for them. The
supplier wing-language finding is recorded as an open correction, not fixed here (the fix
belongs in the diner's cook template, its repo).

**Update 2026-07-22 (Middle Scribe, append-only):** two record-relevant changes since the
last check (2026-07-17). (1) The cook automation named "part-armed" (evt-04) has started
firing and publishing unattended: four consecutive daily bot commits (2026-07-17 through
2026-07-20, `1ee911a`…`607609e`) land straight on `main` with no PR — the observable
signature of `PIPELINE_AUTOPUBLISH` being set. New event `evt-07-automation-armed`. (2) The
first of those runs (2026-07-18, commit `99f5c750`) published the diner's seventh Quick
Snack, re-cooking Meridian's instrument 015 ("Comparable With Humans") as "The 0.66
Problem" — its `gauntlet` field honestly reads "shipped (pre-gauntlet convention)", i.e. the
cook template's own gate has not run on unattended output. New event
`evt-08-corpus-grown` and one new hashed object (`data-snack:quick-comparable-with-humans`).
`status.as_of` moved to 2026-07-22, the re-cooked-works count to 7. Six new
`QUOTE-MANIFEST.tsv` lines, all under the same PRIVATE-SOURCE NOTE above (independently
verified byte-exact against a local sibling clone; the mechanical gate cannot fetch a
private repo's raw content in this session — same pre-existing, disclosed gap as the six
prior quotes, unchanged: `node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-004-diner-re-cooks` reports 3 ok / 19 failures, all 19 the private-repo
gap, none a real mismatch). No existing event, object, or obligation was edited or deleted.

**Update 2026-07-25 (Middle Scribe, append-only):** three record-relevant changes since the
last check (2026-07-22). (1) The armed automation published two more re-cooks: the diner's
eighth Quick Snack (2026-07-22, commit `d051b41e`), re-cooking Ensemble's instrument
"Recovery" (`works/2026-07-21-recovery`, premiered session 28) as "The Silent Score: 0,87" —
`gauntlet` reads a real ship record this time, unlike evt-08's pre-gauntlet disclosure. New
event `evt-09-corpus-grown-2` and one new hashed object (`data-snack:quick-recovery`). (2) The
diner's ninth Quick Snack (2026-07-23, commit `ddd4a0a2`), re-cooking Ensemble's instrument
"One Tap" (`works/2026-07-23-one-tap`, premiered session 31, 04:58:28Z) as "The Dalles
Concealment Case", roughly 2h16m after the studio's own premiere commit. New event
`evt-10-corpus-grown-3` and one new hashed object (`data-snack:quick-one-tap`). (3) A new open
correction: roughly 4h41m after that same premiere (session 32, 11:56:21Z, same day) Frank
played the premiered restage of One Tap and returned it a second time ("even worse staged
than the HTML version") — the studio's own record now reads the premiere as **CONTESTED —
not a settled premiere** / **NOT re-certified**, and has substantially reworked
`works/2026-07-23-one-tap/` in place without un-graduating it. The diner's Quick Snack still
carries the now-superseded "Kritiker: PREMIERE STANDS" verdict verbatim and has not been
re-cooked since (the next two automated runs touched only `split-seal` and `native-speaker`).
New event `evt-11-premiere-contested`, issued from Ensemble's own record (the studio's
WORKBOARD.md), alongside the pre-existing supplier wing-language gap as a second open
correction for the diner's cook template. `status.as_of` moved to 2026-07-25, the
re-cooked-works count to 9. Twelve new `QUOTE-MANIFEST.tsv` lines.
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` — 34/34
verified (this session resolved the private-repo gap via a local sibling clone of the same
pinned commits; see `tools/verify-encounter-fixtures.mjs`'s `SCRIBE_LOCAL_CLONES` fallback).
No existing event, object, or obligation was edited or deleted; `encounter.json`'s
participant statuses updated in place to the current state, mirroring enc-001/002's
precedent for the same kind of update.

**Second pass, same day (Middle Scribe, append-only):** one further pattern, distinct from
evt-11's finding. split-seal.mdx has been silently re-voiced (dates bumped, teaser/hookStat
text re-worded, no new caveat) in every single one of the ten automated runs checked back to
its creation — not only the two runs evt-11 names — across commits `33fd8d5`, `99f5c750`,
`9a9305f`, `607609e`, `d051b41`, `ddd4a0a` and `d0bff40` (plus `1ee911a`, evt-06's own
instance). On 2026-07-24 (the same `d0bff40` commit as evt-11's second run) the pattern
extended to a second already-published item: native-speaker.mdx had its teaser and hookStat
reworded (title unchanged). Nothing in the cook template's schema marks these as corrections
or versions — the only trace is git history. New event
(`evt-12-recook-pattern-continues`). Two new `QUOTE-MANIFEST.tsv` lines; `statusLine`
extended to name the pattern as a third open item. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` (with
`SCRIBE_LOCAL_CLONES`) — verified. No existing event, object, or obligation was edited or
deleted.

**Update 2026-07-26 (Middle Scribe, append-only):** one record-relevant change since the
last check (2026-07-25). Ensemble killed "One Tap" at the source (studio session 43,
2026-07-25T22:42:25Z, commit `b415a59`), overturning evt-11's already-CONTESTED premiere.
Frank returned the work a third time; the studio's own written promise after the second
return ended the restaging, and three strong-tier voices convened separately and converged
on the kill. A second, independent finding rode along: the session-32 staging's central
gesture had never rendered — a strike-through cannot cross an inline-block, so no figure was
ever struck, and the red line fell on five real source names instead — while the studio's own
README, `meta.json` and `WORKBOARD.md` had asserted the opposite as verified fact for two
sessions. The false sentence is left visible on the record, marked superseded, not deleted; a
permanent WITHDRAWN notice was added to `works/2026-07-23-one-tap/`; the physical fountain
inherits nothing; the directory was not deleted (removal offered to Frank, undecided). The
diner's Quick Snack "The Dalles Concealment Case" — at its latest commit, `5ff8616`,
2026-07-25T07:01:08Z, roughly 15.5 hours before the kill — still carries the pre-kill
`gauntlet` value and the already-superseded "Kritiker: PREMIERE STANDS" verdict verbatim
(evt-11), with no withdrawal mark; the diner has not reacted as of this check (2026-07-26).
New event `evt-enc2026004-13-onetap-killed`; `encounter.json`'s Ensemble and
data-snack-plenum participant statuses and `status.as_of`/`statusLine` updated in place to
the current state. Eight new `QUOTE-MANIFEST.tsv` lines. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` — verified (all
new quotes are public, from `frankbueltge/studio`; no `SCRIBE_LOCAL_CLONES` dependency for
this update). No existing event, object, or obligation was edited or deleted.

**Update 2026-07-27 (Middle Scribe, append-only):** two record-relevant changes since the
last check (2026-07-25), both from one automated cook run. (1) The armed automation
published the diner's tenth Quick Snack (`data-snack.com` commit `853b3ae9`,
2026-07-26T07:17:20Z), re-cooking Meridian's instrument 018 ("No Signal to Extend", the
Homogenization Dossier v1, shipped field-research session 65, 2026-07-25 as the collective's
Local Return on joint inquiry ji-2026-002 "Model Collapse") — its `gauntlet` field again
honestly reads a pre-gauntlet-convention disclosure. New event
`evt-enc2026004-14-corpus-grown-4` and one new hashed object
(`data-snack:quick-no-signal-to-extend`). (2) The same commit re-voiced two already-published
items yet again — extending evt-06/evt-12's pattern, and disclosing something those events did
not catch: native-speaker.mdx's title had already flipped once, undisclosed, from evt-12's
"The Gate's Judgment" back to the original "The Machine's Judgment" at an intervening commit
(`5ff8616`, 2026-07-25T07:01:08Z), and this run flips it back again — three titles now on
record for one Quick Snack. split-seal.mdx was re-voiced more substantially than any prior
instance: title changed, teaser reworded, and `hookStatBig` — the headline number itself —
changed from "15" (specimen count) to "6" (Valid-stamp count), a different quantity from the
same work, not only prose. New event `evt-enc2026004-15-recook-pattern-continues-2`. Neither
run touched the diner's "One Tap" Quick Snack, which still carries the pre-kill gauntlet value
and the superseded "Kritiker: PREMIERE STANDS" verdict, unreacted to roughly 32.5 hours after
the source kill. Eight new `QUOTE-MANIFEST.tsv` lines. `node tools/verify-encounter-
fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` (with `SCRIBE_LOCAL_CLONES` set) — 52/52
verified. `status.as_of` moved to 2026-07-27, the re-cooked-works count to 10.
`encounter.json`'s Ensemble/Meridian/data-snack-plenum participant statuses and
`statusLine` updated in place to the current state. No existing event, object, or obligation
was edited or deleted.

**Update 2026-07-30 (Middle Scribe, append-only):** two record-relevant changes since the
last check (2026-07-27), both from one automated cook run. (1) The armed automation
published the diner's eleventh Quick Snack (`data-snack.com` commit `83efcdd1fe9af146c9dbbcbbad245aa9ec5399b9`,
2026-07-29T07:27:25Z), re-cooking Meridian's instrument 020 ("One Line for Ten Thousand", a
reconciliation audit of the Dataset Register seed, shipped field-research sessions 68–69,
reworked through a second gauntlet round 2026-07-27) — its `gauntlet` field again honestly
reads a pre-gauntlet-convention disclosure. New event `evt-enc2026004-16-corpus-grown-5` and
one new hashed object (`data-snack:quick-one-line-for-ten-thousand`). (2) The same commit
re-voiced two already-published items yet again, extending evt-06/evt-12/evt-15's pattern:
native-speaker.mdx's title flips back to "The Machine's Judgment", reversing evt-15's flip to
"The Gate's Judgment" — a fourth flip across the record since birth — and, new to this
pattern, the body prose itself was substantially rewritten a second time (first silently
reworded at evt-15's own commit without disclosure, now again here), not only the frontmatter
fields evt-12/evt-15 named. split-seal.mdx's headline number (`hookStatBig`) flips back from
"6" (Valid-stamp count, set at evt-15) to "15" (specimen count, its original value); its title
is unchanged this run, but teaser and hookStat are reworded again. New event
`evt-enc2026004-17-recook-pattern-continues-3`. Neither run touched the diner's "One Tap"
Quick Snack, which still carries the pre-kill gauntlet value and the superseded "Kritiker:
PREMIERE STANDS" verdict, unreacted to roughly 4.5 days after the source kill. Nine new
`QUOTE-MANIFEST.tsv` lines. `node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-004-diner-re-cooks` (with `SCRIBE_LOCAL_CLONES` set) — 61/61 verified.
`status.as_of` moved to 2026-07-30, the re-cooked-works count to 11. `encounter.json`'s
Meridian/data-snack-plenum participant statuses and `statusLine` updated in place to the
current state. No existing event, object, or obligation was edited or deleted.

**Correction 2026-08-02 (schema repair, not a re-reading).** Authoring this encounter's
narrative made it exportable for the first time, and the loader's schema gate rejected seven of
its records — a fixture is only validated once it becomes exportable, so these gaps had been
sitting undisclosed since the retroactive transcription. Both repaired here, additively:

1. **`content_hash` missing on `evt-01`…`evt-06`.** Backfilled with the repository's own
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

`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` — 61/61
verified (with `SCRIBE_LOCAL_CLONES` for the private-source quotes), unchanged by the repair.
No event, obligation or object record was edited or deleted.

**Update 2026-08-11 (Middle Scribe, append-only):** one record-relevant change since the
last check (2026-07-30) — a change in the automation's own behaviour, not a new re-cook.
The armed automation (evt-07) is still scheduled and still running daily (the workflow's
`cron: '37 4 * * *'` line, byte-unchanged), but it has published nothing to
`prototype-v2/src/content/quick/` since evt-17's commit (`83efcdd1f`, 2026-07-29T07:27:25Z):
checked directly against `frankbueltge/data-snack.com`'s own Actions run history for the
`upstream-auto-cook` workflow, all 12 scheduled runs from 2026-07-30 through 2026-08-10 show
the "Cook passing specials" step failing, with every step after it (gates, publish, deploy)
skipped as a consequence. The cause, read from the pipeline's own committed source: a single
upstream work, field-research's `2026-07-26-unable-to-ring-its-own-bell`, carries a
load-bearing caveat (passing the detect-stage gate) but cites no sources, failing
`validate.ts`'s separate check (`errors.push('no sources cited')`); the orchestrator's own
exit-code guard (`run.ts`: `if (write && hardFails.length > 0) process.exitCode = 1;`) then
fails the *whole* batch, not only that one work. The most recent run's own console output
(read via the GitHub Actions job log, not itself a git-tracked file — reported here as a
finding, not pinned as a manifest quote) shows the script finding two otherwise-ready items on
that run alone — a further `native-speaker` correction, and, since 2026-08-05, Meridian's
newly published instrument 022 "The Second Reader" (already synced to datavism.org's reuse
surface, `enc-2026-003`) — and writing their files to the CI runner's working tree before the
batch-level exit code discards the run: neither file exists in the repository at its current
commit (`bf3e977`, 2026-08-10). No PR, no issue, and nothing in the repository's own committed
record flags the stall; it is visible only in the workflow's run history. New event
`evt-enc2026004-18-cook-silently-stalled`, a fourth open item alongside evt-11/12/15/17's
already-recorded corrections — distinct in kind (a publish failure, not a content-quality
issue). `status.as_of` moved to 2026-08-11; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current state. Three new
`QUOTE-MANIFEST.tsv` lines (all from `frankbueltge/data-snack.com`'s pipeline source, under
the same `SCRIBE_LOCAL_CLONES` private-source fallback as prior updates — the workflow-run
log itself is not manifest-pinned, per the honesty rule above). `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` — 64/64 verified.
No existing event, object, or obligation was edited or deleted.

**Update 2026-08-12 (Middle Scribe, append-only):** one record-relevant change since the
last check (2026-08-11) — the stall continues, confirmed a further day. The scheduled run
that fired the day after the last check (`upstream-auto-cook`, run #33, id `31462334281`,
created 2026-08-11T05:38:52Z on head commit `348fafc6`, an unrelated CHEF-terminal-pool
refresh) failed with the identical signature checked directly against its own job log:
`✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell  (new)`
/ `✗ no sources cited`, tally `─── 2 pass · 1 fail · 13 skipped (fail-safe) ───`. The same
two otherwise-ready items — a further `native-speaker` correction and Meridian's instrument
022 "The Second Reader" — are written to the CI runner's working tree and discarded again by
the batch-level exit-code guard; neither exists in the repository at head. This brings the
run streak to 13 consecutive failures (2026-07-30 through 2026-08-11), extending
evt-enc2026004-18's 12. No fix, no PR, no issue anywhere in either repository (checked via
GitHub's own issue search on `frankbueltge/data-snack.com`). New event
`evt-enc2026004-19-stall-confirmed-day13`; the job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines
this update. `status.as_of` moved to 2026-08-12; `encounter.json`'s data-snack-plenum
participant status and `statusLine` updated in place to the current run count. `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` — 64/64 verified
(unchanged; no new manifest lines to check). No existing event, object, or obligation was
edited or deleted.

**Update 2026-08-13 (Middle Scribe, append-only):** one record-relevant change since the
last check (2026-08-12) — the stall continues, confirmed a further day. The scheduled run
that fired the day after the last check (`upstream-auto-cook`, run #34, id `31568550761`,
created 2026-08-12T06:02:27Z on head commit `6f39fba1`, an unrelated CHEF-terminal-pool
refresh) failed with the identical signature checked directly against its own job log:
`✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell  (new)`
/ `✗ no sources cited`, tally `─── 2 pass · 1 fail · 13 skipped (fail-safe) ───`. The same
two otherwise-ready items — a further `native-speaker` correction and Meridian's instrument
022 "The Second Reader" — are written to the CI runner's working tree and discarded again by
the batch-level exit-code guard; neither exists in the repository at head. This brings the
run streak to 14 consecutive failures (2026-07-30 through 2026-08-12), extending
evt-enc2026004-19's 13. No fix, no PR, no issue anywhere in either repository (checked via
the workflow's own run history: `total_count` is still 34 as of this check, no 2026-08-13 run
has fired yet). New event `evt-enc2026004-20-stall-confirmed-day14`; the job log itself
remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no
new manifest lines this update. `status.as_of` moved to 2026-08-13; `encounter.json`'s
data-snack-plenum participant status and `statusLine` updated in place to the current run
count. No existing event, object, or obligation was edited or deleted.

**Update 2026-08-14 (Middle Scribe, append-only):** one record-relevant change since the
last check (2026-08-13) — the stall continues, confirmed a further day. The scheduled run
that fired the day after the last check (`upstream-auto-cook`, run #35, id `31672407536`,
created 2026-08-13T06:02:43Z on head commit `dba637df`, an unrelated CHEF-terminal-pool
refresh) failed with the identical signature checked directly against its own job log:
`✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell  (new)`
/ `✗ no sources cited`, tally `─── 2 pass · 1 fail · 13 skipped (fail-safe) ───`. The same
two otherwise-ready items — a further `native-speaker` correction and Meridian's instrument
022 "The Second Reader" — are written to the CI runner's working tree and discarded again by
the batch-level exit-code guard; neither exists in the repository at head. This brings the
run streak to 15 consecutive failures (2026-07-30 through 2026-08-13), extending
evt-enc2026004-20's 14. No fix, no PR, no issue anywhere in either repository (checked via
the workflow's own run history: `total_count` is 35 as of this check, no 2026-08-14 run had
fired yet as of 2026-08-14T05:14Z, past the 04:37 UTC schedule). New event
`evt-enc2026004-21-stall-confirmed-day15`; the job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines
this update. `status.as_of` moved to 2026-08-14; `encounter.json`'s data-snack-plenum
participant status and `statusLine` updated in place to the current run count. No existing
event, object, or obligation was edited or deleted.

**Update 2026-08-15 (Middle Scribe, append-only) — two runs found in one check, the stall
continues.** The previous check (2026-08-14) had explicitly noted that day's run had not yet
fired at check time (`total_count` 35, past the 04:37 UTC schedule). This check finds both
that run and the next one, two consecutive scheduled runs, each failing with the identical
signature checked directly against its own job log.

Run #36 (`upstream-auto-cook`, id `31774951953`, created 2026-08-14T06:02:44Z on head commit
`feaf06ee`, an unrelated CHEF-terminal-pool refresh): `✗ FAIL  [field-research]
2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell  (new)` / `✗ no
sources cited`, tally `─── 2 pass · 1 fail · 13 skipped (fail-safe) ───`. New event
`evt-enc2026004-22-stall-confirmed-day16`.

Run #37 (`upstream-auto-cook`, id `31865813888`, created 2026-08-15T04:59:29Z on head commit
`7d6db2ef`, an unrelated CHEF-terminal-pool refresh): the identical signature. New event
`evt-enc2026004-23-stall-confirmed-day17`.

In both runs the same two otherwise-ready items — a further `native-speaker` correction and
Meridian's instrument 022 "The Second Reader" — are written to the CI runner's working tree
and discarded again by the batch-level exit-code guard. Checked directly against the
repository at head (`7d6db2ef`): `native-speaker.mdx` exists (from an earlier successful cook,
before the stall began, and is therefore not evidence of a fix) but `the-second-reader.mdx`
still does not. This brings the run streak to 17 consecutive failures (2026-07-30 through
2026-08-15), extending evt-enc2026004-21's 15. No fix, no PR, no issue anywhere in either
repository (checked via the workflow's own run history: `total_count` is 37 as of this check).
The job log itself remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's
own convention — no new manifest lines this update. `status.as_of` moved to 2026-08-15;
`encounter.json`'s data-snack-plenum participant status and `statusLine` updated in place to
the current run count. No other record-relevant change found since 2026-08-14 in `studio`,
`field-research`, `ulysses`, `frankbueltge.de`, enc-2026-001, enc-2026-002, enc-2026-003,
enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002. No existing event, object, or
obligation was edited or deleted.

**Update 2026-08-16 (Middle Scribe, append-only) — the stall continues, and its backlog
grows by one.** The scheduled run that fired the day after the last check (`upstream-auto-cook`,
run #38, id `31928104736`, created 2026-08-16T05:03:30Z on head commit `48dee704`, an unrelated
CHEF-terminal-pool refresh) failed with the identical signature checked directly against its own
job log: `✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell  (new)`
/ `✗ no sources cited`. This brings the run streak to 18 consecutive failures (2026-07-30 through
2026-08-16), extending evt-enc2026004-23's 17. No fix, no PR, no issue anywhere in either
repository (checked via the workflow's own run history: `total_count` is 38 as of this check).

The batch tally moved for the first time since evt-18: `─── 2 pass · 1 fail · 13 skipped ───` →
`─── 3 pass · 1 fail · 14 skipped ───`. A third otherwise-ready item now joins the discarded
backlog alongside the native-speaker correction and Meridian's instrument 022 "The Second
Reader": studio's own premiere "STILL DARK" (`works/2026-08-15-still-dark`, premiered
2026-08-15, session 96) is a new published+verified work with an extractable caveat, written to
the CI runner's working tree (`wrote .../still-dark.mdx`) and discarded again by the same
exit-code guard. Checked directly against the repository at head (`48dee704`):
`native-speaker.mdx` exists (from an earlier successful cook, before the stall began, not
evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` do not.

Checked and found NOT record-relevant: the same run's job log labels the `one-tap` correction
"session 99 (2026-08-16)", where prior runs said "session 35 (2026-07-23)" for
native-speaker's correction. Checked against studio's own repository directly:
`works/2026-07-23-one-tap/meta.json` and `data.json` are untouched since the 2026-07-25
withdrawal (commit `b415a59`, already on this record); the only 2026-08-16 commit touching that
path (`253c209`) is the ecology-wide privacy-redaction sweep paraphrasing Frank's quoted words
across several repositories (studio, field-research, ulysses, frankbueltge.de all show matching
same-week "wording private" commits), not a new correction to the work itself. The session-99
label is read as a pipeline artefact of that unrelated sweep, not a new upstream event; no event
is opened for it.

New event `evt-enc2026004-24-stall-confirmed-day18`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-16; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current run count and backlog size. No other
record-relevant change found since 2026-08-15 in `studio`, `field-research`, `ulysses`,
`frankbueltge.de`, enc-2026-001, enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or
ji-2026-002 (enc-2026-002 is separately updated today — see that fixture's own README). No
existing event, object, or obligation was edited or deleted.

**Update 2026-08-18 (Middle Scribe, append-only) — two further runs found in one check, the
stall continues, the backlog does not grow.** The two scheduled runs that fired since the last
check (2026-08-16) both failed with the identical signature, checked directly against each
run's own job log.

Run #39 (`upstream-auto-cook`, id `31997439761`, created 2026-08-17T05:18:26Z on head commit
`72d79f38`): `✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell →
quick/unable-to-ring-its-own-bell  (new)` / `✗ no sources cited`, tally
`─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`, unchanged from evt-24. New event
`evt-enc2026004-25-stall-confirmed-day19`.

Run #40 (`upstream-auto-cook`, id `32101521942`, created 2026-08-18T05:05:10Z on head commit
`f5225ed`, a CHEF-terminal-pool refresh): the identical signature and the identical tally. New
event `evt-enc2026004-26-stall-confirmed-day20`.

This brings the run streak to 20 consecutive failures (2026-07-30 through 2026-08-18),
extending evt-enc2026004-24's 18. Unlike the 2026-08-16 update, the batch tally does not move
in either run: the discarded backlog stays at three items (a further native-speaker correction,
Meridian's instrument 022 "The Second Reader", and studio's "STILL DARK"). Checked directly
against the repository at head (`f5225ed`): `native-speaker.mdx` exists (from an earlier
successful cook, before the stall began, not evidence of a fix); `the-second-reader.mdx` and
`still-dark.mdx` still do not. No fix, no PR, no issue anywhere in either repository (checked
via the workflow's own run history: `total_count` is 40 as of this check).

The job log itself remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own
convention — no new manifest lines this update. `status.as_of` moved to 2026-08-18;
`encounter.json`'s data-snack-plenum participant status and `statusLine` updated in place to
the current run count. No other record-relevant change found since 2026-08-16 in `studio`,
`field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the
paths each of those fixtures tracks are untouched in this window; a same-timestamp,
ecology-wide `PROTOCOL.md` addition on 2026-08-18 across `studio`, `field-research` and
`ulysses` — "Protocol: what a stranger gets from a work, and who can answer that" — touches
none of the paths, quotes or topics any open fixture tracks, checked directly against its own
diff). No existing event, object, or obligation was edited or deleted.

**Update 2026-08-19 (Middle Scribe, append-only) — a 21st consecutive run, the stall continues,
the backlog does not grow.** The one scheduled run that fired since the last check (2026-08-18)
failed with the identical signature, checked directly against the run's own job log.

Run #41 (`upstream-auto-cook`, id `32218113073`, created 2026-08-19T05:05:20Z on head commit
`a7e93923`): `✗ FAIL  [field-research] 2026-07-26-unable-to-ring-its-own-bell →
quick/unable-to-ring-its-own-bell  (new)` / `✗ no sources cited`, tally
`─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`, unchanged from evt-26. New event
`evt-enc2026004-27-stall-confirmed-day21`.

This brings the run streak to 21 consecutive failures (2026-07-30 through 2026-08-19),
extending evt-enc2026004-26's 20. The batch tally does not move: the discarded backlog stays
at three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`a7e93923`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the workflow's own run
history: `total_count` is 41 as of this check).

The upstream root cause is also unchanged: `field-research:works/2026-07-26-unable-to-ring-its-own-bell/`
has not been touched since 2026-08-12 (commit `03437c4`, an unrelated instrument, checked
directly against the path's own log).

The job log itself remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own
convention — no new manifest lines this update. `status.as_of` moved to 2026-08-19;
`encounter.json`'s data-snack-plenum participant status and `statusLine` updated in place to
the current run count. No other record-relevant change found since 2026-08-18 in `studio`,
`field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the
paths each of those fixtures tracks are untouched in this window, other than one field-research
commit, `c866311`, touching `memory/claims.md` and `memory/downstream-commitments.md` — checked
directly against its own diff: it adds conditions 17–20 for an unrelated arc, the "severed
readers" absence-confirmation project, not row 12 or any condition this record or enc-002/003
track). No existing event, object, or obligation was edited or deleted.

**Update 2026-08-20 (Middle Scribe, append-only) — a 22nd consecutive run, the stall continues,
the backlog does not grow.** The one scheduled run that fired since the last check (2026-08-19)
failed with the identical signature, checked directly against the run's own job log.

Run #42 (`upstream-auto-cook`, id `32334370470`, created 2026-08-20T05:06:59Z on head commit
`da328fec`, an unrelated CHEF-terminal-pool refresh — the only other commit in the repository
this window, a cosmetic flavor-text rewrite in the `cookie-roulette` game's terminal-lines pool,
checked directly against its own diff, `[skip ci]`, no reference to any tracked path): `✗ FAIL
[field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell
(new)` / `✗ no sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`,
unchanged from evt-27. New event `evt-enc2026004-28-stall-confirmed-day22`.

This brings the run streak to 22 consecutive failures (2026-07-30 through 2026-08-20),
extending evt-enc2026004-27's 21. The batch tally does not move: the discarded backlog stays
at three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`da328fec`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the workflow's own run
history: `total_count` is 42 as of this check).

The upstream root cause is also unchanged: `field-research:works/2026-07-26-unable-to-ring-its-own-bell/`
has not been touched since its one and only commit (2026-08-12T23:34:53Z, an unrelated
deviation entry, checked directly against the path's own log with a deepened local clone —
correcting this record's own prior shorthand for that commit's hash, which does not match any
reachable commit; the date and unrelatedness are unaffected).

The job log itself remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own
convention — no new manifest lines this update. `status.as_of` moved to 2026-08-20;
`encounter.json`'s data-snack-plenum participant status and `statusLine` updated in place to
the current run count. No other record-relevant change found since 2026-08-19 in `studio`,
`field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the
paths each of those fixtures tracks are untouched in this window). No existing event, object,
or obligation was edited or deleted.

**Update 2026-08-21 (Middle Scribe, append-only) — a 23rd consecutive run, the stall continues,
the backlog does not grow.** The one scheduled run that fired since the last check (2026-08-20)
failed with the identical signature, checked directly against the run's own job log.

Run #43 (`upstream-auto-cook`, id `32449400138`, created 2026-08-21T05:07:40Z on head commit
`c329a6f`, an unrelated CHEF-terminal-pool refresh — the only other commit in the repository
this window, `[skip ci]`, no reference to any tracked path): `✗ FAIL [field-research]
2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell (new)` / `✗ no
sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`, unchanged from
evt-28. New event `evt-enc2026004-29-stall-confirmed-day23`.

This brings the run streak to 23 consecutive failures (2026-07-30 through 2026-08-21),
extending evt-enc2026004-28's 22. The batch tally does not move: the discarded backlog stays
at three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`c329a6f`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the workflow's own run
history: `total_count` is 43 as of this check).

The upstream root cause is also unchanged. Checked directly against a full local clone of
`field-research:works/2026-07-26-unable-to-ring-its-own-bell/`'s own commit log: the path's
most recent commit remains `95a20553` (2026-08-05T04:15:02Z, "Landing reconciliation, the
final fetch state, and what the conductor's own commits did to a role"), unrelated to this
work's sources gate. This scribe run could not independently confirm evt-28/evt-27's stated
`2026-08-12T23:34:53Z` figure against any commit reachable on this path — flagged here rather
than repeated, not corrected (no certainty exists yet as to which figure, if either, is the
error); the underlying fact both checks agree on — no touch to this path since well before the
stall began, still unrelated — is unaffected either way.

The job log itself remains unpinned to `QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own
convention — no new manifest lines this update. `status.as_of` moved to 2026-08-21;
`encounter.json`'s data-snack-plenum participant status and `statusLine` updated in place to
the current run count. This same check also produced a new event on `ji-2026-001` (`e0017`,
its own README, its own eight `QUOTE-MANIFEST.tsv` lines) — see that fixture. No other
record-relevant change found since 2026-08-20 in `studio`, `field-research`, `ulysses`,
`frankbueltge.de`, `datavism.org`, `data-snack-plenum`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, or ji-2026-002 (checked directly: the paths each of
those fixtures tracks are untouched in this window). No existing event, object, or obligation
was edited or deleted.

## Update 2026-08-23 (Middle Scribe, append-only) — day 25, same signature, backlog unchanged

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #45 fired 2026-08-23T05:04:34Z on head commit `6653b4e`, another
unrelated CHEF-terminal-pool refresh (confirmed the only other commit in the repository this
window via the GitHub API), and failed with the identical signature: `✗ FAIL
[field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell
(new)` / `✗ no sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`.

This brings the run streak to 25 consecutive failures (2026-07-30 through 2026-08-23),
extending evt-enc2026004-30's 24. The batch tally does not move: the discarded backlog stays
at three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`6653b4e`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the workflow's own run
history: `total_count` is 45 as of this check).

The upstream root cause is also unchanged. Checked directly against a full local clone of
`field-research:works/2026-07-26-unable-to-ring-its-own-bell/`'s own commit log: the path's
most recent commit remains `95a20553` (2026-08-05T04:15:02Z), unrelated to this work's sources
gate.

New event `evt-enc2026004-31-stall-confirmed-day25`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines
this update. `status.as_of` moved to 2026-08-23; `encounter.json`'s data-snack-plenum
participant status and `statusLine` updated in place to the current run count. No other
record-relevant change found since 2026-08-22 in `studio`, `field-research`, `ulysses`,
`frankbueltge.de`, `datavism.org`, `data-snack-plenum`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the
paths each of those fixtures tracks are untouched in this window). No existing event, object,
or obligation was edited or deleted.

## Update 2026-08-22 (Middle Scribe, append-only) — day 24, same signature, backlog unchanged

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #44 fired 2026-08-22T05:02:23Z on head commit `ef0a4d8`, another
unrelated CHEF-terminal-pool refresh, and failed with the identical signature: `✗ FAIL
[field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell
(new)` / `✗ no sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`.

This brings the run streak to 24 consecutive failures (2026-07-30 through 2026-08-22),
extending evt-enc2026004-29's 23. The batch tally does not move: the discarded backlog stays
at three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`ef0a4d8`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the workflow's own run
history: `total_count` is 44 as of this check).

The upstream root cause is also unchanged. Checked directly against a full local clone of
`field-research:works/2026-07-26-unable-to-ring-its-own-bell/`'s own commit log: the path's
most recent commit remains `95a20553` (2026-08-05T04:15:02Z), unrelated to this work's sources
gate.

New event `evt-enc2026004-30-stall-confirmed-day24`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines
this update. `status.as_of` moved to 2026-08-22; `encounter.json`'s data-snack-plenum
participant status and `statusLine` updated in place to the current run count. This same check
also produced a new event on `ji-2026-001` (`e0018`, its own README, its own four
`QUOTE-MANIFEST.tsv` lines) — see that fixture; the fixture's long-tracked README/dossier
currency fixes finally landed there. No other record-relevant change found since 2026-08-21 in
`studio`, `field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`, `data-snack-plenum`,
enc-2026-001, enc-2026-002, enc-2026-003, enc-2026-005, enc-2026-006, or ji-2026-002 (checked
directly: the paths each of those fixtures tracks are untouched in this window). No existing
event, object, or obligation was edited or deleted.

## Update 2026-08-25 (Middle Scribe, append-only) — day 27, same signature, backlog unchanged;
one prior day's narrative entry disclosed as missing, not backfilled

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #47 fired 2026-08-25T05:08:16Z on head commit `ab34db9`, another
unrelated CHEF-terminal-pool refresh (confirmed the only other commit in the repository this
window via the GitHub API), and failed with the identical signature: `✗ FAIL [field-research]
2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell (new)` / `✗ no
sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`.

This brings the run streak to 27 consecutive failures (2026-07-30 through 2026-08-25),
extending evt-enc2026004-32's 26 (2026-08-24, run #46 — that check's own new event exists in
`events.json` and moved `status.as_of`, but this run's own narrative entry was never appended
here; disclosed rather than silently filled in after the fact, per this fixture family's own
precedent for a scribe run's own gaps, not backfilled since the underlying facts are already on
record in evt-32 and this entry). The batch tally does not move: the discarded backlog stays at
three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`ab34db9`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the GitHub API: `data-snack.com`
carries no pull request newer than #7, 2026-08-08, unrelated to this stall; `total_count` is 47
as of this check).

The upstream root cause is also unchanged. Checked directly against `field-research`: the
`2026-07-26-unable-to-ring-its-own-bell` path is untouched this window; the currently live
Minnesota/claims-row-12 text this ledger's sibling fixture `enc-2026-001` tracks, and Meridian's
downstream-commitments conditions 1/2, are also confirmed byte-unchanged, off this fixture's own
scope but checked in the same pass.

New event `evt-enc2026004-33-stall-confirmed-day27`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-25; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current run count. No other record-relevant
change found since 2026-08-24 in `studio`, `field-research`, `ulysses`, `frankbueltge.de`,
`datavism.org`, `data-snack-plenum`, `meridian-runtime`, enc-2026-001, enc-2026-002,
enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the
paths each of those fixtures tracks are untouched in this window, including `frankbueltge.de`'s
`README.md`, `src/config/naming.ts`'s door card, and the studio-dossier authorship line
`ji-2026-001` tracks, even though that repository's `main` advanced substantially this window —
among other things adding a new practice, "Arch", to the site's own roster (2026-08-22/23),
checked directly and found to name no relation to any of the three practices this ledger tracks,
so no fixture was touched for it). Two new standing conditions on field-research's own internal
review-arc drafts (`memory/downstream-commitments.md` conditions 37 and 38, sessions 134 and
135, 2026-08-24/25) are likewise unrelated to any tracked instrument or reuse surface and name no
participant of any open encounter, so no fixture was touched for either. No existing event,
object, or obligation was edited or deleted.

## Update 2026-08-26 (Middle Scribe, append-only) — day 28, same signature, backlog unchanged

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #48 fired 2026-08-26T05:08:41Z on head commit `5bb9183`, another
unrelated CHEF-terminal-pool refresh (confirmed the only other commit in the repository this
window via the GitHub API), and failed with the identical signature — checked this time against
the job's own log directly (job `98068416367`), not only the run's conclusion: `✗ FAIL
[field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell
(new)` / `✗ no sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`; every
step after Cook (Gates, Detect changes, Publish, Upload, Auth to GCP, Deploy) shows `skipped`.

This brings the run streak to 28 consecutive failures (2026-07-30 through 2026-08-26),
extending evt-enc2026004-33's 27. The batch tally does not move: the discarded backlog stays at
three items (a further native-speaker correction, Meridian's instrument 022 "The Second
Reader", and studio's "STILL DARK"). Checked directly against the repository at head
(`5bb9183`): `native-speaker.mdx` exists (from an earlier successful cook, before the stall
began, not evidence of a fix); `the-second-reader.mdx` and `still-dark.mdx` still do not. No
fix, no PR, no issue anywhere in either repository (checked via the GitHub API: `data-snack.com`
carries no pull request newer than #7, 2026-08-08, unrelated to this stall; `total_count` is 48
as of this check).

The upstream root cause is also unchanged. Checked directly against `field-research`: the
`2026-07-26-unable-to-ring-its-own-bell` path is untouched this window; the currently live
Minnesota/claims-row-12 text this ledger's sibling fixture `enc-2026-001` tracks, and Meridian's
downstream-commitments conditions 1/2, are also confirmed byte-unchanged, off this fixture's own
scope but checked in the same pass — that file itself gained no new condition today (still 38,
sessions 134/135, unchanged since evt-33).

New event `evt-enc2026004-34-stall-confirmed-day28`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-26; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current run count. No other record-relevant
change found since 2026-08-25 in `studio`, `field-research`, `ulysses`, `frankbueltge.de`,
`datavism.org`, `data-snack-plenum`, enc-2026-001, enc-2026-002, enc-2026-003, enc-2026-005,
enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the paths each of those fixtures
tracks are untouched in this window — studio's native-speaker and no-way-of-knowing paths
untouched; datavism.org's field-works HEAD unchanged since 2026-08-07 and the
coverage-not-custody mirror regression remains unrepaired; ulysses' `REQUESTS.md` and
`REQUESTS-ARCHIVE.md` carry no MRR/Meridian Research Runtime mention since 2026-08-08, including
through two redaction sweeps this window that touched neither; `frankbueltge.de`'s
ji-2026-001-tracked strings — the README ecology paragraph, the Studio table row, `naming.ts`'s
door card, the dossier authorship line — are byte-unchanged since 2026-08-22's PR #705/#695
landings, and Ensemble's still-open `ji-2026-001` return move remains unaddressed;
`enc-2026-006` stays closed/complete with no new cross-practice event reopening it).
`field-research`'s own internal session 136 (2026-08-26) added a new claims-row entry and
`REQUESTS.md` exchange about an unrelated encyclopedia-citation concept — checked directly and
found to touch no tracked instrument, no claims-row-12 text, and no participant of any open
encounter, so no fixture was touched for it. No existing event, object, or obligation was
edited or deleted.

## Update 2026-08-27 (Middle Scribe, append-only) — day 29, same signature, backlog unchanged; a
scheduling-timing anomaly disclosed

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #49 fired 2026-08-27T15:27:24Z on head commit `f3a5a84`, another
unrelated CHEF-terminal-pool refresh (confirmed the only other commit in the repository this
window via the GitHub API), and failed with the identical signature — checked directly against
the job's own log (job `98572501190`): `✗ FAIL [field-research]
2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell (new)` / `✗ no
sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`; every step after Cook
(Gates, Detect changes, Publish, Upload, Auth to GCP, Deploy) shows `skipped`.

**Disclosed, not treated as a change in kind:** unlike the preceding 28 runs, which all fired in
a roughly 04:37–06:02 UTC band tracking the workflow's own cron (`'37 4 * * *'`), this run's own
`created_at` is 2026-08-27T15:27:24Z — about eleven hours later. The same day's CHEF-terminal-pool
refresh workflow (a separate, unrelated schedule) shows the identical shift, firing at
15:18:21Z rather than its own usual ~04:50–05:10 UTC band. Both workflows' cron expressions are
confirmed byte-unchanged at head; the shift reads as a platform-side scheduling delay on GitHub's
own side, not a change made in either workflow file, and it did not skip a day — exactly one run
of each workflow landed in the window.

This brings the run streak to 29 consecutive failures (2026-07-30 through 2026-08-27), extending
evt-enc2026004-34's 28. The batch tally does not move: the discarded backlog stays at three items
(a further native-speaker correction, Meridian's instrument 022 "The Second Reader", and studio's
"STILL DARK"). Checked directly against the repository at head (`f3a5a84`): `native-speaker.mdx`
exists (from an earlier successful cook, before the stall began, not evidence of a fix);
`the-second-reader.mdx` and `still-dark.mdx` still do not. No fix, no PR, no issue anywhere in
either repository (checked via the GitHub API: `data-snack.com` carries no pull request newer
than #7, 2026-08-08, unrelated to this stall; `total_count` is 49 as of this check).

The upstream root cause is also unchanged. Checked directly against a full clone of
`field-research`: the `2026-07-26-unable-to-ring-its-own-bell` path is untouched this window
(last commit 2026-08-05); the currently live Minnesota/claims-row-12 text this ledger's sibling
fixture `enc-2026-001` tracks, and Meridian's downstream-commitments conditions 1/2, are also
confirmed byte-unchanged, off this fixture's own scope but checked in the same pass — that file
itself gained no new condition today (still 38, sessions 134/135, unchanged since evt-33/evt-34).

A new, unrelated `field-research` internal review-arc commit (2026-08-28, session 137,
"Consolidation: claims, discards and open questions after the session that could not publish its
rate") touches `memory/claims.md`, `memory/discarded.md` and `memory/open-questions.md` but names
no tracked instrument, no claims-row-12 text, and no participant of any open encounter — checked
directly against its own diff — so no fixture was touched for it.

New event `evt-enc2026004-35-stall-confirmed-day29`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-27; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current run count. No other record-relevant
change found since 2026-08-26 in `studio`, `field-research`, `ulysses`, `frankbueltge.de`,
`datavism.org`, `data-snack-plenum`, enc-2026-001, enc-2026-002, enc-2026-003, enc-2026-005,
enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the paths each of those fixtures
tracks are untouched in this window — studio's native-speaker, no-way-of-knowing and one-tap
paths untouched since their own already-recorded last touches; datavism.org's field-works HEAD
unchanged since 2026-08-07 and the coverage-not-custody mirror regression remains unrepaired;
ulysses' `REQUESTS.md` carries no MRR/Meridian Research Runtime mention since 2026-08-11,
including through this window's own unrelated project and delivery commits; `frankbueltge.de`'s
ji-2026-001-tracked strings — the README ecology paragraph, the Studio table row, `naming.ts`'s
door card, the dossier authorship line — are byte-unchanged since 2026-08-22's PR #705/#695
landings despite two further README commits this window (#739, #759, both unrelated wording
currency fixes touching neither tracked line), and Ensemble's still-open `ji-2026-001` return
move remains unaddressed; `enc-2026-006` stays closed/complete with no new cross-practice event
reopening it). `field-research`'s own `REQUESTS.md` carries no new entry since 2026-08-26; its
2026-08-04 request naming `ji-2026-002`'s WAITING/COMPLETED_LOCAL tension is still `Status: open`,
unchanged since the 2026-08-07 check. No existing event, object, or obligation was edited or
deleted.

## Update 2026-08-28 (Middle Scribe, append-only) — day 30, same signature, backlog unchanged; the
scheduling-timing shift persists a second day

Checked directly against the workflow's own run history (`frankbueltge/data-snack.com`,
`upstream-auto-cook`): run #50 fired 2026-08-28T16:53:54Z on head commit `6c70799c`, another
unrelated CHEF-terminal-pool refresh (confirmed the only other commit in the repository this
window via the GitHub API), and failed with the identical signature — checked directly against
the job's own log (job `98919994968`): `✗ FAIL [field-research]
2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell (new)` / `✗ no
sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`; every step after Cook
(Gates, Detect changes, Publish, Upload, Auth to GCP, Deploy) shows `skipped`.

**Disclosed, continuing evt-35's observation:** this is now the second consecutive run in the
shifted ~15:00–17:00 UTC band rather than the workflow's own cron band (`'37 4 * * *'`, confirmed
byte-unchanged at head) — run #49 fired 15:27:24Z (2026-08-27), run #50 fired 16:53:54Z
(2026-08-28), about 12h17m after cron. The same day's CHEF-terminal-pool refresh workflow (a
separate, unrelated schedule, its own cron also byte-unchanged) shows the identical shift a
second day running, firing at 16:41:52Z (run #85) against its own usual ~04:50–05:10 UTC band.
Neither workflow file changed and no day was skipped — exactly one run of each fired in the
window both days. This reads as a platform-side scheduling delay persisting across two days, not
a change made in either workflow.

This brings the run streak to 30 consecutive failures (2026-07-30 through 2026-08-28), extending
evt-enc2026004-35's 29. The batch tally does not move: the discarded backlog stays at three items
(a further native-speaker correction, Meridian's instrument 022 "The Second Reader", and studio's
"STILL DARK"). Checked directly against the repository at head (`6c70799c`): `native-speaker.mdx`
exists (from an earlier successful cook, before the stall began, not evidence of a fix);
`the-second-reader.mdx` and `still-dark.mdx` still do not. No fix, no PR, no issue anywhere in
either repository (checked via the GitHub API: `data-snack.com` carries no pull request newer
than #7, 2026-08-08, unrelated to this stall; `total_count` is 50 as of this check).

The upstream root cause is also unchanged. Checked directly against a full clone of
`field-research`: the `2026-07-26-unable-to-ring-its-own-bell` path's `data.json` and `README.md`
are byte-unchanged since commit `96c9dc4` (long predating this stall); the currently live
Minnesota/claims-row-12 text this ledger's sibling fixture `enc-2026-001` tracks, and Meridian's
downstream-commitments conditions 1/2, are also confirmed byte-unchanged, off this fixture's own
scope but checked in the same pass.

`field-research`'s own internal review-arc gained three further conditions this window
(`downstream-commitments.md` conditions 39, 40 and 41, session 138, 2026-08-29 — a self-directed
extraction-methodology gate, its own hit-rate null, and a pilot-design caveat, all about
Meridian's internal review tooling) and a 94-line `claims.md` addition (session 138's
pre-registered extractor gate, a second fired K4′, and same-session withdrawal of a
population-wide figure as ERRATA-138 E62) — checked directly against both diffs and found to
name no tracked instrument, no claims-row-12 text, and no participant of any open encounter, so
no fixture was touched for either.

New event `evt-enc2026004-36-stall-confirmed-day30`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-28; `encounter.json`'s data-snack-plenum participant
status and `statusLine` updated in place to the current run count. No other record-relevant
change found since 2026-08-27 in `studio`, `field-research`, `ulysses`, `frankbueltge.de`,
`datavism.org`, `data-snack-plenum`, enc-2026-001, enc-2026-002, enc-2026-003, enc-2026-005,
enc-2026-006, ji-2026-001, or ji-2026-002 (checked directly: the paths each of those fixtures
tracks are untouched in this window — studio's native-speaker, no-way-of-knowing, one-tap,
still-dark and no-part paths are all untouched since their own already-recorded last touches;
Ensemble's session 112 (2026-08-28) is entirely about its own "OUTSTANDING" instrument (a relay
timezone defect found and repaired) and a `REQUESTS.md` entry addressed to the architect about
hosting it, naming no tracked work and no participant of any open encounter; datavism.org's
field-works HEAD unchanged since 2026-08-07 and the coverage-not-custody mirror regression
remains unrepaired; ulysses' one new atlas commit this window (2026-08-28, three entries) is
`added_by` "ulysses" itself, not "fable", so `enc-2026-005` is untouched, and its two "Project
work" initiation commits (2026-08-28, 2026-08-29) carry no Meridian/MRR mention in `REQUESTS.md`,
unchanged since 2026-08-11; `frankbueltge.de`'s ji-2026-001-tracked strings — the README ecology
paragraph, the Studio table row, `naming.ts`'s door card, the dossier authorship line — are
byte-unchanged since 2026-08-22's PR #705/#695 landings, its only "studio: integrate" commit this
window (2026-08-28) mirroring session 112's journal and `REQUESTS.md` text without adding a new
work, and Ensemble's still-open `ji-2026-001` return move remains unaddressed; `enc-2026-006`
stays closed/complete with no new cross-practice event reopening it). `data-snack-plenum`'s own
repository carries no commit newer than 2026-08-26 (Plenum session 2026-08-26), already checked.
No existing event, object, or obligation was edited or deleted.

## Update 2026-08-30 (Middle Scribe, append-only) — day 31, same signature, backlog unchanged; the
scheduling-timing shift persists a third day at a different offset; this check lands a day late

This check covers two calendar days: the prior scribe run covered through 2026-08-28, and no
entry was made for 2026-08-29. Checked directly against the workflow's own run history
(`frankbueltge/data-snack.com`, `upstream-auto-cook`): exactly one new run fired in the gap — run
#51, 2026-08-29T11:19:09Z on head commit `eaa4a145` (another unrelated CHEF-terminal-pool refresh,
the only other commit in the repository this window, confirmed via the GitHub API: no commit since
`6c70799c` other than this one) — and none has yet fired for 2026-08-30 as of this check
(2026-08-30T05:08Z; workflow-run `total_count` is 51). Run #51 failed with the identical
signature — checked directly against the job's own log (job `99093532076`): `✗ FAIL
[field-research] 2026-07-26-unable-to-ring-its-own-bell → quick/unable-to-ring-its-own-bell (new)`
/ `✗ no sources cited`, tally `─── 3 pass · 1 fail · 14 skipped (fail-safe) ───`; every step after
Cook (Gates, Detect changes, Publish, Upload, Auth to GCP, Deploy) shows `skipped`.

**Disclosed, continuing evt-35/-36's observation — a third consecutive day, at a varying offset:**
run #49 fired 15:27:24Z (2026-08-27, +10h50m against the `'37 4 * * *'` cron), run #50 fired
16:53:54Z (2026-08-28, +12h17m), run #51 fired 11:19:09Z (2026-08-29, +6h42m). The offset moves
each day rather than holding at a fixed delay, which weighs against a scheduled change to either
workflow file and toward a platform-side scheduling irregularity, as already disclosed. The same
day's CHEF-terminal-pool refresh workflow (a separate, unrelated schedule, its own cron also
byte-unchanged) shows the identical shift a third day running: run #86 fired 11:09:54Z, nine
minutes ahead of this workflow's own run #51 — the same close pairing seen on the two prior days —
against its own usual ~04:50–05:10 UTC band. Neither workflow file changed and no day was skipped
in either workflow's own run history — exactly one run of each fired in the window each day.

This brings the run streak to 31 consecutive failures (2026-07-30 through 2026-08-29), extending
evt-enc2026004-36's 30. The batch tally does not move: the discarded backlog stays at three items
(a further native-speaker correction, Meridian's instrument 022 "The Second Reader", and studio's
"STILL DARK") — confirmed still written in run #51's own job log PASS lines but never committed.
Checked directly against the repository at head (`eaa4a145`): `native-speaker.mdx` exists (from an
earlier successful cook, before the stall began, not evidence of a fix); `the-second-reader.mdx`
and `still-dark.mdx` still do not. No fix, no PR, no issue anywhere in either repository (checked
via the GitHub API: `data-snack.com` carries no pull request newer than #7, 2026-08-08, unrelated
to this stall, and its one open issue — #5, 2026-07-10, a datavism line-patronage canon question —
is unrelated).

The upstream root cause is also unchanged. Checked directly against a full clone of
`field-research`: the `2026-07-26-unable-to-ring-its-own-bell` path is byte-unchanged since commit
`96c9dc4` (long predating this stall, confirmed no touch through 2026-08-30); the currently live
Minnesota/claims-row-12 text this ledger's sibling fixture `enc-2026-001` tracks, and Meridian's
downstream-commitments conditions 1/2/6/7, are also confirmed byte-unchanged, off this fixture's
own scope but checked in the same pass.

`field-research`'s own internal review-arc gained further downstream conditions this window
(conditions 39(f), 41, 42 and 43 — sessions 138/139, 2026-08-29/-30 — self-directed
extraction-methodology and blinding-share caveats about Meridian's internal review tooling) and
further `claims.md` entries (sessions 138/139) — checked directly against both diffs and found to
name no tracked instrument, no claims-row-12 text, and no participant of any open encounter, so no
fixture was touched for either.

New event `evt-enc2026004-37-stall-confirmed-day31`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-29; `encounter.json`'s data-snack-plenum participant status
and `statusLine` updated in place to the current run count. No other record-relevant change found
since 2026-08-28 in `studio`, `field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`,
`data-snack-plenum`, enc-2026-001, enc-2026-002, enc-2026-003, enc-2026-005, enc-2026-006,
ji-2026-001, or ji-2026-002 (checked directly: the paths each of those fixtures tracks are
untouched in this window — studio's native-speaker, no-way-of-knowing, one-tap, still-dark and
no-part paths are all untouched since their own already-recorded last touches; studio's sessions
112 (2026-08-28) and 113 (2026-08-29) are entirely about the same "OUTSTANDING" rain-alert
instrument, naming no tracked work and no participant of any open encounter; `datavism.org`'s
field-works HEAD unchanged since 2026-08-07 (confirmed via the GitHub API: `pushed_at` still
2026-08-07T06:35:31Z) and the coverage-not-custody mirror regression remains unrepaired; `ulysses`'
two new atlas commits this window (2026-08-29, five entries; 2026-08-30, two entries) are
`added_by` "ulysses" itself, not "fable", so `enc-2026-005` is untouched, and its two "Project
work" initiation commits (2026-08-29, 2026-08-30) carry no Meridian/MRR mention in `REQUESTS.md`,
unchanged since 2026-08-11; `frankbueltge.de`'s ji-2026-001-tracked strings — the README ecology
paragraph and `naming.ts`'s door card — are byte-unchanged since 2026-08-22's PR #705/#695
landings, and Ensemble's still-open `ji-2026-001` return move remains unaddressed; `enc-2026-006`
stays closed/complete with no new cross-practice event reopening it). `data-snack-plenum`'s own
repository carries no commit newer than 2026-08-26 (Plenum session 2026-08-26), already checked.
No existing event, object, or obligation was edited or deleted.

**Update 2026-08-31 (Middle Scribe, append-only):** one record-relevant change since the last
check (2026-08-30, which itself covered run #51). Run #52 fired 2026-08-30T10:04:59Z on head
commit `b1b4b76` (the only commit in the repository since `eaa4a14`, the routine CHEF-terminal-pool
refresh) — the 32nd consecutive failing run, same failure signature byte-for-byte, including the
same skip/pass list and the same `field-research`-2026-08-03-where-the-reader-declines` skip entry
already present in run #51 (not new to this run). The timing shift observed since evt-35 continues
a fourth consecutive day, offset now +5h28m against the workflow's own cron (`37 4 * * *`,
byte-unchanged), shrinking on each of the last two days rather than holding — still read as a
platform-side scheduling delay, not a workflow change; the paired CHEF-terminal-pool workflow
(cron also byte-unchanged) shows the identical fourth-day shift, 6m34s ahead of this run. No fix,
no PR, no new issue. Checked as of this update (2026-08-31T05:12Z): total_count still 52, no run
yet fired for 2026-08-31.

**Disclosed, not written into any fixture:** `field-research`, `studio` and `ulysses` each replaced
their own governing `PROTOCOL.md` on 2026-08-30 at the architect's unilateral decision (an
identically-worded team note — "Research ecology v3: your constitution was replaced" — landed the
same day in all three practices' `REQUESTS.md`; superseded protocol texts archived unchanged in
each repository's `archive/protocols/`; each practice then ran its own permitted closing sessions
before opening "cycle 001" under the new law). This was checked directly and is real, but it
touches none of the files this ledger's open encounters pin as source, contract or object:
`enc-2026-001`/`enc-2026-002` pin `field-research:memory/downstream-commitments.md` and
`studio:works/2026-07-13-native-speaker/` / `studio:projects/no-way-of-knowing/` specifically
(unchanged in this window beyond the already-recorded conditions 42/43 addition), and
`enc-2026-005` pins Ulysses' own ADAPTED/TAKEN review conditions, not its house `PROTOCOL.md`. Per
this ledger's own rule (a new fixture opens only for a documented acceptance naming a relation,
never inferred from activity, and a unilateral same-repository governance change is not itself an
inter-practice encounter), no fixture was opened or amended for this change beyond this note.

New event `evt-enc2026004-38-stall-confirmed-day32`. The job log itself remains unpinned to
`QUOTE-MANIFEST.tsv` (not git-tracked), per evt-18's own convention — no new manifest lines this
update. `status.as_of` moved to 2026-08-30; `encounter.json`'s data-snack-plenum participant status
and `statusLine` updated in place to the current run count, and the statusLine now also names the
protocol-replacement check. No other record-relevant change found since 2026-08-29 in `studio`,
`field-research`, `ulysses`, `frankbueltge.de`, `datavism.org`, `data-snack-plenum`, enc-2026-001,
enc-2026-002, enc-2026-003, enc-2026-005, enc-2026-006, ji-2026-001, or ji-2026-002 (checked
directly: `datavism.org`'s field-works HEAD unchanged since 2026-08-07, coverage-not-custody mirror
regression remains unrepaired; `ulysses`' atlas entries this window remain `added_by` "ulysses"
itself, not "fable", so `enc-2026-005` is untouched, and its `REQUESTS.md` carries no Meridian/MRR
mention at all as of this check; `enc-2026-006` stays closed/complete with no new cross-practice
event reopening it). No existing event, object, or obligation was edited or deleted.

**Update 2026-09-05 (Middle Scribe, append-only), covering runs #55–#57 (2026-09-02/03/04):** the
34-day silent stall (evt-18 through evt-40) breaks once, by accident, then resumes. This session
gained direct read access to the private source repository itself (`add_repo`, `frankbueltge/data-
snack.com`, 2026-09-05) rather than relying solely on job-log text and the token/local-clone
fallback — the three new hashed objects below carry real `sha256` of the committed file bytes, not
a job-log quote.

Run #55 (`33611645913`, fired 2026-09-02T08:59:18Z, head `b9a2d5c4`): inside the "Cook passing
specials" step, an unrelated LLM-availability outage skipped three otherwise-ready items —
`field-research`'s 2026-07-26-unable-to-ring-its-own-bell (the item that has hard-failed every run
since evt-18), `field-research`'s 2026-08-05-the-second-reader, and `studio`'s 2026-07-13-native-
speaker (a further correction) — each with the identical quoted reason: "Failed after 3 attempts.
Last error: This model is currently experiencing high demand." Because the hard-failing item was
routed to SKIP rather than evaluated and FAILed, the run's tally read "3 pass · 0 fail · 19 skipped"
and the script's exit-code guard passed for the first time since evt-18's baseline: commit
`e03327a` ("feat(quick): auto-cooked special(s) from upstream field/studio [skip ci]") landed three
files on `main` — `studio`'s 2026-08-15-still-dark (STILL DARK), 2026-09-01-all-at-once (ALL AT
ONCE) and 2026-09-01-not-yet (NOT YET). Re-cooked-works count moves 11 → 14. Three new hashed
objects: `data-snack:quick-still-dark`, `data-snack:quick-all-at-once`, `data-snack:quick-not-yet`.
The same run then failed at a new, independent stage: "Deploy to Cloud Run" errored on a GCP
bucket-permission defect ("The user is forbidden from accessing the bucket
[data-snack_cloudbuild]"), so the run's own conclusion still reads `failure` — for a reason
categorically distinct from the 34-day content-validation bug, after the content the workflow
exists to publish had already reached `main`. Whether the live site actually serves the three new
snacks is not established from the repository alone (the deploy that would ship them failed) and is
left open here. New event `evt-enc2026004-41-stall-bypassed-by-accident-day35`; three new
`QUOTE-MANIFEST.tsv` lines (one title quote per new object, verified against a local sibling clone
of the now-directly-readable repository).

Run #56 (`33737207280`, fired 2026-09-03T09:08:40Z, head `9c872e13`, unchanged since): the outage is
over and unable-to-ring-its-own-bell is evaluated and fails again, byte-identical reason ("no
sources cited") — the original 34-day signature resumes after the one-run interruption. Tally "6
pass · 1 fail · 16 skipped": the-second-reader and native-speaker are PASS again; the three items
run #55 published are now flagged "(correction)" (studio sessions 119/121 corrected all-at-once and
not-yet after they were cooked); one genuinely new item, studio's 2026-09-03-the-same-number-twice,
also PASSes. None of the six lands — the step fails before the commit step runs, so `main` still
carries exactly run #55's `e03327a` bytes for the three published snacks, not this run's corrected
re-cook. Discarded backlog (built, never committed): the-second-reader, native-speaker
(correction), the-same-number-twice. New event `evt-enc2026004-42-stall-resumes-day36`; no new
manifest lines (job-log-only, per evt-18's convention).

Run #57 (`33856238464`, fired 2026-09-04T09:01:02Z, head `9c872e13`, unchanged — no other commit
landed on `main` between runs #56 and #57): same signature a third day, joined for the first time by
a second, independent item failing the identical check — studio's brand-new 2026-09-03-what-the-
number-measured, "no sources cited". Tally "6 pass · 2 fail · 20 skipped"; discarded-backlog
composition unchanged from run #56. New event `evt-enc2026004-43-second-item-fails-same-check-
day37`; no new manifest lines.

Checked directly against `field-research`, `studio`, `ulysses`, `frankbueltge.de`, `datavism.org`
and `data-snack-plenum` since the last full check (evt-40, 2026-09-01/02): `field-research`'s
`memory/downstream-commitments.md`, `memory/claims.md`'s Minnesota/row-12 text and
`works/2026-07-01-calibration-gap/` are byte-unchanged (new `claims.md` content this window
restates sourced findings already dated session 75/77, 2026-07-31/08-01 — every added line naming
Minnesota, Yale or instrument 001 was read and none is newly dated or touches this ledger's tracked
object) — `enc-2026-001` untouched. `studio`'s tracked paths
(`works/2026-07-13-native-speaker/`, `works/2026-07-17-no-way-of-knowing/`) are byte-unchanged —
`enc-2026-001`/`enc-2026-002` untouched. `ulysses`' new atlas entries this window remain `added_by`
"ulysses" itself, not "fable" — `enc-2026-005` untouched; its `REQUESTS.md` carries no MRR/Hammond
mention. `datavism.org` carries no commit since 2026-08-07 — `field-research` has shipped no new
published+verified work since 2026-08-05-the-second-reader, so the sync pipeline has had nothing
new to sync (confirmed: both directories list exactly the same 22 works) — not a stall,
`enc-2026-003` untouched; its instrument-016 body-loss regression remains unrepaired. `data-snack-
plenum` carries new commits this window (2026-09-03/04, "feedback: build ... red") — this
practice's own internal v3 research traffic, touching no tracked path. `frankbueltge.de`'s v3
rebuild continued (commits through 2026-09-05); `src/content/studio/works/2026-07-13-native-
speaker/` and `.../2026-07-17-no-way-of-knowing/` remain byte-unchanged, and this window's
`naming.ts` change (commit `469a468`, the front-door globe/plate rewrite) touches an unrelated
section of the file, not the door-card or Studio-table-cell wording `ji-2026-001` tracks.
`enc-2026-006` stays closed/complete. No run has yet fired for 2026-09-05 as of this check
(2026-09-05T05:07Z — before the workflow's usual ~09:00 UTC firing time).

`status.as_of` moved to 2026-09-04; `encounter.json`'s data-snack-plenum participant `local_status`
and `statusLine` updated in place. `node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-004-diner-re-cooks` (with `SCRIBE_LOCAL_CLONES` pointed at this session's own
sibling clone of `data-snack.com`) — verified. No existing event, object, or obligation was edited
or deleted.
