# Fixture: `enc-2026-002-kill-cloud-travels`

**STATUS: DRAFT — transcription commissioned by Frank Bültge (2026-07-17); the wording has
NOT yet been read or approved by him.** `encounter.json` in the sibling fixture
`enc-2026-001-calibration-gap-travels` carries no `approval` field, so — per the work order —
the draft status is documented here rather than invented as a new schema field.

This fixture encodes a real, audited encounter; nothing in it is illustrative.

It is the second encounter encoding of the ecology: Meridian's kill-cloud material — the
field map's cluster 2 ("AI in war / 'Kill Cloud' / algorithmic targeting", the field's
"sharpest edge") and the atlas digest's cluster-2 entries (the Airwars investigation
catalogued as an atlas artwork, aaajiao's "Minority Algorithm", Disruption Network Lab's
"Investigating the Kill Cloud") — travels into Ensemble's project **"No Way of Knowing" v2**.
The receiver takes the material through its own concept gate: held session 12 behind six
self-imposed conditions, blocked session 13 (condition 1 undischargeable, egress wall,
"The concept stays HELD; nothing opens tonight."), opened session 14 with binding conditions
adopted at the receiver's own gate ("the brief carries from birth"), then transformed locally
through three shipped increments (sessions 15–17). At encoding time the work is
**premiere-ready pending the human playthrough** — the encounter is **NOT closed**: the
premiere gate has not run, Frank's playthrough invitation (REQUESTS.md, session 17) is
unanswered, and Instance 2's live status is held honestly open under an active monitoring
obligation ("2 catches on record. Case 02 unresolved. Last checked 16 July 2026.").

The grammar this fixture demonstrates is the one both repositories state on the record:
Meridian's standing conditions are **offered, not decreed** ("A sibling practice's own
protocol decides how, or whether, it accepts them"), and the conditions that actually bind
this project were adopted by Ensemble **at its own gate, by its own decision** (Kritiker
conditions bind at adoption). Conditions bind through acceptance — on both sides of the
boundary.

Every quote in `events.json` / `obligations.json` / `assertions.json` is copied from the
source repositories in the local sibling clones `../field-research` and `../studio` at the
pinned commits below. Every `content_hash` in `objects.json` is `sha256` over the raw bytes
of the named file at the pinned commit, computed with `git show <commit>:<path> | shasum -a 256`.

**Quote discipline (byte-exactness rule):** every string in a field whose name starts with
`quote` (and every `clause_text` / `instantiation_quote` / assertion `rationale`) is a raw,
byte-exact substring of the named source file at the pinned commit, verified mechanically —
with one declared normalization: where a sentence crosses a hard-wrapped line in a Markdown
source, the newline plus leading indentation is collapsed to a single space, and this is only
done where flagged by `"normalized": true` next to the quote. Unflagged quotes are literal
single-line substrings, including any Markdown emphasis characters they contain. The
machine-checkable list is `QUOTE-MANIFEST.tsv` in this directory (event/field, source file,
60-char prefix, normalized-flag). Prose fields (`local_status_rationale`, `resolution_note`,
`source_note`, `apparatus_note`, `note`) are editorial summaries by the encoder; quoted
fragments embedded in them also appear in the manifest where load-bearing. Event and assertion
`content_hash` values are `sha256` over the canonical JSON of the record minus its
`content_hash` field (UTF-8, sorted keys, compact separators).

## Provenance table

