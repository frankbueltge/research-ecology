<script lang="ts">
  /**
   * The margin rail — the Atelier's only standing navigation (design atelier-aesthetik-2026-07-15.md
   * §5: "this sheet · sheets · works · journal · material · apparatus · → the middle").
   * `here` marks which entry is the current page (br-here style, no link). "works" links to the
   * existing, live site gallery (verified 2026-07-15: frankbueltge.de/atelier/ 200s; no
   * dedicated /atelier/werke index page exists, so the root is the honest target — individual
   * work pages are reachable from there and from the sheet's own ink slabs). "sheets"/"journal"/
   * "material" are this app's own stub routes (work order §4 — no destination content in C1).
   * "→ the middle" stays a plain, non-linking label: apps/middle-web's delivery location is an
   * open deployment question (ADR 0010 §5), so there is no honest URL to point at yet — a
   * fabricated cross-origin link would be a dead link dressed up as a live one.
   */
  interface Props {
    here: "sheet" | "sheets" | "journal" | "material" | "apparatus";
  }
  const { here }: Props = $props();
</script>

<nav class="blattrand" aria-label="Margin rail — the only standing navigation">
  {#if here === "sheet"}
    <span class="br-here">this sheet</span>
  {:else}
    <a href="/">this sheet</a>
  {/if}

  {#if here === "sheets"}
    <span class="br-here">sheets</span>
  {:else}
    <a href="/sheets">sheets</a>
  {/if}

  <a href="https://frankbueltge.de/atelier/" rel="external">works</a>

  {#if here === "journal"}
    <span class="br-here">journal</span>
  {:else}
    <a href="/journal">journal</a>
  {/if}

  {#if here === "material"}
    <span class="br-here">material</span>
  {:else}
    <a href="/material">material</a>
  {/if}

  {#if here === "apparatus"}
    <span class="br-here">apparatus</span>
  {:else}
    <a href="/apparatus">apparatus</a>
  {/if}

  <span class="br-door" title="the middle's delivery location is undecided (ADR 0010 §5) — no link yet, not a broken one">
    → the middle
  </span>
</nav>
