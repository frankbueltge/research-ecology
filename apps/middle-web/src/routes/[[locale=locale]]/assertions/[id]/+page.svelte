<script lang="ts">
  import { dictionary, localizedPath } from "$lib/i18n";
  import TextMontage from "$lib/renderers/TextMontage.svelte";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{dict.assertion.kicker}: {data.assertion.predicate} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.assertion.kicker}</p>
  <h1 class="mono assertion-id">{data.assertion.assertion_id}</h1>

  {#if data.encounter}
    <p class="lede">
      {dict.assertion.encounterContext}
      <a href={localizedPath(data.locale, `/encounters/${data.encounter.encounter_id}`)}>{data.encounter.title ?? data.encounter.encounter_id}</a>
    </p>
  {/if}

  <TextMontage
    assertion={data.assertion}
    authorName={data.authorName}
    authorRoleLabel={data.assertion.author.collective_id}
    dict={dict}
    locale={data.locale}
    encounterId={data.assertion.encounter_id}
  />
</article>

<style>
  .assertion-id {
    font-size: var(--step-1);
    word-break: break-all;
  }
</style>