| # | File (repo:path) | Commit | Timestamp (author, local) | sha256 |
|---|---|---|---|---|
| 1 | `field-research:memory/downstream-commitments.md` (reframed version, "offered, not decreed") | `f856a47f81bb8d0f22fcb480bda3849e4220d6ad` | 2026-07-16 09:42:51 +0200 | `d1586b83b65c65e72b20f1618476f18b83646a22a78b5061023eb9b1a3d631f5` |
| 2 | `field-research:memory/downstream-commitments.md` (founding version — same pin as enc-001) | `4eb3b165b9403b90ed09ce95db4ee4b47c81cb0f` | 2026-07-11 13:51:52 +0200 | `d28f9604812fbe7edaebec0e19d4986927aad8cfdd0df43f3ced823c197db96a` |
| 3 | `field-research:FIELD.md` (kill-cloud cluster 2; C2 expedition update landed at `2be807c5`, 2026-07-11 19:38:52 +0200) | `6365640cabc6a0c21aa8b4a490c1d36566906152` | 2026-07-16 11:17:36 +0000 | `79e30ca42550217802a11348e61cb084dd60307598a7959fb363c1b976804cd3` |
| 4 | `field-research:memory/dossiers/data-art-field-archive.md` (the atlas digest, 214 works) | `32e2e52f321608d977f6fe0b44501710545651fc` | 2026-07-06 12:48:58 +0200 | `416eb5d4543ba4585aa262eef208d6ff00e6d2004a98c57f6d5fc5d5b233b372` |
| 5 | `studio:memory/dossiers/no-way-of-knowing.md` (created session 12; current state) | `c23d3a01e550f3de48454577dda242bdc4206fef` (created `2243fc0839d4c49781b2dda0d6e24d61583a7909`, 2026-07-13 01:41:53 +0200) | 2026-07-16 20:51:25 +0000 | see note below |
| 6 | `studio:journal/2026-07-15.md` (session 13) | `d540bbaaa38383589dc3eb7da4360d6c0f4b3d31` | 2026-07-15 01:22:09 +0000 | — (journal; quoted, not an object) |
| 7 | `studio:journal/2026-07-15-session-14.md` (session 14) | `46bb7a88444b206fcdb17bf7d6f4d880be668635` | 2026-07-15 04:16:58 +0000 | — (journal; quoted, not an object) |
| 8 | `studio:journal/2026-07-16.md` (session 15) | `0a90fefde8c34f6cd1c74f2de2b029bb9afd2f3b` | 2026-07-16 04:47:00 +0000 | — (journal; quoted, not an object) |
| 9 | `studio:journal/2026-07-16-session-16.md` (session 16) | `a73a991ebab77c45d0310be8e1931bc544dd98d8` | 2026-07-16 15:08:06 +0000 | — (journal; quoted, not an object) |
| 10 | `studio:journal/2026-07-16-session-17.md` (session 17) | `c23d3a01e550f3de48454577dda242bdc4206fef` | 2026-07-16 20:51:25 +0000 | — (journal; quoted, not an object) |
| 11 | `studio:projects/no-way-of-knowing/data.json` (increment 3) | `c23d3a01e550f3de48454577dda242bdc4206fef` | 2026-07-16 20:51:25 +0000 | `bd314fbcaab6b0b444211e87c51adb59f0d34edbf774fac09389c4d0cbc709e2` |
| 12 | `studio:projects/no-way-of-knowing/README.md` (the living brief) | `c23d3a01e550f3de48454577dda242bdc4206fef` | 2026-07-16 20:51:25 +0000 | `96f48f2a80e5779232b0f5ac3ebfd2f8e984b4d4616bb034e9714408a24c16ee` |
| 13 | `studio:WORKBOARD.md` (No-Way-of-Knowing row; row text landed at `c23d3a01`, unchanged since) | `c7288ef7d1391b034e71e9023179e7f714c22623` | 2026-07-17 04:54:43 +0000 | — (board; quoted, not an object) |

All timestamps are git author timestamps (`git show -s --format='%H %ci'`); `events.json`'s
`occurred_at` fields are the same instants converted to UTC (CEST is UTC+2 in July 2026).
The studio dossier is quoted at its current state (last commit `c23d3a01`); quotes attributed
to the session-12 event were additionally verified present in the dossier as first committed
(`git show 2243fc08:memory/dossiers/no-way-of-knowing.md`).

## Commit chronology used for `events.json` (UTC)

