# Spec Gap Analysis — Phase 0
## What is directly implementable, what needs repository changes, what should be revised

**Date:** 2026-07-14
**Basis:** `docs/spec/*` (the 2026-07-14 package) checked against the audited state
(`REPOSITORY-AUDIT.md`, `ENCOUNTER-INVENTORY.md`).

---

## 1. Directly implementable (no repository changes, no spec revision)

| Spec element | Audit confirmation |
|---|---|
| Read-only adapters, Phase 1–3 without touching engine repos (06 §4, ADR 0005) | All needed material is public and structured: protocols, journals, works with `meta.json`/`data.json`, `chronicle.json`, `pulse/*.json`, `REQUESTS.md`, `memory/*.md`. The selected encounter is fully reconstructable read-only. |
| Open-string local types and event predicates (05 §3, 09 §8) | Mandatory in practice: undocumented rhizome edge kinds (`grounds`, `continues`, `complement`), `DISCLOSED RECONSTRUCTION` tier, `UNSETTLED-but-informed`, chronicle `move` enum failure ("no 'expedition'"). |
| Obligations as first-class records (05 §3.10) | Meridian's five standing conditions + Ensemble's mirrored contract exist verbatim on both sides — importable as accepted obligations with evidence events. |
| Correction propagation semantics (03 §7) | A real correction (Minnesota) flowed receiver→source and was applied through a gauntlet re-run — richer than the spec's own example (which only models source→receiver). |
| Participant-specific status (05 §3.6) | Native Speaker: Ensemble "premiered, obligation active"; Meridian "correction applied, register revised"; no shared resolution needed. |
| Machine suggestions separated from assertions (05 §3.17) | No existing data pollutes this: nothing in the repos is an unattributed machine edge; rhizome edges are Ulysses-authored. Clean start. |
| Collective manifests, v1 seeded from protocols (06 §4 Phase 1) | `PROTOCOL.md` + `README.md` + `SITE-API.md` per repo contain every required manifest field except an explicit inbox declaration — and `REQUESTS.md` *is* the lived inbox (`inbox.mode: "repository_file"`). |
| Historical cockpit import as Ulysses-authored assertions (08 §11) | `pulse/vital-signs.json` closure values are already self-labelled CONJECTURE; rhizome edges carry exact local kinds. |
| Actor model incl. model runtimes and automations (05 §3.3) | Real actor set already richer than the spec's examples: Fable, Probe, Protokollführung (layer-2 runner), CI identities, Frank-as-conductor. |

## 2. Implementable with small spec *clarifications* (revise the spec text, not the repos)

1. **The first encounter has no `offer.created`.** The real transfer ran under a *standing
   contract* (downstream commitments) + declared consumption. The spec's event grammar covers
   this (`citation.declared`, `object.admitted`, `obligation.accepted`) but 00 §6 narrates
   "offered object" as the entry point. Revision: the encounter view must support "standing
   open offer with conditions" as an initiation shape. No schema change required.
2. **Commit SHAs are mutable pointers.** field-research's documented history rewrite
   (2026-07-12) breaks the implicit assumption in 05 §4.1 that `source_commit` is durable.
   Revision: treat `content_hash` as primary identity, `source_commit` as best-effort
   pointer; import rewrite maps (`notes/2026-07-12-history-rewrite-map.md`) as apparatus
   events; adapters must tolerate dangling SHAs. Schema already stores both — only the
   normative text needs the demotion.
3. **Language.** The spec is silent on DE/EN. The lab site is bilingual (DE default, /en
   mirror… actually EN at root, /de mirror for atelier only). Proposal: The Middle's UI
   chrome bilingual DE/EN like the site; **records render verbatim in source language**
   (English throughout the engine repos) with language tags; editorial propositions authored
   in both languages. This is a product decision for Frank, defaulted to "bilingual chrome,
   untranslated records".
4. **More practices than three.** datavism.org and data-snack.com already hold accepted
   downstream conditions; the lab itself received studio material (Spielraum); a fourth
   integrate pipeline (plenum) shares the site integrator. v1 renders three collectives, but
   collective pages and copy must never say "the three practices" as a structural fact.
   The schema needs no change (open membership by design).
