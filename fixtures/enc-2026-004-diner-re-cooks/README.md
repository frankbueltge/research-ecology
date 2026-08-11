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
