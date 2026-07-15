<script lang="ts">
  import type { Narrative } from "$lib/narrative.js";
  import { isDivergenceBeat } from "$lib/narrative.js";
  import { localizedPath } from "$lib/i18n";
  import type { Dictionary } from "$lib/i18n/dictionary.js";
  import type { Locale } from "$lib/i18n";

  const {
    narrative,
    locale,
    dict,
    encounterId
  }: { narrative: Narrative; locale: Locale; dict: Dictionary; encounterId: string } = $props();

  const beats = $derived(narrative.beats);

  // Badge positions over the drawing, in percent of the stage box. The geometry they anchor
  // to lives in the aria-hidden SVG below; the badges themselves are the interactive layer.
  // Anchored ON the geometry (percent of the 1200×430 viewBox).
  const BADGE_POS: Array<{ left: number; top: number }> = [
    { left: 11.7, top: 34.5 }, // 1 — on the instrument's top edge
    { left: 25, top: 40 }, // 2 — on the transfer line
    { left: 62, top: 30.5 }, // 3 — at the gap (the declined case)
    { left: 46.7, top: 78 }, // 4 — on the counter-arrow
    { left: 6, top: 55.5 }, // 5 — on the re-examination ring
    { left: 86.5, top: 47.7 } // 6 — at the fork's origin
  ];
</script>

<!-- CSS-only station selection: the radios are direct children so that
     #st-N:checked ~ … sibling selectors can drive badge, geometry and caption states.
     Works without JavaScript. -->
