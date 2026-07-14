<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";

  /** Two explicit buttons rather than one flipping toggle: with theme "auto" (no cookie set
   * yet) there is no client-guessed state to get wrong on first paint — the label is always
   * literally true (design §5 "no flash"). */
  interface Props {
    theme: "light" | "dark" | undefined;
    lightLabel: string;
    darkLabel: string;
    toggleLabel: string;
  }

  const { theme, lightLabel, darkLabel, toggleLabel }: Props = $props();
  const next = $derived(page.url.pathname + page.url.search);
</script>

<div class="theme-toggle" role="group" aria-label={toggleLabel}>
  <form method="POST" action="/theme-toggle" use:enhance>
    <input type="hidden" name="theme" value="light" />
    <input type="hidden" name="next" value={next} />
    <button type="submit" aria-pressed={theme === "light"}>{lightLabel}</button>
  </form>
  <form method="POST" action="/theme-toggle" use:enhance>
    <input type="hidden" name="theme" value="dark" />
    <input type="hidden" name="next" value={next} />
    <button type="submit" aria-pressed={theme === "dark"}>{darkLabel}</button>
  </form>
</div>

<style>
  .theme-toggle {
    display: flex;
    gap: var(--space-1);
  }

  form {
    display: contents;
  }

  button[aria-pressed="true"] {
    border-color: var(--ink) !important;
    font-weight: 600;
  }
</style>
