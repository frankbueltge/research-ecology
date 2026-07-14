<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);

  const cockpit = $derived(data.snapshots.find((s) => s.collectiveId === "ulysses"));
</script>

<svelte:head>
  <title>{dict.archive.kicker} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.archive.kicker}</p>
  <h1>{dict.nav.archive}</h1>
  <p class="lede">{dict.archive.intro}</p>

  <div class="archive-notice">
    <p><strong>{dict.archive.liveNotice}</strong></p>
    {#if cockpit?.publicUrl}
      <p>
        <a href={cockpit.publicUrl} target="_blank" rel="noopener noreferrer">{dict.archive.visitCta} (DE)</a>
        ·
        <a href={`${cockpit.publicUrl.replace("frankbueltge.de/", "frankbueltge.de/en/")}`} target="_blank" rel="noopener noreferrer">
          {dict.archive.visitCta} (EN)
        </a>
      </p>
    {/if}
  </div>

  <h2>{dict.archive.snapshotsHeading}</h2>
  <div class="snapshot-table" role="table">
    <div class="snapshot-table__row snapshot-table__row--head" role="row">
      <span role="columnheader">{dict.archive.snapshotCollective}</span>
      <span role="columnheader">Objects imported</span>
      <span role="columnheader">{dict.archive.snapshotCommit}</span>
    </div>
    {#each data.snapshots as snapshot (snapshot.collectiveId)}
      <div class="snapshot-table__row" role="row">
        <span role="cell">{snapshot.name}</span>
        <span role="cell" class="mono">{snapshot.objectCount}</span>
        <span role="cell" class="mono snapshot-table__commits">
          {#each snapshot.commits as commit (commit)}
            <span>{commit.slice(0, 12)}</span>
          {/each}
        </span>
      </div>
    {/each}
  </div>
  <p class="lede">
    Per-entry <code>pulse/vital-signs.json</code> closure values and <code>rhizome.json</code> edges are not yet imported at
    that granularity in this phase — whole-file object references at the pinned commits above are what this archive holds
    today (ADR 0008; deferred per review-notes-for-3c.md item 8).
  </p>
</article>

<style>
  .archive-notice {
    border: 2px solid var(--accent);
    background: var(--accent-soft);
    padding: var(--space-4);
    margin: var(--space-5) 0;
  }

  .snapshot-table {
    display: grid;
    border: var(--border-strong);
    margin: var(--space-5) 0;
  }

  .snapshot-table__row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-bottom: var(--border-thin);
  }

  .snapshot-table__row:last-child {
    border-bottom: none;
  }

  .snapshot-table__row--head {
    font-family: var(--font-record);
    font-size: var(--step--1);
    text-transform: uppercase;
    color: var(--ink-faint);
    background: var(--paper-raised);
  }

  .snapshot-table__commits {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }
</style>
