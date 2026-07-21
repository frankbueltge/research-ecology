# Fixture: `enc-2026-001-calibration-gap-travels`

This fixture encodes a real, audited encounter; nothing in it is illustrative.

It is the vertical-slice encoding of Candidate 1 in
`docs/ENCOUNTER-INVENTORY.md`: Meridian's Instrument 001 ("Calibration Certificate") travels
under a standing, self-issued contract into Ensemble's "Native Speaker"; the receiver's own
first-hand research finds a load-bearing gap in the source's harm register and reports it
upstream via Frank Bültge as delegated conductor; Meridian re-verifies and revises through a
full gauntlet re-run the same day; Ensemble had, independently, already declined to carry the
same court case as detector-attributed harm on its own work. Two incompatible local framings of
the *Yang v. University of Minnesota* case remain live in both archives at once — nothing here
is resolved into a single shared status.

Every quote in `events.json` / `assertions.json` is copied verbatim from the source repositories
at the pinned commits below, verified with `git show <commit>:<path>`. Every `content_hash` in
`objects.json` is `sha256` over the raw bytes of the named file at the pinned commit, computed
with `git show <commit>:<path> | shasum -a 256` in the local sibling clones `../field-research`
and `../studio` (plus one confirmation read from `../../frankbueltge.de`, the site repo that
receives the publication-gate event — read-only, not one of the three sovereign engine
repositories, and not modified by this work order).

## Provenance table

| # | File (repo:path) | Commit | Timestamp (author, local) | sha256 |
|---|---|---|---|---|
| 1 | `field-research:works/2026-07-01-calibration-gap/data.json` | `ae89e09e99d052627aa1b3f72fe3039da1141345` | 2026-07-12 18:10:24 +0200 | `af8557a6bd6c1047ddff50220ec7e60deb1b971dde4b63790b0887320621a36c` |
| 2 | `field-research:works/2026-07-01-calibration-gap/meta.json` | `ae89e09e99d052627aa1b3f72fe3039da1141345` | 2026-07-12 18:10:24 +0200 | `bce54eba1c8699aa4feaa91902377821ce1bc3020be2176d33d2cf08418836e3` |
| 3 | `field-research:memory/claims.md` (row/line 12) | `ae89e09e99d052627aa1b3f72fe3039da1141345` | 2026-07-12 18:10:24 +0200 | `9296dd9abd014238746ccde4c5b6db1e3b1d24da186b87b8194569889e8f4274` |
| 4 | `field-research:memory/downstream-commitments.md` | `4eb3b165b9403b90ed09ce95db4ee4b47c81cb0f` | 2026-07-11 13:51:52 +0200 | `d28f9604812fbe7edaebec0e19d4986927aad8cfdd0df43f3ced823c197db96a` |
| 5 | `field-research:journal/2026-07-10.md` (line 761, governing-principle quote, same session, one day earlier commit) | `4214cd177ef174c5c2694a58a998bd04df79ae23` | 2026-07-11 01:12:19 +0200 | `4b416a66a7428b774b67cbcaa418de3b00b362389d4277574700201628b45328` |
| 6 | `field-research:REQUESTS.md` (line 410ff, correction report) | `5dcdb17b4e5d7e9a287c3f2d593b97ab71564941` | 2026-07-12 16:44:51 +0200 | `2104873a50771c98f2e5e014983cef55960d13700af73242457918d73370373d` |
| 7 | `studio:projects/native-speaker/data.json` (increment 1, contract text) | `3be83b4c4e41f73203da6ef3edee2e4c2c8722ad` | 2026-07-12 15:48:36 +0200 | `9db510e1ec7c1d630e2c755a600321b80181a1599c38137a9812a32b3c54b1aa` |
| 8 | `studio:projects/native-speaker/data.json` (increment, `case_minnesota_boundary`) | `028cf33f7b4f7969d44aa21bc85764f5ef9a019f` | 2026-07-12 17:05:33 +0200 | `ba0f8692794d3a19768d9f5667806437d6a4d2268ec72172ab9c2bac66157f05` |
| 9 | `studio:works/2026-07-13-native-speaker/data.json` | `f6a9d8fc927393b89adc20139e96bdf48a8ce46e` | 2026-07-13 00:20:55 +0200 | `e2123e53175e4b64358b94348103e9d6fbb3f2550e5d8bd4ba97db206770160b` |
| 10 | `studio:works/2026-07-13-native-speaker/meta.json` | `f6a9d8fc927393b89adc20139e96bdf48a8ce46e` | 2026-07-13 00:20:55 +0200 | `7a1cd28dafa9c83a0a1c5d8d005dc1163357991850ea9dcc91f92c30bd8c8b13` |
| 11 | `frankbueltge.de:src/content/studio/works/2026-07-13-native-speaker/meta.json` (site-gate mirror; byte-identical to #10) | `a72d3fc754d84e10e73c441230bd577ed377fc57` | 2026-07-12 22:22:01 +0000 (UTC; bot commit) | `7a1cd28dafa9c83a0a1c5d8d005dc1163357991850ea9dcc91f92c30bd8c8b13` |

All timestamps above are the git author timestamps as returned by `git show -s --format='%H %ci'`;
`events.json`'s `occurred_at` fields are the same instants converted to UTC (CEST is UTC+2 in
July 2026; the frankbueltge.de bot commit is already UTC).

## Commit chronology used for `events.json` (UTC)

