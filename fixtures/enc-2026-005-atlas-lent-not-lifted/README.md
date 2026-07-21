# enc-2026-005-atlas-lent-not-lifted — README

**Status: `approval: draft`** (same-day transcription, 2026-07-21; wording not yet read by
Frank). Five events, five obligations, four assertions, six hashed objects. Verify:
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-005-atlas-lent-not-lifted`
(irrtum-als-methode quotes only — see PRIVATE-REPO NOTE below for meridian-runtime).

This is the ecology's first recorded encounter between Ulysses (`irrtum-als-methode`) and
Meridian Research Runtime (MRR, `meridian-runtime`) — a real cross-practice exchange, not an
illustrative one. On 2026-07-21, MRR's first real research run had already pinned Ulysses'
curated atlas verbatim and hash-locked as ground truth, without negotiation or credit. The
same day, Frank Bültge — explicitly signing for MRR-engineering, not for Meridian's own
Proposer/Skeptic/Synthesiser collective voice — filed a retroactive disclosure and a forward
offer into Ulysses' own `REQUESTS.md`. Ulysses answered that same evening, after independently
re-verifying the note's checkable claims against its own atlas and journal files rather than
taking them on trust: negotiated future use ADAPTED under four standing conditions, the S42
finding TAKEN as a seed for a second run under one framing condition, and a request to annotate
unseen classifications DECLINED narrowly, with one bounded door left open. Before any answer
existed, MRR's own second run (PR #59, merged the same day) had already excluded the
S42-seeded candidate from its scope pending exactly this response. Ulysses' own reply asked
that the exchange be entered in the ecology's public register; this fixture is that entry.

## Authorship honesty (load-bearing)

The initiating party is **Frank Bültge for MRR-engineering**, not the Meridian/Field research
collective. The offer's own signature line states this explicitly: "for the Meridian Research
Runtime (MRR) — the engineering side, not the Meridian/Field collective's own
Proposer/Skeptic/Synthesiser voice ... this note comes from neither persona." `encounter.json`
records the acting participant under `collective_id: "mrr"`, and lists `meridian` under
`non_participants` with a note stating exactly this distinction — recording it any other way
would commit the authorship distortion the offer itself was written to avoid.

## Provenance table

| # | File (repo:path) | Commit | Timestamp (author) | sha256 |
|---|---|---|---|---|
| 1 | `irrtum-als-methode:REQUESTS.md` (the offer, §"Team note — 2026-07-21 — Retroactive disclosure...") | `1e1ef1f02f2840362af56976d13c2fa9a9964afb` | 2026-07-21 18:38:45 +0200 | `030f1028088c2dcdf116e082c1d34f2bf1054ccad46639b3eb317730dcf3d5fc` |
| 2 | `irrtum-als-methode:REQUESTS.md` (the response, appended into the same file/section) | `7b4bc51d7e79069a983538ec4784d8c5168c9ff0` | 2026-07-21 18:43:02 +0000 (UTC; persona commit) | `bd67c915fe40be2ee2ce279379be463b1130e581f5f1ebae5bbc0c201d650c19` |
| 3 | `irrtum-als-methode:atlas/atlas.json` (the pinned atlas, 87 entries; unchanged since this commit through 2026-07-21) | `4f63920ada470e0f5b0018b31e2489c69301e25e` | 2026-07-19 19:03:18 +0200 | `f712ea4e9c6b9137fa180ad91e73a86d8d09862792f33174c77acd76a891e610` |
| 4 | `irrtum-als-methode:journal/2026-07-18-session-42.md` (the S42 finding and its own recorded limit) | `a1f4b822c1203581041e87caf4c09ab7ba2d7602` | 2026-07-18 18:29:19 +0200 | `4130b5c7ad16a70a1db39dbd1accecb678fb37e71f2daed402111b577c9965ec` |
| 5 | `meridian-runtime:task-packets/K1-T04b.yaml` (second real run, PR #59 — honors the exclusion) | `48ad1c83ccc41e52e8419c181942e9a00d90f020` | 2026-07-21 22:48:18 +0200 | `9298c28ae5a34acdfcb432db8cb9e8bef7c9a93ca8902997014922935affce8a` |
| 6 | `meridian-runtime:task-packets/K1-T04.yaml` (first real run, PR #53 — context only, not quoted) | `9afcbd59478c5894d06fd7d3637a666a5f7951fb` | 2026-07-21 11:53:07 +0200 | `2688e158b78f26a847b6f4f26b0979d90e11c0e89b217203f538876b5724a6a4` |

PR identifiers, confirmed via `gh pr view --repo frankbueltge/meridian-runtime`: #53 (first real
run, merged `9afcbd59` 2026-07-21T09:53:07Z) and #59 (second real run, merged `48ad1c83`
2026-07-21T20:48:19Z — one second after row 5's author-commit timestamp above, an ordinary
author-vs-merge-commit gap, not a discrepancy).

## PRIVATE-REPO NOTE (honest)

`meridian-runtime` is a **private** repository (confirmed: `gh repo view
frankbueltge/meridian-runtime --json visibility` → `PRIVATE`; `irrtum-als-methode` is public).
Its two quotes (`events.json/e4`) do not resolve via `raw.githubusercontent.com` and cannot yet
run through the shared verifier either way: `tools/verify-encounter-fixtures.mjs`'s own
`REPO_MAP` does not yet carry a `meridian-runtime` label (it maps `field-research`, `studio`,
`irrtum-als-methode`, `data-snack-plenum`, `research-ecology`, `frankbueltge.de`,
`datavism.org`, and `data-snack.com-from-scratch`, but not this repository). Adding that label
is a small change to a shared tool outside this fixture's own scope — named here, not made
here. Until then, the two `meridian-runtime` manifest rows verify manually, against the local
sibling clone (`git show <commit>:<path>`), the same method used for every quote in this
fixture (see next section) — not a lesser standard, just not yet wired into the automated
runner.

## How every quote was verified

Every `quote_*` field in `events.json` and every `clause_text` in `obligations.json` was
checked as a byte-exact (whitespace-normalized, markdown-emphasis-stripped) substring of its
pinned source at its pinned commit, using the *same* normalization
`tools/verify-encounter-fixtures.mjs` applies (`norm`/`normQuote`: collapse whitespace, strip
`*`/`` ` ``/blockquote markers, allow a missing trailing `.`/`,`/`…`). This was run as a
standalone Python harness (`git show <repo-dir> <commit>:<path>` against the local sibling
clones `../irrtum-als-methode` and `../meridian-runtime`, not against GitHub) reimplementing
that exact logic, rather than by eye — **all 30 manifest rows verified as exact substrings on
the first pass**, none dropped or rewritten to pass. Two atlas entries not directly quoted by
either side of the exchange (`shumailov-curse-of-recursion`, `alemohammad-self-consuming
-generative-models-go-mad`) were independently pulled and checked to confirm Ulysses'
`quote_verification` claim that "the three cited entries exist and each carries the `relevance`
field the run dropped" — not merely repeated on trust.

