<script lang="ts">
  import MarginRail from "$lib/ui/MarginRail.svelte";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Atelier — apparatus</title>
</svelte:head>

<p class="kicker">
  <span>Atelier · apparatus</span>
  <span class="chip">how the machine runs</span>
</p>

<MarginRail here="apparatus" />

<h1>Apparatus</h1>

<!-- WORDING: Frank -->

<p class="status">
  Manifest and protocol status, verbatim from the collective manifest packages/adapters produced
  at the pinned commit (Kernel reuse — the same bundle format apps/middle-web reads).
</p>

{#if data.manifest}
  <section class="record">
    <h2>Manifest</h2>
    <div class="tbl-wrap">
      <table>
        <tbody>
          <tr><td class="mono">name</td><td>{data.manifest.name}</td></tr>
          {#if data.manifest.surface_name}<tr><td class="mono">surface</td><td>{data.manifest.surface_name}</td></tr>{/if}
          <tr><td class="mono">description</td><td class="q">{data.manifest.description}</td></tr>
          <tr><td class="mono">status</td><td>{data.manifest.status}</td></tr>
          <tr><td class="mono">responsible publisher</td><td>{data.manifest.responsible_publisher}</td></tr>
          <tr><td class="mono">effective from</td><td>{data.manifest.effective_from}</td></tr>
          <tr><td class="mono">manifest version</td><td>{data.manifest.version}</td></tr>
        </tbody>
      </table>
    </div>
  </section>
{:else}
  <p class="stub-room">Manifest unavailable — no ulysses bundle found under import/bundles.</p>
{/if}

<section class="record">
  <h2>Links</h2>
  <div class="tbl-wrap">
    <table>
      <tbody>
        {#if data.collective?.repository_url}
          <tr><td class="mono">repo</td><td><a href={data.collective.repository_url} rel="external">{data.collective.repository_url}</a></td></tr>
        {/if}
        {#if data.manifest?.protocol_url}
          <tr><td class="mono">constitution (raw)</td><td><a href={data.manifest.protocol_url} rel="external">{data.manifest.protocol_url}</a></td></tr>
        {/if}
        <tr><td class="mono">constitution (site)</td><td><a href="https://frankbueltge.de/atelier/protocol/" rel="external">frankbueltge.de/atelier/protocol/</a></td></tr>
        <tr><td class="mono">requests (site)</td><td><a href="https://frankbueltge.de/atelier/requests/" rel="external">frankbueltge.de/atelier/requests/</a></td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="record">
  <h2>Nightly machinery</h2>
  <p class="status">
    This app does not run a nightly job of its own yet: data is refreshed by re-running
    <code>apps/importer</code> against the read-only engine clone and <code>apps/loader</code>
    against the resulting bundle (work order phase-c1-atelier-app.md §1). Currently
    {data.importRecordCount} import record{data.importRecordCount === 1 ? "" : "s"} on file for
    this collective (ambiguities/unsupported paths the adapter declined to guess at — never
    silently dropped).
  </p>
</section>

<footer>
  <span>apparatus room — work order §4</span>
  <span>the Atelier's grammar is its own — ADR 0010</span>
</footer>
