<script lang="ts">
  /** Unresolved state (design §5): "an open-ended rule (line that visibly does not close) +
   * the words 'no shared resolution'". The rule itself is decorative (aria-hidden); the words
   * are the real, textual carrier of the state — never colour or shape alone. */
  interface Props {
    text: string;
    note?: string;
  }

  const { text, note }: Props = $props();
</script>

<div class="unresolved">
  <div class="unresolved__rule" aria-hidden="true"></div>
  <p class="unresolved__text">{text}</p>
  {#if note}
    <p class="unresolved__note">{note}</p>
  {/if}
</div>

<style>
  .unresolved {
    margin: var(--space-5) 0;
  }

  .unresolved__rule {
    height: 1px;
    background: repeating-linear-gradient(to right, var(--ink-faint) 0 10px, transparent 10px 16px);
    /* Visibly does not close: the rule stops short of the frame's right edge on purpose. */
    width: 85%;
    margin-bottom: var(--space-3);
  }

  .unresolved__text {
    font-weight: 600;
    font-style: italic;
    margin: 0 0 var(--space-2);
  }

  .unresolved__note {
    color: var(--ink-soft);
    font-size: var(--step--1);
    margin: 0;
  }
</style>
