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

**Update 2026-07-23 (Middle Scribe, append-only):** the previous update's own "unaffected"
finding did not hold for long. field-research's session-53 recovery (2026-07-22, commits
`3f00b2a`/`6f3f7ab`) reconstructed instrument 016's `work.astro` and six data files from the
site's mirror, but its own `RECOVERY.md` discloses that the README.md file was NOT among what
survived the purge — "the shipped directory's documentation files — its README ..." are named
as permanently lost, and the note states plainly that "its original README is lost, so this
file [RECOVERY.md] is the work's documentation of record." New event
`evt-08-readme-loss-disclosed`.

datavism.org's `scripts/field-sync.mjs` has, since before this encounter began, documented its
own rule in-file: "interactive works without a README mirror with an empty body." The
pipeline's next run (commit `db472f2`, 2026-07-22 07:44:14 UTC — the sync cycle immediately
after the one `evt-07` recorded) found instrument 016's directory with no README.md and, exactly
per that pre-existing rule, wrote a frontmatter-only stub: the public page's prose body (method,
the three findings, scope) is gone, sha256 changed from `3418abe6…` to `42777caf…`. New event
`evt-09-sync-body-emptied` and one new object (`datavism:field-works-coverage-not-custody-stub`,
kept beside the original per this ledger's append-only rule).

Recorded as one disclosed causal chain across the repository boundary, not as a pipeline fault:
the full prose still exists in field-research, relocated into `work.astro` rather than
`README.md`; nothing is lost from the ecology as a whole, but datavism.org's own copy is
currently a stub, and ADR 003's translation boundary has nothing to translate until a README.md
exists upstream again or the pipeline is pointed at a different file — a live, unresolved state,
named here rather than smoothed over. `status.as_of` moved to 2026-07-23; the receiver's
`local_status` updated in place to reflect it. Two new `QUOTE-MANIFEST.tsv` lines from
field-research's RECOVERY.md, one from datavism.org's own pipeline script (present before this
sync, not written in response to it). `node tools/verify-encounter-fixtures.mjs
fixtures/enc-2026-003-school-replicates` — 19/19 verified. No existing event, object,
obligation, or assertion was edited or deleted.