5. **"Ulysses cockpit as historical"** (00 §7, 08 §11): the cockpit went live *today* and
   its Ventil accepts reader impulses *now*. Treating it as frozen history while it is the
   live atelier surface would be false. Revision (ADR 0008): the cockpit remains the
   atelier's *local* live instrument on frankbueltge.de; The Middle *archives its data
   snapshots* as dated Ulysses-authored local maps and links out — supersession happens only
   if/when the atelier itself retires it. This is more honest than the spec's framing and
   more faithful to local sovereignty.

## 3. Needs repository changes — deferred to Phase 4 exactly as the spec already plans

- `federation/collective.json` + outbox files in each engine repo (spec 08 §6): defer;
  Phase 1–3 seeds manifests from protocols read-only. When Phase 4 comes, the natural
  authors are the nightly routines themselves under their existing repo-CI gates (the
  "collective delegate" of 07 §2.5 already exists in the form of each repo's merge process).
- Signed events / GitHub App (06 §4 Phase 3): defer, as specced.
- A correction channel *into* The Middle from visitors (07 §5): defer to Phase 6.

## 4. Spec elements to revise after audit (substantive)

1. **Deployment recommendation (06 §2, §13): replace GCP with Cloudflare + managed Postgres.**
   The lab has a standing "no GCP" decision, zero-cost operations, and existing Cloudflare +
   GitHub Actions competence; the spec itself allows this ("The epistemic architecture is
   more important than provider choice"). Full reasoning in **ADR 0006**. Jobs (import,
   projection, export) run as GitHub Actions — the lab's proven pattern — not Cloud Run Jobs.
2. **The fixture (`fixtures/example-encounter.json`) should be replaced, not extended.**
   The real encounter is stronger than the invented one and the fixture's shape survives:
   Phase 1 encodes `enc-2026-001-calibration-gap-travels` as the canonical fixture; the
   illustrative fixture stays only as a schema example, clearly labelled (it already carries
   a fixture_notice).
3. **db/0001_initial.sql is a good starting point; two hardening notes for Phase 1:**
   (a) add an `import_records` / ambiguity queue table (spec 08 §4 requires ambiguity and
   unsupported-record queues; the SQL has none — validation_state on events is not enough for
   *unparseable* inputs that never become events); (b) events' `UNIQUE (content_hash,
   source_uri)` plus idempotent re-import needs an adapter-side deterministic external_event_id
   scheme — specify it in the protocol package (e.g. `sha256(source_uri + content_hash +
   event_type)`), otherwise nightly re-imports fight the unique constraints.
4. **Renderer scope for the slice (04 §7.4):** the audit yields provenance chain,
   transformation lineage, parallel positions, obligation matrix — all four needed for
   Candidate 1. A bounded constellation adds nothing for this encounter and should be
   omitted in v1 (the spec permits this: "only if it adds real comprehension").
5. **Apparatus page must disclose the existing analytics** (self-hosted Umami behind a
   first-party proxy on the site) if The Middle shares that pattern — or better, ship The
   Middle without analytics in v1 (07 §8 "Prefer no behavioural tracking"), and say so.

## 5. Contradictions inside the spec package (minor, resolved here)

- 00 §4 lists `irrtum-als-methode` as "Ulysses/Atelier — full freedom…" while 09 §2.5
  constrains The Middle from imposing any identity; resolved: manifests are seeded from the
  *repos' own words* only.
- 04 §4 route list includes `/refusals` as primary nav; the audited corpus contains no
  published refusal *between practices* yet (kills are internal gate outcomes, not
  inter-practice refusals). v1 keeps the route but it must render the honest empty state
  ("no published refusals between practices; internal kill records live in the sovereign
  archives") rather than pretending emptiness is an error. Ensemble's boundary-case decision
  is rendered *inside* the encounter as translation loss, not as a `/refusals` entry.
- Spec 08 §13 model-allocation table matches the lab's standing model-economy rule; adopted
  as working practice (strongest model: audit/ADRs/domain/first-slice architecture/reviews;
  Sonnet: bounded implementation packages; review cadence after 2–4 packages).

## 6. Unknowns that block nothing but must stay on the board

Carried over from `REPOSITORY-AUDIT.md` §10 (secrets' live state, 404 resolution, impulse
inbox state, session-runtime configuration, datavism ADR content). None blocks Phase 1.
