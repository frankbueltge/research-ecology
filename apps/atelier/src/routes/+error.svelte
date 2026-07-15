<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Atelier — {page.status}</title>
</svelte:head>

<div class="wrap">
  <h1>{page.status}</h1>
  <p class="status">{page.error?.message ?? "Something went wrong."} <a href="/">← back to the sheet</a></p>
</div>
