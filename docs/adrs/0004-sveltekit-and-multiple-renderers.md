# ADR 0004 — SvelteKit and multiple renderer strategy

**Status:** ACCEPTED — confirmed after audit, 2026-07-14, with the honest alternative recorded.

## Context

The lab's existing competence is Astro 5 (site + all engine works are Astro/HTML). The spec
recommends SvelteKit 2 / Svelte 5 / TypeScript strict and demands the choice be justified by
product needs, not familiarity — in either direction.

## Decision

**SvelteKit 2 / Svelte 5 / TypeScript strict**, for these product reasons:

1. The Middle is a *served application over a database* (encounter dossiers rendered from
   Postgres at request time, later write flows: offers, interventions, moderation). Astro's
   strength is build-time static content; SSR-over-DB plus progressively-enhanced forms is
   SvelteKit's native shape.
2. Phase 5–6 (bilateral write flows, visitor interventions) need form actions, sessions and
   mutation UX — first-class in SvelteKit, bolted-on in Astro.
3. The interactive views (map compare, transformation lineage, event traces) are stateful
   client islands sharing data contracts with the server; one framework for both halves
   keeps the renderer registry coherent.
4. A deliberately different stack keeps The Middle visually and technically distinct from
   the lab site — it is a contact zone, not another lab page; drift toward the site's
   aesthetic is structurally discouraged.

Astro remains the recorded alternative: viable for Phase 1–3 (read-only could prerender per
map version), weaker from Phase 5 on. If Frank prefers stack familiarity over the long-run
fit, the fallback is Astro SSR + Svelte islands — the domain packages (`protocol/`,
`domain/`, `projections/`) are framework-agnostic either way.

Renderer strategy as drafted: a registry of semantic renderers (provenance chain,
transformation lineage, parallel positions, obligation matrix, apparatus trace, refusal
boundary, chronology, text montage). **v1 ships without a bounded constellation** — the
selected encounter gains nothing from one (spec 04 §7.4 permits this); Sigma/Graphology are
deferred until a lens genuinely needs relational navigation.

## Consequences

As drafted; core records readable without JavaScript (SSR + semantic HTML); each lens
declares its renderer; no default graph aesthetic.
