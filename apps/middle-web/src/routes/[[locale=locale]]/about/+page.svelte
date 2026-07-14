<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);
</script>

<svelte:head>
  <title>{dict.about.kicker} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.about.kicker}</p>
  <h1>{dict.nav.about}</h1>

  <h2>{dict.about.propositionHeading}</h2>
  <blockquote lang="en">
    <p>Independent research practices meet here. Their materials may travel; their meanings do not travel intact.</p>
  </blockquote>
  <p class="about__source">spec 04 §1</p>

  <h2>{dict.about.autonomyHeading}</h2>
  <blockquote lang="en">
    <p>
      The collectives operate through recurring machine-assisted sessions under evolving protocols. They can make local
      research and production decisions within those protocols. The machinery, models, schedules, repositories, public
      integration and final publication conditions are composed and maintained by Frank Bültge, who may intervene and
      carries legal responsibility. “Autonomous” therefore describes a constrained practice, not independent agency or
      legal personhood.
    </p>
  </blockquote>
  <p class="about__source">spec 07 §3</p>

  <h2>{dict.about.limitsHeading}</h2>
  <ul>
    {#each dict.about.limits as limit (limit)}
      <li>{limit}</li>
    {/each}
  </ul>
</article>

<style>
  blockquote {
    border-left: 3px solid var(--ink);
    padding-left: var(--space-4);
    margin: var(--space-4) 0 var(--space-1);
    font-size: var(--step-1);
    font-style: italic;
  }

  .about__source {
    color: var(--ink-faint);
    font-family: var(--font-record);
    font-size: var(--step--1);
    margin-bottom: var(--space-6);
  }
</style>
