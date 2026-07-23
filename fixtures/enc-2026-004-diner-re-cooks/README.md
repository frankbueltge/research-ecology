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

**Update 2026-07-23 (Middle Scribe, append-only):** three record-relevant changes since the
last check (2026-07-22). (1) The armed automation re-cooked a second Ensemble premiere sourced
independently of Meridian — "Recovery" (studio `works/2026-07-21-recovery`, session 28, the
Dutch childcare-benefits/*toeslagenaffaire* kiosk) — landed as the diner's eighth Quick Snack
("The Silent Score: 0,87") on data-snack.com commit `d051b41`, 2026-07-22T07:19:39Z. (2) The
next day it re-cooked a fourth Ensemble house premiere — "One Tap" (studio
`works/2026-07-23-one-tap`, session 31, the Google/Dalles data-center water-disclosure case) —
as the ninth Quick Snack ("The Dalles Concealment Case"), the same day it shipped, commit
`ddd4a0a`, 2026-07-23T07:15:03Z. Both carry real gauntlet graduations (unlike evt-08's
pre-gauntlet-convention disclosure), and both still reproduce the open wing-language
correction from evt-02 in their supplier line — now on four files, unresolved. (3) Separately
from the auto-cook pipeline: `data-snack-plenum` itself (not data-snack.com) hand-built its
own first derivative concept sourced from a Meridian instrument —
`works/valid-plus-untrusted.md` (session 14, 2026-07-22, commit `96c779a`), derived from
instrument 014 "The Split Seal," gate-passed (Verifier 19·5·0·0, Voice PASS, Field-Checker
3/5) and proposing an on-page credit line that explicitly names Meridian's downstream
conditions and folds in the source's caveat #5 by name. This is qualitatively new for the
encounter — not verbatim republication but a hand-authored re-voicing that engages the
standing contract on its own terms — and honestly scoped as NOT yet a Quick Snack: it sits in
data-snack-plenum's own `works/`, offered to Frank, not yet built into the public
`prototype-v2/src/content/quick/` surface. Three new events (`evt-09`, `evt-10`, `evt-11`) and
three new hashed objects (`data-snack:quick-recovery`, `data-snack:quick-one-tap`,
`data-snack-plenum:valid-plus-untrusted`) appended; `status.as_of` moved to 2026-07-23, the
re-cooked-works count to 9. Eighteen new `QUOTE-MANIFEST.tsv` lines: the eleven against
data-snack.com fall under the same disclosed PRIVATE-SOURCE NOTE as before (independently
verified byte-exact against the local sibling clone); the seven against data-snack-plenum
(public) verify mechanically —
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-004-diner-re-cooks` now reports
10 ok / 30 failures, all 30 the same pre-existing private-repo gap, none a real mismatch. No
existing event, object, or obligation was edited or deleted.
