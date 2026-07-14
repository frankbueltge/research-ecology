# Work Order — Phase 3a: Domain store, loader, lenses, projection engine

**Scope:** first half of the vertical slice per
`docs/design/phase-3-vertical-slice-design.md` (READ IT FIRST — it is the binding design).
Executed in `/Users/frankbultge/Documents/GitHub/research-ecology`. No UI in this package.

## 0. Locked decisions

- **Store:** `packages/domain` exports `EncounterStore` (read interface: encounters,
  participants, events, objects, assertions, obligations, lenses, mapVersions; plus loader
  write methods behind a separate `LoaderStore` interface). Two implementations:
  1. `MemoryStore` — hydrates from `import/bundles/**` + `fixtures/enc-2026-001-…/` +
     `lenses/*.json`; the no-DB dev mode and test store;
  2. `PostgresStore` — the deployed runtime, using the `postgres` (postgres.js) driver,
     hand-typed row mappers, no ORM. (Drizzle is deferred until write paths — note this as
     a one-line amendment in `docs/adrs/0006-…`: "v1 read layer uses postgres.js with typed
     mappers; Drizzle enters with the first write feature.")
- **Loader:** `apps/loader` CLI — validates every record via `packages/protocol`, then
  idempotent upserts (`ON CONFLICT … DO NOTHING` on the Phase-1 unique keys); bundle
  import_records go to the `import_records` table; the fixture's encounter + participants
  load with editorial attribution actor `the-middle-editor` and an
  `editorial.encounter_assembled` event (open type) whose payload names the assembly basis
  (`docs/ENCOUNTER-INVENTORY.md`, pending-approval state per design §6).
- **Actor seed (locked list, from `docs/REPOSITORY-AUDIT.md` §4):** frank-bueltge (human),
  ulysses (persona), meridian (collective), ensemble (collective), fable (model_runtime),
  probe (automation), protokollfuehrung-layer2 (automation), atelier-ci / field-ci /
  studio-ci (automation), studio-integrate / field-integrate / atelier-integrate
  (automation, site side), the-middle-editor (human role held by Frank), the-middle-importer
  (automation). Names/kinds exactly so; display names may be prettier.
- **Lenses:** `lenses/{provenance-v1,ensemble-transformation-v1,meridian-position-v1}.json`
  per design §3, validating against `docs/spec/schemas/lens.schema.json`, each with honest
  `declared_exclusions` and `unknown_type_policy: "show_rupture"`.
- **Projection engine:** `packages/projections` — pure:
  `project(records, lensVersion, watermark, engineVersion) → MapVersionPayload` with:
  renderer payload per design §4 (provenance-chain / object-transformation /
  parallel-positions+obligation-matrix), `accessible_summary` (complete textual account:
  participants, what moved, what changed, what is unresolved, what this lens excludes),
  `exclusions[]`, `render_failures[]` (unknown types → rupture records), `content_hash`
  via Phase-1 canonical hashing. Deterministic: identical inputs ⇒ identical hash (test).
- **Map artifacts:** `apps/project` CLI generates map versions for the encounter × all
  three lenses and stores them via the active store; `--export <dir>` additionally writes
  the JSON artifacts (validating against `map-manifest.schema.json`).

## 1. Epistemic contract tests (executable subset of spec 09 §8 at data layer)

1. no store method returns a global edge list (the domain API has no such method — assert
   at type level with a compile test AND at runtime: assertions are only queryable per
   encounter/object/author);
2. a MapVersionPayload without lens version or exclusions field cannot be constructed
   (validator rejects);
3. participant statuses: the two participants' `local_status` remain distinct through
   store round-trip and projection;
4. `contract.published` (unknown type) appears in provenance projection as a rendered
   record, and any assertion predicate without a registered renderer form yields a
   `render_failures[]` rupture entry, never a dropped or renamed relation;
5. silence: Ulysses is no participant — projections must not emit any Ulysses-related
   record or "missing participant" signal for this encounter (absence stays absence);
6. machine suggestions: store method for accepted assertions never returns records with
   `epistemic_status: "machine_suggestion"` (seed one poisoned record in the test store to
   prove the filter);
7. source hashes + local terms round-trip store→projection byte-identically
   (spot: `DISCLOSED RECONSTRUCTION`, `holds-open-against`-style open predicates,
   `advance (outward)`);
8. corrections: loading a `record.corrected`-style event never mutates or deletes the
   original event row (append-only assertion at store level);
9. determinism: same records + lens version + watermark ⇒ identical map content_hash;
   different watermark ⇒ different map version, prior version untouched;
10. every projected object carries its `canonical_uri` (local archive link present);
11. cockpit import readiness: rhizome-edge assertions from the ulysses bundle project with
    `author_collective_id: "ulysses"` (never re-attributed);
12. fourth collective: load a synthetic minimal bundle (`collective_id: "test-fourth"`,
    one object with novel `local_object_type`) through loader + MemoryStore without any
    schema/migration change — passes end to end.

## 2. Tests & tooling

- All Phase-1/2 tests stay green. Postgres-dependent tests skip without `DATABASE_URL`
  (same pattern as migration.test.ts); MemoryStore covers the full suite DB-free.
- `npm run typecheck`, `npm test` green from root. New workspaces wired additively.

## 3. Boundaries

Engine repos read-only; `docs/spec/` untouched; no UI/framework code; no new runtime deps
beyond `postgres`; no AI-product names/credits; do not commit. Final message: build report
(files, vitest summary, per-lens map stats: included/excluded counts + content_hash
prefixes, discrepancies). If the design doc and this order conflict, STOP and report.
