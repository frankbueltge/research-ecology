<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    kicker?: string;
    heading?: string;
    /** "event" gets a dated ledger-mark rule; "plain" is a quiet bounded frame. */
    variant?: "event" | "plain";
    date?: string;
    id?: string;
    children: Snippet;
  }

  const { kicker, heading, variant = "plain", date, id, children }: Props = $props();
</script>

<section class="record-frame record-frame--{variant}" {id}>
  {#if variant === "event" && date}
    <time class="record-frame__date mono" datetime={date}>{date.slice(0, 10)}</time>
  {/if}
  {#if kicker}
    <p class="kicker">{kicker}</p>
  {/if}
  {#if heading}
    <h3 class="record-frame__heading">{heading}</h3>
  {/if}
  <div class="record-frame__body">
    {@render children()}
  </div>
</section>

<style>
  .record-frame {
    border: var(--border-thin);
    background: var(--paper);
    padding: var(--space-5);
    margin-bottom: var(--space-5);
  }

  .record-frame--event {
    border-left: 3px solid var(--ink);
    padding-left: var(--space-5);
  }

  .record-frame__date {
    display: inline-block;
    color: var(--ink-faint);
    margin-bottom: var(--space-2);
  }

  .record-frame__heading {
    margin-top: 0;
    font-size: var(--step-1);
  }
</style>
