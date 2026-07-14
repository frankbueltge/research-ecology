<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** Always shown — design §5: "assertions: an authored sidebar stroke ... + always the
     * author's name". Never omit this even when space is tight. */
    authorName: string;
    authorRole?: string;
    children: Snippet;
  }

  const { authorName, authorRole, children }: Props = $props();
</script>

<figure class="authored-stroke">
  <figcaption class="authored-stroke__author">
    <span class="authored-stroke__mark" aria-hidden="true"></span>
    <span class="mono">{authorName}</span>
    {#if authorRole}<span class="authored-stroke__role">— {authorRole}</span>{/if}
  </figcaption>
  <div class="authored-stroke__body">
    {@render children()}
  </div>
</figure>

<style>
  .authored-stroke {
    margin: 0 0 var(--space-5);
    padding-left: var(--space-5);
    border-left: 3px solid var(--accent);
  }

  .authored-stroke__author {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    font-size: var(--step--1);
    color: var(--accent);
    margin-bottom: var(--space-2);
  }

  .authored-stroke__mark {
    width: 0.6em;
    height: 0.6em;
    background: var(--accent);
    display: inline-block;
    border-radius: 50%;
  }

  .authored-stroke__role {
    color: var(--ink-faint);
    font-family: var(--font-editorial);
    font-style: italic;
  }

  .authored-stroke__body {
    color: var(--ink);
  }
</style>
