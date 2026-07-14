<script lang="ts">
  import { dictionary, localizedPath } from "$lib/i18n";
  import Glyph from "$lib/ui/Glyph.svelte";
  import PendingApprovalBadge from "$lib/ui/PendingApprovalBadge.svelte";
  import UnresolvedRule from "$lib/ui/UnresolvedRule.svelte";
  import { isDivergenceBeat } from "$lib/narrative.js";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
  const locale = $derived(data.locale);
</script>

<svelte:head>
  <title>{dict.common.siteName}</title>
</svelte:head>

<!-- Ebene 1 — das Blatt (design "redesign-after-first-critique" §2 / work order §1): a full
     sheet, spectacular through scale + typography + the drama of the real material, deliberately
     near-empty. No collective names, no numbers, no UI beyond the existing quiet header chrome
     and the descent invitation. -->
<section class="poster" aria-labelledby="poster-headline">
  <div class="poster__stage">
    <h1 id="poster-headline" class="poster__headline">{dict.poster.headline}</h1>
    <div class="poster__glyph"><Glyph variant="animated" /></div>
    <a class="poster__invitation mono" href="#beat-1">{dict.poster.invitation}</a>
  </div>
  <p class="poster__footnote mono">{dict.poster.footnote}</p>
</section>

<!-- Ebene 2 — die Erzählung (work order §2): six authored beats, one viewport-height each,
     natural scroll only (no scrolljacking, no scroll library). -->
<section class="narrative" aria-label="Narrative">
  {#each data.narrative.beats as beat, i (beat.id)}
    <article class="beat" id={beat.id}>
      <div class="beat__glyph-margin"><Glyph variant="static" stage={(i + 1) as 1 | 2 | 3 | 4 | 5 | 6} /></div>
      <div class="beat__body">
        <h2 class="beat__heading">{beat.heading[locale]}</h2>

        {#if isDivergenceBeat(beat)}
          <div class="beat__divergence">
            <div class="beat__divergence-side beat__divergence-side--meridian">
              <p class="kicker">{beat.divergence.leftLabel[locale]}</p>
              <p class="beat__divergence-quote mono">&ldquo;{beat.divergence.leftQuote}&rdquo;</p>
            </div>
            <div class="beat__divergence-side beat__divergence-side--ensemble">
              <p class="kicker">{beat.divergence.rightLabel[locale]}</p>
              <p class="beat__divergence-quote mono">&ldquo;{beat.divergence.rightQuote}&rdquo;</p>
            </div>
          </div>
          <UnresolvedRule text={beat.divergence.closing[locale]} />
          <p class="beat__cta">
            <a href={localizedPath(locale, `/encounters/${data.encounterId}/compare`)}>{dict.narrative.viewDivergenceCta}</a>
            <a href={localizedPath(locale, `/encounters/${data.encounterId}`)}>{dict.narrative.viewRecordCta}</a>
          </p>
        {:else}
          <blockquote class="beat__quote mono">&ldquo;{beat.quote}&rdquo;</blockquote>
          <p class="beat__attribution">{beat.attribution[locale]}</p>
          <p class="beat__cta">
            <a href={localizedPath(locale, `/encounters/${data.encounterId}#event-${beat.akte.eventId}`)}>{dict.narrative.viewRecordCta}</a
            >
          </p>
        {/if}
      </div>
    </article>
  {/each}

  <!-- Pending state (design §1.3 "jede Verdichtung ... ist ein redaktioneller Akt mit Autor
       und Pending-Zustand"): shown once, subtly, at the end of the sequence — never repeated on
       every beat (work order §2). -->
  <p class="narrative__editorial-note mono">
    <span>{dict.narrative.authoredByPrefix} {data.narrative.authored_by}</span>
    {#if data.narrative.approval === "pending"}
      <PendingApprovalBadge label={dict.common.pendingApprovalLabel} />
    {/if}
  </p>
</section>

<style>
  /* -- poster (Ebene 1) ------------------------------------------------------------------- */

  .poster {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-6);
    padding: var(--space-6) var(--space-5) var(--space-4);
  }

  .poster__stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--space-6);
  }

  .poster__headline {
    margin: 0;
    max-width: 90vw;
    font-family: var(--font-editorial);
    font-weight: 600;
    line-height: 1.05;
    font-size: clamp(2.5rem, 9vw, 7.5rem);
    text-wrap: balance;
  }

  .poster__glyph {
    width: min(90vw, 32rem);
  }

  .poster__invitation {
    display: inline-block;
    color: var(--ink-soft);
    text-decoration: none;
    font-size: var(--step-0);
    border-bottom: 1px solid var(--rule-strong);
    padding-bottom: 0.15em;
  }

  .poster__invitation:hover {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }

  .poster__footnote {
    max-width: var(--content-max);
    color: var(--ink-faint);
    font-size: var(--step--1);
    margin: 0;
  }

  /* -- narrative (Ebene 2) ------------------------------------------------------------------ */

  .narrative {
    display: flex;
    flex-direction: column;
  }

  .beat {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
    align-content: center;
    padding: var(--space-8) 0;
    border-top: var(--border-thin);
  }

  @media (min-width: 50rem) {
    .beat {
      grid-template-columns: minmax(6rem, 9rem) 1fr;
      align-items: center;
    }
  }

  .beat__glyph-margin {
    width: 6rem;
    opacity: 0.85;
  }

  @media (min-width: 50rem) {
    .beat__glyph-margin {
      width: 100%;
    }
  }

  .beat__body {
    max-width: var(--content-max);
  }

  .beat__heading {
    font-family: var(--font-editorial);
    font-weight: 600;
    line-height: 1.15;
    font-size: clamp(1.7rem, 4.5vw, var(--step-4));
    margin: 0 0 var(--space-5);
  }

  .beat__quote {
    margin: 0 0 var(--space-3);
    padding-left: var(--space-5);
    border-left: 3px solid var(--accent);
    font-family: var(--font-record);
    font-size: var(--step-1);
    font-style: normal;
  }

  .beat__attribution {
    margin: 0 0 var(--space-5);
    padding-left: var(--space-5);
    color: var(--ink-faint);
    font-family: var(--font-record);
    font-size: var(--step--1);
  }

  .beat__cta {
    font-family: var(--font-record);
    font-size: var(--step--1);
    display: flex;
    gap: var(--space-4);
  }

  .beat__divergence {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
  }

  @media (min-width: 40rem) {
    .beat__divergence {
      grid-template-columns: 1fr 1fr;
    }
  }

  .beat__divergence-side {
    border: var(--border-thin);
    padding: var(--space-4);
  }

  .beat__divergence-side--ensemble {
    border: 2px solid var(--negative-band-rule);
    background: var(--negative-band-bg);
  }

  .beat__divergence-quote {
    margin: var(--space-2) 0 0;
  }

  .narrative__editorial-note {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    justify-content: center;
    padding: var(--space-6) 0 var(--space-4);
    color: var(--ink-faint);
    font-size: var(--step--1);
  }
</style>
