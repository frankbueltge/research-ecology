<script lang="ts">
  /** Text-only status chip (design §5: "ACTIVE/FULFILLED/DISPUTED as text, not colour-coded").
   * Deliberately the same visual weight regardless of status value — only the text differs. */
  interface Props {
    status: string;
    prominence?: string;
  }

  const { status, prominence }: Props = $props();
</script>

<span class="status-chip mono">
  {status.toUpperCase()}
  {#if prominence === "load_bearing"}<span class="status-chip__prominence">· load-bearing</span>{/if}
</span>

<style>
  .status-chip {
    display: inline-block;
    border: var(--border-strong);
    padding: 0.1em 0.5em;
    font-size: var(--step--1);
    letter-spacing: 0.03em;
  }

  .status-chip__prominence {
    color: var(--ink-soft);
  }
</style>
