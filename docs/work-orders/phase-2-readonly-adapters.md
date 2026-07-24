> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order — Phase 2: Read-only repository adapters → import bundles

**Scope:** spec 08 §4 executed in `/Users/frankbultge/Documents/GitHub/research-ecology`.
Builds on the committed Phase-1 kernel (`packages/protocol`). Engine repos are read-only
siblings (`../irrtum-als-methode`, `../field-research`, `../studio`).

## 0. Architectural decisions (locked)

- **Adapters read the local git clones** via `git show`/`git log`/`git rev-parse` pinned to
  one explicit commit per run (default: current HEAD of the local clone; the commit is a CLI
  argument). No network, no GitHub API.
- **Output = import bundles, not DB writes.** A bundle is a directory
  `import/bundles/<collective>@<shortsha>/` of JSON files that validate against
  `packages/protocol`: `manifest.json` (collective manifest v1), `objects.json`,
  `events.json`, `assertions.json`, `exclusions.json`, `import-records.json` (ambiguities/
  unsupported), `coverage.json` (what was read, what was skipped and why). The Postgres
  loader is a later package; keeping bundles DB-free makes imports testable and diffable.
- **Determinism:** same input commit ⇒ byte-identical bundle (stable ordering by id; ids via
  the Phase-1 `externalEventId`/hash schemes; no run timestamps inside records — the run
  metadata lives only in `coverage.json` under a `generated_at` field EXCLUDED from
  determinism comparison, or better: accept `--generated-at` as CLI input).
- **Adapters never infer relations.** Encounters are NOT assembled by adapters — encounter
  assembly is an attributed editorial act (the Phase-1 fixture is the first, curated one).
  Adapters emit only: object refs, mechanically evident events, source-authored assertions
  (see below), manifests, exclusions.
