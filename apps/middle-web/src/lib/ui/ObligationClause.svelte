<script lang="ts">
  import StatusChip from "./StatusChip.svelte";

  interface Props {
    clauseText: string;
    status: string;
    prominence: string;
    proposerLabel?: string;
    obligatedLabel?: string;
  }

  const { clauseText, status, prominence, proposerLabel, obligatedLabel }: Props = $props();
</script>

<div class="obligation-clause">
  <p class="obligation-clause__text">“{clauseText}”</p>
  <div class="obligation-clause__meta">
    <StatusChip {status} {prominence} />
    {#if proposerLabel && obligatedLabel}
      <span class="obligation-clause__parties mono">{proposerLabel} → {obligatedLabel}</span>
    {/if}
  </div>
</div>

<style>
  .obligation-clause {
    border: var(--border-strong);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
    background: var(--paper-raised);
  }

  .obligation-clause__text {
    font-style: italic;
    margin-bottom: var(--space-3);
  }

  .obligation-clause__meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .obligation-clause__parties {
    font-size: var(--step--1);
    color: var(--ink-faint);
  }
</style>
