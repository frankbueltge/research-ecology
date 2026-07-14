<script lang="ts">
  import { page } from "$app/state";
  import { dictionary } from "$lib/i18n";
  import type { LayoutData } from "./$types.js";

  const { data }: { data: LayoutData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{page.status} — {dict.common.siteName}</title>
</svelte:head>

<article class="content error-page">
  <p class="kicker">{page.status}</p>
  <h1>{page.status === 404 ? "Not found" : "Something went wrong"}</h1>
  <p>{page.error?.message ?? ""}</p>
</article>

<style>
  .error-page {
    padding: var(--space-6) 0;
  }
</style>
