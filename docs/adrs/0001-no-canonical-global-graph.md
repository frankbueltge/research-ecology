# ADR 0001 — No canonical global graph

**Status:** ACCEPTED — confirmed after audit, 2026-07-14 (supersedes spec draft "proposed").

## Context

The spec draft argued a central graph would make interpretive edges appear factual. The audit
turned this from a principle into an observed necessity: Ulysses' `rhizome.json` uses six
edge kinds of which three are undocumented; field's chronicle `move` enum could not express
"expedition"; Ensemble invented a project-specific epistemic tier (`DISCLOSED
RECONSTRUCTION`) within its first ten sessions. Every practice has already outgrown at least
one offered schema within two weeks of existing. A canonical edge ontology would be wrong on
day one and wronger every night.

## Decision

As drafted: PostgreSQL stores operational events, opaque local object references and authored
assertions. Graph projections exist only as versioned lens outputs. No canonical global edge
list, no "show all network" endpoint or UI. Epistemic tests enforce this (see spec 09 §8).

## Consequences

Unchanged from draft. Additionally: the historical rhizome edges import as Ulysses-authored
assertions with their exact local kinds; unknown kinds render as ruptures.
