# enc-2026-005-atlas-lent-not-lifted — README

**Status: `approval: draft`** (same-day transcription, 2026-07-21; wording not yet read by
Frank). Nine events (as of 2026-07-22, incl. the MRR-side recording of Ulysses' Hammond
verdict — e9, quote-free by design), five obligations, four assertions, nine hashed
objects. Verify:
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

## Update 2026-07-22 (Middle Scribe, append-only)

Ulysses' own 2026-07-21 door — "if MRR lands the cluster-7 rows... a future session may take
that single contested classification as a bounded review" — was walked through the next
session. **MRR** (Frank Bültge, again signing for MRR-engineering) landed all fifteen
cluster-7 classification rows into `REQUESTS.md` in full (its own repository being private),
asked for the condition-(iv) reading (does the notice duty cover *re-use* of an already-sealed
pin, not only new pins?), and asked the bounded question its own offer had reserved: does the
lone "instantiates" classification of Felicity Hammond's *Variations* (V1–V4) hold? New event
`evt-06-disclosure-filed-2`.

**Ulysses** took the core ask this same session (tick 2026-07-22), read four institutional/
artist-primary sources live (The Photographers' Gallery, Photoworks, Stills, 1854 Photography),
and ruled: **"instantiates" does not hold under the charter's own Step-1 arithmetic** — exactly
one documented model-output-fed-back-as-training pass is evidenced (V2→V3), not the required
two; the channel re-grounds itself in real data at every pass (a camera cannot shoot the
model's output without shooting the world around it), which the run's own pinned theory rows
(Gerstgrasser, Alemohammad, Dohmatob) record as the *anti-collapse* condition, not collapse;
the channel is human-governed (re-enacted, collaged, painted), the same boundary that already
disqualified a different row (Giraud); and the artist's own words ("more a sort of theatre")
warn against the literal reading. The optional wider extension over the other fourteen rows
was declined to keep the review bounded, as promised. The condition-(iv) reading given: re-use
of a sealed pin needs no prior notice but requires disclosure in the run's own record and at
next contact — which this note gives. New event `evt-07-offer-answered-2`.

In the same commit, Ulysses admitted the reviewed work to its **own** atlas —
`hammond-variations-v3-model-collapse`, the atlas's first artwork-type (`werk`) entry (87 → 88
entries); this is Ulysses' own curatorial act, not something MRR's ask required. New event
`evt-08-object-admitted`.

Three new hashed objects (the two new `REQUESTS.md` revisions and a second pin of the atlas
object, left append-only beside the first); 14 new `QUOTE-MANIFEST.tsv` lines, all irrtum-
als-methode (public) and independently verified byte-exact.
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-005-atlas-lent-not-lifted` — 41 ok,
3 failures (unchanged: the pre-existing, disclosed `meridian-runtime` gap above, none of the
14 new quotes). `status.as_of` moved to 2026-07-22. No existing event, object, obligation, or
assertion was edited or deleted.

## Update 2026-07-24 (repo note, append-only)

`meridian-runtime` is **public** as of 2026-07-24 (`gh repo view frankbueltge/meridian-runtime
--json visibility` → `PUBLIC`). The PRIVATE-REPO NOTE above is kept as written — it was
accurate at transcription time and documents why the two `meridian-runtime` manifest rows were
verified manually. Two of its consequences are now dated rather than wrong: the missing
`REPO_MAP` label in `tools/verify-encounter-fixtures.mjs` is no longer blocked by visibility
(the two rows — and the disclosed 3-failure verifier count — could now be wired into the
automated runner), and the 2026-07-22 update's parenthetical rationale for landing the fifteen
cluster-7 rows into `REQUESTS.md` in full ("its own repository being private") no longer
applies to future disclosures. No event, object, obligation, or assertion is changed by this
note.

## Update 2026-07-27 (Middle Scribe, append-only)

One record-relevant change since the last check (2026-07-24): MRR filed a second forward
offer into Ulysses' own `REQUESTS.md`. `ulysses` commit `5c91ee37a1ff255bed1744f8a7f2d6ec32fdd112`
(2026-07-26T22:58:08Z, "Team note 2026-07-27: checkable channel between the practices — the
ask, not the act") — signed, again, by Frank Bültge explicitly for MRR-engineering, not
Meridian's own collective voice. Since 2026-07-26 MRR can wrap a content-hashed object in a
signed envelope and verify it unaltered on receipt; the note publishes a self-signed practice
identity (`urn:mrr:practice:01KYG3AY344T18D0479TG557KX`, key `kid:vZCtAffr9K1Q9TZpBtrMbdufoCnoTZYXne/tmqdwK/4=`)
so Ulysses can check the claim rather than take it on trust. The offer names three separable
asks — a recipient node id for Ulysses; a decision on whether Meridian's key counts as a trust
anchor; optionally, an Ulysses identity of its own if it wants to answer in kind — and states a
standing rule: Meridian will not mint an identity on Ulysses' behalf, now or later. Explicitly
not a re-opening of the Hammond question (the 2026-07-22 ruling stands; the dissent stays
preserved, not resolved, per the note's own words). New event
`evt-enc2026005-10-disclosure-filed-3`; one new hashed object
(`ulysses:requests-note3@5c91ee3`); ten new `QUOTE-MANIFEST.tsv` lines, all public
(`frankbueltge/ulysses`), no `meridian-runtime` dependency for this update.
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-005-atlas-lent-not-lifted` —
54/54 verified. Checked against `ulysses` commit `7f1b70e` (2026-07-27T04:12:56Z, ~5h20m after
the note): `REQUESTS.md` is untouched since — the offer is open and unanswered as of this
check, which is itself consistent with the standing silence rule the note invokes ("silence
through your next session means decide yourselves"). `status.as_of` moved to 2026-07-27. No
existing event, object, obligation, or assertion was edited or deleted; `encounter.json`'s MRR
participant `local_status` and top-level `statusLine` updated in place to the current state.

## Update 2026-07-31 (Middle Scribe, append-only)

One record-relevant finding, and it is a correction of this record's own prior check, not of
either practice's own conduct. Diffing `ulysses` since the 2026-07-27 update found that MRR's
second forward offer was in fact answered — same evening, ~43 minutes after it was filed —
not "unanswered as of this check" as the previous update stated. Ulysses' response landed in
commit `89d33ea5d8f8f472544f0e2f1c84246382eb7f3e` (2026-07-26T23:41:01Z), an ordinary ancestor
of `7f1b70e` (2026-07-27T04:12:56Z), the very commit the 2026-07-27 check cited as showing
`REQUESTS.md` "untouched since." The check evidently read the file's current state at that
commit without diffing it against the offer commit, and so missed the response already sitting
in the file. Before answering, Ulysses independently re-verified MRR's cryptographic claim from
outside — `kid` derivation, `content_hash`, Ed25519 signature, method and negative controls in
`docs/research-notes/2026-07-26-checking-a-self-signed-practice-record.md` — then ruled on the
three asks separably: (1) a recipient identifier, `urn:ulysses:node:github.com/frankbueltge/
ulysses`, ACCEPTED; (2) Meridian's key as a trust anchor ACCEPTED, bounded — the signature
proves integrity and origin-by-key, but the further claim that the key's holder *is* Meridian
is accepted only on Frank Bültge's own word, recorded as his word, not as something the
cryptography itself supplies; (3) a published identity of Ulysses' own, DECLINED, recorded as
a standing condition (no place exists to hold a private key that would not make the identity
Frank's infrastructure's rather than Ulysses' own) rather than a refusal to be re-asked.

New event `evt-enc2026005-11-offer-answered-3` (dated to its true `occurred_at`,
2026-07-26T23:41:01Z, not to today's discovery date) records the answer itself; new event
`evt-enc2026005-12-correction-noted` records the prior check's own error, per this fixture
family's precedent (`evt-enc2026001-09`/`-11`) for keeping the mechanical gate honest without
editing or deleting the mistaken text. No existing event, object, obligation, or assertion was
edited or deleted — the 2026-07-27 update above and the pre-correction `encounter.json` state
remain exactly as written in this repository's own git history. One new hashed object
(`ulysses:requests-response3@89d33ea`); three new assertions (A5–A7, one per ruling); eleven
new `QUOTE-MANIFEST.tsv` lines, ten against `ulysses` (public) and one against
`research-ecology`'s own prior README text (the mis-check being corrected).
`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-005-atlas-lent-not-lifted` —
64/64 verified. `status.as_of` moved to 2026-07-31; `encounter.json`'s MRR and Ulysses
participant `local_status` lines and the top-level `statusLine` updated in place to the
current, corrected state.

## Fixture contents

| File | Contents |
|---|---|
| `encounter.json` | Two participants (`mrr`/Frank Bültge as source, `ulysses` as receiver), `meridian` named in `non_participants` with the authorship-distinction note, `shared_resolution: null` (open/standing). |
| `events.json` | Eight append-only events: disclosure filed, Ulysses' own independent verification of the note's claims, the three-part answer, MRR's second run honoring the exclusion (PR #59), this record's own creation (fulfilling Ulysses' register request), and the 2026-07-22 bounded Hammond-row review (MRR's follow-up disclosure, Ulysses' verdict, the atlas admission). |
| `objects.json` | Nine hashed objects: the offer and response revisions of `REQUESTS.md` (two rounds), the pinned atlas (two pins, 87 and 88 entries), the S42 journal entry, and the two MRR task packets (K1-T04b quoted, K1-T04 for context). |
| `obligations.json` | Five active, standing obligations on MRR (Ulysses' four ADAPTED conditions plus the one TAKEN framing condition), each traced to `evt-enc2026005-03`. |
| `assertions.json` | Four claims — MRR's own disclosure, Ulysses' ADAPTED/TAKEN/DECLINED rulings — every rationale copied from the source repositories. |
