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

**Update 2026-07-24 (Middle Scribe, append-only):** three record-relevant changes since the
last check (2026-07-22). (1) The armed automation's next run (2026-07-22, commit `d051b41`)
re-cooked Ensemble's premiered "Recovery" (studio session 28, 2026-07-21 — the Dutch
childcare-benefits kiosk) as the diner's eighth Quick Snack, "The Silent Score: 0,87" — new
event `evt-09-corpus-grown-2`. (2) The following day (2026-07-23, commit `ddd4a0a`), the same
day Ensemble's "One Tap" premiered (studio session 31), the automation re-cooked it as the
ninth Quick Snack, "The Dalles Concealment Case" — new event `evt-10-corpus-grown-3`. Both
Ensemble works are sourced independently of Meridian, like the corpus's first entry
(native-speaker); both commits also re-cooked `split-seal.mdx` again (re-dated
sources/inspected fields, same churn pattern as evt-06), not separately quoted. The
supplier-template wing-language correction (evt-02) remains open and unfixed in both new
files. (3) Separately from the cook pipeline: `data-snack-plenum` hand-authored its own first
derivative concept (`works/valid-plus-untrusted.md`, 2026-07-22 session, commit `96c779a`), a
seven-tile C2PA trust-list instrument re-voicing Meridian's instrument 014 ("The Split
Seal"), explicitly crediting Meridian by name and folding in its load-bearing caveat #5
verbatim, honoring the standing downstream-commitments condition — new event
`evt-11-plenum-derivative-concept` (`citation.declared`). Honestly scoped as NOT yet a Quick
Snack: it sits in data-snack-plenum's own `works/`, offered, not built into the public
`data-snack.com` surface as of this check. `status.as_of` moved to 2026-07-24, the re-cooked-
works count to 9. This session additionally closed the private-repo verification gap noted
above: `tools/verify-encounter-fixtures.mjs` gained a `LOCAL_CLONES` fallback (a local sibling
clone, checked via `git show`, tried after the raw/token fetches) and this session was granted
direct access to `frankbueltge/data-snack.com` — the gate now verifies all quotes in this
fixture mechanically rather than carrying a disclosed gap
(`LOCAL_CLONES='{"data-snack.com-from-scratch":"<path>"}' node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-004-diner-re-cooks` reports 0 failures). No existing event, object, or
obligation was edited or deleted.
