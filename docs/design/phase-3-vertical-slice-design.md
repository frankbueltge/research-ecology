# Phase 3 Design — The Middle, read-only vertical slice
## Architecture, lenses, renderers, visual direction

**Date:** 2026-07-14 · **Author:** lab session (strongest-model design, per spec 08 §13)
**Input:** Phase-1 kernel + fixture, Phase-2 bundles, ADRs 0001–0009.
**Subject:** one encounter — `enc-2026-001-calibration-gap-travels`.

---

## 1. Data flow (locked)

```
import bundles (Phase 2)  +  curated encounter records (fixture, editor-attributed)
        │ loader (validates via packages/protocol, idempotent upserts)
        ▼
PostgreSQL (db/migrations/0001)          ← operational source of truth (deploy: Neon, ADR 0006)
        │ projection job (deterministic: encounter + lens version + event watermark)
        ▼
map_versions (immutable, hashed, stored)  → also exported as JSON artifacts
        │
SvelteKit app: SSR record pages + client islands for compare/trace views
```

- `packages/domain`: repository interface (`EncounterStore`) with the Postgres
  implementation as the deployed runtime store; an in-memory implementation (hydrating
  from bundles + fixture) doubles as the no-DB local dev mode and the test store.
- `packages/projections`: pure functions `(records, lensVersion, watermark) → mapVersion`
  — no I/O, fully deterministic, checksum over canonical JSON (Phase-1 hashing).
- The **encounter record itself is editorial**: participants, initiating event, proposition.
  It is stored with author attribution (see §6). Adapters never wrote it (Phase-2 rule).

## 2. Routes (v1 — English-only since 2026-07-15, Frank's decision: no per-run translation
duty; the `/de/…` chrome mirror described below was removed again)

```
/                                  → redirects to the current encounter (302, honest: there is exactly one)
/encounters/enc-2026-001-…         canonical encounter page
/encounters/[id]/maps/[map]@[v]    immutable map version (stable citation URL)
/encounters/[id]/compare           two+ maps side by side (mobile: position switcher)
/objects/[collective]/[localId]    object reference + conditions + "home address" exit
/assertions/[id]                   authored claim, evidence, responses
/lenses/[id]                       lens manifest + versions
/apparatus                         infrastructure, actors, editorial rules, this system's own limits
/archive                           cockpit + prior interfaces (ADR 0008: links out, snapshots dated)
/about                             proposition + autonomy statement (spec 07 §3 text)
/ledger                            append-only event list for the encounter(s), cursor-paged
/de/…                              German chrome mirror of all of the above
```

No `/collectives` directory page in v1 (spec: entry through relation, directory must not
dominate; collective self-descriptions appear on object/encounter pages and `/apparatus`).
`/refusals` deferred until a published inter-practice refusal exists; `/about` explains this
honestly ("internal kill records live in the sovereign archives").

## 3. Lenses (three; each a versioned config in `lenses/`, executed by packages/projections)

### 3.1 `provenance-v1` — author: The Middle (editor)
- **Selection:** operational events only (all 7), object refs, obligations. Assertions
  excluded (declared exclusion: "interpretations are not provenance").
- **Renderer:** `provenance-chain` — a dated vertical ledger; each event a ruled entry with
  issuer, source link (pinned commit), payload excerpt; obligations anchor as boxed clauses
  at their accepting event; the two `derivative.published` events show the 66-second
  studio→site gap explicitly.
- **Declared blind spots:** meaning, internal deliberation, anything outside the pinned
  commits.

### 3.2 `ensemble-transformation-v1` — author: Ensemble (imported material only)
- **Selection:** events 02/04/06/07, Ensemble-authored assertions, the work's own tier
  structure (VERIFIED / DISCLOSED RECONSTRUCTION / IMAGINED elements from `data.json`),
  active obligations. Meridian's counter-framing excluded — **declared**: "the source's
  response is visible in the compare view, not here."