## GAPs (honest)

- **No `content_hash` field on events/obligations/assertions**, matching `enc-2026-004`'s own
  lean convention (the newest fixture at the time of writing) rather than `enc-2026-001`'s
  fuller one; `docs/spec/schemas/encounter-event.schema.json` lists `content_hash` as required,
  and neither this fixture nor `enc-2026-004` satisfies that strictly — an existing, unresolved
  gap in house convention, not introduced here.
- **`evt-enc2026005-05-register-recorded`** (this record's own creation) carries no
  `source_commit` and an approximate `occurred_at`: the fixture predates its own commit by
  design (the session commits after review), so there is no commit to pin yet.
- **Run 3** (an MRR run actually seeded from S42, per offer (2) TAKEN) has not happened as of
  this writing — `obl-enc2026005-5` binds it if and when it does; nothing here claims it already
  did.

## Fixture contents

| File | Contents |
|---|---|
| `encounter.json` | Two participants (`mrr`/Frank Bültge as source, `ulysses` as receiver), `meridian` named in `non_participants` with the authorship-distinction note, `shared_resolution: null` (open/standing). |
| `events.json` | Five append-only events: disclosure filed, Ulysses' own independent verification of the note's claims, the three-part answer, MRR's second run honoring the exclusion (PR #59), and this record's own creation (fulfilling Ulysses' register request). |
| `objects.json` | Six hashed objects: the offer and response revisions of `REQUESTS.md`, the pinned atlas, the S42 journal entry, and the two MRR task packets (K1-T04b quoted, K1-T04 for context). |
| `obligations.json` | Five active, standing obligations on MRR (Ulysses' four ADAPTED conditions plus the one TAKEN framing condition), each traced to `evt-enc2026005-03`. |
| `assertions.json` | Four claims — MRR's own disclosure, Ulysses' ADAPTED/TAKEN/DECLINED rulings — every rationale copied from the source repositories. |
