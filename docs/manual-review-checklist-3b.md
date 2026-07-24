> **status: HISTORICAL** (dated record, banner added 2026-07-24) — kept as audit trail;
> for what is current, see README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Manual review checklist — Phase 3b (apps/middle-web)

Spec 04 §13's twelve product-acceptance items are mapped to automated checks where the
criterion is machine-checkable (1, 3, 4, 5, 6, 7, 9, 10, 12 — see
`apps/middle-web/tests/unit/data.test.ts` and `apps/middle-web/tests/e2e/*.spec.ts`, cross-
referenced in code comments by item number where directly relevant). The three remaining items
require a human judgment call that no assertion can stand in for. Frank (or whoever performs the
3c conceptual/visual review) should walk through these against a running `npm run preview` (or
the deployed preview once one exists) and record a verdict + note below.

## Item 2 — "a visitor can identify source, receiver, object and unresolved issue within one
minute"

**Where to check:** `/encounters/enc-2026-001-calibration-gap-travels` (EN and DE), first
screen only — the boxed "who offered what / what the receiver did / what is disputed or
unresolved / where the sources live" grid immediately below the proposition, before scrolling
into "Participant positions".

**What to judge:** hand the page to someone unfamiliar with the fixture, time them, ask them to
say back who the source and receiver are, what object is at stake, and what's unresolved. An
automated test can confirm the four sections exist and contain non-empty text (they do — see
`tests/e2e/no-js.spec.ts`), but not that a first-time reader actually forms the right mental
model in ~60 seconds. Watch in particular whether the density of the first-screen grid (four
stacked blocks, each with participant names + one rationale sentence) reads fast or feels like
a wall of text — this is exactly the kind of judgment spec 04 §5.3 flags as needing to *not*
"require prior reading merely to identify its structure."

**Verdict:** ☐ pass ☐ needs revision — _(fill in during 3c)_

---

## Item 8 — "silence and refusal render intentionally"

**Where to check:** the "Documented non-participation" section on `/encounters/[id]` (Ulysses'
non-participation note), the `declined-to-carry` negative band on
`/encounters/[id]/maps/ensemble-transformation-v1@1` (the Minnesota omission), and the
"no shared resolution" open-ended rule on the encounter page's first screen.

**What's already machine-checked (work order §2, not this checklist):** that "Ulysses" appears
on the encounter page *only* inside the non-participation section (`tests/e2e/
epistemic-http-guards.spec.ts`), and that the negative band and unresolved-rule markup render
without JS (`tests/e2e/no-js.spec.ts`).

**What needs a human:** whether the visual/textual treatment reads as *intentional design*
rather than an accidental gap or a bug. Concretely: does the negative band's terracotta-bordered
box with Ensemble's verbatim rationale look like "this was deliberately left out, and here is
why" — or could a visitor mistake it for a rendering error? Does the "no shared resolution"
open-ended rule (a dashed line that visibly does not close, design §5) read as a considered
form, or as unstyled placeholder content? Does the non-participation note's framing ("not a
participant... documented non-relation, not failure or inferred refusal") land as *editorial
honesty* rather than a legalistic disclaimer nobody will read? This is a tone/craft judgment,
not a presence/absence check.

**Verdict:** ☐ pass ☐ needs revision — _(fill in during 3c)_

---

## Item 11 — "the interface names editorial and infrastructure choices"

**Where to check:** `/apparatus` (actors table, editorial-sentinel explanation, pipeline
description, pinning rule, no-analytics statement, current limitations, design authorship) and
the pending-approval pin block at the top of `/encounters/[id]`.

**What's already machine-checked:** that `/apparatus` renders the actors table, the sentinel
explanation text, and the limitations list (would need a dedicated assertion if this becomes
load-bearing later — currently only covered incidentally by the a11y/route-inventory sweep,
which confirms the page renders and passes contrast/landmark checks, not that its *content* is
complete or well-explained).

**What needs a human:** whether `/apparatus`'s prose actually explains *why* each choice was
made, in language a curious visitor (not just a develarcher familiar with the work orders) can
follow — spec 04 §11: "The page must not imply that disclosure removes power. It makes power
more discussable." Judge whether the page reads as genuine disclosure or as a compliance
checklist nobody asked for. Also check whether the pending-approval pin state on the encounter
page ("draft — pending Frank Bültge's approval") is legible as an *active, current* state rather
than dead boilerplate — i.e. does it look like something that could plausibly change soon, or
like a permanent fixture nobody intends to resolve?

**Verdict:** ☐ pass ☐ needs revision — _(fill in during 3c)_

---

## Notes for whoever runs this

- Run `cd apps/middle-web && npm run build && npm run preview -- --port 4173`, then walk
  through both `/en` (bare path) and `/de` prefixes.
- Toggle light/dark (the two buttons in the header) and re-check items 2 and 8 in both schemes —
  the negative band's hatch pattern and the terracotta accent read differently against the two
  palettes; screenshots for both live in `apps/middle-web/tests/e2e/screenshots/`.
- This file intentionally has no automation hook. Fill in the verdict checkboxes by hand and
  commit the update (or note the outcome in `CONCEPTUAL-IMPLEMENTATION-REVIEW.md` per the
  work-order's 3c handoff) — do not delete this file once reviewed; it is the record that the
  review happened.
