<script lang="ts">
  // Deliberately the narrow "./core-event-types" subpath, NOT the "@research-ecology/protocol"
  // barrel: the barrel re-exports validators.ts, which eagerly compiles Ajv schemas via
  // `new Function` at module load — fine on the server, but this component is also part of the
  // client bundle (hydrated inside ProvenanceChain), and that codegen violates the strict
  // script-src CSP (no `unsafe-eval`) the moment it reaches the browser.
  import { isCoreEventType } from "@research-ecology/protocol/core-event-types";

  /** Demonstrates design §4's "type chip" distinction on every ledger entry: core protocol
   * types (spec 03 §3) get a plain chip; anything else gets the "local type" treatment with a
   * "not a core protocol type" note — proven live on the fixture's own `contract.published`
   * event, which is deliberately an open, non-core type (events.json `apparatus_note`). */
  interface Props {
    eventType: string;
    localTypeNote: string;
  }

  const { eventType, localTypeNote }: Props = $props();
  const core = $derived(isCoreEventType(eventType));
</script>

<span class="type-chip mono" class:type-chip--local={!core}>
  {eventType}
</span>
{#if !core}
  <span class="type-chip__note">{localTypeNote}</span>
{/if}

<style>
  .type-chip {
    display: inline-block;
    border: 1px solid var(--ink);
    padding: 0.05em 0.4em;
    font-size: var(--step--1);
  }

  .type-chip--local {
    border-style: dashed;
    border-color: var(--rule-strong);
    color: var(--ink-soft);
  }

  .type-chip__note {
    display: inline-block;
    margin-left: var(--space-2);
    font-size: var(--step--1);
    color: var(--ink-faint);
    font-style: italic;
  }
</style>
