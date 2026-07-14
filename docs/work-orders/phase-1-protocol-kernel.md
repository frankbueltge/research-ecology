# Work Order — Phase 1: Protocol kernel, fixtures, migration, contract tests

**Scope:** spec 08 §3 (Phase 1) executed inside `/Users/frankbultge/Documents/GitHub/research-ecology`.
**Locked contracts below are not up for reinterpretation; anything not specified follows
`docs/spec/` and the ADRs.** No engine repository is modified. No network access needed
(local clones of the three engine repos are siblings of this repo).

## 1. Tooling (locked)

- npm workspaces monorepo, TypeScript strict, Node 22, Vitest, Ajv (draft 2020-12 mode).
- Layout (spec 06 §3, Phase-1 subset):

```
package.json                 (workspaces: packages/*)
tsconfig.base.json
packages/protocol/           schemas, types, validators, canonical JSON + hashing
db/migrations/0001_initial.sql
fixtures/enc-2026-001-calibration-gap-travels/
tests/contract/              (vitest project; imports packages/protocol)
LICENSE.md                   (PolyForm NC 1.0.0 code + CC BY-NC-SA 4.0 works — copy the
                              dual-license structure from ../studio/LICENSE.md, same
                              Required Notice "Copyright Frank Bültge (https://frankbueltge.de)")
.gitignore                   (node_modules, dist, coverage, .DS_Store)
```

## 2. packages/protocol (locked contracts)

1. **Schemas:** copy the eight `docs/spec/schemas/*.schema.json` into
   `packages/protocol/schemas/` as the single source of truth; compile with Ajv at module
   load; export typed validate functions per schema. Write TS interfaces mirroring each
   schema by hand (no codegen dependency), exported from the package root.
2. **Canonical JSON (locked):** `canonicalJson(value)` — UTF-8, object keys sorted
   lexicographically (code-unit order), no insignificant whitespace, arrays in given order,
   numbers via JSON.stringify defaults, reject `undefined`/`NaN`/`Infinity`/functions with a
   thrown error. Recursive.
3. **Hashing (locked):** `contentHash(record) = "sha256:" + hex(sha256(canonicalJson(record
   minus fields content_hash and signature)))`. Use node:crypto.
4. **Idempotency (locked):** `externalEventId(sourceUri, contentHash, eventType) =
   sha256hex(sourceUri + "\n" + contentHash + "\n" + eventType)`.
5. **Validator rules beyond schema (locked):**
   - an assertion with `epistemic_status: "machine_suggestion"` is REJECTED by the assertion
     validator (suggestions live in their own store; spec 05 §3.17, test 09 §8);
   - event `event_type` must match `^[a-z0-9_.-]+$` but is otherwise an OPEN string — the
     validator must accept unknown types when the envelope is valid, and expose
     `isCoreEventType(type)` merely as an informational check (core list from spec 03 §3);
   - visibility defaults to `public` when absent.

## 3. db/migrations/0001_initial.sql

Copy `docs/spec/db/0001_initial.sql`, then apply ADR 0002 amendments:

- add table `import_records` (id uuid pk default gen_random_uuid(), source_uri text not null,
  source_commit text, adapter text not null, adapter_version text not null, state text not
  null default 'ambiguous' — states: ambiguous | unsupported | rejected | superseded —,
  reason text not null, raw_excerpt jsonb, content_hash text, imported_at timestamptz not
  null default now());
- comment on the events table documenting the externalEventId scheme;
- no other schema edits.

Add `db/README.md` (how to apply with psql; DATABASE_URL convention) and a
`tests/contract/migration.test.ts` that SKIPS unless `DATABASE_URL` is set, else applies the
migration to a scratch schema and asserts the tables exist.

## 4. Fixture: the real encounter (the heart of this work order)

Encode `enc-2026-001-calibration-gap-travels` from
`docs/ENCOUNTER-INVENTORY.md` (Candidate 1 — read it first) as schema-valid JSON under
`fixtures/enc-2026-001-calibration-gap-travels/`:

- `encounter.json` — participants meridian (source; local_status "correction applied;
  register revised; obligations active") and ensemble (receiver; local_status "premiered;
  live-status obligation active"); NO shared resolution field with a value — unresolved.
- `objects.json` — local object refs for: instrument 001 (collective meridian,
  local_object_type EXACTLY as the source presents it, e.g. from its meta.json `medium`
  plus WORKBOARD listing — do not invent a type; if none exists use the source's own words
  and note the derivation in `source_metadata`), claims ledger row 12, downstream
  commitments doc, Native Speaker work. **content_hash of each object = sha256 over the raw
  bytes of the file at the pinned commit**, computed via `git show <commit>:<path> | sha256`
  in the local sibling clones (`../field-research`, `../studio`). canonical_uri = pinned
  GitHub blob URL (`https://github.com/frankbueltge/<repo>/blob/<commit>/<path>`).
- `events.json` — the seven events tabulated in ENCOUNTER-INVENTORY (standing contract →
  admission+obligations → correction report → translation-loss declaration → correction
  applied → derivative premiered → publication via site gate), with:
  - event types: use core vocabulary where it fits (`object.admitted`,
    `obligation.accepted`, `correction.issued`, `translation.loss_declared`,
    `correction.applied`, `derivative.published`); for the standing contract use the OPEN
    type `contract.published` (deliberately non-core — it must survive validation and
    round-trip as an unknown type);
  - issuer collective + actor per side; the correction-report event's payload records the
    delegation ("delivered via the studio's conductor, explicitly delegated — Frank Bültge
    as transport") — apparatus visibility;
  - occurred_at from the commit timestamps (convert CEST→UTC correctly);
  - source_uri = pinned GitHub blob/commit URLs; source_commit = the commit;
  - payload quotes VERBATIM sentences from the repos (contract clauses, boundary-case
    rationale, claims-row session-33 addition) — no paraphrase, no invention;
  - content_hash per §2.3; external ids per §2.4.
- `obligations.json` — the accepted conditions as obligation records (status active),
  evidence = the relevant event ids.
- `assertions.json` — at minimum: (a) Ensemble's transformation claim for the meter
  (preserve local label `DISCLOSED RECONSTRUCTION` in `local_epistemic_status`), (b)
  Ensemble's boundary-case position (predicate open string `declines-to-carry`, rationale
  verbatim "A work about machine judgment may not borrow stakes the record does not
  attribute to the machine"), (c) Meridian's live framing from claims row 12 ("a
  detector-in-the-accusation observation, not court-attributed detector harm"), each with
  author, epistemic_status `interpretation`, evidence refs. These are IMPORTED positions —
  every word of rationale must exist in the source repos.
- `README.md` — provenance table (file → repo/commit → hash) and the sentence: "This
  fixture encodes a real, audited encounter; nothing in it is illustrative."

Also KEEP `docs/spec/fixtures/example-encounter.json` untouched where it is (schema example
only).

## 5. tests/contract (acceptance = spec 08 Phase 1 criteria, executable)

1. every schema example in `docs/spec/schemas` and every fixture record validates;
2. `contract.published` (unknown type) validates and survives
   serialise→parse→canonicalise→hash round-trip unchanged;
3. source-local type strings survive round-trip byte-identically (incl.
   `DISCLOSED RECONSTRUCTION`, `UNSETTLED-but-informed` if present);
4. an assertion with `epistemic_status: "machine_suggestion"` fails validation;
5. participant-specific statuses in `encounter.json` are distinct and preserved;
6. fixture completeness: source hash, ≥1 load-bearing caveat, two incompatible authored
   positions, ≥1 active obligation, no global resolution;
7. canonicalJson determinism (key order independence; rejection of undefined/NaN);
   contentHash stability against a golden value committed in the test;
8. externalEventId determinism.

`npm test` green from the repo root. Do not add CI workflows yet.

## 6. Boundaries

- Read-only toward `../field-research`, `../studio`, `../irrtum-als-methode`.
- No app code, no adapters, no DB client code beyond the optional migration test.
- No AI-product names or credits anywhere (code comments, package metadata, commits —
  you do not commit; leave the working tree for review).
- If a verbatim quote or commit cannot be found where this order claims, STOP on that item
  and report the discrepancy instead of inventing a substitute.