- **Renderer:** `object-transformation` — layered lineage: source column (instrument 001 +
  claims rows, with live status), transformation band (preserved / re-voiced / declined-to-
  carry / imagined — the Minnesota omission renders as a **visible negative band** with
  Ensemble's verbatim rationale), derivative column (premiered work + tier legend).
- **Semantics difference vs 3.1:** includes interpretations, groups by material tier instead
  of time, renders an omission as form.

### 3.3 `meridian-position-v1` — author: Meridian (imported material only)
- **Selection:** events 01/03/05, Meridian-authored assertion (claims-row-12 framing),
  instrument 001's live status + load-bearing caveat state, obligations it holds toward
  downstream.
- **Renderer:** `parallel-positions` — the register row before/after the correction
  (correction as overlay, original visible struck-not-erased), the appellate caveat at
  display prominence (mirroring the source's own "amber sub-line"), the standing conditions
  as an obligation matrix with per-condition state.
- **Semantics difference:** time collapses into register-state; the derivative appears only
  as "a downstream consumer that reported the gap" — deliberately its perspective.

Compare view: 3.2 vs 3.3 side by side is the spec's "two incompatible local maps" — same
encounter, different objects included, different logic, different form. 3.1 is the neutral
entry.

## 4. Renderer registry (v1)

`provenance-chain`, `object-transformation`, `parallel-positions`, `obligation-matrix`
(embedded in 3.3), `text-montage` (assertion detail). **No bounded constellation in v1**
(ADR 0004). Every renderer ships: SSR HTML (no-JS readable), a client enhancement layer
(focus/expand/cross-highlight), a textual summary block (screen readers; also the map
version's `accessible_summary`), and print CSS. Unknown-type rupture blocks are part of the
registry contract from day one (the fixture's `contract.published` event must render as a
typed record, not fall back silently — good first proof).

## 5. Visual direction (binding for 3b)

**Register, not dashboard. Paper, not glass.**

- **Feel:** a public record room — editorial, infrastructural, quiet. Kin to legal
  registers and printed protocols, NOT to the lab site's mono skin (The Middle is a
  different place; distinctness is deliberate, ADR 0004 §4).
- **Type:** self-hosted, SIL-OFL: **Literata** (editorial text: propositions, positions,
  rationales) + **IBM Plex Mono** (record data: ids, hashes, dates, event types, clauses).
  No Inter/Roboto.
- **Surface:** warm off-white (`#faf8f4`), near-black ink (`#1a1817`); dark scheme
  (`prefers-color-scheme` + toggle) inverts to deep umber paper (`#161412`) with bone ink —
  equally serious, no neon.
- **Colour is semantic and scarce** (never per-collective factions):
  - events: ink + date rule;
  - assertions: an authored sidebar stroke (single accent, terracotta `#9a4a2e`, AA on both
    schemes) + always the author's name;
  - obligations: boxed clause, status chip (`ACTIVE/FULFILLED/DISPUTED` as text, not colour-coded);
  - corrections: overlay hatch; the prior state remains visible, struck not erased;
  - unresolved: an open-ended rule (line that visibly does not close) + the words
    "no shared resolution";
  - refusal/omission: a reserved negative band with the author's stated reason;
  - archive exits: doorway affordance — framed link block "This object lives at … ↗"
    with repo/commit;
  - machine suggestions: dotted border + label (none exist in v1; the style exists in the
    system so its absence is checkable).
- **Motion:** none ambient. Only reduced-motion-safe transitions on expand/compare switch.
- **A11y bar (tests in 3b):** keyboard-complete, visible focus, WCAG AA, textual map
  summaries, mobile-native layouts (event cards, sticky position switcher), print/citation
  view with map version hash + URL.

## 6. Editorial honesty mechanics

- The homepage pin: "Selected because: first fully evidenced inter-practice encounter of the
  lab · Pinned by: Frank Bültge (pending approval — draft by the lab session of 2026-07-14)"
  — the *pending* state is shown until Frank approves wording; the approval itself becomes
  an editorial event.
- Proposition (draft, DE/EN, attributed the same way): "Ein verifiziertes Instrument wurde
  Material eines erfahrbaren Werks — und die wichtigste Korrektur floss rückwärts: das Werk
  fand die Lücke im Instrument." / "A verified instrument became material for an
  experiential work — and the most important correction flowed backwards: the work found
  the gap in the instrument."
- Every map frame carries the lens manifest summary (author, basis, exclusions, unknown
  types, engine version, map version + hash) — one tap/keystroke away, spec 04 §7.2.
- `/apparatus` v1 content: actors table (from audit §4), the import/projection pipeline with
  versions, the editorial rule for pinning, the "no analytics" statement, current
  limitations (one encounter; no write paths; cockpit is live elsewhere and younger than
  its archive entry), and this design doc's authorship.

## 7. Work-order split

- **3a — domain + loader + projections** (Sonnet): `packages/domain` (store interface +
  Postgres impl + memory impl for tests), loader CLI (bundles+fixture → DB), lens configs
  §3 as data, `packages/projections` with map-version generation + checksums + the three
  renderers' data payloads, epistemic contract tests (spec 09 §8 list: no global edge list
  endpoint, no map without lens+exclusions, statuses not collapsed, silence ≠ rejection,
  machine suggestions excluded by default, hashes/local terms round-trip, corrections
  append-only, deterministic maps, local archive URLs present, cockpit edges stay
  Ulysses-attributed, fourth-collective import needs no migration).
- **3b — SvelteKit app** (Sonnet, after 3a review): routes §2, renderers §4 as Svelte
  components over 3a payloads, visual system §5, i18n chrome, a11y + Playwright journeys +
  screenshot tests.
- **3c — conceptual/visual review** (strongest model + Frank): spec 09 §10 checklist →
  `docs/CONCEPTUAL-IMPLEMENTATION-REVIEW.md`; stop before any deploy/write features.
