<script lang="ts">
  import type { Dictionary, Locale } from "$lib/i18n";
  import { localizedPath } from "$lib/i18n";

  interface Props {
    locale: Locale;
    dict: Dictionary;
  }

  const { locale, dict }: Props = $props();
</script>

<footer class="site-footer">
  <div class="frame">
    <nav aria-label="Footer">
      <a href={localizedPath(locale, "/apparatus")}>{dict.footer.apparatusLink}</a>
      <a href={localizedPath(locale, "/about")}>{dict.footer.aboutLink}</a>
    </nav>
    <p>{dict.common.siteTagline}</p>
    <p>{dict.footer.noAnalytics}</p>
  </div>
</footer>
