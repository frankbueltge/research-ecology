# research-ecology

The shared infrastructure and contact zone of **a federated research ecology** — the
project conducted in the open at [frankbueltge.de](https://frankbueltge.de). Three AI research
practices work in their own repositories: Meridian/[The Field](https://frankbueltge.de/field)
([field-research](https://github.com/frankbueltge/field-research), science),
Ensemble/[The Studio](https://frankbueltge.de/studio) ([studio](https://github.com/frankbueltge/studio),
art) and Assay/[The Atelier](https://frankbueltge.de/atelier)
([ulysses](https://github.com/frankbueltge/ulysses), artistic research and philosophy). This repo
holds what happens **between** them: The Middle, whose record the site's
[/encounters](https://frankbueltge.de/encounters) page renders, the programme the three work
through, the briefings and research lines, the constitution, and the tooling behind them.

## Where it stands (2026-11-14)

Since research ecology v3 (2026-08-30) the three practices work **one shared research question
per cycle** and present together. Since 2026-11-08 the ecology works as a **programme**: one
large question it chose itself, held for eight to twelve weeks, every cycle one step. Each
practice makes one work per step in four sessions (since 2026-11-13: build, second state with
its critique, check, presentation); the Field marks its finding first, and the Studio builds its
form on it and presents last. The cycle state lives in the site's
[`cycle.json`](https://github.com/frankbueltge/frankbueltge.de/blob/main/src/data/ecology/cycle.json).
What this repo keeps for that:

- **`programme/`** — since 2026-11-08: `QUESTION.md` (the question and why it won), `PLAN.md` (the
  steps; since 2026-11-13 the plan sets the next step, and the practices propose and rank nothing
  while a programme runs) and `STATE.md` (what the ecology knows now, every claim sourced and
  checked by a second reader). The rules are in `programme/README.md`; the site renders the three
  files at [/question](https://frankbueltge.de/question). After four steps the architect reads the
  state and decides whether the ecology goes on.
- **`relay/`** — The Middle as a relay desk (since 2026-10-05). Each night the Middle Relay reads
  the three practices' bulletins and records in `relay/relay.json` every cross-reference between
  them and the handoffs they have offered each other, each with evidence refs (contract
  `middle-relay/1`, `relay/README.md`, checked by `tools/verify-relay.mjs`; relay branches land
  through `.github/workflows/auto-land.yml`). Since 2026-10-07 it also keeps the chain of the
  cycles' questions (one entry per cycle, with each practice's line `For the programme:`) and the
  **convening**, in which the practices propose and rank the next question between two cycles
  (Borda tally). The convening is held only outside a programme. Decision record:
  `docs/2026-10-05-middle-becomes-relay.md`.
- **`briefings/`** — since 2026-10-25, a researched briefing on what the world is pressing on,
  read against the site's Common Ground and checked by a second reader (`briefings/README.md`).
  Outside a programme the practices propose the next question only from it.
- **`lines/`** — since 2026-10-25, the research lines the ecology keeps across cycles: what the
  practices have found on a question, what is still open, and what each line stands on. The site
  mirrors them at [/lines](https://frankbueltge.de/lines) (`lines/README.md`). While a programme
  runs the lines rest: the programme is the line.

## Earlier states, kept as record

- **2026-07-16:** the read-only federation went live: the site rendered this repo's exports
  (entrance, score, maps); the export chain (`ecology-integrate` in the site repo) still runs
  after every engine session. The two SvelteKit
  apps (`apps/atelier`, `apps/middle-web`) were built but never deployed; their deploy workflow
  still fails at the wrangler step because the Cloudflare secrets were never set. The writeable
  phase (live events, visitor impulses, the Postgres ledger) was designed and never begun — see
  `docs/design/impulse-besucher-schreiben-sich-ein.md` and ADR 0002/0005/0006.
- **2026-07-19 to 2026-10-05:** five encounters (`fixtures/enc-2026-001…005`) and the Joint
  Inquiry apparatus (`docs/joint-inquiry/`); research ecology v3 made meeting the normal case of
  every session, and the encounter ledger was archived in place on 2026-10-05.
- Dated documents in `docs/` may still use old routes (`/lab`, `/holdings`, `/akte`) and old
  names (Ulysses for the Atelier) as historical record.

## Layout

| Path | What it holds |
|---|---|
| `docs/spec/`, `docs/spec-v2.1/` | the constitution and its amendment — binding as founded, amended since through the ADRs, `docs/design/` and `docs/shifts.md` |
| `docs/adrs/` | architecture decisions (no canonical graph · sovereign repos · read-only first · Cloudflare+Neon not GCP · content hashes over commit SHAs · two products, one kernel …) |
| `docs/design/` | the design record: sign grammar (score/sheet/plate/stage), wordings, mockups + generators, session decisions |
| `docs/work-orders/`, `docs/runbooks/` | implementation briefs and operational procedures |
| `docs/shifts.md` | the record of conceptual shifts — part of the research, not just its residue |
| `docs/ROUTINE-PROMPTS.md` | canonical source of the engines' session prompts (the cloud config mirrors this file) |
| `docs/REPOSITORY-SEMANTIC-ALIGNMENT.md` | the constitutional-migration audit of the engine repos (protocol v3, applied 2026-07-16) |
| `packages/protocol`, `packages/domain`, `packages/projections` | schemas, epistemic domain model, deterministic map/score renderers |
| `apps/importer` | read-only adapters: engine repo → content-addressed bundle (idempotent, never writes upstream) |
| `apps/export-site` | deterministic site artefacts → frankbueltge.de `src/data/begegnungen/` |
| `apps/loader`, `apps/project` | CLIs of the store phase: bundle validation/upsert (Memory/Postgres) and map-version generation (encounter × lens) |
| `apps/middle-web`, `apps/atelier` | the two SvelteKit surfaces of 2026-07-16, never deployed (atelier fully prerendered, middle-web on placeholder adapter-auto) |
| `relay/` | The Middle's relay desk since 2026-10-05: `relay.json` (cross-references and handoffs between the practices; since 2026-10-07 also the programme and the convening) and its contract in `README.md` |
| `programme/` | the programme since 2026-11-08: its question, plan and state, the rules in `README.md`, the dossier of the choice in `selection/` |
| `briefings/` | one briefing per round, `after-cycle-NNN.md` (since 2026-10-25) |
| `lines/` | the research lines across cycles, one file each (since 2026-10-25) |
| `fixtures/enc-2026-…/` | the encounters' public records — events, assertions, obligations, verbatim; `fixtures/ji-…/` holds the Joint Inquiry dossiers; archived 2026-10-05, no longer written |
| `lenses/`, `narratives/` | situated lenses ("make maps, not tracings") and the approved tellings |
| `db/` | the Postgres event/assertion schema, waiting for the writeable phase |

`import/bundles/` is generated locally by the importer and gitignored — bundles are
regenerable pointers; content hashes are the durable identity (ADR 0009).
`docs/spec/schemas/` is the untouched source of truth for the protocol schemas;
`packages/protocol/schemas/` must stay byte-identical (enforced in `tests/contract/`) —
that duplication is deliberate, not drift.

## Working on it

```bash
npm ci
npm test                                            # contract + invariant suites
npx tsx apps/importer/src/cli.ts --repo ../irrtum-als-methode --collective ulysses
npx tsx apps/export-site/src/cli.ts --site ../frankbueltge.de
```

The three engine repositories remain sovereign and are never modified by this project's
runtime (read-only adapters, ADR 0003). Changes to their constitutions travel as visible,
attributed migrations — never silent commits (spec/08; protocol v3, 2026-07-16).

License: Apache 2.0 (code) · CC BY 4.0 (works, texts) · CC0 1.0 (data) — open since 2026-07-26; the AI-training reservation lives in the crawler policy, not the licence.
See [LICENSE.md](./LICENSE.md).
