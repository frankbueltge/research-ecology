<script lang="ts">
  /**
   * Theme toggle (design §3: "auto→light→dark, localStorage 'theme'"). Cycles the same three
   * states the inline script in `src/app.html` resolves on load; this component only runs once
   * JavaScript has hydrated (no-JS visitors keep the static default and have no way to toggle —
   * expected, work order §6 test 5's no-JS check is about the sheet's CONTENT staying readable,
   * not about this control). Written as a Svelte `onclick` prop (compiled to `addEventListener`,
   * not an inline HTML attribute) so the strict `script-src: 'self'` CSP (svelte.config.js) needs
   * no `unsafe-inline`/hash carve-out for it.
   */
  type Mode = "auto" | "light" | "dark";
  const ORDER: Mode[] = ["auto", "light", "dark"];

  function readMode(): Mode {
    try {
      const stored = localStorage.getItem("theme");
      return stored === "light" || stored === "dark" ? stored : "auto";
    } catch {
      return "auto";
    }
  }

  function resolve(mode: Mode): "light" | "dark" {
    if (mode !== "auto") return mode;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(mode: Mode): void {
    const root = document.documentElement;
    root.setAttribute("data-theme", resolve(mode));
    root.setAttribute("data-theme-mode", mode);
  }

  function cycle(): void {
    const current = readMode();
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]!;
    try {
      if (next === "auto") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable (private mode, disabled storage) — theme still applies for
      // this page load, just does not persist. Not an error worth surfacing to the visitor.
    }
    apply(next);
  }
</script>

<button
  class="theme-toggle"
  data-theme-toggle
  aria-label="Theme: auto / light / dark"
  title="Theme: auto / light / dark"
  onclick={cycle}
>
  <svg class="i-auto" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" />
  </svg>
  <svg class="i-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
    <circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4l1.4-1.4M18 6l1.4-1.4" />
  </svg>
  <svg class="i-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.6 14.2A8.2 8.2 0 1 1 9.8 3.4a6.8 6.8 0 1 0 10.8 10.8z" />
  </svg>
</button>