| Event | UTC `occurred_at` | Source commit |
|---|---|---|
| `contract.published` (standing conditions; same real-world act as enc-001's event 01) | `2026-07-11T11:51:52Z` | field-research `4eb3b165` |
| `concept.held` (receiver's own gate: HOLD, six conditions) | `2026-07-12T23:41:53Z` | studio `2243fc08` |
| `condition.declared_unmet` (egress wall; concept stays HELD; routed to Frank) | `2026-07-15T01:22:09Z` | studio `d540bbaa` |
| `project.opened` (condition 1 discharged first-hand; gate OPEN-WORTHY; conditions adopted) | `2026-07-15T04:16:58Z` | studio `46bb7a88` |
| `citation.declared` (the brief names the atlas-catalogued neighbors, with daylight) | `2026-07-15T04:16:58Z` | studio `46bb7a88` |
| `object.transformed` (increment 1: the working console; monitoring line dated) | `2026-07-16T04:47:00Z` | studio `0a90fefd` |
| `contract.reframed` (Meridian's conditions restated as offered, not decreed) | `2026-07-16T07:42:51Z` | field-research `f856a47f` |
| `object.transformed` (increment 2: render-from-island; standing guard) | `2026-07-16T15:08:06Z` | studio `a73a991e` |
| `object.transformed` (increment 3: premiere-ready pending human playthrough) | `2026-07-16T20:51:25Z` | studio `c23d3a01` |
| `invitation.created` (the human playthrough invitation to Frank — still open) | `2026-07-16T20:51:25Z` | studio `c23d3a01` |

`concept.held`, `condition.declared_unmet`, `project.opened` and `contract.reframed` are
deliberately OPEN event-type strings (not core types from spec 03 §3): the receiver's own
concept-gate lifecycle and the source's reframing of its standing contract have no core
vocabulary, and fabricating an `offer.created`/`offer.accepted` pair would misstate the record
— no bilateral offer addressed to this encounter ever existed (same modeling honesty as
enc-001's `contract.published`). `citation.declared`, `object.transformed` and
`invitation.created` are core types (spec 03 §3.1, §3.4).

## What travelled, honestly scoped

The material handover is **map and canon, not verified claims**: Ensemble's project stands on
Meridian's field-map cluster 2 (the kill-cloud territory and its Airwars "no way of knowing"
lead — carried on Meridian's side at **SNIPPET** tier) and on the atlas digest's cluster-2
entries (which the receiver's own Kritiker made binding as "hidden neighbors" and condition 2's
"CATALOGUED ATLAS ARTWORK"). The factual spine of the work itself — every quote on both faces —
is **Ensemble's own first-hand research** (SOURCED / primary-confirmed at session 14), NOT a
reuse of Meridian VERIFIED material; the dossier's fallback ("mature via Meridian's VERIFIED
pipeline") was never needed. Meridian's standing conditions address "anyone reusing its
VERIFIED material" — so this fixture records them as the standing offer under which the
relation operates and is monitored (the studio's session-opening upstream diffs watch
"instrument 001, 011/card 001, or the kill-cloud material"), not as an accepted VERIFIED-reuse
contract. The receiver's local tier on the core "no way of knowing" fact exceeds the source's:
primary-confirmed downstream, SNIPPET upstream. Both statuses stay local; neither is flattened.

## Known gaps and disclosed discrepancies (not silently smoothed)

1. **Frank did NOT provide the egress unblock.** The work order's framing ("the egress
   enablement that made condition 1 possible") is not supported by the journals: session 13
   routed the ask to Frank ("Routed to Frank (REQUESTS.md, 2026-07-15)"); session 14 records
   "Frank's egress request in REQUESTS.md is still open (no response, no pasted primaries)" and
   discharges condition 1 through the web-research tool's server-side route — "it was the
   *fetcher*, not the sources" — after which the request to Frank was downgraded honestly to "a
   convenience, not a blocker". Frank's conductor lane in `encounter.json` therefore carries
   only what the record supports: atlas delivery upstream of the encounter (2026-07-06,
   "Delivered by the team (Frank / the lab)"), addressee of the unanswered egress ask, and the
   pending playthrough gate.
2. **"submitted-but-WITHHELD" and a "Senate deadline" appear nowhere** in either repository's
   record of this project (swept mechanically). The honest live-status content is: the Pentagon
   investigation "still being finalised", the congressional AI question unanswered, and the
   studio's dated monitoring status ("not a claim that none exists"). Those are encoded;
   the unsupported phrases are omitted.
3. **Session 12's journal (`studio:journal/2026-07-13.md`) is outside this work order's
   authorized quote set.** The session-12 event (`concept.held`) is therefore sourced from the
   project dossier, which was created in the same commit (`2243fc08`) and carries the six
   conditions and the HOLD verdict in its own text.
4. **`studio:PROTOCOL.md` contains the accepting-side section "Meridian's publishing conditions
   — accepted where you use its material"** (referenced by the contract's own provenance note
   as "studio's parallel rewrite"). It is likewise outside the authorized quote set, so it is
   named here as corroborating context but not quoted in the record.
5. **The reframing commit changed condition 3's modality** ("must never be re-served" →
   "should never be re-served") along with the offered-not-decreed framing; enc-001 pins the
   founding wording, this fixture pins the reframed wording. Both versions are in the
   provenance table; the delta is noted in the `contract.reframed` event rather than silently
   harmonised.
6. **The encounter is open.** No `encounter.closed_locally` exists on either side; the premiere
   gate has not run; the playthrough invitation is unanswered (re-confirmed unchanged in the
   studio's session-18 journal, 2026-07-17, outside the quote set: "still premiere-ready, still
   waiting on Frank's playthrough"). `shared_resolution` is null by fact, not by omission.

## Update 2026-07-20 (Middle Scribe, append-only)

Frank answered the playthrough invitation (evt-10) the same day the DRAFT flag above was
written: `studio:REQUESTS.md` commit `e9914d46`, 2026-07-17 16:50:57 +0200 — "**Response (team,
2026-07-17):** go". The studio ran the full premiere gate that evening (session 19, commit
`1860072541150f99dcd63259f1f86c2de9e1ba69`, 2026-07-17 18:47:33 UTC): Verifier PASS WITH
FINDINGS (one NIT fixed: "more than 120" vs "120" members of Congress), Dramaturg DELIVERS WITH
CONDITIONS (a reduced-motion timing gap closed by disclosure, not by hiding it), Kritiker
PREMIERE STANDS with its hostile critique published beside the work. "No Way of Knowing"
graduated to `works/2026-07-17-no-way-of-knowing/` — the studio's second work — and was mirrored
onto frankbueltge.de/studio 3 minutes later (`frankbueltge.de` commit `06657906`, path-boundary
guard intact: only `works/` travelled). Three new events (`evt-11` playthrough-accepted, `evt-12`
derivative-published, `evt-13` publication-site-gate) and one new object
(`ensemble:no-way-of-knowing@1860072`, superseding nothing — the in-production object
`@c23d3a01` stays in the record) were appended; no existing event, object, obligation or
assertion was edited or deleted.

**The encounter is still open.** The premiere closed this encounter's former live blocker (the
unanswered invitation) but not the encounter itself: before running the gate, the conductor
first-hand re-checked the world on premiere day and confirmed Instance 2's open status still
held ("Instance 2's OPEN state holds; the central claim is still true" — the Minab investigation
still unreleased, the congressional AI question still unanswered), then re-dated the monitoring
line 2026-07-16 → 2026-07-17 at ship time rather than shipping it stale. Both load-bearing
obligations (open-instance-honesty, monitoring-status) remain `active`, unedited — they are
standing commitments for the life of the work, not conditions this premiere discharges. The
DRAFT status above is untouched: Frank's "go" answered the playthrough request specifically, not
a read/approval of this fixture's wording, which the work order distinguishes and this update
does not blur.

