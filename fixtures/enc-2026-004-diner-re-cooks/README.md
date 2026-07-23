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

**Update 2026-07-23 (Middle Scribe, append-only):** one commit (`d051b41`, 2026-07-22, the
armed automation's next unattended run) touched two files. (1) A new, eighth Quick Snack —
`recovery.mdx`, re-cooking Ensemble's third work of the house, "Recovery" (studio session 28,
premiered 2026-07-21), as "The Silent Score: 0,87". This is the first Ensemble re-cook since
the founding "Native Speaker" snack (evt-02) — every addition in between (evt-08) was a
Meridian instrument. The supplier template's wing-language finding (evt-02's open correction)
is unchanged in this new snack too — carried, not fixed. New event
`evt-09-corpus-grown-2` and one new hashed object (`data-snack:quick-recovery`). (2) The same
commit re-touched the existing Split Seal snack a second time (first refresh: evt-06,
2026-07-17): `inspected`/`accessed` dates bumped 2026-07-20 → 2026-07-22, minor wording
tightened, no new caveat and none of the five load-bearing caveats evt-06 fixed in place
were touched. New event `evt-10-split-seal-refreshed-2` — recorded because the automation
keeps re-touching already-served snacks unattended, not because anything substantive
changed. `status.as_of` moved to 2026-07-23, the re-cooked-works count to 8. Seven new
`QUOTE-MANIFEST.tsv` lines, all under the same PRIVATE-SOURCE NOTE above (independently
verified byte-exact against a local sibling clone; `node
tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` reports 3 ok / 26
failures, all 26 the same pre-existing private-repo gap, none a real mismatch). No existing
event, object, or obligation was edited or deleted.
