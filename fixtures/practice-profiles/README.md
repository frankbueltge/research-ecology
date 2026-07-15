# Fixtures: practice profile drafts (spec-v2.1 §3, ADR 0011)

Three `v1`, `status: "draft"` `EpistemicPracticeProfile` versions, one per sovereign practice
(`meridian.json`, `ulysses.json`, `ensemble.json`) — work order `phase-b-profiles.md` §4.

**Nothing here is invented.** `orientation`, `primary_commitment` and `accountability_questions`
are copied verbatim from `docs/spec-v2.1/01-FEDERATED-ECOLOGY-V2.1-IMPLEMENTATION-DELTA.md` §3
(the three initial formulations are Frank-authored, per ADR 0011 §2 — their `provenance` entries
name that document as the source, `spec_ref`, rather than a repository quote). Every other
sourced field (`public_name`, `self_description`, `typical_operations`, `admissible_outputs`,
`characteristic_risks`, `protocol_ref`) is a byte-exact quote from the practice's own
`PROTOCOL.md` (or, for Ensemble's `public_name`, an already-ingested `chronicle.entry` event
sitting in `import/bundles/ensemble@2243fc0/events.json`) — never paraphrased. Markdown wraps a
quote spans in the source are joined with a single space (the same soft-wrap convention
`packages/adapters/src/common.ts`'s `extractReadmeDescription` already uses for manifest
descriptions); nothing else about the text is altered, markdown emphasis markers included.

No field in any of the three profiles was left empty — real, citable material existed for all
of them.

Each profile's `authored_by` is the practice's own synthetic actor (`meridian` / `ulysses` /
`ensemble`, the existing actor-seed entries) — never an editorial/Middle actor id
(`the-middle-editor` / `the-middle-importer`); `packages/domain`'s loader and both store
implementations throw `EditorialProfileAuthorViolation` otherwise (ADR 0011 §1, "The Middle
cannot publish a profile"). `provenance._compiled_by` documents, per profile, that the draft was
redactionally compiled by the lab session from the cited quotes and awaits the practice's own
local confirmation before `status` can move to `"active"` (ADR 0011 §2) — that confirmation is
steered by Frank via each practice's own channel, never committed here.

## Provenance table

| Collective | Field | File | Commit | sha256 (content_hash) |
|---|---|---|---|---|
| meridian | public_name, self_description, typical_operations, admissible_outputs, characteristic_risks | `field-research:PROTOCOL.md` | `32e2db56645e223f4f1249e52dbdf052763574f3` | `3982501d765a2a72d5b2ab6c880e4c802f9a4161838467a53a73a0591d201239` |
| ulysses | public_name, self_description, typical_operations, admissible_outputs, characteristic_risks | `irrtum-als-methode:PROTOCOL.md` | `c413eaec163b58d337ae74881fa4157b60db6f1a` | `5db82a63ccefc1aa626c769a5a4939cebe1112b0ea8db90843ebc31f8cac4240` |
| ensemble | self_description, typical_operations, admissible_outputs, characteristic_risks | `studio:PROTOCOL.md` | `2243fc0839d4c49781b2dda0d6e24d61583a7909` | `47a5b5563578561a354ec8650ac5ecd7060aef6d7e197c11e68012fec23e0eac` |
| ensemble | public_name | `studio:chronicle.json#session-1` (already ingested: `import/bundles/ensemble@2243fc0/events.json`) | `2243fc0839d4c49781b2dda0d6e24d61583a7909` | `bca735e5908c9838793d7811ca3ad1d4be51c4f6001f4566c86188b4e4a1f979` (the ingested event's own `content_hash`) |

The three whole-file `PROTOCOL.md` hashes above are identical to the `protocol-document`
`local_object_ref` already present in each collective's bundle (`import/bundles/<collective>@
<shortSha>/objects.json`, `local_object_id: "protocol"`) — reused, not recomputed, so a single
number is the source of truth for "this is genuinely `PROTOCOL.md` at this commit" everywhere
it is cited across this repo. `orientation`/`primary_commitment`/`accountability_questions` do
not appear in this table: their source is `docs/spec-v2.1/`, not a repository commit (see
`provenance.spec_ref` in each JSON file).

`apps/middle-web/tests/unit/practice-profiles.test.ts` re-derives every `PROTOCOL.md` quote's
`content_hash` from the pinned commit in the local sibling clones `../../field-research`,
`../../irrtum-als-methode`, `../../studio` (skipped gracefully if a sibling clone is not present
on the machine running the test) and checks every quoted string is a genuine, whitespace-
normalized substring of the file at that commit — the same pattern as the beat-quote
verification in `narrative.test.ts` (work order phase-3d §4), extended to reach into the engine
repos themselves rather than only this repo's own fixture JSON.
