<script lang="ts">
  import { dictionary, localizedPath } from "$lib/i18n";
  import EncounterTableau from "$lib/ui/EncounterTableau.svelte";
  import PendingApprovalBadge from "$lib/ui/PendingApprovalBadge.svelte";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
  const locale = $derived(data.locale);

  const displayDate = $derived(
    data.lastEventDate
      ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(`${data.lastEventDate}T00:00:00Z`))
      : ""
  );
</script>

<svelte:head>
  <title>{dict.common.siteName}</title>
</svelte:head>

<!-- Ebene 1, dritte Iteration (2026-07-15): the entrance is one composed tableau in a dark
     room — a deliberate inversion of the record's paper world. Kicker and status line answer
     "what is this?" immediately; the six-station drawing carries the whole story without
     scrolling; identity still recedes (collective names first appear in station 6's caption). -->
<section class="entrance" aria-labelledby="entrance-headline">
  <div class="entrance__meta mono">
    <span class="entrance__kicker">{dict.poster.kicker} · {data.encounterId.toUpperCase()}</span>
    <span class="entrance__status">
      {dict.poster.statusAsOf}
      {displayDate} · {dict.poster.statusLine}
    </span>
  </div>

  <h1 id="entrance-headline" class="entrance__headline">{data.narrative.headline ?? dict.poster.headline}</h1>

  <EncounterTableau narrative={data.narrative} {locale} {dict} encounterId={data.encounterId} />

  <div class="entrance__foot">
    <p class="entrance__ctas">
      <a href={localizedPath(locale, `/encounters/${data.encounterId}`)} class="entrance__cta">{dict.poster.openRecordCta}</a>
      <a href={localizedPath(locale, `/encounters/${data.encounterId}/compare`)} class="entrance__cta">{dict.poster.openDivergenceCta}</a>
    </p>
    <p class="entrance__footnote mono">
      <span>{dict.poster.footnote}</span>
      <span class="entrance__editorial">
        {dict.narrative.authoredByPrefix}
        {data.narrative.authored_by}
        {#if data.narrative.approval === "pending"}
          <PendingApprovalBadge label={dict.common.pendingApprovalLabel} />
        {/if}
      </span>
    </p>
  </div>
</section>

<style>
  /* the dark room: always dark, in both site themes — the entrance is the night room,
     the record is the reading room */
  .entrance {
    --room: #14110e;
    --room-ink: #ece7df;
    --room-faint: rgba(236, 231, 223, 0.62);
    --room-line: #d8d2c6;
    --room-accent: #cf7350;

    /* the entrance is always dark regardless of the site's own light/dark toggle, but
       descendant components (e.g. PendingApprovalBadge) read the site's global --ink-soft/
       --rule-strong tokens — those flip with the site theme, not the room. In the site's
       light theme --ink-soft is #4a4440 (tuned for the --paper background), which measures
       only 1.96:1 against this room's #14110e (axe: color-contrast, serious). Pin both tokens
       to the room's own palette here so anything inside the room reads correctly no matter
       which site theme is active. */
    --ink-soft: var(--room-faint);
    --rule-strong: var(--room-line);

    background: var(--room);
    color: var(--room-ink);
    min-height: calc(100dvh - var(--header-height, 4rem));
    display: flex;
    flex-direction: column;
    padding: var(--space-5) var(--space-6) var(--space-4);
    margin: 0;
  }

  .entrance__meta {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-5);
    font-size: var(--step--1);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--room-faint);
    border-bottom: 1px solid color-mix(in srgb, var(--room-line) 30%, transparent);
    padding-bottom: var(--space-3);
  }

  .entrance__status {
    color: var(--room-accent);
  }

  .entrance__headline {
    font-family: var(--font-editorial);
    font-weight: 600;
    font-size: clamp(1.85rem, 4.3vw, 3.9rem);
    line-height: 1.08;
    letter-spacing: -0.01em;
    max-width: 24ch;
    margin: var(--space-5) 0 var(--space-4);
    text-wrap: balance;
    color: var(--room-ink);
  }

  .entrance__foot {
    margin-top: auto;
    padding-top: var(--space-4);
  }

  .entrance__ctas {
    display: flex;
    gap: var(--space-5);
    flex-wrap: wrap;
    margin: 0 0 var(--space-3);
  }

  .entrance__cta {
    color: var(--room-ink);
    font-family: var(--font-record);
    font-size: var(--step-0);
    text-decoration-color: var(--room-accent);
    text-decoration-thickness: 2px;
    text-underline-offset: 5px;
  }
  .entrance__cta:hover {
    color: var(--room-accent);
  }

  .entrance__footnote {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-5);
    margin: 0;
    font-size: var(--step--1);
    color: var(--room-faint);
  }

  .entrance__editorial {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  @media (max-width: 48rem) {
    .entrance {
      padding: var(--space-4);
      min-height: 0;
    }
    .entrance__headline {
      font-size: clamp(1.6rem, 7.2vw, 2.4rem);
    }
  }
</style>
