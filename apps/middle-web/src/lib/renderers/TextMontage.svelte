<script lang="ts">
  import type { StoredAssertion } from "@research-ecology/domain";
  import AuthoredStroke from "$lib/ui/AuthoredStroke.svelte";
  import type { Dictionary } from "$lib/i18n";
  import { objectHref } from "$lib/object-ref.js";

  /** `text-montage` (design §4: assertion detail) — the authored claim, its evidence and its
   * epistemic status, always under the author's visible name (never presented as fact). */
  interface Props {
    assertion: StoredAssertion;
    authorName: string;
    authorRoleLabel?: string;
    dict: Dictionary;
    encounterId?: string;
  }

  const { assertion, authorName, authorRoleLabel, dict, encounterId }: Props = $props();

  interface RefField {
    refId: string;
    fieldPath?: string;
  }

  function objectRefFieldOf(value: unknown): RefField | undefined {
    if (value && typeof value === "object" && "local_object_ref_id" in (value as Record<string, unknown>)) {
      const record = value as Record<string, unknown>;
      return {
        refId: String(record.local_object_ref_id),
        fieldPath: "field_path" in record ? String(record.field_path) : undefined
      };
    }
    return undefined;
  }

  function describePlain(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value);
  }

  const subjectRef = $derived(objectRefFieldOf(assertion.subject));
  const objectRef = $derived(objectRefFieldOf(assertion.object));
</script>

<AuthoredStroke {authorName} authorRole={authorRoleLabel}>
  <dl class="montage">
    <dt>{dict.assertion.subjectLabel}</dt>
    <dd class="mono">
      {#if subjectRef}
        <a href={objectHref(subjectRef.refId)}>{subjectRef.refId}</a>{#if subjectRef.fieldPath} ({subjectRef.fieldPath}){/if}
      {:else}
        {describePlain(assertion.subject)}
      {/if}
    </dd>

    <dt>{dict.assertion.predicateLabel}</dt>
    <dd class="mono">{assertion.predicate}</dd>

    <dt>{dict.assertion.objectLabel}</dt>
    <dd>
      {#if objectRef}
        <a class="mono" href={objectHref(objectRef.refId)}>{objectRef.refId}</a>{#if objectRef.fieldPath} ({objectRef.fieldPath}){/if}
      {:else}
        {describePlain(assertion.object)}
      {/if}
    </dd>

    <dt>{dict.assertion.epistemicStatusLabel}</dt>
    <dd class="mono">{assertion.local_epistemic_status ?? assertion.epistemic_status}</dd>

    {#if assertion.lifecycle_status}
      <dt>{dict.assertion.statusLabel}</dt>
      <dd class="mono">{assertion.lifecycle_status}</dd>
    {/if}
  </dl>

  {#if assertion.rationale}
    <h4>{dict.assertion.rationaleHeading}</h4>
    <p class="montage__rationale">“{assertion.rationale}”</p>
  {/if}

  {#if assertion.evidence && assertion.evidence.length > 0}
    <h4>{dict.assertion.evidenceHeading}</h4>
    <ul class="montage__evidence">
      {#each assertion.evidence as item, i (i)}
        <li>
          {#if typeof item.event_id === "string"}
            {#if encounterId}
              <a class="mono" href={`/encounters/${encounterId}#event-${item.event_id}`}>{item.event_id}</a>
            {:else}
              <span class="mono">{item.event_id}</span>
            {/if}
          {:else if typeof item.source_uri === "string"}
            <a href={item.source_uri} target="_blank" rel="noopener noreferrer">
              {typeof item.field_path === "string" ? item.field_path : item.source_uri} ↗
            </a>
          {:else}
            <span class="mono">{JSON.stringify(item)}</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</AuthoredStroke>

<style>
  .montage {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-2) var(--space-4);
    margin: 0 0 var(--space-4);
  }

  .montage dt {
    color: var(--ink-faint);
    font-family: var(--font-record);
    font-size: var(--step--1);
  }

  .montage dd {
    margin: 0;
  }

  .montage__rationale {
    font-style: italic;
    font-size: var(--step-1);
  }

  .montage__evidence {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .montage__evidence li {
    padding: var(--space-1) 0;
    border-bottom: var(--border-thin);
  }
</style>
