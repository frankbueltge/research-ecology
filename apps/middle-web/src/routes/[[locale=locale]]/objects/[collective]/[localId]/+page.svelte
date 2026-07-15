<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import DoorwayLink from "$lib/ui/DoorwayLink.svelte";
  import TextMontage from "$lib/renderers/TextMontage.svelte";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{data.object.title_cache ?? data.object.local_object_id} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.object.kicker}</p>
  <h1 lang="en">{data.object.title_cache ?? data.object.local_object_id}</h1>
  {#if data.object.summary_cache}<p class="lede" lang="en">{data.object.summary_cache}</p>{/if}

  <dl class="object-meta">
    <dt>{dict.object.lifecycleStatus}</dt>
    <dd class="mono">{data.object.lifecycle_status}</dd>

    {#if data.object.local_epistemic_status}
      <dt>{dict.object.epistemicStatus}</dt>
      <dd class="mono">{data.object.local_epistemic_status}</dd>
    {/if}

    <dt lang="en">local type</dt>
    <dd lang="en">{data.object.local_object_type}</dd>

    {#if data.object.interoperability_class}
      <dt>{dict.object.interoperabilityClass}</dt>
      <dd class="mono">{data.object.interoperability_class}</dd>
    {/if}

    <dt>{dict.object.contentHash}</dt>
    <dd class="mono object-meta__hash">{data.object.content_hash}</dd>

    {#if data.object.source_commit}
      <dt>{dict.object.sourceCommit}</dt>
      <dd class="mono">{data.object.source_commit}</dd>
    {/if}
  </dl>

  <DoorwayLink
    href={data.object.canonical_uri}
    lead={`${dict.common.doorwayLead} — ${data.collective?.current_name ?? data.object.collective_id}`}
    cta={dict.common.doorwayCta}
    repoLabel={dict.common.doorwayRepo}
    repoUrl={data.collective?.repository_url}
    commit={data.object.source_commit}
    commitLabel={dict.common.doorwayCommit}
  />

  <h2>{dict.object.assertionsAboutHeading}</h2>
  {#if data.assertionsAbout.length === 0}
    <p class="lede">{dict.object.noAssertions}</p>
  {:else}
    {#each data.assertionsAbout as assertion (assertion.assertion_id)}
      <TextMontage
        {assertion}
        authorName={data.authorNames[assertion.assertion_id] ?? assertion.author.actor_id}
        dict={dict}
        encounterId={assertion.encounter_id}
      />
    {/each}
  {/if}
</article>

<style>
  .object-meta {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-2) var(--space-4);
    margin: var(--space-5) 0;
  }

  .object-meta dt {
    color: var(--ink-faint);
    font-family: var(--font-record);
    font-size: var(--step--1);
  }

  .object-meta dd {
    margin: 0;
  }

  .object-meta__hash {
    word-break: break-all;
  }
</style>
