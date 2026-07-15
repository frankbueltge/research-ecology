<script lang="ts">
  import "$lib/styles/tokens.css";
  import "$lib/styles/base.css";
  import ThemeToggle from "$lib/ui/ThemeToggle.svelte";

  let { children } = $props();
</script>

<div class="wrap">
  <ThemeToggle />
  {@render children()}
</div>
