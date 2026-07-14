<script lang="ts">
  import { dictionary, localizedPath } from "$lib/i18n";
  import RecordFrame from "$lib/ui/RecordFrame.svelte";
  import TypeChip from "$lib/renderers/TypeChip.svelte";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
  const base = $derived(localizedPath(data.locale, "/ledger"));
</script>

<svelte:head>
  <title>{dict.ledger.kicker} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.ledger.kicker}</p>
  <h1>{dict.nav.ledger}</h1>
  <p class="lede">{dict.ledger.intro}</p>

  <ol class="ledger-list">
    {#each data.events as event (event.event_id)}
      <li>
        <RecordFrame variant="event" date={event.occurred_at}>
          <p><TypeChip eventType={event.event_type} localTypeNote="— not a core protocol type" /></p>
          <p class="mono">{dict.event.issuedBy} {data.actorNames[event.issuer.collective_id] ?? event.issuer.collective_id} / {data.actorNames[event.issuer.actor_id] ?? event.issuer.actor_id}</p>
          <p><a href={event.source_uri} target="_blank" rel="noopener noreferrer">{dict.event.source} ↗</a></p>
        </RecordFrame>
      </li>
    {/each}
  </ol>

  <nav class="ledger-pager" aria-label="Pagination">
    {#if data.hasPrev}
      <a href={`${base}?cursor=${data.page - 1}`}>{dict.ledger.prevCta}</a>
    {:else}
      <span class="ledger-pager__disabled">{dict.ledger.prevCta}</span>
    {/if}
    <span class="mono">{dict.ledger.pageLabel} {data.page + 1} / {data.totalPages}</span>
    {#if data.hasNext}
      <a href={`${base}?cursor=${data.page + 1}`}>{dict.ledger.nextCta}</a>
    {:else}
      <span class="ledger-pager__disabled">{dict.ledger.nextCta}</span>
    {/if}
  </nav>
</article>

<style>
  .ledger-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ledger-pager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: var(--border-thin);
    padding-top: var(--space-4);
    margin-top: var(--space-5);
  }

  .ledger-pager__disabled {
    color: var(--ink-faint);
  }
</style>
