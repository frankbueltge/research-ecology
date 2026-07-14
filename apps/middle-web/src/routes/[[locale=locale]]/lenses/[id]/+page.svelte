<script lang="ts">
  import { dictionary, localizedPath } from "$lib/i18n";
  import LensManifestPanel from "$lib/ui/LensManifestPanel.svelte";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);

  function selectionSummaryOf(selection: Record<string, unknown>): string {
    const events = Array.isArray(selection.event_ids) ? selection.event_ids.length : 0;
    const objects = Array.isArray(selection.object_ref_ids) ? selection.object_ref_ids.length : 0;
    const assertions = Array.isArray(selection.assertion_ids) ? selection.assertion_ids.length : 0;
    const obligations = Array.isArray(selection.obligation_ids) ? selection.obligation_ids.length : 0;
    return `${events} events · ${objects} objects · ${assertions} assertions · ${obligations} obligations`;
  }
</script>

<svelte:head>
  <title>{data.latest.name} — {dict.lens.kicker} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.lens.kicker}</p>
  <h1>{data.latest.name}</h1>
  <p class="lede" lang="en">{data.latest.purpose}</p>

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
    openByDefault={true}
    labels={dict.map}
    toggleHint={dict.common.lensManifestToggleHint}
  />

  <p>
    <a href={localizedPath(data.locale, `/encounters/${data.encounterId}/maps/${data.lensId}@${data.latestMapVersion}`)}>
      {dict.lens.viewMapCta} →
    </a>
  </p>

  <h2>{dict.lens.rendererLabel}</h2>
  <p class="mono">{data.latest.renderer}</p>

  <h2>{dict.lens.unknownTypePolicyLabel}</h2>
  <p class="mono">{data.latest.unknown_type_policy ?? "—"}</p>

  <h2>{dict.lens.exclusionsHeading}</h2>
  <ul>
    {#each data.latest.declared_exclusions as exclusion, i (i)}
      <li lang="en">{typeof exclusion.reason === "string" ? exclusion.reason : JSON.stringify(exclusion)}</li>
    {/each}
  </ul>

  <h2>{dict.lens.versionsHeading}</h2>
  <ul class="record-list lens-versions">
    {#each data.versions as version (version.version)}
      <li>
        <span class="mono">v{version.version}</span> — {selectionSummaryOf(version.selection)}
        <span class="mono lens-versions__hash">{version.implementation_hash.slice(0, 22)}…</span>
      </li>
    {/each}
  </ul>
</article>

<style>
  .lens-versions li {
    border-bottom: var(--border-thin);
    padding: var(--space-2) 0;
  }

  .lens-versions__hash {
    color: var(--ink-faint);
    margin-left: var(--space-2);
  }
</style>
