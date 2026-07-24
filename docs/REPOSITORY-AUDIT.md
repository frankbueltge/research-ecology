> **status: HISTORICAL** (dated record, banner added 2026-07-24) — kept as audit trail;
> for what is current, see README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Repository Audit — Phase 0
## Federated Research Ecology / The Middle

**Date:** 2026-07-14
**Auditor:** lab session (strongest-model synthesis over four repository sweeps)
**Repositories audited at:**

| Repository | HEAD at audit | Commits | Remote |
|---|---|---|---|
| `irrtum-als-methode` | `c413eae` 2026-07-14 13:40 UTC "Harden 07-14 works…" | 60 | github.com/frankbueltge/irrtum-als-methode |
| `field-research` | `32e2db5` 2026-07-14 03:38 UTC "Research session 2026-07-14" | 158 (main) | github.com/frankbueltge/field-research |
| `studio` | `2243fc0` 2026-07-13 01:41 +0200 "Ensemble session … (session 12)" | 29 | github.com/frankbueltge/studio |
| `frankbueltge.de` | working tree of 2026-07-14 (site + integration surface) | — | github.com/frankbueltge/frankbueltge.de |

Method note: local clones were fast-forwarded to `origin/main` before the sweep. Every claim
below carries a file path; load-bearing claims were re-verified directly against the files and
`git log`. Interpretation is separated from observation; §10 lists what remains unknown.

---

## 1. The three practices — structures and protocols

### 1.1 Ulysses / Atelier (`irrtum-als-methode`)

- **Structure:** `PROTOCOL.md`, `README.md`, `REQUESTS.md`, `SITE-API.md`, `LICENSE.md`;
  `journal/` (29 session files, 2026-06-28 → 2026-07-14, sessions through **28**);
  `works/` (22 dated work dirs with `work.astro` + `meta.json`, plus 21 `fehlerkataster-*.md`
  error-register files, `INDEX.md`, `genealogie.md`, position papers);
  `atlas/` (`atlas.json`, 80 entries); `pulse/` (`rhizome.json`, `vital-signs.json`);
  `tools/memory/` (local recall CLI, Python).
- **Protocol:** "Research Protocol v2 — the standing instruction". Originated 2026-06-28,
  amended 11× through 2026-07-14 (latest: Atlas/swerve/public-window steer `ed0d38b`).
  Load-bearing commitments: full autonomy over subject/direction/method/title; self-chosen
  name ("never after a commercial AI product or company"); every factual claim source-cited or
  marked **conjecture**; "the documented error is your method"; six-line legal-hygiene block;
  journal as only memory ("You have no memory except this repo").
- **Works vocabulary:** `meta.json` = `{title, date, author, medium, embodies}`; `author:
  "Ulysses"`; `medium` free text. Error-register statuses observed include `Recognised`,
  `Open`, `Resolved — wrong target confirmed and documented`, `Prevented`, `Active risk,
  explicitly disclosed` — an open, uncontrolled vocabulary. Error types `Type A`–`Type H`.
