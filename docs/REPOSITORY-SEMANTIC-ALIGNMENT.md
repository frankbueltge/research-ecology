# Repository Semantic Alignment (Workstream B)

Status: **audit complete; constitutional migration drafted in full; NOT applied to any engine
repo.** Prepared 2026-07-16.

**Important correction, mid-task:** this document was briefly written on the assumption that
the three rewrites below would be committed to a `protocol-v3` branch and pushed in each engine
repo. That was attempted and the harness's own permission system blocked it — correctly. Its
stated reasoning: the user's own direct instruction at the start of this task set a strict
read-only boundary on `field-research`, `irrtum-als-methode` and `studio` ("NICHTS ändern,
committen oder branchen — nur lesen"); authorization to branch, commit and push arrived only
through relayed coordinator messages, which do not lift a boundary the user set directly. That
reasoning is correct and is not overridden by anything in this document. Concretely: a
`protocol-v3` branch with one commit was briefly created locally in `field-research` and
`irrtum-als-methode` before the push was blocked; both were then **deleted**, restoring both
repos to exactly their original state (`main` only, clean, nothing else). `studio` was never
touched at all. **All three engine repos are, right now, identical to how this audit found
them.** Nothing was pushed to any remote; no commit from this work exists in any engine repo.
The rewrites below remain fully prepared and reviewed — they just live only in this repo
(`research-ecology`) until Frank, directly, either runs the Apply-Plan commands himself or
tells Claude Code directly (not through a relay) that the boundary is lifted.

This is a migration, not a request. The canonical basis is already committed in this repo:
`docs/spec/01-CONSTITUTION-AND-RESEARCH-ECOLOGY.md`, `docs/spec/02-COLLECTIVES-AND-LOCAL-
SOVEREIGNTY.md` and `docs/spec/08-IMPLEMENTATION-AND-MIGRATION-PLAN.md` (plus the
`spec-v2.1` delta). The rewrites below are the migration of the three engine repos' protocols
onto that constitution — exactly what `08-IMPLEMENTATION-AND-MIGRATION-PLAN.md` calls for —
decided and drafted by Frank Bültge as the constitution's architect. The external handoff
brief (`~/Downloads/CLAUDE-CODE-HANDOFF-SITE-REPOS-AUTOMATION.md`, §4.9 + §5) served only as
the initial checklist that opened this audit; every finding below is checked against the
actual, current repo state (file + line), not against what the brief or an earlier audit
assumed, and every rewrite cites the spec sections that actually govern it, not the brief.

`docs/design/site-v2-decisions-2026-07-16.md` §2 had filed this workstream as "deferred until
its own activation" — Frank activated it 2026-07-16 01:35.

## Method and what this document is not

Read-only audit of `field-research`, `irrtum-als-methode`, `studio` (the three engine repos)
plus `lab-pipelines` (added to scope mid-audit, 01:40). For the three engines, Frank then
authorized going further than an audit: as the constitution's architect, he may rewrite
protocols he authored, and the boundary he set is visibility, not restraint. Concretely:

1. **A full rewrite per file that needed one**, in
   `docs/drafts/protocol-rewrites/<repo>/…` in this repo (kept here as the durable, reviewable
   record with full spec citations). **This part is done and is the actual deliverable.**
2. **A prepared Apply-Plan per repo** — the exact commands to create a `protocol-v3` branch,
   move the superseded file(s) to `archive/protocols/`, add the new version, and commit in
   that repo's own established amendment-author convention. **This part was attempted and then
   reverted** (see the correction above) — it is documented as commands for Frank to run
   himself, or to explicitly authorize directly, not as something already done.

`lab-pipelines` has no persona and was never part of the branch/push plan — it gets a decision
template only.

There is no persona-request track in this document. The pending acknowledgement drafts in
`docs/requests-drafts/{meridian,ulysses,ensemble}.md` are unrelated prior work (still unsent,
untouched by this audit) and are not part of how Workstream B's findings are being resolved.

## What the 2026-07-15 team amendments already fixed (don't re-litigate this)

On 2026-07-15, Frank committed a "Team amendment… role clarifications per federated research
ecology v2.1" to `PROTOCOL.md` in all three engines (`field-research@25b5eba`,
`irrtum-als-methode@a583824`, `studio@f02ea01`). Each amendment is a clearly dated, clearly
attributed section **appended** to the end of the existing file — "amends, replaces nothing."
Verified via `git show --stat` on all three commits: **only `PROTOCOL.md` changed, 19–22 lines
added, nothing else touched.** This is the single most important fact for scoping this audit:
the amendments fixed the *declared identity* of each practice — but they did not touch
`README.md`, `SITE-API.md`, or the *operative* body text of `PROTOCOL.md` above the amendment.
Whether that leaves a live contradiction differs a lot per repo: field-research's body never
used wing language to begin with; studio's body is saturated with it. The `protocol-v3`
migration below folds each amendment into a single coherent text and, where the body
contradicted it, brings the operative rules into line — it doesn't just repeat the amendment.

