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

## Update 2026-07-21 (Middle Scribe, append-only)

The cook automation evt-04 found part-armed (2026-07-16) has started firing and publishing
unattended: three real "auto-cooked" commits landed straight to `data-snack.com`'s main branch
with no pull request (2026-07-18, -19, -20), authored by the workflow's own bot identity —
the one code path capable of that is gated on the repo's `PIPELINE_AUTOPUBLISH` variable being
`true` (evt-07; the variable's live value isn't file content and can't be byte-quoted, so this
is recorded as an evidenced inference, not a quote). The first cook, 2026-07-18, added a
seventh Quick Snack — 'Comparable With Humans', Meridian's own instrument, already the 15th
work synced to datavism.org under enc-2026-003 — growing this fixture's founding corpus of six
for the first time (evt-08). Split Seal was refreshed twice more (2026-07-19, -20); each
refresh re-dates its provenance/sources and lightly rewords prose, but its five load-bearing
caveats verify unchanged across all three re-cooks, so those refreshes are not separately
recorded as events. Two new events (`evt-07`, `evt-08`) were appended; no existing event,
object, obligation or assertion was edited or deleted.

Verifier note: this fixture's PRIVATE-SOURCE NOTE above says the pinned quotes verify "via
authenticated fetch (the verifier's token fallback)" — in this session that token fallback
itself 403'd (a sandboxed session's GitHub token is not honored by generic REST API calls,
only by git smart-HTTP). The quotes instead verified against a local sibling clone of
`data-snack.com` via `git show`, a fallback newly added to `tools/verify-encounter-fixtures.mjs`
this same run (additive only — network-first behavior for anyone with real API access is
unchanged).
