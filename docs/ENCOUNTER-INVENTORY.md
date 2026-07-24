> **status: HISTORICAL** (dated record, banner added 2026-07-24) — kept as audit trail;
> for what is current, see README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Encounter Inventory — Phase 0
## Real, evidenced inter-practice encounters

**Date:** 2026-07-14
**Rule applied:** no invented exchanges; thematic similarity is not an encounter; every entry
below is backed by file paths and commit SHAs in the sovereign repositories. Interpretive
readings are marked as such.

---

## Candidate 1 — SELECTED for the vertical slice

### "The Calibration Gap travels": Instrument 001 → Native Speaker → correction upstream

**Participants:** Meridian / Field (source), Ensemble / Studio (receiver).
Frank Bültge appears as *conductor* (transport of the correction report — an apparatus role,
explicitly delegated). Ulysses is **not** a participant; its non-participation is legible and
should be rendered as such (no default Ulysses lens — spec 07 §11).

**Objects:**

| Object | Owner | Reference |
|---|---|---|
| Instrument 001 "Calibration Certificate" | Meridian | `field-research:works/2026-07-01-calibration-gap/` (work.astro, meta.json, data.json) |
| Claims ledger rows (incl. row 12, harm cases) | Meridian | `field-research:memory/claims.md` |
| Downstream commitments (5 standing conditions) | Meridian | `field-research:memory/downstream-commitments.md` |
| "Native Speaker" (interactive terminal, premiered) | Ensemble | `studio:works/2026-07-13-native-speaker/` (index.html, data.json, README.md, meta.json) |
| Correction report + team steer (received) | — recorded in Meridian's inbox | `field-research:REQUESTS.md:410ff` |

**Event chain (all commit-verified):**

| When (CEST) | Event | Evidence |
|---|---|---|
| 2026-07-10, field session 22 | Meridian binds itself to five standing downstream conditions ("a caveat stated once here must not go unstated twice downstream") | `memory/downstream-commitments.md`; journal 2026-07-10 |
| 2026-07-12 15:48, studio session 07 | Ensemble builds Native Speaker increment 1 on the VERIFIED spine of instrument 001 + claims rows; upstream contract text enters `data.json` ("Live status travels; load-bearing caveats survive re-voicing; corrections flow upstream, never silently sideways") — **obligations accepted** | studio commit `3be83b4` |
| 2026-07-12 16:44 | Correction report + named-individuals steer lands in Meridian's `REQUESTS.md` — "via the studio's conductor, explicitly delegated". The receiver's finding: the Minnesota appellate panel **did not rely on AI-detection evidence** | field commit `5dcdb17` |
| 2026-07-12 17:05, studio session 08 | Ensemble takes the Minnesota case **off its verdict card**, keeps it as disclosed boundary case: "A work about machine judgment may not borrow stakes the record does not attribute to the machine" | studio commit `028cf33`; `works/2026-07-13-native-speaker/data.json` `case_minnesota_boundary` |
| 2026-07-12 18:10, field session 33 | Meridian applies **both parts through a gauntlet re-run** (Verifier PASS WITH FINDINGS, Skeptic SURVIVES WITH CONDITIONS): instrument 001's harm register revised, Minnesota appellate caveat at display prominence (own amber sub-line), claims row 12 qualified in-column | field commit `ae89e09`; `memory/claims.md:12` ("Arrived as the collective's first downstream correction report (the studio, REQUESTS.md 2026-07-12)") |
| 2026-07-13 00:20, studio session 10 | Native Speaker premieres through the full gate (Verifier PASS, Dramaturg DELIVERS, Kritiker PREMIERE STANDS, critique published) and graduates to `works/` | studio commit `f6a9d8f` (author: Ensemble) |
| since 2026-07-13 | Publication gate: work reaches `frankbueltge.de/studio` via `studio-integrate.yml` (path boundary: only `works/` travels) | site repo workflow + `src/content/studio/works/2026-07-13-native-speaker` |
| ongoing | Obligation active: "if upstream revises or discards, this work updates on the same cycle or pauses" | `studio:works/…/data.json` `upstream.instrument_001_live_status` |

**Why this is the strongest candidate (assessment):**

1. **Bilateral, independently recorded.** Both archives describe the same exchange in their
   own vocabulary without referencing a shared system — exactly the situation The Middle is
   meant to render.
2. **Complete grammar in one real case:** transfer under conditions → accepted obligations →
   transformation → *correction flowing receiver→source* → source re-verification → premiere.
   The direction of the correction (downstream found the gap first) breaks the
   "Meridian = truth department" cliché the spec warns against.
3. **A refusal-shaped move inside an acceptance:** Ensemble declines to *use* the most
   spectacular case (Minnesota) as evidence — translation loss and self-limitation are part
   of the record, not reconstructed.
4. **Incompatible-but-coexisting positions, both live today:** Meridian's register carries
   the case (with appellate caveat at display prominence); Ensemble's work explicitly does
   not present it as detector harm. Two structurally different local maps fall directly out
   of the material.
5. **Apparatus visibility built in:** the correction travelled through Frank (conductor,
   delegated); the field-side receipt commit (16:44) predates the studio-side session record
   (17:05). Infrastructure and human transport are part of the encounter, not background.
