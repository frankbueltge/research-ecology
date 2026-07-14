<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import ObjectTransformation from "$lib/renderers/ObjectTransformation.svelte";
  import ParallelPositions from "$lib/renderers/ParallelPositions.svelte";
  import LensManifestPanel from "$lib/ui/LensManifestPanel.svelte";
  import type { ObjectTransformationPayload, ParallelPositionsPayload } from "@research-ecology/projections";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);

  const panelA = $derived(data.panels[0]!);
  const panelB = $derived(data.panels[1]!);

  // LensManifestView (data.ts) uses name/version; LensManifestPanel.svelte's props are named
  // lensName/mapVersion — translate rather than widen the component's prop names to two aliases.
  function manifestPanelProps(manifest: (typeof data.panels)[number]["manifest"]) {
    const { name, version, ...rest } = manifest;
    return { ...rest, lensName: name, mapVersion: version };
  }
</script>

<svelte:head>
  <title>{dict.compare.kicker} — {data.bundle.encounter.title} — {dict.common.siteName}</title>
</svelte:head>

<article>
  <p class="kicker">{dict.compare.kicker}</p>
  <h1 class="content">{dict.encounter.compareCta}</h1>
  <p class="lede content">{dict.compare.intro}</p>

  <div class="compare">
    <input type="radio" name="compare-view" id="view-a" checked class="compare-radio" />
    <input type="radio" name="compare-view" id="view-b" class="compare-radio" />

    <div class="compare-switcher no-print" role="group" aria-label={dict.compare.positionSwitcherLabel}>
      <span class="compare-switcher__label mono">{dict.compare.positionSwitcherLabel}:</span>
      <label for="view-a">Ensemble</label>
      <label for="view-b">Meridian</label>
    </div>

    <div class="compare-grid">
      <section class="compare-panel compare-panel--a">
        <h2>Ensemble — object-transformation</h2>
        <LensManifestPanel {...manifestPanelProps(panelA.manifest)} openByDefault={false} labels={dict.map} toggleHint={dict.common.lensManifestToggleHint} />
        <ObjectTransformation payload={panelA.map.projection as unknown as ObjectTransformationPayload} {dict} locale={data.locale} />
      </section>

      <section class="compare-panel compare-panel--b">
        <h2>Meridian — parallel-positions</h2>
        <LensManifestPanel {...manifestPanelProps(panelB.manifest)} openByDefault={false} labels={dict.map} toggleHint={dict.common.lensManifestToggleHint} />
        <ParallelPositions
          payload={panelB.map.projection as unknown as ParallelPositionsPayload}
          actorNames={data.actorNames}
          {dict}
          locale={data.locale}
          unrenderedAssertions={panelB.unrenderedAssertions}
        />
      </section>
    </div>
  </div>
</article>

<style>
  /* One position at a time at EVERY width (interim after the first human critique,
     2026-07-15): the earlier desktop two-column layout collided — the object-transformation
     renderer's internal grid overflowed its half-width panel onto the neighbour — and,
     worse, juxtaposing two complete registers is exactly the information deluge the
     critique named. The sticky switcher guides the contrast instead. The full guided-
     contrast redesign is specced in docs/design/redesign-after-first-critique.md. */
  .compare-radio {
    display: inline-block;
    position: absolute;
    left: -9999px;
  }

  .compare-switcher {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 5;
    gap: var(--space-3);
    align-items: center;
    padding: var(--space-3) var(--space-5);
    border-bottom: var(--border-thin);
    background: var(--paper);
  }

  .compare-switcher label {
    border: var(--border-thin);
    padding: var(--space-1) var(--space-3);
    cursor: pointer;
    font-family: var(--font-record);
    font-size: var(--step--1);
  }

  #view-a:checked ~ .compare-switcher label[for="view-a"],
  #view-b:checked ~ .compare-switcher label[for="view-b"] {
    border-color: var(--ink);
    font-weight: 600;
  }

  .compare-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding: var(--space-5);
    max-width: 72rem;
  }

  .compare-panel {
    display: none;
    min-width: 0;
    border-top: 3px solid var(--ink);
    padding-top: var(--space-4);
  }

  #view-a:checked ~ .compare-grid .compare-panel--a,
  #view-b:checked ~ .compare-grid .compare-panel--b {
    display: block;
  }
</style>
