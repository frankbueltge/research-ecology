# Implementation Handoff — 2026-07-16 (evening)

Supersedes the state assertions of `docs/REPOSITORY-SEMANTIC-ALIGNMENT.md` (Workstream B,
same day, morning). That document stays unaltered as the audit record; **this document says
what actually happened afterwards** — what was adopted, what was adapted, what was
deliberately not done, and which commits carry the current state. Authorized directly by
Frank ("go für alles" for the P0 repairs; "umsetzen wo sinnvoll … zieh durch" for the
consistency work), same evening.

## Adopted (from the drafted rewrites)

| Repo | What landed | Commit(s) |
|---|---|---|
| `studio` | README + PROTOCOL migrated (protocol-v3, PR #2) | `d4ac84a`, merge `46a0d0f` |
| `irrtum-als-methode` | PROTOCOL v3 (merges v2 + amendment) | `30321f5` |
| `field-research` | README + `memory/downstream-commitments.md` (conditions as offers) | `f856a47` |

## Adapted / done beyond the drafts (same evening)

| Repo | What | Commit(s) |
|---|---|---|
| `field-research` | **Research Protocol v2** — founding text + 2026-07-15 amendment folded into one coherent text ("not the truth department"; VERIFIED as local status, not global ontology; offers not orders; conditions bind only through acceptance; Meridian may equally be the *receiver* of an Ensemble/Ulysses encounter; instrument critique is welcome material). Previous version archived. | `34685a0` |
| `irrtum-als-methode` | README migrated (spec 02 §2) — sovereign practice in the ecology, not "part of the lab"; founding README archived | `e333e0e` |
| `studio` | SITE-API residual closed as part of the feedback-channel rename: `field-feedback/` → `studio-feedback/` in SITE-API/PROTOCOL/REQUESTS (journals keep the old name as record); site-side writer renamed the same evening | `9341785` (+ site `5dcfe34`) |
| all three engines | `auto-land.yml` repaired: PR events trigger, merge/push failures turn the job red, machine-readable per-branch outcomes; irrtum can now land `claude/*` at all | `4436027` / `e173ddd` / `20c49b9` |
| `studio` | the two stranded duplicate sessions preserved as evidence and cleared off the landing path: `archive/duplicate-session-15-2026-07-16` (@ `fc74d9f`), `archive/duplicate-session-16-2026-07-16` (@ `5bd1e42`, sole carrier of `INCREMENT-2-SPEC.md`); old `research/` names deleted with Frank's named approval | branch refs |
| `lab-pipelines` | decision template resolved as recommended: **generated mirror** — README fixes 1+2 applied ("private" corrected to public, daily-records sentence attributed to the site repo, export provenance stated); repo description updated (retired "Die Akte der Gegenwart" reference dropped) | `5e2a315` |
| site (`frankbueltge.de`) | /apparatus rewritten from the constitution (P0.2), autonomy language qualified site-wide ("locally constituted, machine-run … versioned wherever the apparatus permits"), README table de-winged, `approval: draft` explicitly documented as archival-record model (not a publication gate), legacy routes (`/lab/`, `/praktiken/` + /de twins) fixed, deploy gated on check+test, GitHub repo descriptions of all engine repos + site updated | `85804df`, `a6ca20c`, `5dcfe34`, `bd01dcb`, `7f05fb6` |
| this repo | README deployment ladder (atelier: statically exportable, not deployed, fails at the intended secret gate; middle-web: not statically exportable on placeholder adapter-auto); decisions doc §4 updated (Beleg renames, auto-land repair) | see `git log docs/ README.md`, same evening |

## Late additions (same night, third feedback round)

| Where | What | Commit(s) |
|---|---|---|
| this repo, `docs/ROUTINE-PROMPTS.md` | optional encounter inbox in all three orientation passes ("check for offers, invitations, corrections or challenges explicitly addressed to this practice — no response required, silence remains legitimate, technical delivery is not acceptance"); explicitly a possibility, never an exchange obligation. Ensemble prompt also moved to `studio-feedback/`. **Still to mirror by hand into the cloud routines configuration.** | see `git log docs/ROUTINE-PROMPTS.md` |
| `lab-pipelines` | ADR 0001 "generated mirror" — role, sync direction (site → mirror, never reverse), correction authority (none here; corrections are new dated renderings in the site repo) fixed as a decision record, linked from the README | ADR commit, same night |

## Deliberately not done

- **`lab-pipelines` fix 3** (scheduled re-export workflow in the site repo): offered in the
  audit as an option, not a recommendation — left for Frank to want it first. The mirror's
  staleness is now stated in its README instead.
- **`deploy-apps.yml` left fail-red on purpose:** the workflow header documents the missing
  Cloudflare secrets as the intended failure point; converting it to a silent skip would
  hide the reminder. Only the README wording was corrected.
- **`apps/middle-web` static migration:** a design decision (theme-toggle endpoint,
  `url.search` reads) that the audit and the runbook route to Frank; not preempted.
- **Historical records untouched:** journals, committed session texts, the archived cockpit's
  inner copy, and this repo's superseded audit keep their original language — only *current*
  self-descriptions were migrated (per the review's own rule).

## Root causes still open (watching, not fixed)

- Why cloud sessions sometimes clone stale repo state (duplicate sessions 15 and 16 in
  `studio`) — environment cache suspected; watchdog + fail-red auto-land now make every
  recurrence visible the same night.
- Why one session pushed only its `claude/*` outcome branch and no landing branch
  (Meridian S40, hand-landed as `5484b41`) — the new `pull_request` triggers close the
  known miss; observe the next nightlies.