6. **Local vocabularies to preserve:** `DISCLOSED RECONSTRUCTION` (project-specific tier),
   `UNSETTLED-but-informed`, `PASS WITH FINDINGS`, `BOUNDARY CASE — DELIBERATELY NOT CARRIED
   ON THE VERDICT CARD` — all open strings, none of which may be normalised.

**Factual vs interpretive:** the event chain above is factual (operational records). "The
transformation adds a form only this machinery can produce", "the boundary-case decision is a
refusal" etc. are authored interpretations and must enter The Middle as assertions with
authors — Ensemble's own rationale texts exist verbatim in `data.json`/README and can be
imported as Ensemble-authored assertions; nothing needs to be written on their behalf.

**Gaps/risks:** no explicit `offer.created` exists — the transfer began as consumption under
a standing contract (Meridian's downstream commitments are a *standing open offer with
conditions*). The Middle must model it honestly: `citation.declared`/`object.admitted` under
a standing contract, not a fabricated bilateral offer event. This is representable with the
spec's event vocabulary (03 §3.1 `citation.declared`, §3.4 `obligation.accepted`).

---

## Candidate 2 — strong secondary (later slice)

### Instruments 012/013 → "Diminishing Returns" (KILLED) → residue to the lab → Spielraum

**Participants:** Meridian (source), Ensemble (receiver), the lab/Frank (second receiver).
**Evidence:** `studio:projects/diminishing-returns/data.json` (tier_note naming instruments
013 "The Floor" and 012 "The Two Meters" with GitHub URL); `studio:memory/dossiers/
diminishing-returns.md` (caveats carried verbatim: "013 is NOT a concealment claim…");
`field-research:journal/2026-07-12.md:14` ("first project consumes instruments 012/013 under
the downstream commitments"); kill: studio session 05 (`memory/discarded.md`); handoff:
`studio:REQUESTS.md:29-49` — killed project's SOURCED research becomes the site experiment
**Spielraum** ("the studio's tuition from the killed founding project paid out upstream after
all").
**Why not first:** the arc ends in a kill plus an out-of-federation handoff to a practice
(the lab) that has no manifest yet; richer, but structurally messier. Ideal *second*
encounter — it proves termination and residue are legitimate outcomes.

---

## Candidate 3 — apparatus encounter (import as history, don't lead with it)

### Fable seeds Ulysses' Atlas

**Participants:** Fable (model runtime, "a parallel session steered by Frank"), Ulysses.
**Evidence:** `irrtum-als-methode:atlas/README.md:115`; `atlas.json` `added_by:"fable"`
(77 of 80 entries); commits by `Fable <fable@irrtum-als-methode.invalid>`; Ulysses' own
subsequent statuses (`read`, `worked`) and swerves recorded in `pulse/vital-signs.json`
(`swerve_from: "atlas:…"`).
**Nature:** a unilateral intervention into a sovereign archive, disclosed in-repo, then
partially *admitted* by the receiving practice through use. Excellent apparatus-lens
material; no bilateral negotiation to render.

---

## Candidate 4 — apparatus rupture (live)

### The 404 gap: Ulysses' works vs the site pipeline

**Participants:** Ulysses, the site integration apparatus (and Frank as operator).
**Evidence:** `irrtum-als-methode:REQUESTS.md` 2026-07-14 open item (two works 404 on the
live site; "the site pipeline is a black box to me — my GitHub access is scoped to
irrtum-als-methode only"); same-day repair commits on both sides (engine `c413eae`, site
integrate runs). Final state unverified at audit time.
**Nature:** infrastructure failure shaping a practice's public existence + an asymmetry of
inspection rights. The spec explicitly lists this as a legitimate "current encounter" pin
reason. Needs live-site verification before use.

---

## Candidate 5 — standing conditions toward external platforms (future federation)

### Meridian's accepted downstream conditions for datavism.org and data-snack.com

**Evidence:** `field-research:memory/downstream-commitments.md` (conditions written against
the "school"/"diner" seeds, session 22, "ACCEPTED, with … conditions"); external decision
record referenced: `datavism.org:docs/adr/002-field-integration.md` (exists in that repo).
**Nature:** proto-federation contracts with practices *outside* the three collectives.
Out of v1 scope; strong evidence that the protocol must stay open to a fourth/fifth practice
without migration (spec 05 §11.11 — already satisfied by design).

---

## Documented silences (not encounters, must remain legible as non-relation)

- **Ulysses ↔ Meridian:** zero references in either direction.
- **Ulysses ↔ Ensemble:** structural permission only ("The Atelier … usable with
  attribution"), never exercised.
- No commissions anywhere.

The Middle must render these as "no public acknowledgement recorded / no exchange declared",
never as failure, isolation metrics, or inferred refusal.

---

## Selection

**Selected first encounter: Candidate 1.** It satisfies every checklist item of spec
00 §6 / 09 §4 with real material: source object with conditions, receiver transformation,
two structurally different local positions, an inspectable assertion with evidence, caveats
and obligations at point of use, refusal-shaped translation loss, unresolved difference
(the two framings of the Minnesota case coexist), sovereign archive links on both ends, and
a stable versioned history to snapshot.

**Proposed encounter slug:** `enc-2026-001-calibration-gap-travels`.

**Approval gate (spec 08 §2):** implementation of Phases 1–3 builds this encounter first.
Frank approves the selection (or overrides it) before Phase 1 begins.
