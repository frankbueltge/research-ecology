# Fixtures: practice profile drafts (spec-v2.1 §3, ADR 0011)

Five `EpistemicPracticeProfile` versions, one per sovereign practice:

- **Three `v2` refreshes** (`meridian.json`, `ulysses.json`, `ensemble.json`) after the
  protocol migrations to the federated constitution of 2026-07-16 (field-research →
  "Research Protocol v2", irrtum-als-methode → "Research Protocol v3", studio → the migrated
  Studio Protocol with the sharpened identity "conductor of an autonomous artist collective").
  All sourced fields re-quoted byte-exactly from the migrated `PROTOCOL.md`s; `status` is back
  to `"draft"` — the v1 activation basis (the 2026-07-15 team amendments) covered v1 only, and
  each v2 awaits its practice's own confirmation (ADR 0011 §2). The v1 versions, including
  their `local_confirmation` blocks, live in this repo's git history.
- **Two new `v1` drafts** (`frank.json`, `data-snack-plenum.json`) after the admissions of
  2026-07-17 (`docs/design/membership-proposals-2026-07-17.md`, decided by Frank, "ja gib
  frei"): Frank Bültge as the human practice, and data-snack.com with its resident collective,
  the Plenum. A third practice, datavism.org, was admitted the same morning but has no profile
  here yet — its sources (its own repo's governance statement) are not available to this
  working copy, and inventing one is not an option.

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

Two clarifications to the paragraph above, which is kept verbatim from the v1 state of this
README: (1) Ensemble's `public_name` has since been re-pinned from the regenerable bundle event
to the raw `chronicle.json` at the pinned commit (ADR 0009), see the table below. (2) The
spec-v2.1 §3 formulations exist only for the three initial practices; for the two practices
admitted 2026-07-17 the same three fields are byte-exact quotes from the Frank-approved
membership paper (whose §7.1 statements for Frank "bind as Frank's own words per that
approval") and, for the Plenum, its own `PROTOCOL.md`. One consequence is stated openly:
`frank.json`'s `accountability_questions` entry is the membership paper's role-separation rule
("One person, two hats, never silently mixed — every record says which hat was on."), which is
not phrased as a question — no question-form passage exists in the sources, and quoting beats
inventing one.

No field in any of the five profiles was left empty — real, citable material existed for all
of them.

Each profile's `authored_by` is the practice's own actor, never an editorial/Middle actor id
(`the-middle-editor` / `the-middle-importer`); `packages/domain`'s loader and both store
implementations throw `EditorialProfileAuthorViolation` otherwise (ADR 0011 §1, "The Middle
cannot publish a profile"). For the three engine collectives that is the existing actor-seed
entry (`meridian` / `ulysses` / `ensemble`); for the human practice it is the seeded human
actor `frank-bueltge`; for the diner it is `data-snack-plenum`, the practice's own collective
actor, which is **not yet in `packages/domain`'s `ACTOR_SEED`** (seeding it, like extending the
tests, is follow-up work outside this fixtures directory). `provenance._compiled_by` documents,
per profile, that the draft was redactionally compiled by the lab session from the cited quotes
and awaits the practice's own local confirmation before `status` can move to `"active"`
(ADR 0011 §2) — that confirmation is steered by Frank via each practice's own channel, never
committed here. For `frank.json` the underlying statements are already Frank-approved
(2026-07-17); the compiled profile itself still awaits his confirmation as a manifest entry.

## Provenance table

| Practice | Field | File | Commit | sha256 (content_hash) |
|---|---|---|---|---|
| meridian (v2) | public_name, self_description, typical_operations, admissible_outputs, characteristic_risks | `field-research:PROTOCOL.md` | `34685a07a0e061444d482d3fdd920507a9a541a6` | `491aead41b79b3eff48caae425ab778f1352668a1cc5c9700db9635fc7c70db2` |
| ulysses (v2) | public_name, self_description, typical_operations, admissible_outputs, characteristic_risks | `irrtum-als-methode:PROTOCOL.md` | `a11d9e00745b347b9e66380475e3ac17d4785312` | `071bb5e94a1faef948c0144864b68679a7a025862a2eef6e50811aca60d17e2e` |
| ensemble (v2) | self_description, typical_operations, admissible_outputs, characteristic_risks | `studio:PROTOCOL.md` | `6cd3a5d380b899ee59b93b02f166730e79eb0bbf` | `b024e1e93ec1efe1141a330a6d6131718d3d99ab6f996fd951af2e70781a8b1f` |
| ensemble (v2) | public_name | `studio:chronicle.json` (founding entry, collective_session=1) | `6cd3a5d380b899ee59b93b02f166730e79eb0bbf` | `d789d5bbcef4e26425362cd8ecbe941dae44a5043494b203fc210a248b9c0c94` |
| frank (v1) | public_name, self_description, orientation, primary_commitment, accountability_questions, typical_operations, admissible_outputs | `research-ecology:docs/design/membership-proposals-2026-07-17.md` | `9bfc486f933646c60eae72f93c1bd56bf922223f` | `125e0f7b998c36f20231c77f2aba2ddfced9680e15e700c2a6fb35f9d84d8f99` |
| frank (v1) | characteristic_risks | `research-ecology:docs/spec/02-COLLECTIVES-AND-LOCAL-SOVEREIGNTY.md` §5 | `93ae432f6a7a5ce644aa1bee1b913d060dcd6f35` | `a74ba08906c90b0b6ce26ce47015204e7539b807d6b58ca0c931d2b7d8e0d734` |
| data-snack-plenum (v1) | self_description, orientation, accountability_questions, typical_operations, admissible_outputs, characteristic_risks | `data-snack-plenum:PROTOCOL.md` | `a47c9f40ef12ed443bf429f114d64a7f45e0b0ea` | `30a26335f8bc5b6d544bfa6075b18e2912df46796b9a8461d977d513a982d2a2` |
| data-snack-plenum (v1) | public_name, primary_commitment | `research-ecology:docs/design/membership-proposals-2026-07-17.md` | `9bfc486f933646c60eae72f93c1bd56bf922223f` | `125e0f7b998c36f20231c77f2aba2ddfced9680e15e700c2a6fb35f9d84d8f99` |

Every whole-file hash above is freshly computed as sha256 of the file at the pinned commit
(`git show <commit>:<path> | shasum -a 256`) — the pinned commit is, in each case, the last
commit that touched the file at the time of compilation, so working tree and pin agree. The v1
practice of reusing the bundle `local_object_ref` hashes does not carry over: the migrated
protocols are newer than any ingested bundle. `orientation`/`primary_commitment`/
`accountability_questions` of the three engine collectives keep their v1 `spec_ref` provenance
(`docs/spec-v2.1/`, not a repository commit).

`apps/middle-web/tests/unit/practice-profiles.test.ts` re-derives every `PROTOCOL.md` quote's
`content_hash` from the pinned commit in the local sibling clones and checks every quoted
string is a genuine, whitespace-normalized substring of the file at that commit. **As of this
refresh the test still encodes the v1 state** (exactly three profiles, `version: 1`,
`status: "active"`, `local_confirmation` of 2026-07-15, spec-v2.1 `spec_ref` on all three
required fields, sibling clones for the three engine repos only) and must be extended for the
five-profile state: the v2 drafts, the `data-snack-plenum` sibling clone, and the two profiles
whose quotes point into this repo's own `docs/` (verifiable with plain `git show` here, no
sibling clone needed). Updating the test is outside this fixtures directory and was
deliberately not smuggled in alongside the data.
