<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} — The Middle</title>
</svelte:head>

<div class="fallback-error">
  <p class="fallback-error__code">{page.status}</p>
  <p>{page.error?.message ?? "Not found."}</p>
  <p><a href="/">The Middle</a></p>
</div>

<style>
  /* No `:global(body)` here on purpose: SvelteKit preloads every error-boundary node's CSS
     alongside the page it protects (in case hydration itself fails), so a global `body` rule
     in this file would apply on EVERY route, not just when this fallback actually renders —
     it silently overrode the dark-theme `color`/`background` custom properties on every page
     until this was caught in a dark-mode screenshot review. Style only this own wrapper. */
  .fallback-error {
    max-width: 32rem;
    margin: 4rem auto;
    padding: 0 1.5rem;
    font-family: Georgia, "Iowan Old Style", serif;
    background: #faf8f4;
    color: #1a1817;
  }

  .fallback-error__code {
    font-size: 2rem;
    font-weight: 700;
    font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  }
</style>
