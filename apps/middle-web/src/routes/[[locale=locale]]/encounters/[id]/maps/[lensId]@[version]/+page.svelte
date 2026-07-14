<script lang="ts">
  import { page } from "$app/state";
  import { dictionary } from "$lib/i18n";
  import LensManifestPanel from "$lib/ui/LensManifestPanel.svelte";
  import ProvenanceChain from "$lib/renderers/ProvenanceChain.svelte";
  import ObjectTransformation from "$lib/renderers/ObjectTransformation.svelte";
  import ParallelPositions from "$lib/renderers/ParallelPositions.svelte";
  import type {
    ObjectTransformationPayload,
    ParallelPositionsPayload,
    ProvenanceChainPayload
  } from "@research-ecology/projections";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{data.manifest.name} @ v{data.manifest.version} — {data.bundle.encounter.title} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.map.kicker}</p>
  <h1>{data.manifest.name}</h1>
  <p class="lede" lang="en">{data.lens.purpose}</p>

  <LensManifestPanel
    lensName={data.manifest.name}
    authorLabel={data.manifest.authorLabel}
    basis={data.manifest.basis}
    selectionSummary={data.manifest.selectionSummary}
    exclusions={data.manifest.exclusions}
    unknownTypesCount={data.manifest.unknownTypesCount}
    engineVersion={data.manifest.engineVersion}
    mapId={data.manifest.mapId}
    mapVersion={data.manifest.version}
    contentHash={data.manifest.contentHash}
    watermark={data.manifest.watermark}
    openByDefault={false}
    labels={dict.map}
    toggleHint={dict.common.lensManifestToggleHint}
  />

  <div class="renderer">
    {#if data.lens.renderer === "provenance-chain"}
      <ProvenanceChain payload={data.map.projection as unknown as ProvenanceChainPayload} actorNames={data.actorNames} {dict} />
    {:else if data.lens.renderer === "object-transformation"}
      <ObjectTransformation payload={data.map.projection as unknown as ObjectTransformationPayload} {dict} locale={data.locale} />
    {:else if data.lens.renderer === "parallel-positions"}
      <ParallelPositions
        payload={data.map.projection as unknown as ParallelPositionsPayload}
        actorNames={data.actorNames}
        {dict}
        locale={data.locale}
        unrenderedAssertions={data.unrenderedAssertions}
      />
    {:else}
      <p>No renderer form exists for "{data.lens.renderer}". Raw map data below.</p>
      <pre class="mono">{JSON.stringify(data.map.projection, null, 2)}</pre>
    {/if}
  </div>

  <section class="accessible-summary">
    <h2>{dict.map.accessibleSummaryHeading}</h2>
    <p lang="en">{data.map.accessible_summary}</p>
  </section>

  <section class="citation">
    <h2>{dict.map.citationHeading}</h2>
    <dl>
      <dt>{dict.map.citationUrl}</dt>
      <dd class="mono">{page.url.href}</dd>
      <dt>{dict.map.citationHash}</dt>
      <dd class="mono">{data.map.content_hash}</dd>
      <dt>{dict.map.citationWatermark}</dt>
      <dd class="mono">{data.map.event_watermark}</dd>
    </dl>
    <p class="citation__print-hint no-print">{dict.common.printCitationHint}</p>
    <p class="no-print"><a href="export.json">export.json ↓</a></p>
  </section>
</article>

<style>
  .renderer {
    margin: var(--space-6) 0;
  }

  .accessible-summary {
    border-top: var(--border-thin);
    padding-top: var(--space-5);
  }

  .accessible-summary p {
    color: var(--ink-soft);
  }

  .citation {
    border: var(--border-strong);
    padding: var(--space-5);
    margin-top: var(--space-6);
  }

  .citation dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-2) var(--space-4);
  }

  .citation dt {
    color: var(--ink-faint);
    font-family: var(--font-record);
    font-size: var(--step--1);
  }

  .citation dd {
    margin: 0;
    word-break: break-all;
  }

  @media print {
    .citation {
      border: 1px solid #000;
    }
  }
</style>