## Update 2026-07-24 (Middle Scribe, append-only)

The studio ran its first post-premiere monitoring cycle (session 33, commit
`e068fdc134c1b2bd5f07ec5f4bb280a3e96ec36c`, 2026-07-23 13:24:44 UTC): the monitoring line was
six days stale (last checked at the 2026-07-17 premiere). The conductor re-checked the world
first-hand against a newer primary (Military Times, 13 July 2026 — the Pentagon: "is ongoing...
no updates to announce"; more than two dozen senators demanding release). Instance 2's OPEN
state held true — no gate, no graduation, so the update is recorded under a new open event
type, `object.maintained` (`evt-enc2026002-14`), rather than `object.transformed`; the
site-gate re-mirror followed 94 seconds later (`frankbueltge.de` commit `576da560`,
`evt-enc2026002-15`). Only the dated monitoring fields changed
(`monitoring.last_checked`/`statement`/`serial_line`, `disclosed`, the open-answer-slot text);
no SOURCED sentence changed. Both load-bearing obligations (open-instance-honesty,
monitoring-status) remain `active`, unedited — this update evidences them being kept, not
discharged. No existing event, object, obligation, or assertion was edited or deleted.

## Fixture contents

| File | Contents |
|---|---|
| `encounter.json` | The encounter, its two collective participants (Meridian/source, Ensemble/receiver) with distinct local statuses, Frank's conductor lane (apparatus and, as of 2026-07-20, an answered playthrough gate), Ulysses' documented non-participation, and the explicit absence of any shared resolution — the encounter is open even after the premiere. |
| `objects.json` | Five local object references (the standing-conditions document in its reframed version, the field map's kill-cloud cluster, the atlas digest, the No-Way-of-Knowing project in production, and — appended 2026-07-20 — the premiered `works/` version) with real content hashes and pinned commits. |
| `events.json` | Thirteen append-only encounter events (tables above plus the 2026-07-20 update), mixing core types with deliberately open type strings. |
| `obligations.json` | Three active obligations — all adopted by the receiver at its own gate or held as its own standing practice; none imposed across the repository boundary. |
| `assertions.json` | Four imported, authored assertions — Ensemble's daylight claim against the catalogued atlas artwork, Ensemble's premise demotion (epistemic asymmetry, not proven pattern), Meridian's live framing of the kill-cloud cluster, and Ensemble's first-hand-spine tier declaration. |
| `QUOTE-MANIFEST.tsv` | One line per verbatim quote: fixture location, source file, first 60 characters — for mechanical substring verification. |

`docs/spec/fixtures/example-encounter.json` is untouched — it remains the schema-illustration
fixture only. Nothing outside this directory was created or modified, and nothing was committed.
