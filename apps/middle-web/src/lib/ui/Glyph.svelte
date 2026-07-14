<script lang="ts">
  /**
   * The glyph (work order phase-3d §1/§2; design "redesign-after-first-critique" §2 Ebene 1):
   * a drawing, not a graph — a long transfer line (ink, left→right) and a shorter, dashed
   * correction arrow underneath it (terracotta, right→left). Two variants:
   *
   * - `"animated"` (the poster, Ebene 1): draws itself once via `stroke-dashoffset` on load,
   *   ~2.4s total, `animation-iteration-count` implicitly 1 (no loop, nothing pulses — work
   *   order §1 "Keine Loops, nichts pulsiert"). `prefers-reduced-motion: reduce` cancels the
   *   animation and renders fully drawn immediately (work order §4 "reduced-motion (keine
   *   Zeichnung)").
   * - `"static"` (the beat margin miniature, Ebene 2): a fixed, pre-drawn state for a given
   *   `stage` (1–6) — no animation, no JS, plain SVG geometry computed once at render time
   *   (work order §2 "statisch pro Beat, kein JS nötig"). The transfer line lengthens through
   *   stages 1–5; the correction arrow only exists from stage 4 onward (mirrors beat 4, "the
   *   correction flows backwards") and completes at stage 5; stage 6 adds a small diverging
   *   fork at the transfer line's end (beat 6, "two readings remain").
   *
   * Purely decorative (the heading + quote already carry the meaning) — `aria-hidden`, no
   * accessible name needed.
   */
  interface Props {
    variant?: "animated" | "static";
    stage?: 1 | 2 | 3 | 4 | 5 | 6;
  }

  const { variant = "animated", stage = 6 }: Props = $props();

  // Unique per component instance, stable across SSR/hydration (Svelte 5.20+) — required
  // because up to seven Glyph instances (poster + six beat miniatures) can exist on the same
  // page at once, and SVG marker ids must be unique within the document.
  const uid = $props.id();
  const markerId = `glyph-arrow-${uid}`;

  const TRANSFER_END_X: Record<number, number> = { 1: 130, 2: 210, 3: 290, 4: 370, 5: 370, 6: 370 };
  const CORRECTION_START_X = 340;
  const CORRECTION_END_X: Record<number, number> = { 4: 220, 5: 90, 6: 90 };

  function transferPath(endX: number): string {
    const startX = 30;
    const y = 55;
    const midY = 33;
    const midX = startX + (endX - startX) / 2;
    return `M${startX},${y} Q${midX},${midY} ${endX},${y}`;
  }

  function correctionPath(startX: number, endX: number): string {
    const y = 100;
    const midY = 120;
    const midX = startX - (startX - endX) / 2;
    return `M${startX},${y} Q${midX},${midY} ${endX},${y}`;
  }

  const staticTransferD = $derived(transferPath(TRANSFER_END_X[stage] ?? 370));
  const staticShowCorrection = $derived(stage >= 4);
  const staticCorrectionD = $derived(correctionPath(CORRECTION_START_X, CORRECTION_END_X[stage] ?? 90));
  const staticShowArrowhead = $derived(stage >= 5);
  const staticShowFork = $derived(stage >= 6);
</script>

<svg class="glyph" class:glyph--animated={variant === "animated"} viewBox="0 0 400 140" aria-hidden="true" focusable="false">
  <defs>
    <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" class="glyph__arrowhead" />
    </marker>
  </defs>

  {#if variant === "animated"}
    <path class="glyph__transfer" d={transferPath(370)} pathLength="1" />
    <path class="glyph__correction" d={correctionPath(CORRECTION_START_X, 90)} pathLength="1" marker-end={`url(#${markerId})`} />
  {:else}
    <path class="glyph__transfer glyph__transfer--static" d={staticTransferD} />
    {#if staticShowCorrection}
      <path
        class="glyph__correction glyph__correction--static"
        d={staticCorrectionD}
        marker-end={staticShowArrowhead ? `url(#${markerId})` : undefined}
      />
    {/if}
    {#if staticShowFork}
      <path class="glyph__fork" d="M370,55 L392,42 M370,55 L392,68" />
    {/if}
  {/if}
</svg>

<style>
  .glyph {
    width: 100%;
    height: auto;
    display: block;
  }

  .glyph__transfer,
  .glyph__correction,
  .glyph__fork {
    fill: none;
    stroke-linecap: round;
  }

  .glyph__transfer {
    stroke: var(--ink);
    stroke-width: 3;
  }

  .glyph__correction {
    stroke: var(--accent);
    stroke-width: 2.5;
  }

  .glyph__correction--static {
    stroke-dasharray: 7 6;
  }

  .glyph__fork {
    stroke: var(--ink-faint);
    stroke-width: 2;
  }

  .glyph__arrowhead {
    fill: var(--accent);
  }

  /* Self-drawing, once, no loop (work order §1 "Keine Loops, nichts pulsiert"; §4 reduced
     motion below cancels this branch entirely). ~2.4s total: transfer line 0.1s–1.5s,
     correction arrow overlapping from 1.3s–2.4s. */
  .glyph--animated .glyph__transfer {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: glyph-draw 1.4s var(--motion-ease) forwards;
    animation-delay: 0.1s;
  }

  .glyph--animated .glyph__correction {
    stroke-dasharray: 0.05 0.045;
    stroke-dashoffset: 1;
    animation: glyph-draw 1.1s var(--motion-ease) forwards;
    animation-delay: 1.3s;
  }

  @keyframes glyph-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .glyph--animated .glyph__transfer,
    .glyph--animated .glyph__correction {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
