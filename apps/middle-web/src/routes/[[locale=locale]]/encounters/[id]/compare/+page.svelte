<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import CorrectionOverlay from "$lib/ui/CorrectionOverlay.svelte";
  import UnresolvedRule from "$lib/ui/UnresolvedRule.svelte";
  import ObjectTransformation from "$lib/renderers/ObjectTransformation.svelte";
  import ParallelPositions from "$lib/renderers/ParallelPositions.svelte";
  import LensManifestPanel from "$lib/ui/LensManifestPanel.svelte";
  import type { ObjectTransformationPayload, ParallelPositionsPayload } from "@research-ecology/projections";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
  const prefix = $derived(data.locale === "de" ? "/de" : "");

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
  <title>{dict.divergence.heading} — {data.bundle.encounter.title} — {dict.common.siteName}</title>
</svelte:head>

<article>
  <p class="kicker">{dict.divergence.kicker}</p>
  <h1 class="content">{dict.divergence.heading}</h1>
  <p class="lede content">{dict.divergence.context}</p>

  <!-- Divergence view proper (work order §3 items 1–4): the shared backbone appears once, then
       the two positions open exactly at the point they diverge. -->
  <div class="divergence-primary">
    <section class="divergence-backbone">
      <p class="kicker">{dict.divergence.backboneHeading}</p>
      {#if data.divergence.caption}
        <p class="divergence-backbone__caption">{data.divergence.caption}</p>
      {/if}
      <p class="divergence-backbone__meta mono">
        <span class="kicker">{dict.divergence.appellateFindingLabel}</span>
        {#if data.divergence.appellateFindingDate}
          <time datetime={data.divergence.appellateFindingDate}>{data.divergence.appellateFindingDate.slice(0, 10)}</time>
        {/if}
      </p>
      {#if data.divergence.appellateFindingQuote}
        <blockquote class="divergence-backbone__quote mono">&ldquo;{data.divergence.appellateFindingQuote}&rdquo;</blockquote>
      {/if}
    </section>

    <div class="divergence-grid">
      <section class="divergence-position divergence-position--meridian">
        <h2>{dict.divergence.meridianLabel}</h2>
        <CorrectionOverlay
          baselineText={data.divergence.meridian.baselineText}
          baselineLabel="baseline (struck, not erased)"
          correctedText={data.divergence.meridian.correctedText}
          correctedLabel="corrected (session 33)"
        />
        {#if data.divergence.meridian.framingValue}
          <p class="divergence-position__framing">{data.divergence.meridian.framingValue}</p>
        {/if}
        {#if data.divergence.meridian.framingRationale}
          <p class="divergence-position__rationale">&ldquo;{data.divergence.meridian.framingRationale}&rdquo;</p>
        {/if}
        {#if data.divergence.meridian.assertionId}
          <p class="divergence-position__link">
            <a href={`${prefix}/assertions/${data.divergence.meridian.assertionId}`}>view authored assertion →</a>
          </p>
        {/if}
      </section>

      <section class="divergence-position divergence-position--ensemble">
        <h2>{dict.divergence.ensembleLabel}</h2>
        <div class="divergence-position__band">
          {#if data.divergence.ensemble.label}
            <p class="kicker mono">{data.divergence.ensemble.label}</p>
          {/if}
          {#if data.divergence.ensemble.rationale}
            <p class="divergence-position__rationale">&ldquo;{data.divergence.ensemble.rationale}&rdquo;</p>
          {/if}
        </div>
        {#if data.divergence.ensemble.assertionId}
          <p class="divergence-position__link">
            <a href={`${prefix}/assertions/${data.divergence.ensemble.assertionId}`}>view authored assertion →</a>
          </p>
        {/if}
      </section>
    </div>

    <UnresolvedRule text={dict.common.noSharedResolution} note={`${dict.divergence.bothStandNote} · ${data.divergence.watermark ?? ""}`} />
  </div>

  <!-- Full maps (work order §3 item 5): the pre-existing two-lens switcher, demoted to a
       collapsed, subordinate appendix — not deleted, not the primary form any more. -->
  <details class="full-maps no-print">
    <summary class="full-maps__summary mono">{dict.divergence.fullMapsHeading}</summary>
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
            dict={dict}
            locale={data.locale}
            unrenderedAssertions={panelB.unrenderedAssertions}
          />
        </section>
      </div>
    </div>
  </details>
</article>

<style>
  .divergence-primary {
    margin-bottom: var(--space-7);
  }

  .divergence-backbone {
    border: var(--border-strong);
    background: var(--paper-raised);
    padding: var(--space-5);
    margin: var(--space-5) 0 var(--space-6);
    max-width: var(--frame-max);
  }

  .divergence-backbone__caption {
    font-size: var(--step-1);
    font-weight: 600;
    margin: 0 0 var(--space-2);
  }

  .divergence-backbone__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--ink-faint);
    font-size: var(--step--1);
    margin: 0 0 var(--space-3);
  }

  .divergence-backbone__quote {
    padding-left: var(--space-5);
    border-left: 3px solid var(--ink);
    font-size: var(--step-1);
    margin: 0;
  }

  .divergence-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
    max-width: var(--frame-max);
    margin-bottom: var(--space-6);
  }

  @media (min-width: 64rem) {
    .divergence-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .divergence-position {
    border-top: 3px solid var(--ink);
    padding-top: var(--space-4);
  }

  .divergence-position h2 {
    margin-top: 0;
    font-size: var(--step-1);
  }

  .divergence-position__framing {
    font-size: var(--step-1);
    font-weight: 600;
    margin: 0 0 var(--space-2);
  }

  .divergence-position__rationale {
    font-style: italic;
    color: var(--ink-soft);
    margin: 0 0 var(--space-2);
  }

  .divergence-position__link {
    font-size: var(--step--1);
  }

  .divergence-position--ensemble .divergence-position__band {
    border: 2px solid var(--negative-band-rule);
    background: var(--negative-band-bg);
    padding: var(--space-4);
    margin-bottom: var(--space-2);
  }

  .full-maps {
    border-top: var(--border-strong);
    padding-top: var(--space-5);
    margin-top: var(--space-7);
  }

  .full-maps__summary {
    cursor: pointer;
    font-size: var(--step-0);
    letter-spacing: 0.02em;
    padding: var(--space-2) 0;
  }

  /* Interim switcher (design §5, phase-3c): one position at a time at every width — the
     object-transformation renderer's internal grid overflows a half-width panel, and
     juxtaposing two complete registers is exactly the deluge the divergence view above exists
     to avoid. Kept verbatim from the pre-3d compare page (work order §3 item 5: "keine
     Löschung, Demotion"). */
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
