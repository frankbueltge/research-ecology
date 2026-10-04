# The Middle becomes a relay desk

**Date:** 2026-10-05 · **Status:** decided (Frank's decision of 2026-10-05, wording private)

The Middle, the contact zone of the research ecology, stops keeping the encounter ledger and
becomes a relay desk between the three practices (The Field / Meridian, The Atelier / Assay, The
Studio / Ensemble).

## What is archived

As of 2026-10-05 the **encounter ledger is archived**: `fixtures/enc-*`, `fixtures/ji-*`,
`docs/ENCOUNTER-INVENTORY.md` and `tools/verify-encounter-fixtures.mjs`. Nothing is moved or
deleted — the site's `/encounters` register still reads these files, and their history stays where
it was published. They are no longer written. The nightly **Middle Scribe** routine that wrote them
is retired.

## Why

1. **It watched data-snack, not the ecology.** 30 of the 48 scribe commits on main touched
   `enc-2026-004`, the record of data-snack's cook automation. Since the v3 rebuild of 2026-08-30,
   14 of the 18 scribe runs on record (8 landed, 10 left on branches) recorded nothing else — the
   last of them on 2026-10-04 at 23:11 UTC (`eff6305`, pushed straight to main while this change
   was being prepared; it belongs to the archive like the rest). What the practices did with each
   other after v3 — their bulletins, their sibling sections — never entered the ledger.
2. **It stranded.** Whenever the routine's environment let it push only a `claude/*` branch, its
   work stayed there: this repository had no auto-land, so nothing merged PRs #2, #7, #12–#15 and
   #20–#28, or four further branches without a PR. Between 2026-09-15 and that last run nothing it
   wrote reached main.
3. **It broke.** On 2026-10-04 a run could not clone the private repository
   `frankbueltge/data-snack.com`, and its own verifier went red on 53 quotes it could no longer fetch
   (issue #29). A ledger whose gate depends on a private repository cannot be kept by a routine that
   should only ever need the public record.
4. **It missed the ecology's actual traffic.** A measurement of 2026-10-05 over 73 sessions
   (2026-09-07 … 2026-10-04) found: 75 % of the practices' references to each other are courtesy and
   16 % load-bearing; the Field has not once used or answered the Studio; the Studio rarely builds
   from sibling material; the real collaboration is checking each other's numbers; there is no joint
   work. A ledger of fixtures could not see any of that, and nothing in it helped a practice pick up
   what a sibling had offered.

## What replaces it

- **`relay/relay.json`**, contract `middle-relay/1` (`relay/README.md`). Each night the Middle Relay
  reads the three practices' newest bulletins and the artifacts they name and records (a) every
  cross-reference between practices, classified as `built_on`, `answered` or `noted`, each with an
  evidence ref on both sides, and (b) **open handoffs** — material, data or questions one practice
  offered that no other practice has taken up. A handoff lapses after 21 days without being taken.
- The practices will be required to read the open handoffs at session open, through a site feed the
  site team builds against the same contract.
- The Middle still never speaks for a practice and never interprets beyond what the records show.
  A classification is verifiable because every entry carries its evidence refs.
- **`tools/verify-relay.mjs`** is the gate: the contract, append-only against main's version, and
  (online) whether each ref exists at its commit.
- **The routine:** `docs/ROUTINE-PROMPTS.md`, section "Middle Relay — nightly". It pushes a
  `research/relay-<date>` branch and never main.
- **Landing:** `.github/workflows/auto-land.yml` lands `research/*` branches, and `claude/*` branches
  while their PR is open and not a draft, after running the verifier on the merged tree. A branch that
  fails is not landed and the job turns red. A branch that writes to the archived ledger
  (`fixtures/enc-*`, `fixtures/ji-*`) is refused the same way, so a scribe run that is still
  scheduled somewhere cannot land through it. When something lands it notifies frankbueltge.de
  (`repository_dispatch`, event `middle-landed`) if the secret `SITE_DISPATCH_TOKEN` is set.
- **The seed:** the first `relay.json` was derived from the 2026-10-05 measurement, period
  2026-09-07 … 2026-10-04 (cycle 003 and the start of cycle 004): 146 relations (`built_on` 20,
  `answered` 17, `noted` 109) and 9 handoffs, 6 of them open.

## Housekeeping done with this change

- The stranded scribe PRs #2, #7, #12–#15 and #20–#28 are closed with a pointer here, and their
  branches deleted; so are the four scribe branches without a PR. Every commit on them was either
  already on main or a scribe update of the archived fixtures (the one unlanded commit without a PR,
  `bf81ea5` of 2026-09-04, records run #55 of the data-snack automation, which main's `e335b48`
  records as well). Closed PRs keep their commits reachable on GitHub.
- Issue #29 is closed with a pointer here: the relay reads only the three public practice
  repositories.
- `.github/workflows/encounter-freshness.yml` no longer runs nightly. Its only job was to prompt the
  scribe to update the ledger; it can still be run by hand.
