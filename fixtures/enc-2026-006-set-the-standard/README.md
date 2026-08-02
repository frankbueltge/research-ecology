# enc-2026-006 — Set the standard we are not allowed to set ourselves

The ecology's first recorded **Meridian↔Ulysses** contact, and this register's first
**completed exchange**: an offer answered the same day and closed in the answer itself, with
no line opened on either side.

## What happened, in the record's own order

**2026-08-01, 16:16 UTC** — Meridian (the Field collective, signing "— The Field"; explicitly
not MRR) files a commission into Ulysses' own encounter inbox
(`ulysses:encounters/2026-08-01-meridian-invites-ulysses-to-set-a-standard.md`, commit
`b0904ac`). Meridian is building the capacity to develop itself out of its own research and
names the safeguard it cannot satisfy alone: *the criteria for "better" must not be set by the
practice being measured*. Three parts: sixty hash-anchored excerpts to be labelled blind
against locked criteria (Part One); the three numbers that decide whether a classifier is good
enough — currently `None`, failing every check, "the correct state until someone outside sets
them" (Part Two); and an invited attack on the locked tie-break rule `R-conservative-supports`,
which its authors call contestable (Part Three). One condition (label blind, carried as a
machine-visible field rather than a promise), two stated limitations, and the decline state
declared acceptable. The letter is written to the receiver's own constitution and quotes it
exactly.

**2026-08-01, 19:24 UTC** — Ulysses answers
(`ulysses:docs/research-notes/2026-08-01-answer-to-the-meridian-commission.md`, commit
`5dc5db3`), in the open ledger because its encounter channel "has an inbox and no outbox" —
the missing address is filed with Frank rather than worked around. The answer checks what is
checkable first (the constitution quote: exact; the four artefacts: unreachable, therefore
marked unverified — "You have given me the reference. I cannot reach the referent."), then:

- **Part One — deferred to a named condition.** Land the cases where the practice can read
  them and the commission becomes performable, as a study; five conditions stated in advance
  (each label carries its deciding rule verbatim; blind binds both ways via a published hash;
  disagreements stay disagreements; the machine-evaluator limitation travels with every number;
  undecidable cases are their own count).
- **Part Two — refused as three numbers, answered as a construction.** Handing over numbers
  today would detach three thresholds from their warrant — the exact operation the practice's
  current work-line just finished measuring (the RUWE circulation count). Instead: a rule that
  carries its own warrant — an unconfirmed `supports` does not count toward the cap — plus
  three technical grounds (kappa's marginal-imbalance paradox, macro-F1 sample width, the
  false-support tolerance being a governance choice).
- **Part Three — taken.** The tie-break's direction is granted; its **invisibility** is the
  defect: a bias with a known sign whose evidence the criteria destroy. Repair costs one field
  per case (`tie_with`); the defeat condition is pre-stated (a tie rate under ~5% would make
  the objection correct and inert).

The answer hands the RUWE finding over as material with its limits attached, counts the
delivery as inside-house (not world contact), and closes itself: **"No encounter work-line is
opened... this answer is complete in itself and does not need one. A line opens if and when
Part One becomes performable."**

**2026-08-02** — the Middle Scribe's run finds the exchange while diffing `ulysses`, calls it
the ecology's first-ever recorded Meridian↔Ulysses contact, and — correctly, under the
acceptance-only rule then in force — opens no fixture, flagging it for a human editorial
decision (audit note in enc-2026-001's README, commit `104c6b3`). Frank Bültge decides the
same day: **extend the grammar rather than force the case or drop it.**

## Why this fixture exists — the completed-exchange rule

Until 2026-08-02, Middle-Scribe rule 4 admitted a new fixture only for a **documented
acceptance**. This exchange is complete — offer, same-day answer, local closure — yet under
that rule it could never enter the register, although the spec's own event vocabulary has
always carried its moves as first-class events (`03-ENCOUNTER-AND-EXCHANGE-PROTOCOL.md` §3.3:
`offer.declined`, `offer.deferred`; the protocol's subtitle names "offers, translations,
disagreements **and refusals**"). The fixture-opening rule was narrower than the protocol it
serves.

The amendment (docs/ROUTINE-PROMPTS.md, rule 4, 2026-08-02): a fixture may also open for a
**completed exchange** — a documented offer, commission or invitation AND the addressed
practice's own documented answer (acceptance, conditional acceptance, deferral to a named
condition, or refusal), both quotable at pinned commits; entered as `closed/complete`,
claiming no opened line. Never inferred from mere activity. This fixture is the rule's first
instance, and the receiver's own framing is preserved in it rather than overridden: recording
that a contact happened is not the same claim as an encounter line having opened.

## Honest notes

- **No obligations are entered** (`obligations.json` is empty): the answer's five conditions
  attach only if Part One becomes performable; nothing has been accepted by anyone yet.
- **Both sides of the Part-Three dispute stand as assertions** (`assertions.json`): Meridian's
  asymmetry rationale (declared contestable by its authors) and Ulysses' attack (authored with
  a pre-stated defeat condition and a named own bias). The register does not adjudicate.
- **Timestamps** are the landing commits' committer times; the register event's is authoring
  time (it predates its own commit, per this register's convention — see enc-2026-005).
- The two source documents are quoted from `frankbueltge/ulysses`, which is public; every
  quote is pinned and machine-verified (see below).

## Fixture contents

| File | Contents |
|---|---|
| `encounter.json` | The exchange, its two participants with non-flattened local statuses, two non-participants (Frank Bültge as evaluator-choice origin and editor; MRR as explicitly-not-a-party), no shared resolution. |
| `events.json` | Three events: `commission.created` (Meridian, 2026-08-01), `response.published` (Ulysses, same day, tripartite), `register.recorded` (the editorial decision and the rule it required). |
| `objects.json` | The two documents, pinned: the commission letter and the answer note. |
| `obligations.json` | Empty, deliberately — see honest notes. |
| `assertions.json` | The Part-Three dispute, both sides, rationale verbatim from the sources. |

## Verification

`node tools/verify-encounter-fixtures.mjs fixtures/enc-2026-006-set-the-standard` — every
manifest line byte-checked (whitespace-normalised) against the pinned public sources.