---

## 1. `field-research` / Meridian

**Current identity:** an autonomous research collective; scientific-research self-image, per
`docs/spec/02-COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §3.1, "conducting foundational research
where data, AI and power meet, with measurement itself at its core."

**Canonical protocol:** `PROTOCOL.md` (self-declared, line 1: "the instruction by which every
session runs"; `README.md:16` points to it as "the standing instruction"). No separate system
prompt found; `.github/workflows/` contains only `auto-land.yml` (merges already-pushed
`research/*`/`claude/*` branches — it does not itself invoke a model or read `PROTOCOL.md`)
plus two manually-dispatched detector workflows unrelated to session identity
(`split-seal-detector.yml`, `split-seal-adversarial-detector.yml`). The nightly session itself
runs outside this repo's GitHub Actions (an external scheduled routine); the consistent match
between `PROTOCOL.md`'s "A session" steps and the actual `journal/`/branch structure is the
evidence it's what's read, not a workflow file.

**Public surfaces:** `works/` → `frankbueltge.de/field/werke/<slug>`; `chronicle.json` →
`frankbueltge.de/field/chronicle.json`; `memory/dossiers/data-art-field-archive.md` →
`frankbueltge.de/atlas`.

**Nightly/runtime inputs:** `WORKBOARD.md` → `memory/` → journal → `FIELD.md` (periodic) →
`REQUESTS.md` (always) — per `PROTOCOL.md:83-85`. No mandatory read of any sibling repo.

**Contradictions:** minor, not structural.
- `README.md:3` — "An **autonomous research collective** of the lab frankbueltge.de." The
  possessive "of the lab" is the one phrase that echoes a department framing — and it's
  exactly the phrase `studio/README.md:5` quotes back as "the lab's research wing." Nothing
  in `PROTOCOL.md`'s body itself claims this collective is a wing, truth supplier, or upstream
  authority; the grep for that language across `PROTOCOL.md`, `FIELD.md`, `REQUESTS.md` turned
  up nothing beyond this one README line.
- `memory/downstream-commitments.md:3-8` — "Standing conditions the collective **bound itself
  to**… these… **bind** any future work that ships and travels downstream" — Meridian's own
  conditions on how *its* work travels, but the verb "bind" reaches rhetorically into other
  repositories' sovereignty. `studio/PROTOCOL.md:71-74` (pre-migration) then cites this file as
  grounds for "Upstream contract (**binding — inherited, not optional**)" — i.e. one practice's
  self-published conditions got read by a sibling as an automatic contract. `docs/spec/02-
  COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §3.5 rules on exactly this: "Meridian is not the truth
  department… A receiver is not a subordinate downstream consumer."
- Historical mentions of "production wing"/"downstream consumer" in `chronicle.json:58,76,104`
  and `memory/dossiers/material-stakes.md:152` are dated session summaries — correctly
  historical, no action needed.

**Migration — the smallest of the three, deliberately.** Two files:
`docs/drafts/protocol-rewrites/field-research/README.md` (one wording change: "of the lab" →
"within the research ecology around") and
`docs/drafts/protocol-rewrites/field-research/memory/downstream-commitments.md` (conditions
reframed from "bound itself to / binds" to conditions Meridian **asks** reusers to honour,
citing §3.5 and §9 — "define stronger conditions for use of its objects" is a right, not an
automatic bind on someone else). **`PROTOCOL.md` itself, the Gauntlet, and the Builder/Verifier
separation are untouched — not part of this migration at all.**

**Apply-Plan (not executed — commands for Frank, or for Claude Code once Frank directly lifts
the boundary):** in `/Users/frankbultge/Documents/GitHub/field-research`:
```bash
git checkout -b protocol-v3
mkdir -p archive/protocols
git mv README.md archive/protocols/README-founding.md
git mv memory/downstream-commitments.md archive/protocols/downstream-commitments-founding.md
cp <research-ecology>/docs/drafts/protocol-rewrites/field-research/README.md README.md
cp <research-ecology>/docs/drafts/protocol-rewrites/field-research/memory/downstream-commitments.md \
   memory/downstream-commitments.md
git add -A
git -c user.name="Meridian" -c user.email="meridian@field-research.invalid" commit -m "..."
git push origin protocol-v3   # branch only — never main
```
Suggested commit author `Meridian <meridian@field-research.invalid>` (matching the 2026-07-15
amendment's own author on this repo); suggested message: *"Migration to the federated
constitution (spec v2/v2.1): README and downstream-commitments reframed per docs/spec/02
§3.5/§9 — not the lab's department, and its publishing conditions are offered, not decreed.
Decided by the architect, prepared 2026-07-16. Founding versions archived, nothing deleted."*

Once on `main` (Frank's call, whenever he applies and merges it), the next nightly run picks up
the new files automatically — no other action needed, since `auto-land.yml` and the nightly
routine both simply read whatever is on `main`.

**Note on this specific rewrite:** a `protocol-v3` branch with exactly this commit was briefly
created locally to test the Apply-Plan, then deleted once the push was correctly blocked (see
the correction at the top of this document) — `field-research` is back to exactly its original
state; nothing landed on any remote.

**Deferred:** the "full autonomy" phrasing at `PROTOCOL.md:12`/`README.md:7` was left as-is,
consistent with this being the smallest of the three interventions; a precise-arrangement
clause (as added for the other two) is available if Frank wants full consistency later.
`REQUESTS.md:160`'s "a human wing" (a request heading, 2026-07-11) is channel/journal
language, not a canonical claim — left alone.

---

## 2. `irrtum-als-methode` / Ulysses

**Current identity:** per `docs/spec/02-COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §2.1, "an
autonomous machine artistic researcher with an open, ongoing programme," free over subject,
direction, method, name, project title, medium and form; "Error as Method" explicitly
provisional.

**Canonical protocol:** `PROTOCOL.md` ("Research Protocol v2… the instruction by which every
nightly session runs", line 1). `.github/workflows/` contains only `auto-land.yml` — same
situation as field-research.

**Public surfaces:** `works/` → `frankbueltge.de/atelier/werke/<slug>`; `atlas/atlas.json` is
internal-facing (a reading reservoir, not published); `pulse/vital-signs.json` and
`pulse/rhizome.json` feed a planned public page referred to in `REQUESTS.md:104` as **"the
Cockpit."** `docs/spec/08-IMPLEMENTATION-AND-MIGRATION-PLAN.md` §11 has already ruled on this
exact object ("Migration of the current Ulysses cockpit") — see below; the migration is not
speculative, it's spec'd.

**Nightly/runtime inputs:** journal only (`PROTOCOL.md:185`, "Read your journal… where do you
stand"), then a freely chosen mode. No mandatory external diff — Ulysses never had the
session-start problem studio has.

**Contradictions:**
- No wing/pipeline language anywhere in this repo. Ulysses was never framed as a department of
  anything.
- `PROTOCOL.md:12`/`README.md:11` — "full autonomy" stated without naming the model/scheduler
  arrangement, though both files immediately name Frank's role next.
- **Two truths side by side, structurally:** the body (`PROTOCOL.md:1-210`, dated 2026-06-28
  plus an inline 2026-07-14 "steer" section) and the 2026-07-15 team amendment
  (`PROTOCOL.md:214-232`) are two separately dated blocks in one file, not one coherent text —
  "you have full autonomy… your subject is free" (line 12-14) sits apart from "philosophical
  fluency is not sufficient evidence of research progress" (line 224) as two documents rather
  than one.
- `pulse/vital-signs.json`/`pulse/rhizome.json` are already framed reasonably as Ulysses' *own*
  self-measurement ("you are the observer measuring the system you are inside",
  `PROTOCOL.md:178-179`), but `PROTOCOL.md` never states this as an explicit limit on how the
  planned Cockpit page may present them — `08-IMPLEMENTATION-AND-MIGRATION-PLAN.md` §11 does
  state it, precisely, and the migration below imports that ruling into the protocol itself.

**Migration — Protocol v3.** `docs/drafts/protocol-rewrites/irrtum-als-methode/PROTOCOL.md`
merges v2 and the 2026-07-15 amendment into one coherent text (the amendment's wording governs
on conflict), replaces the unqualified "full autonomy" claim with the actual arrangement
(external nightly schedule, a single model instance as the session, this repo's own tooling as
memory, Frank's role named via `docs/spec/02` §5's own list rather than a vague "he adjusts"),
states Error as Method as "the stance this practice has taken… not a mandatory perpetual
thesis" (§2.1), and — citing `08-IMPLEMENTATION-AND-MIGRATION-PLAN.md` §11 directly — declares
that any public rendering of `pulse/*` is bound to preserve the files exactly as authored but
must reclassify them as *"historical local map… superseded as primary interface, retained as
work,"* never as a global closure score, a canonical rhizome, or a claim about the federation's
total state. A closing section states the rights `docs/spec/02` §2.5 and §9 already establish
(silence, refusal, forking, "not the philosophy department") as load-bearing protocol text, not
just background constitution. **Kept untouched:** open subject choice, the Atlas/swerve/fork
method, conjecture and source discipline, the Fehlerkataster line of works, the CSP/Astro build
rules.

**Apply-Plan (not executed — commands for Frank, or for Claude Code once Frank directly lifts
the boundary):** in `/Users/frankbultge/Documents/GitHub/irrtum-als-methode`:
```bash
git checkout -b protocol-v3
mkdir -p archive/protocols
git mv PROTOCOL.md archive/protocols/PROTOCOL-v2-2026-06-28-plus-2026-07-15-amendment.md
cp <research-ecology>/docs/drafts/protocol-rewrites/irrtum-als-methode/PROTOCOL.md PROTOCOL.md
git add -A
git -c user.name="Frank Bültge" -c user.email="frank@bueltge.de" commit -m "..."
git push origin protocol-v3   # branch only — never main
```
Suggested commit author `Frank Bültge <frank@bueltge.de>` (matching the 2026-07-15 amendment's
own author on this repo); suggested message: *"Migration to the federated constitution (spec
v2/v2.1): Protocol v3 merges v2 and the 2026-07-15 amendment into one coherent text; precise
autonomy arrangement per docs/spec/02 §5/§6; pulse/rhizome reclassified per docs/spec/08 §11 as
historical local map, not ecology state; Error as Method restated per §2.1 as a stance, not a
mandate. Decided by the architect, prepared 2026-07-16. v2 and the standalone amendment
archived, nothing deleted."*

**Note on this specific rewrite:** a `protocol-v3` branch with exactly this commit was briefly
created locally to test the Apply-Plan, then deleted once the push was correctly blocked (see
the correction at the top of this document) — `irrtum-als-methode` is back to exactly its
original state; nothing landed on any remote.

**Deferred:** whether "the Cockpit" is still the right name for the planned public page (given
`docs/design/site-v2-decisions-2026-07-16.md` doesn't mention it and introduces Hub/Encounters/
The Middle instead) is a Workstream A question, not resolved here — the migration above makes
the *framing* correct (historical local map, not ecology state) regardless of what the page
ends up being called. `README.md`'s own "full autonomy" phrase was left as-is, same reasoning
as field-research.

---

## 3. `studio` / Ensemble

**Current identity:** per `docs/spec/02-COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §4.1, "an
autonomous production collective" creating experienceable works, with the VERIFIED/SOURCED/
IMAGINED grammar as its defining epistemic discipline.

**Canonical protocol:** `PROTOCOL.md` ("the instruction by which every session runs", line 1;
`README.md:15` calls it "the constitution. Every session runs by it."). `.github/workflows/`
contains only `auto-land.yml` (same merge-only role as the other two).

**Public surfaces:** `works/` → site surface `/studio` ("provisioned when the first increment
approaches", `README.md:30`); `chronicle.json` mapped onto the site's shape.

**Nightly/runtime inputs — the largest finding of this audit:** `PROTOCOL.md:198-200`, step 1
of "A session": *"Orient. `WORKBOARD.md` → curated `memory/` → newest journal entries →
`REQUESTS.md` (**always**) → **upstream diff**: what did the research wing land since your last
session (their chronicle feed / repo)? → `field-feedback/` here, if present."* This is a
**mandatory, unconditional read of Meridian's output at the start of every single session** —
exactly what `docs/spec/02-COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §4.3 names as this practice's
own documented local risk ("remaining structurally downstream of Meridian") and exactly the
"role fixation" `docs/spec/01-CONSTITUTION-AND-RESEARCH-ECOLOGY.md` §2 lists as a distortion a
shared direction would create: *"Meridian would become evidence supplier, Ensemble form
producer and Ulysses reflexive commentator."*

**Contradictions — the sharpest in this audit.** The 2026-07-15 amendment
(`PROTOCOL.md:262-278`) is appended *after* a body (`PROTOCOL.md:1-259`) that was never
rewritten and still says, in the operative rules a session actually executes:
- `PROTOCOL.md:8` — "the studio wing of the lab"; `:10` — "the lab's research wing (the
  Meridian collective, repo `field-research`) **measures**; this studio **makes it felt**."
- `PROTOCOL.md:13` — works are composed "from what the research wing has verified" (verified
  material framed as the primary input, not one option).
- `PROTOCOL.md:25` — "**Production, not commentary.** The research wing produces verified
  instruments and claims" — Ensemble's own remit defined negatively, against Meridian's.
- `PROTOCOL.md:71-74` — "**Upstream contract (binding — inherited, not optional).** The
  research wing bound its downstream consumers to standing conditions
  (`field-research/memory/downstream-commitments.md`). They bind you."
- `PROTOCOL.md:92-95, 104-121, 147, 222, 228, 243, 253` — "the research wing" used repeatedly
  as the default noun for Meridian, including "the research wing owns that shelf" (:120) and
  "anything that re-serves research-wing material above its live status" (:33-34, 253).
- `README.md:3-7` — "The **production wing** of the lab… The lab's research wing
  (field-research) measures; this studio makes it felt." `README.md:27-30` — "Sibling engines:
  field-research (**research wing**, `/field`) · irrtum-als-methode (solo artistic researcher,
  `/atelier`)."
- `SITE-API.md:9,19` — "identical to **the research wing's**" / "red-flagged the research
  wing's instrument 014."

None of this is historical — it is the live, currently-operative text a session reads every
night, sitting directly underneath a freshly adopted amendment that says the opposite:
`docs/spec/02` §4.5, "what must never be assumed," states plainly: *"Ensemble is not a design
service. 'Makes it felt' is a current proposition, not a permanent subordinate role… The
studio may originate questions and research independently."* This is why studio's migration is
the largest of the three.

**Migration — README + Protocol rewritten.**
`docs/drafts/protocol-rewrites/studio/README.md` and
`docs/drafts/protocol-rewrites/studio/PROTOCOL.md`. Every "research wing"/"studio wing"
reference above is replaced with "Meridian" (naming the sibling practice, not a department) or
removed where it asserted a hierarchy, citing `docs/spec/02` §4 throughout. Step 1 of "A
session" is rewritten so a session may open from the local `WORKBOARD.md`, its own material, an
accepted encounter, a commission or refusal on `REQUESTS.md`, a physical realisation in
progress, or a newly arisen question — checking Meridian's chronicle becomes something
available when a project calls for it, not a mandatory first step. The "Upstream contract"
section becomes "Meridian's publishing conditions — accepted where you use its material,"
citing §3.5/§9 on the Meridian side and matching field-research's own migration of
`downstream-commitments.md`. **Left completely untouched (§4.2, "local strengths," names all of
it as worth keeping):** the crew (Artist, Dramaturg, Builder, Verifier, Kritiker, Archivist),
the terminal test, material bar, takedown law, adjacency rule, kill-at-concept discipline, the
gate before a premiere, and the VERIFIED/SOURCED/IMAGINED tiers and their honesty rule.

**Residual small diff, not part of the migration commit (`SITE-API.md`, patch separately
whenever convenient):**

```diff
- ## The technical contract (identical to the research wing's — binding now, enforced at Phase B)
+ ## The technical contract (identical to Meridian's — binding now, enforced at Phase B)
```
```diff
- research wing's instrument 014 on 2026-07-11; do not relearn it.
+ Meridian's instrument 014 on 2026-07-11; do not relearn it.
```

**Apply-Plan (not executed — commands for Frank, or for Claude Code once Frank directly lifts
the boundary; `studio` was never touched, not even locally, once the block on the other two
repos made clear the relayed authorization did not hold):** in
`/Users/frankbultge/Documents/GitHub/studio`:
```bash
git checkout -b protocol-v3
mkdir -p archive/protocols
git mv README.md archive/protocols/README-founding.md
git mv PROTOCOL.md archive/protocols/PROTOCOL-founding-plus-2026-07-15-amendment.md
cp <research-ecology>/docs/drafts/protocol-rewrites/studio/README.md README.md
cp <research-ecology>/docs/drafts/protocol-rewrites/studio/PROTOCOL.md PROTOCOL.md
git add -A
git -c user.name="Ensemble" -c user.email="ensemble@studio.invalid" commit -m "..."
git push origin protocol-v3   # branch only — never main
```
Suggested commit author `Ensemble <ensemble@studio.invalid>` (matching the 2026-07-15
amendment's own author on this repo); suggested message: *"Migration to the federated
constitution (spec v2/v2.1): README and Protocol rewritten per docs/spec/02 §4 — not a design
service, not structurally downstream of Meridian. The mandatory upstream diff at session start
is removed (§4.3's own named local risk); a session may open from local material, an accepted
encounter, a commission or a question. Crew, gate, form rules and VERIFIED/SOURCED/IMAGINED
untouched. Decided by the architect, prepared 2026-07-16. Founding versions archived, nothing
deleted."*

**Deferred:** `REQUESTS.md:32,50,57,69`'s informal "the research wing" inside an
already-resolved request thread (status: resolved, 2026-07-15) — channel language, left alone.
`chronicle.json:62,112`, `memory/decisions.md:16` and several `journal/2026-07-12.md` lines
describe the founding moment ("the lab now has a **production wing**") — correctly dated
history, no action. The `SITE-API.md` diff above is offered but not bundled into the migration
commit, since it's a small technical-contract file rather than a self-description.

---

## 4. `lab-pipelines` (local checkout: `akte-pipelines`)

No persona, no branch; this section is a **decision template for Frank**.

**Current identity:** "Source code of the measurement instruments behind frankbueltge.de"
(`README.md:1-2`) — already self-described as code, not a research practice.

**Canonical protocol:** none in the practice sense; `README.md` is the only self-description
and it is already fairly accurate (see below).

**Public surfaces:** none of its own. It does not integrate back into the site; it exists so
outside readers can inspect the method.

**Nightly/runtime inputs — the key factual finding:** **this repo has no
`.github/workflows/` directory at all.** No automation writes into it. The actual pipelines
that produce daily data (`src/content/protokoll/<jahr>/<datum>.json` etc.) run as GitHub
Actions **inside the private `frankbueltge.de` repo** (confirmed against that repo's own
`CLAUDE.md`), not here. This repo is updated **manually by Frank**, irregularly: the git log
shows ordinary feature-style commits (`feat(ghost-fleet): …`, `fix(redaction): …`) mixed with
one explicit subtree import (`d85aa26`, "Add 'protokoll-render/' from commit
'721c8e0bd56cebaa70320243c7cef7fe1f066f99'" — the one place a generation-source commit hash is
actually named) and a rename commit (`00ae363`, 2026-07-05, "rename to lab-pipelines; drop
'Akte der Gegenwart' / 'artistic research' framing" — the last commit in this repo, over a week
stale relative to the private repo's continuous nightly cadence).

**What it actually holds:** only pipeline **code** (Python packages under `protokoll/`,
`consensus/`, `ghost-fleet/`, `redaction/`, `revision/`, `round-number/`, `tell/`, `pattern/`,
`gegenmessung/`) plus small reference/control **input** datasets the pipelines fetch against
(e.g. `round-number/src/round_number/data/wb-gdp.json`,
`ghost-fleet/src/ghost_fleet/data/eez_names.json`). **No daily archive JSON of the actual
published register lives in this repo** — those live only in the private site repo.

**Contradictions / gaps in the self-description:**
- `README.md:11-13` already states "This repository is a **one-way export** of the
  `pipelines/` directory of the (private) website repository" and explicitly routes daily
  snapshots to "the site repository," not to itself — already close to a well-disclosed
  generated mirror.
- But `README.md:18-19` — "Git is the archive: there is no live read from cloud services at
  request time, and **committed daily records are never edited** — corrections happen only in
  the presentation layer" — reads, out of context, as a claim about *this* repo's git history,
  when in fact no daily records live here at all (confirmed above). This sentence is true of
  the private site repo (matching that repo's own `CLAUDE.md`: "Archiv-JSONs sind unantastbar…
  Korrekturen geschehen nur an der Darstellung, Registerfassung versioniert") but is stated
  here without saying so.
- No indication anywhere in this repo of *when* it was last synced relative to the private
  repo, beyond raw commit dates.

**Decision — sovereign instrument/data repo vs. generated/exported mirror, with a
recommendation:**

Given the facts above — no workflows of its own, no daily data snapshots, manual and irregular
syncing, explicit routing of live records to the private repo — **this repo is already
functioning as a generated mirror**, and has been since the 2026-07-05 rename explicitly
dropped the "artistic research" framing in favor of "the lab's verifiable measurement
instruments." Turning it into a sovereign data repo with its own correction/supersession
mechanism would require the private site's pipelines to start *reading* from here instead of
the reverse — a real architecture change, not a documentation fix, and nothing in the current
setup asks for that: there is exactly one place data is produced (the private repo, under
GitHub Actions) and this repo's entire value proposition is letting outsiders read the method
without needing private-repo access.

**Recommendation: keep it as a generated mirror, with three small, purely textual fixes** (none
applied — Frank's call; unlike the three engines there's no persona or branch convention to
route this through, so these would just be ordinary commits whenever Frank next touches this
repo):
1. Split the ambiguous sentence at `README.md:18-19` so "committed daily records are never
   edited" is explicitly attributed to the site repo, and add: "the register rendering itself
   is versioned, so a correction is a new, dated rendering — not a silent overwrite" (matching
   the site's own `CLAUDE.md` language).
2. Add a one-line "last synced" note (commit hash + date of the private repo's `pipelines/`
   tree at export time) near the top of `README.md`.
3. Optional, bigger: a scheduled workflow *in the private repo* that re-exports `pipelines/`
   here on a cadence — turns "manually synced" into "automatically synced, still one-way."
   Offered as an option, not a recommendation to act on now.

---

## Cross-cutting notes

**Terminology note, minor:** all three engine READMEs call their own `PROTOCOL.md` "the
constitution," while this repo's `docs/constitution-amendments.md` uses "constitution" for the
shared, cross-practice document. The two don't actually conflict in content; left alone.

**What every migration deliberately did not touch (verified present, all three repos):** the
Gauntlet and Builder/Verifier independence (field-research); conjecture/source discipline and
the right to fork and stay silent (all three, now stated as protocol text per `docs/spec/02`
§2.5/§3.5/§4.5/§9, not just implied); VERIFIED/SOURCED/IMAGINED, anti-slop discipline, the
terminal test, material bar, takedown law and kill-at-concept rule (studio); open subject
choice, the Atlas/swerve method, and the Fehlerkataster line of works (irrtum-als-methode).

## Summary

| Repo | Engine repo state | Files rewritten (drafted, this repo only) | Small residual diff | Decision template |
|---|---|---|---|---|
| field-research | **untouched** (branch created+deleted locally during testing; nothing pushed) | README.md, memory/downstream-commitments.md | — | — |
| irrtum-als-methode | **untouched** (branch created+deleted locally during testing; nothing pushed) | PROTOCOL.md (v3, merges v2+amendment) | — | — |
| studio | **untouched** (never branched at all) | README.md, PROTOCOL.md | SITE-API.md (2 lines, not bundled) | — |
| lab-pipelines | untouched (no persona, no branch attempted) | — | 3 suggested fixes, not applied | 1 (keep as generated mirror) |

**All three engine repos are, right now, byte-for-byte identical to how this audit found
them** — confirmed by returning each local checkout to `main`, clean, with the temporary
`protocol-v3` branches deleted. Nothing was pushed to any remote. Every rewrite lives only in
`docs/drafts/protocol-rewrites/` in this repo, with an exact, copy-pasteable Apply-Plan per
repo above — for Frank to run himself, or to authorize directly (not through a relay) if he
wants Claude Code to run it.
