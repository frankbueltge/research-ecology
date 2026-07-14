<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{dict.apparatus.kicker} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.apparatus.kicker}</p>
  <h1>{dict.nav.apparatus}</h1>
  <p class="lede">{dict.apparatus.intro}</p>

  <h2>{dict.apparatus.actorsHeading}</h2>
  <div class="actors-table" role="table">
    <div class="actors-table__row actors-table__row--head" role="row">
      <span role="columnheader">{dict.apparatus.actorId}</span>
      <span role="columnheader">{dict.apparatus.actorName}</span>
      <span role="columnheader">{dict.apparatus.actorKind}</span>
      <span role="columnheader">{dict.apparatus.actorCollective}</span>
    </div>
    {#each data.actors as actor (actor.id)}
      <div class="actors-table__row" role="row">
        <span role="cell" class="mono">{actor.id}</span>
        <span role="cell">{actor.display_name}</span>
        <span role="cell" class="mono">{actor.actor_kind}</span>
        <span role="cell" class="mono">{actor.collective_id ?? "—"}</span>
      </div>
    {/each}
  </div>

  <h2>{dict.apparatus.sentinelHeading}</h2>
  <p>{dict.apparatus.sentinelBody}</p>

  <h2>{dict.apparatus.pipelineHeading}</h2>
  <p>{dict.apparatus.pipelineBody}</p>
  <p class="mono">{dict.map.manifestEngineVersion}: {data.engineVersion}</p>

  {#if data.importRecords.some((r) => r.records.length > 0)}
    <h3>Import records (ambiguous / unsupported / rejected)</h3>
    {#each data.importRecords as group (group.collectiveId)}
      {#if group.records.length > 0}
        <h4 class="mono">{group.collectiveId}</h4>
        <ul>
          {#each group.records as record, i (i)}
            <li lang="en"><span class="mono">[{record.kind}]</span> {record.path} — {record.reason}</li>
          {/each}
        </ul>
      {/if}
    {/each}
  {/if}

  <h2>{dict.apparatus.pinningHeading}</h2>
  <p>{dict.apparatus.pinningBody}</p>
  {#if data.assemblyEvent}
    <div class="assembly-event">
      <p class="mono">{data.assemblyEvent.event_id}</p>
      <p lang="en">{String(data.assemblyEvent.payload.note ?? "")}</p>
      <p class="mono assembly-event__meta">
        {data.assemblyEvent.occurred_at} · issuer: {data.assemblyEvent.issuer.collective_id} / {data.assemblyEvent.issuer.actor_id}
      </p>
    </div>
  {/if}

  <h2>{dict.apparatus.analyticsHeading}</h2>
  <p>{dict.apparatus.analyticsBody}</p>

  <h2>{dict.apparatus.limitationsHeading}</h2>
  <ul>
    {#each dict.apparatus.limitations as limitation (limitation)}
      <li>{limitation}</li>
    {/each}
  </ul>

  <h2>{dict.apparatus.authorshipHeading}</h2>
  <p>{dict.apparatus.authorshipBody}</p>
</article>

<style>
  .actors-table {
    display: grid;
    border: var(--border-strong);
    margin: var(--space-5) 0;
    overflow-x: auto;
  }

  .actors-table__row {
    display: grid;
    grid-template-columns: 1.4fr 1.6fr 1fr 1fr;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-bottom: var(--border-thin);
  }

  .actors-table__row:last-child {
    border-bottom: none;
  }

  .actors-table__row--head {
    font-family: var(--font-record);
    font-size: var(--step--1);
    text-transform: uppercase;
    color: var(--ink-faint);
    background: var(--paper-raised);
  }

  .assembly-event {
    border: 1px dashed var(--rule-strong);
    padding: var(--space-4);
    margin: var(--space-4) 0;
  }

  .assembly-event__meta {
    color: var(--ink-faint);
    font-size: var(--step--1);
  }
</style>
