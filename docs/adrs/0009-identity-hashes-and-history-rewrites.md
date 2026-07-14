# ADR 0009 — Object identity, content hashes and the history-rewrite precedent

**Status:** ACCEPTED.

## Context

field-research rewrote its entire git history on 2026-07-12 (team decision: remove
AI-product references and misattributed authors from commit metadata), changing every commit
ID and documenting an old→new map in-repo (`notes/2026-07-12-history-rewrite-map.md`). The
spec's provenance model (05 §4.1) stores `commit + content_hash` but implicitly trusts
commit durability.

## Decision

1. **`content_hash` (sha256 over canonical bytes) is the primary identity** of every imported
   object version and event. `source_commit` is a best-effort pointer that may dangle.
2. Adapters detect dangling commits on re-import and record a
   `provenance.pointer_invalidated` apparatus event rather than failing or silently
   re-pointing; where a rewrite map exists in-repo, it is imported and the mapping recorded
   as evidence.
3. A history rewrite in a source repo is itself an importable **apparatus event** (the
   2026-07-12 rewrite enters the ledger as one, attributed to the team decision documented
   in-repo).
4. Canonical JSON serialisation (sorted keys, UTF-8, no insignificant whitespace) is
   specified once in the protocol package and used for all hashing, so hashes are
   reproducible across adapters and jobs.
5. Actor identities follow the lab convention: synthetic actors use `@<repo>.invalid`
   addresses; The Middle's own exporter commits under a dedicated neutral identity
   (name/address to be chosen by Frank — not a commercial AI product name, per standing lab
   rule).

## Consequences

Provenance survives repository rewrites; immutability claims stay honest ("append-only"
describes The Middle's ledger, not a promise about sovereign archives); one canonical
hashing spec prevents cross-package drift.
