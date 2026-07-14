<script lang="ts">
  import type { ProvenanceChainPayload } from "@research-ecology/projections";
  import RecordFrame from "$lib/ui/RecordFrame.svelte";
  import ObligationClause from "$lib/ui/ObligationClause.svelte";
  import TypeChip from "./TypeChip.svelte";
  import type { Dictionary } from "$lib/i18n";

  interface Props {
    payload: ProvenanceChainPayload;
    actorNames: Record<string, string>;
    dict: Dictionary;
  }

  const { payload, actorNames, dict }: Props = $props();

  function nameOf(id: string): string {
    return actorNames[id] ?? id;
  }
</script>

{#if payload.derivative_publication_gap_seconds !== null}
  <div class="gap-note">
    <p class="kicker">{dict.event.gapHeading}</p>
    <p>
      {dict.event.gapBody}
      <span class="mono">({payload.derivative_publication_gap_seconds}s)</span>
    </p>
  </div>
{/if}

<ol class="ledger">
  {#each payload.ledger as entry (entry.event_id)}
    <li>
      <RecordFrame variant="event" date={entry.occurred_at} id={`event-${entry.event_id}`}>
        <p class="ledger__type">
          <TypeChip eventType={entry.event_type} localTypeNote="— not a core protocol type" />
        </p>
        <p class="ledger__issuer mono">
          {dict.event.issuedBy}
          {nameOf(entry.issuer.collective_id)} / {nameOf(entry.issuer.actor_id)}
        </p>
        <p class="ledger__source">
          <a href={entry.source_uri} target="_blank" rel="noopener noreferrer">{dict.event.source} ↗</a>
          {#if entry.source_commit}<span class="mono ledger__commit">{entry.source_commit.slice(0, 12)}</span>{/if}
        </p>
        <details class="ledger__excerpt">
          <summary class="mono">{dict.event.payloadExcerpt}</summary>
          <pre class="mono">{JSON.stringify(entry.payload_excerpt, null, 2)}</pre>
        </details>
        {#if entry.obligations_accepted_here.length > 0}
          <div class="ledger__obligations">
            <p class="kicker">{dict.event.obligationsAcceptedHere}</p>
            {#each entry.obligations_accepted_here as obligation (obligation.id)}
              <ObligationClause clauseText={obligation.clause_text} status={obligation.status} prominence={obligation.prominence} />
            {/each}
          </div>
        {/if}
      </RecordFrame>
    </li>
  {/each}
</ol>

<style>
  .gap-note {
    border: 2px solid var(--accent);
    padding: var(--space-4);
    margin-bottom: var(--space-6);
    background: var(--accent-soft);
  }

  .ledger {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ledger__type {
    margin: 0 0 var(--space-2);
  }

  .ledger__issuer {
    color: var(--ink-soft);
    margin: 0 0 var(--space-2);
  }

  .ledger__source {
    margin: 0 0 var(--space-2);
  }

  .ledger__commit {
    color: var(--ink-faint);
    margin-left: var(--space-2);
  }

  .ledger__excerpt {
    margin: var(--space-2) 0;
  }

  .ledger__excerpt pre {
    overflow-x: auto;
    background: var(--paper-raised);
    padding: var(--space-3);
    margin: var(--space-2) 0 0;
    font-size: 0.85em;
  }

  .ledger__obligations {
    margin-top: var(--space-3);
  }
</style>
