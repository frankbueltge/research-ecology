<script lang="ts">
  import "$lib/styles/tokens.css";
  import "$lib/styles/fonts.css";
  import "$lib/styles/base.css";
  import type { Snippet } from "svelte";
  import SiteHeader from "$lib/chrome/SiteHeader.svelte";
  import SiteFooter from "$lib/chrome/SiteFooter.svelte";
  import { dictionary, type Locale } from "$lib/i18n";

  interface Props {
    data: { locale: Locale; theme: "light" | "dark" | undefined };
    children: Snippet;
  }

  const { data, children }: Props = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<SiteHeader locale={data.locale} {dict} theme={data.theme} />
<main id="main-content">
  <div class="frame">
    {@render children()}
  </div>
</main>
<SiteFooter locale={data.locale} {dict} />
