<script lang="ts">
  /**
   * Lens manifest summary panel (design §6 / spec 04 §7.2): author, basis, selection,
   * exclusions (incl. synthesized ones), unknown types, engine version, map version + hash,
   * watermark. "Collapsible, open by default on /lenses/[id], one keypress (m) elsewhere"
   * (work order §0). Built on native <details>/<summary> so it is fully usable with JS
   * disabled (click/Enter/Space on the summary); the "m" keypress below is a progressive
   * enhancement layered on top, not a replacement.
   */
  interface ExclusionEntry {
    reason: string;
    synthesized?: boolean;
  }

  interface Props {
    lensName: string;
    authorLabel: string;
    basis: string;
    selectionSummary: string;
    exclusions: ExclusionEntry[];
    unknownTypesCount: number;
    engineVersion: string;
    mapId: string;
    mapVersion: number;
    contentHash: string;
    watermark: string;
    openByDefault?: boolean;
    labels: {
      manifestHeading: string;
      manifestAuthor: string;
      manifestBasis: string;
      manifestSelection: string;
      manifestExclusions: string;
      manifestUnknownTypes: string;
      manifestEngineVersion: string;
      manifestVersion: string;
      manifestHash: string;
      manifestWatermark: string;
    };
    toggleHint?: string;
  }

  const {
    lensName,
    authorLabel,
    basis,
    selectionSummary,
    exclusions,
    unknownTypesCount,
    engineVersion,
    mapId,
    mapVersion,
    contentHash,
    watermark,
    openByDefault = false,
    labels,
    toggleHint
  }: Props = $props();

  let detailsEl: HTMLDetailsElement | undefined = $state();

  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== "m" && event.key !== "M") return;
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
    if (!detailsEl) return;
    detailsEl.open = !detailsEl.open;
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

<details class="lens-manifest no-print" bind:this={detailsEl} open={openByDefault}>
  <summary class="lens-manifest__summary mono">
    {labels.manifestHeading} — {lensName}
  </summary>
  <dl class="lens-manifest__grid">
    <dt>{labels.manifestAuthor}</dt>
    <dd>{authorLabel}</dd>

    <dt>{labels.manifestBasis}</dt>
    <dd>{basis}</dd>

    <dt>{labels.manifestSelection}</dt>
    <dd>{selectionSummary}</dd>

    <dt>{labels.manifestExclusions}</dt>
    <dd>
      {#if exclusions.length === 0}
        <span class="mono">—</span>
      {:else}
        <ul class="lens-manifest__exclusions">
          {#each exclusions as exclusion, i (i)}
            <li>{exclusion.reason}{#if exclusion.synthesized}<span class="mono lens-manifest__synth"> (synthesized)</span>{/if}</li>
          {/each}
        </ul>
      {/if}
    </dd>

    <dt>{labels.manifestUnknownTypes}</dt>
    <dd class="mono">{unknownTypesCount}</dd>

    <dt>{labels.manifestEngineVersion}</dt>
    <dd class="mono">{engineVersion}</dd>

    <dt>{labels.manifestVersion}</dt>
    <dd class="mono">{mapId}@{mapVersion}</dd>

    <dt>{labels.manifestHash}</dt>
    <dd class="mono lens-manifest__hash">{contentHash}</dd>

    <dt>{labels.manifestWatermark}</dt>
    <dd class="mono">{watermark}</dd>
  </dl>
  {#if toggleHint}
    <p class="lens-manifest__hint mono">{toggleHint}</p>
  {/if}
</details>

<style>
  .lens-manifest {
    border: var(--border-strong);
    background: var(--paper-raised);
    margin-bottom: var(--space-5);
  }

  .lens-manifest__summary {
    cursor: pointer;
    padding: var(--space-3) var(--space-4);
    font-size: var(--step--1);
    letter-spacing: 0.02em;
  }

  .lens-manifest__grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-2) var(--space-4);
    padding: 0 var(--space-4) var(--space-4);
    margin: 0;
  }

  .lens-manifest__grid dt {
    font-family: var(--font-record);
    font-size: var(--step--1);
    color: var(--ink-faint);
  }

  .lens-manifest__grid dd {
    margin: 0;
  }

  .lens-manifest__exclusions {
    margin: 0;
    padding-left: 1.1em;
  }

  .lens-manifest__synth {
    color: var(--ink-faint);
  }

  .lens-manifest__hash {
    word-break: break-all;
    font-size: 0.85em;
  }

  .lens-manifest__hint {
    padding: 0 var(--space-4) var(--space-3);
    color: var(--ink-faint);
    font-size: var(--step--1);
    margin: 0;
  }
</style>
