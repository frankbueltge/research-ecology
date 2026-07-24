> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order — Phase 3b: The Middle, public read-only app (SvelteKit)

**Scope:** second half of the vertical slice per
`docs/design/phase-3-vertical-slice-design.md` (BINDING — especially §2 routes, §4
renderers, §5 visual direction, §6 editorial honesty). Executed in
`/Users/frankbultge/Documents/GitHub/research-ecology`. Local dev only — NO deployment
config beyond `adapter-auto` placeholder; deployment is a later, human-approved step.

## 0. Locked decisions

- `apps/middle-web/`: SvelteKit 2, Svelte 5, TypeScript strict, `@sveltejs/adapter-auto`.
  Data access exclusively through `packages/domain`'s `EncounterStore`; dev mode uses
  MemoryStore hydrated at server start (bundles + fixture + lenses + generated map
  versions via `packages/projections`). No direct file reads in routes.
- **Routes exactly per design §2**, including `/de/…` chrome mirror. `/` = 302 to the
  current encounter (the honest single-encounter state).
- **SSR-first:** every record page renders complete, readable HTML without JavaScript
  (test this). Client islands only for: compare-view position switcher, event-trace
  expand/collapse, cross-highlighting. Progressive enhancement, no client-side data
  fetching for core records.
- **Renderers** (Svelte components over the 3a payloads): provenance-chain,
  object-transformation (the Minnesota omission as a visible negative band with Ensemble's
  verbatim rationale), parallel-positions (register before/after with struck-not-erased
  correction overlay), obligation-matrix, text-montage (assertion detail), rupture block
  (unknown types — style exists and is demonstrated on the `contract.published` event's
  type chip: core types get plain chips, non-core types get the "local type" treatment
  with a "not a core protocol type" note).
- **Visual system per design §5** — implement as CSS custom properties + a small
  `packages/ui` (or app-local `src/lib/ui`) of primitives: RecordFrame, AuthoredStroke,
  ObligationClause, CorrectionOverlay, UnresolvedRule, DoorwayLink, LensManifestPanel,
  StatusChip (text-only), PendingApprovalBadge. Fonts: Literata + IBM Plex Mono,
  **self-hosted** (download once into `apps/middle-web/static/fonts/`, subset not required
  in v1), `font-display: swap`. Light+dark per `prefers-color-scheme` + manual toggle
  (persisted, no flash). NO Tailwind — hand-written CSS with custom properties (the design
  is form-specific; utility classes would fight it).
- **Every map frame** carries the lens-manifest summary panel (author, basis, selection,
  exclusions incl. synthesized ones, unknown types, engine version, map version + hash,
  watermark) — collapsible, open by default on `/lenses/[id]`, one keypress (`m`) elsewhere.
- **Editorial honesty (§6):** homepage pin block with pending-approval state; proposition
  DE/EN with attribution "draft — pending Frank Bültge's approval"; `/apparatus` implements
  design §6 content including the actor table, the `the-middle-editorial` sentinel
  explanation, the no-analytics statement, and current limitations list.
- **`/archive`:** ADR 0008 — links OUT to the live cockpit (both locales) with the dated
  data-snapshot table (which pulse snapshots were imported, at which commits), explicitly
  labeled "the cockpit is live and younger than this archive entry".
- **i18n:** chrome strings via a minimal typed dictionary module (`de`/`en`), URL-prefix
  routing (`/de/...`); records stay source-language with `lang="en"` attributes inside
  `lang="de"` pages where applicable. No i18n framework dependency.
- **Security headers** (even in dev config, as hooks): strict CSP (self only, no inline
  scripts beyond SvelteKit's hashed ones, no external hosts), X-Content-Type-Options,
  Referrer-Policy. All source-repo content rendered as TEXT (no raw HTML injection of
  imported material — escape everything; markdown NOT rendered in v1, shown as plain text
  excerpts with links to the source blob).

## 1. Accessibility & journey tests (Playwright + vitest)

- axe-core pass on every route (no serious/critical violations);
- keyboard-only journey: home → encounter → open lens manifest → compare → assertion →
  object → doorway link (focus visible throughout);
- no-JS journey: encounter page + map version page render complete records with JS disabled;
- reduced-motion: no transitions when `prefers-reduced-motion`;
- mobile (390×844): event cards stack, position switcher sticky, no horizontal scroll;
- print stylesheet: map version page prints with citation block (URL + hash + watermark);
- screenshot tests: one per renderer, light + dark.
- spec 04 §13 acceptance items 1–12 mapped to at least one automated check each where
  machine-checkable (1,3,4,5,6,7,9,10,12) and a manual-review checklist file for the rest.

## 2. Epistemic guards at the HTTP layer

- no route or API returns a global edge list (there is no `/api/graph`; test asserts 404);
- map version URLs are immutable: same URL always serves identical content (hash in page,
  test compares two fetches);
- `/encounters/[id]` shows participant statuses side by side, never a merged status;
- silence rendering: the encounter page contains NO Ulysses mention outside the editorial
  non-participation note (test).

## 3. Boundaries

Engine repos read-only; `docs/spec/` untouched; no deployment configs/secrets; no analytics;
no external requests at runtime (fonts self-hosted; CSP enforces); no AI-product
names/credits; do not commit. All existing tests stay green; `npm test`, `npm run typecheck`,
and `npm run -w apps/middle-web build` green from root. Playwright browsers: use
`npx playwright install chromium` if needed.

Final message: build report — file tree summary, test summaries (vitest + Playwright),
route inventory with SSR/no-JS status, screenshot file paths, and discrepancies
(STOP-and-report on design conflicts). Raw data, not prose.
