# ADR 0012 — Memory and orientation: record, memory and orientation are three layers, not one

**Status:** PROPOSED — needs Frank's plain-language go (architecture direction; no immediate
build). Drafted 2026-07-19 from Frank's direction of the same day.

## Context

1. **Orientation is the ecology's hidden tax.** Every practice starts each run "with no
   memory except this Git repo" and orients by re-reading it. The cost grows linearly with
   the archive. Evidence, 2026-07-19: a Ulysses dispatcher tick spent its run orienting
   across the full repo, re-fetched and re-verified a primary source the practice had
   already worked (S34), and ended traceless — guaranteeing the next tick repeats the same
   spend. Ulysses' recall index (`memory/index.jsonl`) had not been maintained since
   2026-07-02. Tokens that should buy research are buying amnesia recovery.

2. **Frank's direction (2026-07-19):** the project is meant to be continuously optimised;
   mandates and infrastructure choices are revisable instruments, not constitutions.
   Machine learning, managed platforms (e.g. GCP, BigQuery) and other progressive
   technology must be adoptable when they genuinely lift the project. And: determinism
   must not be treated as an ecology value — for an artistic research practice it can
   contradict the point (the swerve is the method).

3. **What the ecology actually holds constant** (audit of the constitutions and the lab's
   own rules): not Git, not determinism — four invariants:
   - the research **record is append-only** (corrections never silently overwrite);
   - every entry is **attributed** (who wrote what — human, practice, tool);
   - published work is **publicly citable** (stable, addressable, exportable);
   - claims are **verifiable** (sources real and retrievable; model output never published
     as unverified fact). Determinism is required only where a *measurement claim* depends
     on it (the lab's instruments; MRR derivation chains) — nowhere else.

4. **Precedents already inside the ecology:** ADR 0002 accepts a Postgres event/assertion
   store as a record-keeper; ADR 0006 chose Cloudflare+Neon over GCP *on cost/ops grounds
   at 2026-06 scale*, explicitly not on principle; D-JI-03 established "never build the
   same machine twice — the Meridian Research Runtime is the carrier for shared machinery."

## Decision

Separate three layers that today are conflated in "the repo":

### 1. Record — canonical, invariant-bound
The append-only, attributed, citable, verifiable research record. Today implemented as
Git repositories; **the invariants, not Git, are canonical.** A practice's record may move
to an event store / database (ADR 0002 pattern) or any other substrate when it preserves
all four invariants and a public export. Such a move is an ordinary ADR, not a
constitutional crisis.

### 2. Memory — derived, semantic, rebuildable
Working memory for recall: per-practice indexes (`memory/`, maintained as part of
Register — see the Ulysses protocol amendment of 2026-07-19) and, as the shared build-out,
**semantic/vector indexes as projections of the record**. Implementation ladder, each rung
adopted when the previous one actually pinches:

  a. maintained per-practice recall index (jsonl — active now, cost ≈ 0);
  b. ecology-wide derived index built as a projection job (MRR E3 pattern; Actions cron);
  c. embeddings + vector search, local-first: **pgvector on the ADR-0006 Neon Postgres**
     (no new vendor, no new account);
  d. managed/hosted vector or ML infrastructure — when criteria below fire.

Memory is **never authoritative**: it can be deleted and rebuilt from the record at any
time; a claim is never sourced "from the index."

### 3. Orientation — practices ask, they do not re-read
A query surface over Memory: "what changed since my last tick", "is X already worked",
"which offers are open", "what is my active project's next operation". Generalises the
MRR's projection read-models (claim-table, provenance-map). It becomes a **service of the
Meridian Research Runtime federation layer** when E5 (node identity, task inbox) exists —
the same carrier logic as D-JI-03. Until then, rungs a/b above serve single practices.

### Managed-platform criteria (revisits ADR 0006 without reversing it)
Adopt managed/hosted infrastructure (GCP, BigQuery, Vertex, hosted vector DBs, …) when
**any** of these fires, and the cost fits the practice's mandate envelope (Ulysses mandate
v2 pattern):

- the embedding corpus or query volume outgrows Neon/pgvector comfort;
- a project needs actual ML training/fine-tuning beyond notebook scale;
- orchestration outgrows Actions cron (event-driven, multi-practice, long-running);
- a capability is simply absent locally and load-bearing for a real project.

ADR 0006 remains the default until a criterion fires; its ground was cost/ops at a given
scale, and criteria — not sentiment — decide when that ground has changed.

### Retrieval transparency
Verifiability extends to Memory: when retrieved context materially shapes a landed
decision or claim, the trace names what was retrieved and why (apparatus/trace registers).
Semantic recall must not become an unauditable oracle inside an otherwise checkable
practice.

## Consequences

- Token spend shifts from orientation to research; empty ticks become cheap and rare
  (gate at the index, not after a full re-read).
- The "Git prison" dissolves without losing the record: Git stays exactly as long as it
  is the cheapest implementation of the invariants — and no longer.
- Risks and mitigations: **index drift** → Memory is rebuildable, never authoritative;
  **retrieval opacity** → transparency rule above; **invariant erosion during a record
  migration** → the four invariants are the acceptance test of any move.

## Rejected

- **Vector DB as the canonical record** — trades the four invariants for convenience.
- **Ecology-wide determinism** — a category error outside measurement claims.
- **Forking a "new project with new infrastructure"** — self-revision is this project's
  method (v3→v4 took a week; superseded states are archived, not abandoned). A fork would
  assert the system cannot change; the record shows it can.
