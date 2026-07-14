<script lang="ts">
  import { page } from "$app/state";
  import type { Dictionary, Locale } from "$lib/i18n";
  import { localizedPath, stripLocalePrefix } from "$lib/i18n";
  import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
  import ThemeToggle from "./ThemeToggle.svelte";

  interface Props {
    locale: Locale;
    dict: Dictionary;
    theme: "light" | "dark" | undefined;
  }

  const { locale, dict, theme }: Props = $props();

  const navItems = $derived([
    { href: localizedPath(locale, `/encounters/${CURRENT_ENCOUNTER_ID}`), label: dict.nav.encounter },
    { href: localizedPath(locale, `/encounters/${CURRENT_ENCOUNTER_ID}/compare`), label: dict.nav.compare },
    { href: localizedPath(locale, "/ledger"), label: dict.nav.ledger },
    { href: localizedPath(locale, "/lenses/provenance-v1"), label: dict.nav.lenses },
    { href: localizedPath(locale, "/apparatus"), label: dict.nav.apparatus },
    { href: localizedPath(locale, "/archive"), label: dict.nav.archive },
    { href: localizedPath(locale, "/about"), label: dict.nav.about }
  ]);

  const otherLocaleHref = $derived(
    locale === "de" ? stripLocalePrefix(page.url.pathname) : `/de${page.url.pathname === "/" ? "" : page.url.pathname}`
  );
</script>

<a class="skip-link" href="#main-content">{dict.common.skipToContent}</a>

<header class="site-header">
  <div class="frame site-header__bar">
    <a class="site-title" href={localizedPath(locale, "/")}>{dict.common.siteName}</a>
    <nav class="site-nav" aria-label="Primary">
      {#each navItems as item (item.href)}
        <a href={item.href} aria-current={page.url.pathname === item.href ? "page" : undefined}>{item.label}</a>
      {/each}
    </nav>
    <div class="site-controls">
      <a class="control" href={otherLocaleHref} hreflang={locale === "de" ? "en" : "de"} rel="alternate">
        {dict.common.languageSwitch}
      </a>
      <ThemeToggle {theme} lightLabel={dict.common.themeLight} darkLabel={dict.common.themeDark} toggleLabel={dict.common.themeToggleLabel} />
    </div>
  </div>
</header>