- **Path boundaries (ADR 0003, mirror of the site gates):**
  - atelier: import `PROTOCOL.md`, `README.md`, `REQUESTS.md`, `SITE-API.md`, `LICENSE.md`,
    `journal/*.md`, `works/**` (as object refs + `meta.json` metadata; file inventory, not
    parsed prose), `atlas/atlas.json`, `pulse/*.json`. Exclude `tools/`, `.github/` (record
    as exclusions with kind `editorial scope`), `memory/` (derived index, gitignored anyway).
  - field: import `PROTOCOL.md`, `FIELD.md`, `README.md`, `REQUESTS.md`, `SITE-API.md`,
    `LICENSE.md`, `chronicle.json`, `journal/*.md`, `works/**`,
    `memory/claims.md` and `memory/downstream-commitments.md` (both are published record —
    Ensemble's protocol names them as the consumable shipped record). Exclude `drafts/`,
    `WORKBOARD.md`, the rest of `memory/`, `notes/`, `tools/` — each as an explicit
    exclusion record (kinds: `local practice boundary` / `editorial scope`).
  - studio: import the doc files, `chronicle.json`, `journal/*.md`, `works/**` (premiered
    only — that is the repo's own gate). Exclude `projects/`, `memory/`, `WORKBOARD.md` as
    exclusion records. NOTE: `projects/` contents may be *referenced* by object refs when
    other imported records cite them (e.g. the killed diminishing-returns), with
    `lifecycle_status` from the source's own words ("KILLED") and validation_state
    `reference_only` — content not imported.

## 1. What becomes what (locked)

| Source | Record | Rules |
|---|---|---|
| doc files (PROTOCOL/README/REQUESTS/SITE-API/FIELD/claims/downstream-commitments/LICENSE) | `local_object_refs` | `local_object_type` open strings like `"protocol-document"`, `"inbox-channel"`, `"claims-ledger"`, `"downstream-contract"`, `"field-map"`; content_hash over raw bytes at pinned commit; canonical_uri = pinned GitHub blob URL |
| `works/<slug>/` | one `local_object_ref` per work | type from the work's own `meta.json` `medium` verbatim (fallback `"work"` + import_record noting the gap); lifecycle `"published (works/)"` — the location IS the source's own gate semantics; include per-file inventory + hashes in `source_metadata` |
| `journal/*.md` | `local_object_refs` (type `"session-journal"`) | one per file; session numbers parsed from headings go to `source_metadata.sessions[]`; parsing failures → import_records, never guesses |
| `chronicle.json` entries (field, studio) | `events` | event_type `chronicle.entry` (mechanical), payload = entry verbatim, occurred_at = entry date (midnight UTC + import_record noting date-only precision), issuer = the collective; external id per Phase-1 scheme with source_uri + a stable per-entry fragment (`#session-<n>`) |
| `pulse/vital-signs.json` history (atelier) | `assertions` | author ulysses; predicate `self-assessment.closure`; object_literal = the entry verbatim; `epistemic_status: "conjecture"` (the source says CONJECTURE), `local_epistemic_status` = the closure_note's own first word; one assertion per history entry |
| `pulse/rhizome.json` edges (atelier) | `assertions` | author ulysses; predicate = the edge's exact `kind` string (including undocumented `grounds`/`continues`/`complement`); subject/object = node ids resolved to object refs where the node is a work, else object_literal with the node record verbatim; epistemic_status `interpretation` |
| `atlas/atlas.json` | ONE `local_object_ref` for the whole atlas (type `"source-atlas"`) | per-entry import is out of v1 scope — record this as an exclusion (kind `computational limit`, reason "per-entry atlas import deferred") |
| protocol docs at pinned commit | `manifest.json` (collective_versions v1) | name/surface name from the repos' own words (Ulysses/atelier, Meridian/field, Ensemble/studio); `description` = verbatim sentence(s) from the repo README (quoted, no paraphrase); protocol_url/repository_url/public_url; `responsible_publisher: "Frank Bültge"`; `status: "active"`; omit `accepted_encounter_types` (nothing declared yet); `inbox` = `{mode: "repository_file", url: <REQUESTS.md blob URL>}` — it is the lived channel; version 1; content_hash per Phase-1 rules |

## 2. Package layout

```
packages/adapters/            one package, submodules generic-git / atelier / field / studio
  src/generic-git.ts          commit pinning, file reads at commit, blob URL + hash helpers
  src/atelier.ts / field.ts / studio.ts
  src/bundle.ts               bundle assembly, stable ordering, validation via packages/protocol
apps/importer/                CLI: npx tsx apps/importer/src/cli.ts --repo ../field-research \
                              --collective meridian --commit <sha|HEAD> --out import/bundles \
                              [--generated-at <iso>]
tests/contract/adapters.test.ts (+ per-adapter tests)
```
`import/` goes into `.gitignore` (bundles are generated artifacts; the durable Git export is
a later, deliberate deployment step).

## 3. Tests (acceptance = spec 08 Phase 2 criteria, executable)

1. running an adapter twice on the same commit yields byte-identical bundles (determinism /
   "repeated import creates no duplicate events");
2. every record validates against `packages/protocol` schemas and carries source_uri,
   source_commit, content_hash, importer_version;
3. the three undocumented rhizome kinds appear verbatim as assertion predicates
   (no normalisation to "related");
4. exclusions exist for `drafts/`, `projects/`, `WORKBOARD.md`, `memory/` internals, atlas
   per-entry deferral;
5. closure assertions carry `epistemic_status: "conjecture"`;
6. chronicle `move` values survive verbatim in payloads (incl. `"advance (outward)"`);
7. no adapter output contains an `encounter_id` (adapters do not assemble encounters);
8. coverage.json lists every top-level path of the repo as imported / excluded / unsupported
   — nothing silently absent;
9. run against the CURRENT HEADs of all three local clones: `npm test` green from repo root.

## 4. Boundaries

Read-only toward the engine repos; no modifications under `docs/spec/`; no DB code; no
framework code; no AI-product names/credits; do not commit — leave the tree for review.
If a repo file resists mechanical parsing, emit an import_record and move on; never guess.
Keep dependencies: existing ones only (no new runtime deps beyond node builtins; execa-style
child_process wrappers hand-rolled).
