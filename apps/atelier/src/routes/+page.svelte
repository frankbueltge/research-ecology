<script lang="ts">
  import MarginRail from "$lib/ui/MarginRail.svelte";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();

  function connectorClass(kind: string): string {
    if (kind === "elaborates") return "tie";
    if (kind === "bridge") return "bridge";
    if (kind === "complement") return "comp";
    if (kind === "ground") return "ground";
    if (kind === "grounds") return "stub";
    return "tie";
  }
</script>

<svelte:head>
  <title>Atelier — the sheet</title>
</svelte:head>

<p class="kicker">
  <span>Atelier · working sheet</span>
  {#if data.collectiveName}<span>{data.collectiveName}</span>{/if}
  <span class="chip">Slice C1</span>
</p>

<MarginRail here="sheet" />

<h1 id="sheet-headline">{data.entranceThreadLabel ?? "the sheet"}</h1>

<p class="status">
  <b
    >{data.counts.threads} thread{data.counts.threads === 1 ? "" : "s"} · {data.counts.sources} source{data.counts.sources === 1
      ? ""
      : "s"} · {data.counts.works} work{data.counts.works === 1 ? "" : "s"} · {data.counts.bridges} bridge{data.counts.bridges === 1
      ? ""
      : "s"}</b
  >
  · the sheet title is the current thread's own label, verbatim; every edge below is drawn in the rhizome by Ulysses
</p>

<figure>
  <svg
    id="score"
    viewBox={data.layout.viewBox}
    role="img"
    aria-label="Atelier working sheet: {data.counts.threads} threads, {data.counts.sources} sources, {data.counts
      .works} works; the full edge list follows as a table."
  >
    {#each data.layout.threads as thread (thread.id)}
      <path class="th" d={thread.path} />
      <text class="t-thread" x={thread.labelPos.x} y={thread.labelPos.y}>{thread.label}<title>{thread.fullLabel}</title></text>
    {/each}

    {#each data.layout.continuesEdges as edge (edge.fromId + edge.toId)}
      <path class="th th-cont" d={edge.path} />
      <text class="t-note" x={edge.labelPos.x} y={edge.labelPos.y}>{edge.caption}</text>
    {/each}

    {#each data.layout.sources as source (source.id)}
      <text class="t-src" x={source.textPos.x} y={source.textPos.y} text-anchor="end"
        >{source.label}<title>{source.fullLabel}</title></text
      >
      {#if source.stubPath}<path class="stub" d={source.stubPath} />{/if}
      {#if source.swervePath}<path class="rp" d={source.swervePath} />{/if}
    {/each}

    {#each data.layout.sessionMarkers as marker (marker.session)}
      <circle class="rp-dot" cx={marker.point.x} cy={marker.point.y} r="3.5" />
      <text class="t-sess" x={marker.point.x - 6} y={marker.point.y + 22} text-anchor="end">{marker.label}</text>
    {/each}

    {#each data.layout.works as work (work.id)}
      <rect
        class={work.ghost ? "slab-ghost" : "slab"}
        x={work.rect.x}
        y={work.rect.y}
        width={work.rect.width}
        height={work.rect.height}
      />
      {#if work.href}
        <a href={work.href} target="_blank" rel="noopener external" aria-label="{work.fullLabel} — external, on frankbueltge.de">
          <text class="t-work work-link" x={work.labelPos.x} y={work.labelPos.y} text-anchor={work.anchor}
            >{work.label}<title>{work.fullLabel}</title></text
          >
        </a>
      {:else}
        <text class="t-work" x={work.labelPos.x} y={work.labelPos.y} text-anchor={work.anchor}
          >{work.label}<title>{work.fullLabel}</title></text
        >
      {/if}
      {#if work.date}
        <text class="t-date" x={work.labelPos.x} y={work.labelPos.y + 15} text-anchor={work.anchor}>{work.date}</text>
      {/if}
    {/each}

    {#each data.layout.connectors as connector, i (i)}
      <path class={connectorClass(connector.kind)} d={connector.path} />
      {#if connector.caption && connector.captionPos}
        <text class="t-note" x={connector.captionPos.x} y={connector.captionPos.y}>{connector.caption}</text>
      {/if}
    {/each}

    <path class="door" d={data.layout.door.path} />
    <path class="door" d={data.layout.door.ticks} />
    <text
      class="t-note"
      transform="rotate(-90 {data.layout.door.labelPos.x} {data.layout.door.labelPos.y})"
      x={data.layout.door.labelPos.x}
      y={data.layout.door.labelPos.y}
      text-anchor="middle">{data.layout.door.text}</text
    >
  </svg>
</figure>

<aside class="legend" aria-label="Sheet key">
  <div class="lg-col">
    <h3>Materials</h3>
    <p class="lg-note">
      Thread — ink, a reading drawn across works. Swerve — red pencil, a source kinks into a thread (the clinamen).
      Work — an ink slab standing on the sheet; a dashed slab is a prior work on the shelf, present, not re-made.
    </p>
  </div>
  <div class="lg-col">
    <h3>Ties</h3>
    <p class="lg-note">
      Elaborates — a thread holds a work. Bridge — two works tied in the practice's own words (double line). Complement
      — a loss-side shelf answers a birth-side run (dashed graphite). Grounds — a source laid under a work as
      foundation. Doorway — reserved for external encounters, empty until one exists.
    </p>
  </div>
  <div class="lg-col">
    <h3>Not this sheet</h3>
    <p class="lg-note">
      No time axis, no lanes, no practice colours, no as-of edge — those belong to The Middle's score (ADR 0010: no
      shared visual grammar). The sheet keeps one lab-wide ethic unchanged: everything drawn is verbatim and sourced,
      and the table below compresses nothing.
    </p>
  </div>
</aside>

<section class="record">
  <h2>Edge register — all {data.edgeRegister.length} edges of the sheet, uncompressed</h2>
  <div class="tbl-wrap">
    <table>
      <thead>
        <tr><th>from</th><th>kind</th><th>to</th><th>session</th></tr>
      </thead>
      <tbody>
        {#each data.edgeRegister as row (row.index)}
          <tr><td class="q">{row.from}</td><td>{row.kind}</td><td class="q">{row.to}</td><td>{row.session}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<footer>
  <span>{data.ruleDescription} — today: {data.entranceThreadLabel ?? "—"}</span>
  <span>
    the Atelier's grammar is its own — ADR 0010 · source:
    {#if data.repositoryUrl}<a href={data.repositoryUrl} rel="external">{data.repositoryUrl}</a>{:else}repository URL unavailable{/if}
  </span>
</footer>