| Event | UTC `occurred_at` | Source commit |
|---|---|---|
| `contract.published` (standing contract) | `2026-07-11T11:51:52Z` | field-research `4eb3b165` |
| `object.admitted` (+ obligations accepted, folded into the same event) | `2026-07-12T13:48:36Z` | studio `3be83b4c` |
| `correction.issued` (delivered via Frank as delegated conductor) | `2026-07-12T14:44:51Z` | field-research `5dcdb17b` |
| `translation.loss_declared` (Minnesota boundary case) | `2026-07-12T15:05:33Z` | studio `028cf33f` |
| `correction.applied` (session-33 gauntlet re-run) | `2026-07-12T16:10:24Z` | field-research `ae89e09e` |
| `derivative.published` (studio-internal graduation to `works/`) | `2026-07-12T22:20:55Z` | studio `f6a9d8fc` |
| `derivative.published` (site-gate republication onto frankbueltge.de) | `2026-07-12T22:22:01Z` | frankbueltge.de `a72d3fc7` |

Two events share the type `derivative.published`: the studio's own graduation into its sovereign
`works/` archive, and the separate, later (by ~66 seconds) republication onto frankbueltge.de via
`studio-integrate.yml` — a distinct apparatus act at a different layer, not a duplicate of the
same fact (`docs/ENCOUNTER-INVENTORY.md` lists both as separate table rows). `obligation.accepted`
does not appear as its own event type in this encoding: the acceptance is evidenced structurally
through `obligations.json[*].source_event_id`, which points at the `object.admitted` event —
building Native Speaker on the verified spine of instrument 001 *was* the act of accepting the
standing contract's conditions, not a separate later act.

## Known, disclosed discrepancy (not a blocking gap)

`memory/downstream-commitments.md` attributes its governing principle and five conditions to
"session 22, 2026-07-10", but the file itself was first committed the *following* day, during
session 24's consolidation (`4eb3b165`, 2026-07-11 13:51:52 CEST — the session-22 date only holds
once you also allow that entries get written up the next calendar day). The identical
governing-principle sentence already appears, verbatim, the same night as the stated session
(`journal/2026-07-10.md`, commit `4214cd177ef174c5c2694a58a998bd04df79ae23`, 2026-07-11 01:12:19
CEST = 2026-07-10T23:12:19Z UTC — the only commit whose UTC date actually falls on 2026-07-10).
This fixture pins the `contract.published` event and the `downstream-commitments-doc` object to
the *session-24* commit (`4eb3b165`), since that is the first point where the standing conditions
became a durable, citable document rather than journal prose; the journal commit is cited
separately in `objects.json[2].source_metadata.session_label_caveat` and in row 5 of the
provenance table above. Disclosed here per the work order's integrity rule, rather than silently
adjusted to make the date match.

## Update 2026-07-21 (Middle Scribe, append-only)

Meridian revised Instrument 001's harm-register entry for the Minnesota case again, unrelated
to this encounter's original bilateral correction (a same-day legal-hygiene pass, commit
message "Personennamen aus AI-Detection-Recherche redigiert (Rechtshygiene)",
`field-research` commit `ad335729`, 2026-07-21 10:02:20 +0200): the row's "outcome" text drops
the unsupported escalation "career and residency ended", nothing else in the row. The
appellate caveat that is this encounter's central finding is untouched. One new event
(`evt-enc2026001-10-object-transformed-2`) was appended; no existing event, object, obligation
or assertion was edited or deleted. The same field-research commit made companion edits
outside this encounter's tracked objects (`journal/2026-07-01.md`, `FIELD.md`) — out of scope
here, not transcribed.

While auditing this update the verifier was found already failing one pre-existing, unrelated
line (`events.json[2]/payload/quote_appellate_finding`): an earlier direct edit by Frank
(`research-ecology` commit `cd0af83`, legal hygiene) redacted "Yang's" to "[the student]'s" in
that event's own quote, which now legitimately no longer matches the byte-exact historical
source, but the corresponding `QUOTE-MANIFEST.tsv` line was never commented out to match. Fixed
by commenting out that one manifest line with a LEGACY-NOTE, mirroring the file's own existing
precedent for `quote_context` immediately below it — no event, object, obligation or assertion
touched.

## Fixture contents

| File | Contents |
|---|---|
| `encounter.json` | The encounter, its two participants (Meridian/source, Ensemble/receiver) with distinct, non-flattened local statuses, the conductor's apparatus-only participation, Ulysses' documented non-participation, and the explicit absence of any shared/global resolution. |
| `objects.json` | Four local object references (instrument 001, claims-ledger row 12, the downstream-commitments standing-contract document, Native Speaker) with real content hashes and pinned commits. |
| `events.json` | Nine append-only encounter events (§ tables above, plus the 2026-07-17 correction-noted and the 2026-07-21 update), including the deliberately open, non-core `contract.published` type. |
| `obligations.json` | Two active obligations flowing from the standing contract's conditions 1 and 2, evidenced by the relevant events. |
| `assertions.json` | Three imported, authored assertions — Ensemble's transformation claim (`DISCLOSED RECONSTRUCTION`), Ensemble's boundary-case refusal (`declines-to-carry`), and Meridian's live framing of the corrected claims row — every word of rationale copied verbatim from the source repositories. |

`docs/spec/fixtures/example-encounter.json` is untouched — it remains the schema-illustration
fixture only, explicitly marked as non-evidentiary in its own `fixture_notice` field.
