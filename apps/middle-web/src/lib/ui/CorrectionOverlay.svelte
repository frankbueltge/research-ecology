<script lang="ts">
  /** Correction as overlay (design §5): "an overlay hatch; the prior state remains visible,
   * struck not erased." The baseline register row stays fully legible with a strike-through —
   * never hidden, never opacity-faded to illegibility — and the correction is layered below it
   * as a visually distinct, hatched panel, not a silent replacement. */
  interface Props {
    baselineText?: string;
    baselineLabel: string;
    correctedText?: string;
    correctedLabel: string;
  }

  const { baselineText, baselineLabel, correctedText, correctedLabel }: Props = $props();
</script>

<div class="correction-overlay">
  {#if baselineText}
    <div class="correction-overlay__baseline">
      <p class="kicker">{baselineLabel}</p>
      <p class="correction-overlay__baseline-text">{baselineText}</p>
    </div>
  {/if}
  {#if correctedText}
    <div class="correction-overlay__corrected">
      <p class="kicker">{correctedLabel}</p>
      <p>{correctedText}</p>
    </div>
  {/if}
</div>

<style>
  .correction-overlay {
    margin-bottom: var(--space-5);
  }

  .correction-overlay__baseline {
    padding: var(--space-4);
    border: var(--border-thin);
    margin-bottom: var(--space-2);
  }

  .correction-overlay__baseline-text {
    text-decoration: line-through;
    text-decoration-color: var(--ink-faint);
    color: var(--ink-soft);
    margin: 0;
  }

  .correction-overlay__corrected {
    padding: var(--space-4);
    border: 2px solid var(--accent);
    background-image: repeating-linear-gradient(
      135deg,
      var(--accent-soft),
      var(--accent-soft) 8px,
      transparent 8px,
      transparent 16px
    );
    background-color: var(--paper);
    margin: 0;
  }

  .correction-overlay__corrected p:last-child {
    margin: 0;
    font-weight: 600;
  }
</style>
