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
