# ADR 0008 — Treatment of the Ulysses cockpit

**Status:** ACCEPTED (deviates deliberately from the spec's framing; needs Frank's nod).

## Context

Spec 00 §7 / 08 §11 treats "the current Ulysses cockpit as a historical work and migration
source". Audit reality: the cockpit went live 2026-07-14 — the same day as the spec — and
its Ventil (reader-impulse inlet) shipped this morning. It is the atelier's *live local
instrument*, not a retired interface. Declaring a sovereign practice's live surface
"historical" from the shared layer would violate the spec's own first principles (the
receiving practice decides; The Middle does not reinterpret local state).

## Decision

1. The cockpit **remains the atelier's live local map** on frankbueltge.de, owned by that
   surface. The Middle does not replace, embed or freeze it.
2. The Middle imports **dated snapshots of its data** (`pulse/vital-signs.json` closure
   values, `rhizome.json` edges, atlas statuses) as **Ulysses-authored assertions and
   self-assessments** with exact local vocabulary, epistemic status honoring the source's
   own CONJECTURE labels, and per-snapshot commit provenance.
3. The Middle's `/archive` page documents interface history (including this spec's
   predecessor, the cockpit's launch state, and screenshots/dated references) and links out;
   supersession of the cockpit happens only if the atelier itself retires it — which then
   imports as an event.
4. Never migrated as truth (unchanged from spec): no global closure score, no canonical
   rhizome, no fixed relation-type list.

## Consequences

The spec's migration checklist (08 §11 "Preserve/Reclassify") applies to *data snapshots*,
not to the living page. The Middle's archive is honest about being younger than the thing it
archives.
