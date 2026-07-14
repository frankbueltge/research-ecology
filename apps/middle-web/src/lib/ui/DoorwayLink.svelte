<script lang="ts">
  /** Doorway affordance out of The Middle (design §5 / product §2.4): "This object lives at …
   * ↗" with repo/commit — every source/derivative keeps its home address. */
  interface Props {
    href: string;
    lead: string;
    cta: string;
    repoLabel?: string;
    repoUrl?: string;
    commit?: string;
    commitLabel?: string;
  }

  const { href, lead, cta, repoLabel, repoUrl, commit, commitLabel }: Props = $props();
</script>

<p class="doorway">
  <span class="doorway__lead">{lead}</span>
  <a class="doorway-link" {href} target="_blank" rel="noopener noreferrer">{cta}</a>
  {#if repoUrl && repoLabel}
    <span class="doorway__meta mono">{repoLabel}: <a href={repoUrl} target="_blank" rel="noopener noreferrer">{repoUrl}</a></span>
  {/if}
  {#if commit && commitLabel}
    <span class="doorway__meta mono">{commitLabel}: {commit.slice(0, 12)}</span>
  {/if}
</p>

<style>
  .doorway {
    border: var(--border-thin);
    border-left: 3px solid var(--ink);
    padding: var(--space-3) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: 0 0 var(--space-4);
  }

  .doorway__lead {
    color: var(--ink-soft);
    font-size: var(--step--1);
  }

  .doorway-link {
    font-weight: 600;
  }

  .doorway__meta {
    font-size: var(--step--1);
    color: var(--ink-faint);
    word-break: break-all;
  }
</style>