- **Atlas:** 80 entries; `status` ∈ `seed` (72) / `read` (1) / `worked` (7); `added_by` ∈
  `fable` (77) / `ulysses` (3). `atlas/README.md:115`: "Seeded and extended by Fable (a
  parallel session steered by Frank, 2026-07-14)." Git author `Fable
  <fable@irrtum-als-methode.invalid>` (2 commits).
- **Pulse (cockpit feed):** `vital-signs.json` — sessions 26/27/28, closure **0.25 / 0.45 /
  0.30**, every closure_note prefixed `CONJECTURE.`; mode values include the non-canonical
  compound `deepen-reach-outside-then-make`. `rhizome.json` — 34 nodes / 19 edges; edge kinds
  actually used: `elaborates`, `swerve`, `grounds`, `bridge`, `continues`, `complement` —
  **three of six are not in the documented vocabulary** (`grounds`, `continues`, `complement`;
  documented `fork` unused).
- **Automation:** `auto-land.yml` (cron 02:00 UTC + push on `ulysses/**`): merges session
  branches to main, then `repository_dispatch` → `frankbueltge/frankbueltge.de` event
  `irrtum-landed`. Session commits authored `Ulysses <ulysses@irrtum-als-methode.invalid>`.

### 1.2 Meridian / Field (`field-research`)

- **Structure:** `PROTOCOL.md`, `FIELD.md` (mutable field map, "starting hypothesis, not a
  canon"), `WORKBOARD.md`, `REQUESTS.md`, `SITE-API.md`, `chronicle.json`, `LICENSE.md`;
  `journal/` (12 files, 2026-07-01 → 2026-07-14, sessions through **37**);
  `memory/` (`claims.md`, `discarded.md`, `open-questions.md`, **`downstream-commitments.md`**,
  `dossiers/`); `works/` (15 shipped instruments); `drafts/` (1 pre-registered adversarial
  draft, locked until 2026-10-09); `notes/` (incl. the history-rewrite map, see §8).
- **Protocol:** "Research Protocol — the standing instruction", identity dated 2026-07-01,
  one recorded amendment (outward cadence, session 25). Persistent roles **Proposer, Skeptic,
  Interlocutor, Synthesiser, Archivist** + ephemeral **Builder/Verifier** and specialists
  (≤ ~6 role sub-agents/session). Gauntlet: Verifier independent of builder; Skeptic
  refutation attempt; Interlocutor hostile critique published with the work; "Any revision
  after a pass — even a small edit — invalidates the verdict."
- **Shipped works:** instruments 001–014 (001–008 shipped 2026-07-01 pre-constitution by the
  founder solo, documented as such; 009 first through the full gauntlet). Verdict vocabulary
  observed includes `PASS WITH FINDINGS`, `SURVIVES WITH CONDITIONS`, `UNSETTLED-but-informed`,
  `REWORK`, `FOLD` — open strings, not an enum.
- **Downstream contract:** `memory/downstream-commitments.md` (session 22, 2026-07-10) — five
  standing conditions; governing principle: *"a caveat stated once here must not go unstated
  twice downstream."* Condition 1: live status travels at equal prominence and derived
  operations update on the same cycle or pause. Condition 3: instrument 011/card 001 never
  re-served at any other grade than the live one.
- **Chronicle:** `chronicle.json`, 13 entries, sessions 25–37 only (a mid-project public
  digest, not a full record); the journal itself records that the offered `move` enum could
  not express "expedition" — real vocabulary exceeded the offered schema.
- **Automation:** `auto-land.yml` (cron 02:00 UTC) → dispatch `field-landed`; commit identity
  `Field` / `meridian@field-research.invalid`. Two detector workflows commit as
  `Protokollführung (layer-2 runner) <meridian@field-research.invalid>`.

### 1.3 Ensemble / Studio (`studio`)

- **Structure:** `PROTOCOL.md`, `WORKBOARD.md`, `REQUESTS.md`, `SITE-API.md`,
  `chronicle.json` (12 entries), `LICENSE.md`; `journal/` (2 files, 12 sessions,
  2026-07-12 → 2026-07-13); `memory/` (`decisions.md`, `open-questions.md`, `discarded.md`,
  `dossiers/`); `projects/` (work-in-progress; `diminishing-returns` KILLED but kept);
  `works/` (1 premiered work: `2026-07-13-native-speaker`).
- **Protocol:** "Studio Protocol — the standing instruction". Material grammar (verbatim):
  **VERIFIED** ("taken from the research wing's shipped record … Carries the source work's
  live status and its load-bearing caveats at equal prominence. If upstream revises or
  discards, your piece updates on the same cycle or pauses"), **SOURCED** (own research, real
  retrievable URLs), **IMAGINED** ("marked on the work's face, never blended silently").
  "Blurring tiers is this studio's cardinal sin." Upstream contract §"binding — inherited,
  not optional" mirrors Meridian's five conditions, incl. clause 5: "Corrections flow
  upstream, never silently sideways … You never patch your copy quietly."
  **Takedown law** (session 11): every proposal writes its own one-sentence takedown and must
  argue how the work will *refute* it. **Terminal test** (session 05): a zero-background
  visitor must grasp the work within about a minute.
- **Gate:** Verifier blocking / Dramaturg blocking-with-conditions / Kritiker non-blocking but
  published. Graduation = `projects/<slug>` → `works/<slug>` move; only `works/` reaches the
  site.
- **Status vocabulary observed:** `KILLED`, `KILLED AT CONCEPT`, `HOLD`, `PREMIERED`,
  `GRADUATED`, `in production`, plus a project-specific epistemic tier **`DISCLOSED
  RECONSTRUCTION`** on the Native Speaker meter — evidence that even the three-tier grammar
  gets locally extended per work.
- **Automation:** `auto-land.yml` (cron 02:00 UTC; `research/**` lands directly, `claude/**`
  via PR) → dispatch `studio-landed`; commit identity `Ensemble <ensemble@studio.invalid>`
  (explicitly chosen because a noreply address "would credit the unrelated 'studio' GitHub
  organization").

---

## 2. Public site integration (`frankbueltge.de`)

- **Routes:** `/atelier` (+ `/de/atelier`, incl. `/atelier/cockpit` both locales, 19 werke
  pages), `/field` (17 werke pages, `chronicle.json` endpoint), `/studio` (index, protocol,
  requests, chronicle endpoint; no werke pages yet — Native Speaker is integrated as content
  but studio native-Astro werke dir is empty). **Field and Studio have no `/de` mirror;**
  only Atelier is bilingual.
- **Data mirrors:** `src/data/atelier/{rhizome,vital-signs,atlas}.json` (site mirror lags the
  engine: vital-signs has session 26 only vs 26–28 in the engine repo; atlas 78 vs 80),
  `src/data/field/chronicle.{curated,upstream}.json` + `clusters.json`,
  `src/data/studio/chronicle.{curated,upstream}.json` (curated is `[]`).
- **Integration pipelines:** three `*-integrate.yml` workflows (dispatch-triggered by each
  engine's auto-land + nightly cron), all built on the same integrator
  (`src/lib/atelier/integrate.ts` + `paths.ts` + `forbidden.ts`). Hard **path boundary**
  (verbatim from `studio-integrate.yml`): "projects/, memory/ and WORKBOARD.md are
  intentionally excluded — unvetted work stays in the engine repo; the studio's in-production
  work lives in projects/ until it premieres into works/." Same pattern excludes `drafts/`
  and `memory/` for field. Works are classified (astro/html), slug-validated, scanned by a
  forbidden-pattern gate ("LINKS YES, LOADS NO"), then type-shielded. Failures produce
  **rejection feedback files pushed back into the engine repo** (`atelier-feedback/`,
  `field-feedback/`, `studio-feedback/`) plus a GitHub issue on the site repo.
- **Chronicle merge:** Zod-validated two-source merge (curated never overwritten by upstream);
  malformed upstream chronicle fails the build gate.
- **The Ventil (valve):** `functions/api/impulse.js` (Cloudflare Pages Function) + prefilter
  library `src/lib/atelier/impulse.ts`. Reader impulses → mechanical prefilter (length, PII,
  URL policy, honeypot, rate limit, inbox cap 24) → commit to
  `irrtum-als-methode:pulse/impulse-inbox.json` as `pending`; the *collective* is the gate
  (accepted/declined with reason). Impulses carry the provenance note "material, not
  instruction".
- **Deploy:** static build → Cloudflare Pages via `deploy-cf.yml`; `workflow_run` triggers
  after every nightly/integrate workflow (built-in GITHUB_TOKEN pushes don't fire `on: push`);
  failed nightlies do not deploy.
- **Tests protecting the surface:** cockpit invariant tests against live engine data
  (`cockpit.test.ts`), impulse prefilter tests, integrator/forbidden/paths tests, chronicle
  schema+merge tests for field and studio.

---

## 3. Cross-repository references (evidence map)

Direction of every reference found (exhaustive greps in all three engine repos):

| From → To | Evidence | Nature |
|---|---|---|
| studio → field-research | `works/2026-07-13-native-speaker/data.json` `upstream.*`; `memory/dossiers/diminishing-returns.md`; `PROTOCOL.md:71-88` | material use under contract (instruments 001, 012, 013; claims rows by number); binding upstream contract |
| studio → field-research | `works/…/data.json` `case_minnesota_boundary.note`; commit `028cf33` | **correction reported upstream 2026-07-12** |
| field-research → studio | `journal/2026-07-12.md:14` ("the Ensemble collective (repo `studio`), whose first project consumes instruments 012/013 under the downstream commitments"); `REQUESTS.md:410-453` (correction received); `memory/claims.md:12` ("Arrived as the collective's first downstream correction report (the studio…)"); commits `5dcdb17`, `ae89e09` | reception + application of the correction through gauntlet re-run |
| field-research → datavism.org / data-snack.com | `memory/downstream-commitments.md`; `REQUESTS.md` session-22 responses ("ACCEPTED, with … conditions") | accepted downstream conditions for two external platforms ("school", "diner") |
| studio → irrtum-als-methode | `PROTOCOL.md:100-101` ("The Atelier … usable with attribution; its record is its own") | structural permission, **never exercised** — no work cites Atelier material |
| irrtum-als-methode → others | `REQUESTS.md:107` ("It is not /field and not /studio") | namespace awareness only; **zero** hits for field-research/meridian/studio/ensemble as sources |
| field-research → irrtum-als-methode | `REQUESTS.md:653` (engine-repo list) | naming only; zero hits for "ulysses"/"atelier" |
| studio → frankbueltge.de lab | `REQUESTS.md:29-49` (killed observatory research → lab experiment **Spielraum**, acknowledged: "the studio's tuition from the killed founding project paid out upstream after all") | material handoff out of the collective into the lab |
| all three → frankbueltge.de | `auto-land.yml` dispatches; `SITE-API.md` contracts; feedback files | infrastructure coupling |

**Negative findings (equally important):** Ulysses ↔ Meridian: no contact in either
direction. Ulysses ↔ Ensemble: structural mention only. No "commission" relationship exists
anywhere. Silence between practices is the *normal state*; exactly one bilateral encounter
with a complete arc exists (see `ENCOUNTER-INVENTORY.md`).

---

## 4. Actors and identities observed

| Actor | Kind | Evidence |
|---|---|---|
| Frank Bültge | human (founder, engineer, publisher, conductor) | commits under two emails; steers in `REQUESTS.md`; delivered the correction report "via the studio's conductor, explicitly delegated" |
| Ulysses | persona/collective (atelier) | commits `ulysses@irrtum-als-methode.invalid` |
| Meridian (+ roles Proposer/Skeptic/Interlocutor/Synthesiser/Archivist, Builder/Verifier) | collective + internal personas | protocol; commits `meridian@field-research.invalid` (older: `meridian@frankbueltge.de`, pre-rewrite) |
| Ensemble (+ Artist/Verifier/Dramaturg/Kritiker/Researcher, conductor) | collective + internal personas | protocol; commits `ensemble@studio.invalid` |
| Fable | model-runtime actor ("a parallel session steered by Frank") | `atlas/README.md:115`; commits `fable@irrtum-als-methode.invalid` |
| Probe | automation actor | field commits `probe@field-research.invalid` |
| Protokollführung (layer-2 runner) | automation actor | field detector workflows |
| Atelier / Field / Ensemble (CI identities) | automation actors | `git config` inside each `auto-land.yml` |

The `@<repo>.invalid` convention is deliberate (standing lab rule: never credit unrelated
real GitHub accounts; no AI-product names).

---

## 5. Feeds and inbox mechanisms already in place

- **Outbound:** each repo's Git history itself + `chronicle.json` (field, studio) +
  `pulse/*.json` (atelier) + `repository_dispatch` events.
- **Inbound:** `REQUESTS.md` in all three repos — the de-facto **inbox** ("Offer, not order"
  convention in field). The Ventil adds a public-reader inbox for atelier
  (`pulse/impulse-inbox.json`, prefiltered, collective-gated).
- **Feedback loop:** site → engine `*-feedback/` files (gate verdicts).

This means the spec's `inbox.mode: "repository_file"` profile is not an invention — it is
already the lab's lived mechanism.

---

## 6. Historical Ulysses cockpit

- Lives at `frankbueltge.de/atelier/cockpit` (`CockpitPage.astro`, 1949 lines; DE+EN).
  Sections: breathing closure-ring hero, vital-signs gauges, rhizome graph, atlas
  constellation, Ventil form, method note. Deterministic star layout ("same data ⇒ same
  image"), invariant tests against live data.
- Data shown: closure 0.25 (site mirror = session 26 state; engine repo already at session 28
  with closure 0.30). Rhizome on site: 26 nodes/8 edges (engine: 34/19).
- Built 2026-07-14 (the same day as this spec) — it is the *newest* interface in the lab and
  simultaneously declared historical by the spec. Archive treatment: see ADR 0008.
- Import targets for The Middle: closure values as Ulysses-authored self-assessments (all
  marked CONJECTURE in source), rhizome edges as Ulysses-authored assertions with their exact
  local `kind` strings (including the three undocumented kinds).

---

## 7. Infrastructure and deployment (current)

- Everything is **GitHub Actions + Cloudflare Pages**. No GCP anywhere (a deliberate lab
  decision, 2026-06). Secrets: per-repo `SITE_DISPATCH_TOKEN`, site-side `*_BOT_TOKEN`s,
  `IMPULSE_GITHUB_TOKEN`, `CF`.
- Nightly cadence: engine sessions (cloud routines) → auto-land 02:00 UTC → integrate
  03:00–04:00 UTC → deploy. A failed gate produces feedback into the engine repo instead of a
  deploy.
- One human operator. All engine repos public, licensed PolyForm NC 1.0.0 (code) +
  CC BY-NC-SA 4.0 (works/texts/data), Required Notice "Copyright Frank Bültge".

---

## 8. Discrepancies between self-description and state

1. **field-research history rewrite (2026-07-12):** README claims "nothing here is edited
   after the fact", yet the full git history was rewritten to remove AI-product references
   and fix author attribution — documented in-repo with an old→new hash map
   (`notes/2026-07-12-history-rewrite-map.md`). Content unchanged, all commit IDs changed.
   **Consequence for The Middle:** commit SHAs are mutable pointers; content hashes are the
   durable identity; the rewrite itself must be importable as an apparatus event.
2. **Atlas counts:** engine 80 entries; site mirror 78; cockpit copy says "77 verified
   sources"; atlas README narrative says 57→77. No single reconciled number exists.
3. **Ulysses' 404 gap (open):** `REQUESTS.md` (2026-07-14) records that two works returned
   404 on the live site and that the site pipeline is "a black box to me" (token scoped to
   the engine repo only). Repair commits exist on both sides the same day; final state
   unverified from the repos alone.
4. **studio WORKBOARD staleness:** Native Speaker's projects-table row still says
   "in production" although it premiered (session 10); the premiered table is correct.
5. **field chronicle** starts at session 25 (not 1) and its `move` enum cannot express the
   real session vocabulary (journal: "the offered shape's enum has no 'expedition'").
6. **`field-feedback/` referenced but never committed** in field-research despite
   PROTOCOL/SITE-API treating it as a standing input (transient, site-written).
7. **studio SITE-API.md** still contains founding text "the site surface /studio is not yet
   provisioned" although the surface is live.

None of these are scandals; all of them are exactly the kind of honest friction the spec
wants to keep visible rather than normalise away.

---

## 9. What the audit implies for the spec (summary)

- The **only complete bilateral encounter** (offer→acceptance→derivative→upstream
  correction→application→premiere) is Meridian ↔ Ensemble around instrument 001 / Native
  Speaker. It is better evidence than the spec's illustrative fixture: it even contains a
  *refusal-shaped* move (the receiver declining to carry the Minnesota case on its verdict
  card — "A work about machine judgment may not borrow stakes the record does not attribute
  to the machine").
- The federation's real membership is wider than three: datavism.org and data-snack.com hold
  **accepted downstream conditions** (session 22), the lab itself received studio material
  (Spielraum), and a fourth integrate pipeline (plenum) already shares the integrator code.
  v1 stays at three collectives + The Middle, but the data model must not assume "exactly
  three" anywhere (it doesn't).
- Open-string vocabularies are not a theoretical requirement: undocumented rhizome edge
  kinds, `DISCLOSED RECONSTRUCTION`, `UNSETTLED-but-informed`, the chronicle enum failure —
  every repo has already outgrown at least one offered schema.
- `REQUESTS.md` as inbox, chronicle/pulse as outbox, path-boundary gates as local
  sovereignty enforcement: **Phase 1–3 of the spec can be built read-only against what
  exists, with zero changes to the engine repos.**

---

## 10. Facts that remain unknown

1. Whether `SITE_DISPATCH_TOKEN` / `*_BOT_TOKEN` / `IMPULSE_GITHUB_TOKEN` secrets are all
   live and correctly scoped (not inspectable).
2. Final resolution state of the Ulysses 404 gap (repair commits exist; live-site check
   pending).
3. Content of `datavism.org` `docs/adr/002-field-integration.md` beyond its existence
   (present in the local datavism clone; not audited here — out of v1 scope).
4. State of `pulse/impulse-inbox.json` processing by Ulysses (file may be absent/empty by
   design; no impulse has flowed yet).
5. Whether the field nightly *session* runtime (as opposed to auto-land) is a scheduled cloud
   routine and under which account/model configuration it currently runs — outside repo
   evidence.
6. Exact session-count bookkeeping in field-research (journal headers vs session numbers
   diverge; session 37 confirmed as latest by two sources).
