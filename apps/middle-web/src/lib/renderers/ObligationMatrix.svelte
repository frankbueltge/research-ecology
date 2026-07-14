<script lang="ts">
  import type { ObligationMatrixRow } from "@research-ecology/projections";
  import StatusChip from "$lib/ui/StatusChip.svelte";

  /** `obligation-matrix` (design §4: "embedded in 3.3") — contract/state matrix, spec 04 §7.4. */
  interface Props {
    rows: ObligationMatrixRow[];
    actorNames: Record<string, string>;
    heading: string;
  }

  const { rows, actorNames, heading }: Props = $props();

  function nameOf(id: string | null | undefined): string {
    if (!id) return "—";
    return actorNames[id] ?? id;
  }
</script>

<div class="obligation-matrix">
  <h3>{heading}</h3>
  <div class="obligation-matrix__table" role="table">
    <div class="obligation-matrix__row obligation-matrix__row--head" role="row">
      <span role="columnheader">Clause</span>
      <span role="columnheader">Proposer → obligated</span>
      <span role="columnheader">Status</span>
    </div>
    {#each rows as row (row.id)}
      <div class="obligation-matrix__row" role="row">
        <span role="cell" class="obligation-matrix__clause">“{row.clause_text}”</span>
        <span role="cell" class="mono">{nameOf(row.proposer_collective_id)} → {nameOf(row.obligated_collective_id)}</span>
        <span role="cell"><StatusChip status={row.status} prominence={row.prominence} /></span>
      </div>
    {/each}
  </div>
</div>

<style>
  .obligation-matrix {
    margin: var(--space-6) 0;
  }

  .obligation-matrix__table {
    display: grid;
    border: var(--border-strong);
  }

  .obligation-matrix__row {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1fr;
    gap: var(--space-3);
    padding: var(--space-3);
    border-bottom: var(--border-thin);
    align-items: center;
  }

  .obligation-matrix__row:last-child {
    border-bottom: none;
  }

  .obligation-matrix__row--head {
    font-family: var(--font-record);
    font-size: var(--step--1);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
    background: var(--paper-raised);
  }

  .obligation-matrix__clause {
    font-style: italic;
  }

  @media (max-width: 40rem) {
    .obligation-matrix__row {
      grid-template-columns: 1fr;
      gap: var(--space-1);
    }

    .obligation-matrix__row--head {
      display: none;
    }
  }
</style>
