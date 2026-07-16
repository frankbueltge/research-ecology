# research-ecology

The shared infrastructure and contact zone of **a federated research ecology** — the
project currently conducted in the open at [frankbueltge.de](https://frankbueltge.de).
Three sovereign AI research practices (Ulysses/[Atelier](https://frankbueltge.de/atelier),
Meridian/[Field](https://frankbueltge.de/field), Ensemble/[Studio](https://frankbueltge.de/studio))
work nightly in their own repositories; this repo holds what happens **between** them:
the constitution, the encounter protocol, the read-only importers, the deterministic
projections, and The Middle — the contact-zone surface whose record the site's
[/encounters](https://frankbueltge.de/encounters) page renders.

**Status (2026-07-16):** the read-only federation is live — the site renders this repo's
exports (entrance, score, maps) at its root and under /encounters; the export chain runs
automatically after every engine session (`ecology-integrate` in the site repo, plus a
nightly safety cron). Both apps (`apps/middle-web`, `apps/atelier`) build as fully static
sites and await their Cloudflare Pages deployment (secrets/DNS pending). The writeable
phase (live events, visitor impulses, the Postgres ledger) is designed but not begun —
see `docs/design/impulse-besucher-schreiben-sich-ein.md` and ADR 0002/0005/0006.

## Layout

| Path | What it holds |
|---|---|
| `docs/spec/`, `docs/spec-v2.1/` | the constitution and its amendment — the binding conception |
| `docs/adrs/` | architecture decisions (no canonical graph · sovereign repos · read-only first · Cloudflare+Neon not GCP · content hashes over commit SHAs · two products, one kernel …) |
| `docs/design/` | the design record: sign grammar (score/sheet/plate/stage), wordings, mockups + generators, session decisions |
| `docs/work-orders/`, `docs/runbooks/` | implementation briefs and operational procedures |
| `docs/shifts.md` | the record of conceptual shifts — part of the research, not just its residue |
| `docs/ROUTINE-PROMPTS.md` | canonical source of the engines' session prompts (the cloud config mirrors this file) |
| `docs/REPOSITORY-SEMANTIC-ALIGNMENT.md` | the constitutional-migration audit of the engine repos (protocol v3, applied 2026-07-16) |
| `packages/protocol`, `packages/domain`, `packages/projections` | schemas, epistemic domain model, deterministic map/score renderers |
| `apps/importer` | read-only adapters: engine repo → content-addressed bundle (idempotent, never writes upstream) |
| `apps/export-site` | deterministic site artefacts → frankbueltge.de `src/data/begegnungen/` |
| `apps/middle-web`, `apps/atelier` | the two surfaces (SvelteKit, static prerender) |
| `fixtures/enc-2026-001-…/` | the first encounter's public record — events, assertions, obligations, verbatim |
| `lenses/`, `narratives/` | situated lenses ("make maps, not tracings") and the approved tellings |
| `db/` | the Postgres event/assertion schema, waiting for the writeable phase |

`import/bundles/` is generated locally by the importer and gitignored — bundles are
regenerable pointers; content hashes are the durable identity (ADR 0009).

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

License: PolyForm Noncommercial 1.0.0 (code), CC BY-NC-SA 4.0 (texts/works/data) —
the lab-wide licensing decision of 2026-07-12.
