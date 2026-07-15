<script lang="ts">
  import type { ParallelPositionsPayload } from "@research-ecology/projections";
  import CorrectionOverlay from "$lib/ui/CorrectionOverlay.svelte";
  import ObligationMatrix from "./ObligationMatrix.svelte";
  import RuptureBlock from "./RuptureBlock.svelte";
  import type { Dictionary } from "$lib/i18n";

  interface Props {
    payload: ParallelPositionsPayload;
    actorNames: Record<string, string>;
    dict: Dictionary;
    /** Unrendered predicates the projection engine reported for this map (render_failures),
     * already filtered to this renderer by the caller. */
    unrenderedAssertions: Array<{ assertion_id: string; predicate: string; reason: string }>;
  }

  const { payload, actorNames, dict, unrenderedAssertions }: Props = $props();

  const baselineRow = $derived(payload.register_rows.find((r) => r.state === "baseline"));
  const correctedRow = $derived(payload.register_rows.find((r) => r.state === "corrected"));
</script>

{#if payload.standing_contract}
  <section class="parallel__contract">
    <h3>Standing contract</h3>
    {#if payload.standing_contract.governing_principle}
      <p class="parallel__principle">“{payload.standing_contract.governing_principle}”</p>
    {/if}
    {#if payload.standing_contract.conditions.length > 0}
      <ul class="parallel__conditions">
        {#each payload.standing_contract.conditions as condition, i (i)}
          <li class="mono">
            {typeof condition === "object" && condition !== null && "quote" in (condition as Record<string, unknown>)
              ? String((condition as Record<string, unknown>).quote)
              : JSON.stringify(condition)}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
{/if}

<section class="parallel__register">
  <h3>Register row: before / after</h3>
  <CorrectionOverlay
    baselineText={baselineRow?.text}
    baselineLabel="baseline (struck, not erased)"
    correctedText={correctedRow?.text}
    correctedLabel="corrected (session 33)"
  />
</section>

{#if payload.appellate_caveat}
  <section class="parallel__caveat">
    <p class="kicker">appellate caveat — display prominence: high</p>
    <p class="parallel__caveat-text">{payload.appellate_caveat.text}</p>
  </section>
{/if}

{#if payload.current_framing}
  <section class="parallel__framing">
    <h3>Current framing</h3>
    <p class="parallel__framing-value">{payload.current_framing.value}</p>
    {#if payload.current_framing.rationale}<p class="parallel__framing-rationale">{payload.current_framing.rationale}</p>{/if}
    <p class="parallel__framing-link"><a href={`/assertions/${payload.current_framing.assertion_id}`}>view authored assertion →</a></p>
  </section>
{/if}

{#each unrenderedAssertions as failure (failure.assertion_id)}
  <RuptureBlock
    heading={dict.map.ruptureHeading}
    lead={dict.map.ruptureLead}
    localType={failure.predicate}
    reason={failure.reason}
    inspectHref={`/assertions/${failure.assertion_id}`}
    inspectLabel="inspect raw assertion"
  />
{/each}

<ObligationMatrix rows={payload.obligation_matrix} {actorNames} heading="Standing conditions (obligation matrix)" />

<style>
  .parallel__contract,
  .parallel__register,
  .parallel__framing {
    margin-bottom: var(--space-6);
  }

  .parallel__principle {
    font-style: italic;
    font-size: var(--step-1);
  }

  .parallel__conditions {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .parallel__conditions li {
    border-bottom: var(--border-thin);
    padding: var(--space-2) 0;
  }

  .parallel__caveat {
    border: 2px solid var(--accent);
    padding: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .parallel__caveat-text {
    font-weight: 600;
    margin: 0;
  }

  .parallel__framing-value {
    font-size: var(--step-1);
    font-weight: 600;
  }

  .parallel__framing-rationale {
    font-style: italic;
    color: var(--ink-soft);
  }

  .parallel__framing-link {
    font-size: var(--step--1);
  }
</style>
