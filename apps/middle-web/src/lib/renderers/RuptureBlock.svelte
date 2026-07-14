<script lang="ts">
  /**
   * Rupture block (spec 04 §7.5 "UNRENDERED RELATION" / design §5 "machine suggestion:
   * dotted border + label"). Unknown/unregistered record forms are never silently mapped to
   * "related" — they render here, visibly, with the raw local type and the reason no renderer
   * form exists. `kind="machine_suggestion"` styling exists so its absence is checkable
   * (none exist in v1 — epistemic contract test filters them out at the store's read layer).
   */
  interface Props {
    heading: string;
    lead: string;
    localType: string;
    authorLabel?: string;
    reason: string;
    inspectHref?: string;
    inspectLabel?: string;
  }

  const { heading, lead, localType, authorLabel, reason, inspectHref, inspectLabel }: Props = $props();
</script>

<div class="rupture">
  <p class="kicker">{heading}</p>
  <p class="rupture__lead">{lead}</p>
  <dl class="rupture__grid">
    <dt>local type</dt>
    <dd class="mono">"{localType}"</dd>
    {#if authorLabel}
      <dt>author</dt>
      <dd>{authorLabel}</dd>
    {/if}
    <dt>reason</dt>
    <dd>{reason}</dd>
  </dl>
  {#if inspectHref && inspectLabel}
    <p class="rupture__actions"><a href={inspectHref}>[{inspectLabel}]</a></p>
  {/if}
</div>

<style>
  .rupture {
    border: 2px dotted var(--rule-strong);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .rupture__lead {
    color: var(--ink-soft);
  }

  .rupture__grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-1) var(--space-3);
    margin: var(--space-3) 0;
  }

  .rupture__grid dt {
    font-family: var(--font-record);
    font-size: var(--step--1);
    color: var(--ink-faint);
  }

  .rupture__grid dd {
    margin: 0;
  }

  .rupture__actions {
    margin: var(--space-2) 0 0;
    font-family: var(--font-record);
    font-size: var(--step--1);
  }
</style>