<div class="tableau">
  {#each beats as beat, i (beat.id)}
    <input
      type="radio"
      name="tableau-station"
      id={`st-${i + 1}`}
      class="st-radio"
      checked={i === 0}
      aria-label={`${i + 1} — ${beat.heading}`}
    />
  {/each}

  <div class="tableau__stage">
    <svg viewBox="0 0 1200 430" preserveAspectRatio="xMidYMid meet" aria-hidden="true" class="tableau__svg">
      <!-- the instrument -->
      <g class="g-st g-st-1">
        <circle cx="140" cy="205" r="44" class="ln" />
        {#each [-60, -38, -16, 6, 28, 50] as deg}
          <line
            x1={140 + 44 * Math.cos((deg * Math.PI) / 180)}
            y1={205 - 44 * Math.sin((deg * Math.PI) / 180)}
            x2={140 + 52 * Math.cos((deg * Math.PI) / 180)}
            y2={205 - 52 * Math.sin((deg * Math.PI) / 180)}
            class="ln ln--thin"
          />
        {/each}
      </g>
      <!-- the re-examination ring (station 5) -->
      <g class="g-st g-st-5">
        <circle cx="140" cy="205" r="60" class="ln ln--dashed ln--thin" />
      </g>

      <!-- the transfer line, with the conditions as clause ticks and the declined case as a
           deliberate gap (station 3) -->
      <g class="g-st g-st-2">
        <path d="M 196 192 C 380 158, 560 150, 726 158" class="ln" fill="none" />
        {#each [{ x: 360, y: 167 }, { x: 470, y: 158 }, { x: 580, y: 154 }] as t}
          <line x1={t.x} y1={t.y - 7} x2={t.x} y2={t.y + 7} class="ln ln--thin" />
          <rect x={t.x - 3} y={t.y - 13} width="6" height="6" class="fill" />
        {/each}
      </g>
      <g class="g-st g-st-3">
        <line x1="726" y1="148" x2="726" y2="168" class="ln" />
        <line x1="762" y1="150" x2="762" y2="170" class="ln" />
      </g>
      <path d="M 762 160 C 830 163, 890 172, 934 188" class="ln" fill="none" />

      <!-- the work -->
      <g class="g-st g-st-2">
        <rect x="938" y="158" width="100" height="94" rx="2" class="ln" fill="none" />
        <line x1="958" y1="236" x2="1018" y2="236" class="ln ln--thin" />
        <line x1="988" y1="236" x2="998" y2="214" class="ln ln--thin" />
      </g>

      <!-- the correction, flowing backwards (station 4) -->
      <g class="g-st g-st-4">
        <path d="M 938 282 C 700 356, 380 356, 224 262" class="ln ln--accent ln--dashed" fill="none" />
        <polygon points="216,258 240,252 234,272" class="fill fill--accent" />
      </g>

      <!-- the fork: two readings, open-ended (station 6) -->
      <g class="g-st g-st-6">
        <line x1="1038" y1="178" x2="1132" y2="128" class="ln" />
        <line x1="1038" y1="232" x2="1132" y2="282" class="ln ln--accent" />
        <circle cx="1138" cy="125" r="5" class="ln ln--thin" fill="none" />
        <circle cx="1138" cy="285" r="5" class="ln ln--accent ln--thin" fill="none" />
      </g>

      <!-- captions inside the drawing: generic by design — identity recedes; the collectives
           are named only in station 6's caption text below -->
      <text x="140" y="314" class="lbl" text-anchor="middle">{dict.poster.instrumentLabel}</text>
      <text x="988" y="142" class="lbl" text-anchor="middle">{dict.poster.workLabel}</text>
      <text x="1180" y="316" class="lbl" text-anchor="end">{dict.poster.readingsLabel}</text>
    </svg>

    {#each beats as beat, i (beat.id)}
      <label class="st-badge mono" for={`st-${i + 1}`} style={`left:${BADGE_POS[i]!.left}%; top:${BADGE_POS[i]!.top}%;`}>
        {i + 1}
      </label>
    {/each}
  </div>

  <p class="tableau__hint mono">{dict.poster.stationsLabel}</p>

  <div class="tableau__captions">
    {#each beats as beat, i (beat.id)}
      <div class={`tableau__caption cap-${i + 1}`}>
        <h2 class="cap-heading">
          <span class="cap-no mono">{i + 1}</span>
          {beat.heading}
        </h2>
        {#if isDivergenceBeat(beat)}
          <div class="cap-divergence">
            <div class="cap-div-side">
              <p class="cap-div-label mono">{beat.divergence.leftLabel}</p>
              <p class="cap-quote mono">&ldquo;{beat.divergence.leftQuote}&rdquo;</p>
            </div>
            <div class="cap-div-side cap-div-side--accent">
              <p class="cap-div-label mono">{beat.divergence.rightLabel}</p>
              <p class="cap-quote mono">&ldquo;{beat.divergence.rightQuote}&rdquo;</p>
            </div>
          </div>
          <p class="cap-attribution">{beat.divergence.closing}</p>
          <p class="cap-links">
            <a href={localizedPath(locale, `/encounters/${encounterId}/compare`)}>{dict.narrative.viewDivergenceCta}</a>
            <a href={localizedPath(locale, `/encounters/${encounterId}`)}>{dict.narrative.viewRecordCta}</a>
          </p>
        {:else}
          <blockquote class="cap-quote mono">&ldquo;{beat.quote}&rdquo;</blockquote>
          <p class="cap-attribution">— {beat.attribution}</p>
          <p class="cap-links">
            <a href={localizedPath(locale, `/encounters/${encounterId}#event-${beat.akte.eventId}`)}>{dict.narrative.viewRecordCta}</a>
          </p>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .tableau {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* radios stay focusable/checkable without JS; visually the badges are their labels */
  .st-radio {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .tableau__stage {
    position: relative;
    width: 100%;
  }

  .tableau__svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .ln {
    stroke: var(--room-line);
    stroke-width: 2.25;
    stroke-linecap: round;
    fill: none;
    transition: stroke 160ms ease, opacity 160ms ease;
    opacity: 0.85;
  }
  .ln--thin {
    stroke-width: 1.4;
  }
  .ln--dashed {
    stroke-dasharray: 7 8;
  }
  .ln--accent {
    stroke: var(--room-accent);
  }
  .fill {
    fill: var(--room-line);
    opacity: 0.85;
  }
  .fill--accent {
    fill: var(--room-accent);
  }
  .lbl {
    font-family: var(--font-record);
    font-size: 13px;
    letter-spacing: 0.22em;
    fill: var(--room-faint);
  }

  /* selected station: its geometry brightens */
  .tableau:has(#st-1:checked) .g-st-1 .ln,
  .tableau:has(#st-2:checked) .g-st-2 .ln,
  .tableau:has(#st-3:checked) .g-st-3 .ln,
  .tableau:has(#st-4:checked) .g-st-4 .ln,
  .tableau:has(#st-5:checked) .g-st-5 .ln,
  .tableau:has(#st-6:checked) .g-st-6 .ln {
    stroke: var(--room-accent);
    opacity: 1;
  }
  .tableau:has(#st-2:checked) .g-st-2 .fill,
  .tableau:has(#st-4:checked) .g-st-4 .fill {
    fill: var(--room-accent);
    opacity: 1;
  }

  .st-badge {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    border: 1.5px solid var(--room-line);
    border-radius: 50%;
    background: var(--room);
    color: var(--room-ink);
    font-size: 0.85rem;
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
  }
  .st-badge:hover {
    border-color: var(--room-accent);
  }
  .tableau:has(#st-1:checked) label[for="st-1"],
  .tableau:has(#st-2:checked) label[for="st-2"],
  .tableau:has(#st-3:checked) label[for="st-3"],
  .tableau:has(#st-4:checked) label[for="st-4"],
  .tableau:has(#st-5:checked) label[for="st-5"],
  .tableau:has(#st-6:checked) label[for="st-6"] {
    background: var(--room-accent);
    border-color: var(--room-accent);
    color: var(--room);
    font-weight: 700;
  }
  .st-radio:focus-visible + * ~ .tableau__stage label,
  .st-radio:focus-visible ~ .tableau__stage .st-badge {
    outline: none;
  }
  .tableau:has(#st-1:focus-visible) label[for="st-1"],
  .tableau:has(#st-2:focus-visible) label[for="st-2"],
  .tableau:has(#st-3:focus-visible) label[for="st-3"],
  .tableau:has(#st-4:focus-visible) label[for="st-4"],
  .tableau:has(#st-5:focus-visible) label[for="st-5"],
  .tableau:has(#st-6:focus-visible) label[for="st-6"] {
    outline: 2px solid var(--room-accent);
    outline-offset: 3px;
  }

  .tableau__hint {
    margin: var(--space-2) 0 0;
    color: var(--room-faint);
    font-size: var(--step--1);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .tableau__captions {
    margin-top: var(--space-3);
    min-height: 13.5rem;
    border-top: 1px solid color-mix(in srgb, var(--room-line) 35%, transparent);
    padding-top: var(--space-4);
  }

  .tableau__caption {
    display: none;
    max-width: 62rem;
  }
  .tableau:has(#st-1:checked) .cap-1,
  .tableau:has(#st-2:checked) .cap-2,
  .tableau:has(#st-3:checked) .cap-3,
  .tableau:has(#st-4:checked) .cap-4,
  .tableau:has(#st-5:checked) .cap-5,
  .tableau:has(#st-6:checked) .cap-6 {
    display: block;
  }

  .cap-heading {
    font-family: var(--font-editorial);
    font-size: clamp(1.15rem, 1.9vw, 1.55rem);
    font-weight: 600;
    margin: 0 0 var(--space-3);
    color: var(--room-ink);
  }
  .cap-no {
    display: inline-grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid var(--room-accent);
    border-radius: 50%;
    font-size: 0.8rem;
    color: var(--room-accent);
    margin-right: 0.5rem;
    vertical-align: 0.15em;
  }
  .cap-quote {
    margin: 0 0 var(--space-2);
    padding-left: var(--space-4);
    border-left: 3px solid var(--room-accent);
    color: var(--room-ink);
    font-size: var(--step-0);
    line-height: 1.55;
  }
  .cap-attribution {
    margin: 0 0 var(--space-2);
    color: var(--room-faint);
    font-size: var(--step--1);
  }
  .cap-links {
    margin: 0;
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  .cap-links a {
    color: var(--room-ink);
    text-decoration-color: var(--room-accent);
    text-underline-offset: 4px;
  }

  .cap-divergence {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }
  @media (min-width: 64rem) {
    .cap-divergence {
      grid-template-columns: 1fr 1fr;
    }
  }
  .cap-div-label {
    margin: 0 0 var(--space-1);
    color: var(--room-faint);
    font-size: var(--step--1);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .cap-div-side .cap-quote {
    border-left-color: var(--room-line);
  }
  .cap-div-side--accent .cap-quote {
    border-left-color: var(--room-accent);
  }

  @media (max-width: 48rem) {
    .st-badge {
      width: 1.7rem;
      height: 1.7rem;
      font-size: 0.75rem;
    }
    .tableau__captions {
      min-height: 17rem;
    }
  }
</style>
