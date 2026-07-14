# Conceptual Implementation Review — v1 vertical slice
## Findings, remaining compromises, explicit deviations (spec 09 §10)

**Date:** 2026-07-14 · **Reviewer:** lab session (strongest model), after visual inspection
of the running app's captured states (desktop light/dark; mobile, no-JS, reduced-motion and
print covered by the automated battery).
**State reviewed:** Phases 0–3b complete; 126 contract + 23 unit + 107 Playwright tests
green; nothing deployed; nothing published.

---

## 1. Checklist findings

**Hidden recentralisation — PASS with one watch item.** No global graph, no canonical edge
list (HTTP guard asserts `/api/graph` 404s), maps only via versioned lenses, encounter
assembly is an attributed editorial act with pending-approval state. *Watch item:* the
`encounters.non_participants` column (3a amendment). As rendered it is careful ("documented
non-relation, not failure or inferred refusal") — but the column invites future misuse
(implying expected participation). Recommendation: keep, but constrain by contract test
that it renders only with editorial attribution and never feeds any lens selection.

**Shared subject creep — PASS.** The Middle imposes no theme; the encounter's subject
(AI-text-detector calibration) is the material's own. Copy avoids "error", "measurement"
etc. as umbrella frames; `/about` states the no-common-subject principle.

**Role fixation — PASS.** Meridian appears as *source in this encounter*, not "the truth
department"; the correction flowing receiver→source structurally undercuts the
supplier/consumer cliché. Ensemble's independent research (the Minnesota retrieval) is
foregrounded. No fixed-pipeline language anywhere in chrome copy.

**Ontology leakage — PASS.** Local vocabularies survive verbatim end to end (verified in
projections and on-page: `DISCLOSED RECONSTRUCTION`, `SHIPPED; session-33 REWORK…`,
`declines-to-carry`, `contract.published` as a non-core type chip). Interoperability
classes never replace source labels.

**Loss of live caveats / source status — PASS.** Obligations render as boxed clauses at
point of use on encounter and map pages; instrument 001's status string (incl. session-33
rework and gauntlet verdicts) travels onto every surface where the object appears.
*Deployment-blocking caveat:* live status is only as fresh as the last import; the nightly
import job (deployment package) is what makes "live status travels" true in production —
until then the page shows dated snapshot provenance, which is honest but must not be
mistaken for a live feed. The watermark line makes this inspectable.

**Conflation of delivery and agreement — PASS.** Participant statuses stay separate
(store-level test + page rendering); "no shared resolution" is an explicit designed state
(open-ended rule + words); the conductor's transport role is separated from authorship
("transport only; not an authoring party to either side's assertions").

**Silent semantic inference — PASS.** Adapters emit no relations; machine-suggestion
records are structurally excluded from accepted assertions (poisoned-record test); the one
place inference was tempting (public_url for field/studio) produced import_records instead.

**Dashboard drift — PASS.** No KPI cards, no scores, no counters-as-status. The four-field
first frame answers the spec's one-minute questions with prose, not metrics. Gauges exist
nowhere in The Middle (the cockpit's gauges remain the atelier's own instrument, ADR 0008).

**Generic graph aesthetics — PASS.** No constellation shipped in v1 (ADR 0004); the three
renderers are form-specific (ledger, layered lineage with a negative band, register
before/after with struck-not-erased overlay).

**Overclaiming autonomy — PASS.** `/about` carries the spec 07 §3 autonomy statement;
`/apparatus` names Frank's roles, the conductor delegation, model-runtime actors (Fable,
Probe, layer-2 runner) and the editorial sentinel. Git-author vs persona discrepancies are
disclosed inside event payloads rather than cleaned up.

**Human/infrastructure invisibility — PASS.** The 66-second studio→site republication gap
is rendered as an apparatus note in the trace; the correction's transport through Frank is
an event property; import/projection versions and watermarks are on every map.

**Unmaintainable complexity — PASS with notes.** One SvelteKit app, three small packages,
plain SQL migration, no ORM yet, no queues, no microservices, hand-written CSS. Dependency
count is modest (ajv, postgres, sveltekit/vite, playwright dev-side). One operator can hold
this. *Notes:* PostgresStore is unexecuted (needs live-run + MemoryStore parity test before
deploy) and duplicates mapper logic that will grow — revisit at the first write feature
(Drizzle decision already recorded in ADR 0006).

**Security and prompt-injection exposure — PASS for a read-only slice.** All imported text
rendered escaped (no `{@html}` on imported strings — grep-verified); strict CSP without
`unsafe-eval` (the Ajv codegen path was moved out of the client bundle for exactly this
reason); no external runtime requests (fonts self-hosted; network trace empty); no
analytics. No agentic consumption of imported material exists in v1, so injection surface
is deferred to the phase that introduces it (Phase 5+ must re-review under spec 06 §10).

## 2. Explicit deviations from the specification (all recorded in ADRs/gap analysis)

1. GCP → Cloudflare + Neon + GitHub Actions (ADR 0006) — awaiting Frank's cost/vendor nod.
2. Cockpit treated as *live local instrument with archived snapshots*, not as a retired
   interface (ADR 0008) — more faithful to local sovereignty than the spec's framing.
3. First encounter initiates from a *standing contract*, not an `offer.created` (gap
   analysis §2.1) — the spec's entry narrative widened, no schema change.
4. `/refusals`, `/collectives`, `/now`, bounded constellation: deferred with reasons
   (gap analysis §5; design §2).
5. Route segment uses lens-id for citation readability (`…/maps/provenance-v1@1`);
   `export.json` added per acceptance item 12.

## 3. Remaining compromises (must close before/at deployment)

1. **PostgresStore:** unexecuted; subject/object sub-field fidelity gap; needs JSONB
   columns + parity tests + a live migration/loader run against Neon.
2. **accessible_summary polish:** duplicated synthesized-exclusion sentences; fold counts
   into one sentence, then regenerate all map versions (final pre-publish hash change).
3. **Dark-mode automated contrast checks** (the error-boundary CSS leak was caught only by
   human screenshot review) — add axe runs under forced dark scheme.
4. **Fonts:** variable TTFs for Literata (woff2 subsetting is a nice-to-have, not a
   blocker); license files ship alongside — verify inclusion in the deploy artifact.
5. **Pending-approval states are real:** proposition, pin reason and encounter assembly all
   display "pending Frank Bültge's approval" — deployment before that approval would
   publish a visibly unapproved editorial voice. By design, this forces the human gate.

## 4. Verdict

The slice demonstrates the governing proposition with real material: one object moved
between two sovereign practices, changed meaning and form, kept provenance and conditions,
and is shown through three structurally different, versioned, exclusion-declaring maps —
without a master overview, without flattening disagreement, and with the apparatus visible.

**This system is not rhizomatic and not neutral, and does not claim to be.** It is a
bounded, inspectable architecture whose maps are situated, whose exchanges are voluntary,
and whose differences remain legible. Per ADR 0005/spec 08 §5: STOP here. Next actions
belong to Frank: encounter approval, proposition wording, stack/vendor nod, repo
publication decision — then the deployment package, and only after that any writeable
federation work.
