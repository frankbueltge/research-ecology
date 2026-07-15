<script lang="ts">
  import type { ObjectTransformationPayload, TransformationBandEntry } from "@research-ecology/projections";
  import ObligationClause from "$lib/ui/ObligationClause.svelte";
  import RuptureBlock from "./RuptureBlock.svelte";
  import type { Dictionary } from "$lib/i18n";
  import { objectHref } from "$lib/object-ref.js";

  interface Props {
    payload: ObjectTransformationPayload;
    dict: Dictionary;
  }

  const { payload, dict }: Props = $props();

  const bandsByCategory = $derived.by(() => {
    const groups: Record<TransformationBandEntry["category"], TransformationBandEntry[]> = {
      preserved: [],
      "re-voiced": [],
      "declined-to-carry": [],
      imagined: [],
      unclassified: []
    };
    for (const entry of payload.transformation_band) groups[entry.category].push(entry);
    return groups;
  });

  const CATEGORY_HEADING: Record<TransformationBandEntry["category"], string> = {
    preserved: "PRESERVED",
    "re-voiced": "RE-VOICED",
    "declined-to-carry": "DECLINED TO CARRY",
    imagined: "IMAGINED",
    unclassified: "UNCLASSIFIED"
  };
</script>

<div class="transformation">
  <section class="transformation__column">
    <h3>Source</h3>
    {#each payload.source_column as obj (obj.id)}
      <div class="transformation__object">
        <a class="mono" href={objectHref(obj.id)}>{obj.id}</a>
        <p class="transformation__object-type">{obj.local_object_type}</p>
        {#if obj.local_epistemic_status}<p class="transformation__status mono">{obj.local_epistemic_status}</p>{/if}
      </div>
    {/each}
  </section>

  <section class="transformation__band">
    <h3>Transformation</h3>
    {#each Object.entries(bandsByCategory) as [category, entries] (category)}
      {#if entries.length > 0}
        <div class="transformation__group transformation__group--{category}">
          <p class="kicker">{CATEGORY_HEADING[category as TransformationBandEntry["category"]]}</p>
          {#each entries as entry, i (entry.assertion_id ?? `${category}-${i}`)}
            {#if entry.category === "unclassified"}
              <RuptureBlock
                heading={dict.map.ruptureHeading}
                lead={dict.map.ruptureLead}
                localType={entry.label}
                reason={`no registered renderer form for predicate "${entry.label}"`}
                inspectHref={entry.assertion_id ? `/assertions/${entry.assertion_id}` : undefined}
                inspectLabel="inspect raw assertion"
              />
            {:else if entry.is_negative_band}
              <div class="transformation__negative-band">
                <p class="transformation__label">{entry.label}</p>
                {#if entry.rationale}<p class="transformation__rationale">“{entry.rationale}”</p>{/if}
                {#if entry.assertion_id}
                  <p class="transformation__link"><a href={`/assertions/${entry.assertion_id}`}>view authored assertion →</a></p>
                {/if}
              </div>
            {:else}
              <div class="transformation__entry">
                <p class="transformation__label">{entry.label}</p>
                {#if entry.rationale}<p class="transformation__rationale">{entry.rationale}</p>{/if}
                {#if entry.local_epistemic_status}<p class="transformation__tier mono">{entry.local_epistemic_status}</p>{/if}
                {#if entry.assertion_id}
                  <p class="transformation__link"><a href={`/assertions/${entry.assertion_id}`}>view authored assertion →</a></p>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    {/each}
  </section>

  <section class="transformation__column">
    <h3>Derivative</h3>
    {#each payload.derivative_column as obj (obj.id)}
      <div class="transformation__object">
        <a class="mono" href={objectHref(obj.id)}>{obj.id}</a>
        <p class="transformation__object-type">{obj.local_object_type}</p>
        {#if obj.local_epistemic_status}<p class="transformation__status mono">{obj.local_epistemic_status}</p>{/if}
      </div>
    {/each}
    <p class="kicker transformation__legend-heading">Tier legend</p>
    <ul class="transformation__legend mono">
      {#each payload.tier_legend as tier (tier)}
        <li>{tier}</li>
      {/each}
    </ul>
  </section>
</div>

{#if payload.obligations.length > 0}
  <div class="transformation__obligations">
    {#each payload.obligations as obligation (obligation.id)}
      <ObligationClause clauseText={obligation.clause_text} status={obligation.status} prominence={obligation.prominence} />
    {/each}
  </div>
{/if}

<style>
  .transformation {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  @media (min-width: 60rem) {
    .transformation {
      grid-template-columns: 1fr 1.4fr 1fr;
      align-items: start;
    }
  }

  .transformation__column h3,
  .transformation__band h3 {
    margin-top: 0;
    font-size: var(--step-1);
  }

  .transformation__object {
    border: var(--border-thin);
    padding: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .transformation__object-type {
    color: var(--ink-soft);
    margin: var(--space-1) 0 0;
  }

  .transformation__status {
    color: var(--ink-faint);
    margin: var(--space-1) 0 0;
  }

  .transformation__group {
    margin-bottom: var(--space-5);
  }

  .transformation__entry {
    border-left: 3px solid var(--rule-strong);
    padding-left: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .transformation__negative-band {
    border: 2px solid var(--negative-band-rule);
    background: var(--negative-band-bg);
    padding: var(--space-4);
    margin-bottom: var(--space-3);
  }

  .transformation__label {
    font-weight: 600;
    margin: 0 0 var(--space-1);
  }

  .transformation__rationale {
    font-style: italic;
    color: var(--ink-soft);
    margin: 0 0 var(--space-1);
  }

  .transformation__tier {
    color: var(--ink-faint);
    font-size: var(--step--1);
    margin: 0;
  }

  .transformation__link {
    margin: var(--space-2) 0 0;
    font-size: var(--step--1);
  }

  .transformation__legend-heading {
    margin-top: var(--space-4);
  }

  .transformation__legend {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .transformation__legend li {
    border-bottom: var(--border-thin);
    padding: var(--space-1) 0;
  }

  .transformation__obligations {
    margin-top: var(--space-6);
  }
</style>
