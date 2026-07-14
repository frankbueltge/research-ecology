/**
 * The projection engine (work order §0 Locked decision "Projection engine"): PURE —
 * `project(records, lensVersion, watermark, engineVersion) -> MapVersionPayload`. No I/O, no
 * `Date.now()` anywhere in this module: the watermark and (via the caller) "now" are both
 * inputs, never read from the environment (work order critical rule).
 *
 * Determinism: identical `(records, lens, watermark, engineVersion)` ⇒ identical
 * `content_hash`, because content_hash is computed via the Phase-1 canonical hashing
 * (`packages/protocol`'s `contentHash`) over exactly the `MapContent` this function builds —
 * `map_id`/`version` are NOT part of that basis; they are assigned by the persistence layer
 * (apps/project / `LoaderStore.insertMapVersion`) on top of the already-content-addressed
 * payload (epistemic contract test 9).
 */

import { contentHash as protocolContentHash } from "../../protocol/src/index.js";
import { buildAccessibleSummary } from "./accessible-summary.js";
import { renderObjectTransformation } from "./renderers/object-transformation.js";
import { renderParallelPositions } from "./renderers/parallel-positions.js";
import { renderProvenanceChain } from "./renderers/provenance-chain.js";
import type { MapContent, MapVersionPayload, ProjectionInput, ProjectionLens } from "./types.js";

export class ProjectionInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectionInputError";
  }
}

/** Renderers with at least one registered assertion form. Any OTHER renderer name selecting
 * assertions at all means every one of them is a rupture — that renderer has no assertion
 * forms whatsoever (defense in depth beyond the two renderers' own per-predicate checks). */
const RENDERERS_WITH_ASSERTION_FORMS = new Set(["object-transformation", "parallel-positions"]);

function assertLensShape(lens: ProjectionLens): void {
  if (!lens.lens_id || typeof lens.version !== "number") {
    throw new ProjectionInputError("project(): lens is missing lens_id/version");
  }
  if (!lens.selection || typeof lens.selection !== "object") {
    throw new ProjectionInputError("project(): lens is missing a selection object");
  }
  if (!Array.isArray(lens.declared_exclusions)) {
    throw new ProjectionInputError("project(): lens is missing declared_exclusions[]");
  }
}

function byIds<T>(all: T[], ids: string[] | undefined, idOf: (item: T) => string): T[] {
  if (!ids) return [];
  const idSet = new Set(ids);
  return all.filter((item) => idSet.has(idOf(item)));
}

export function project(
  records: ProjectionInput,
  lens: ProjectionLens,
  watermark: string,
  engineVersion: string
): MapVersionPayload {
  assertLensShape(lens);

  const watermarkMs = new Date(watermark).getTime();
  if (Number.isNaN(watermarkMs)) {
    throw new ProjectionInputError(`project(): watermark is not a valid ISO date-time: ${watermark}`);
  }

  const selectedEvents = byIds(records.events, lens.selection.event_ids, (e) => e.event_id)
    .filter((e) => new Date(e.occurred_at).getTime() <= watermarkMs)
    .sort((a, b) => a.occurred_at.localeCompare(b.occurred_at) || a.event_id.localeCompare(b.event_id));

  const selectedObjects = byIds(records.objects, lens.selection.object_ref_ids, (o) => o.id);

  const selectedAssertions = byIds(records.assertions, lens.selection.assertion_ids, (a) => a.assertion_id).filter(
    (a) => !a.valid_from || new Date(a.valid_from).getTime() <= watermarkMs
  );

  const selectedObligations = byIds(records.obligations, lens.selection.obligation_ids, (o) => o.id).filter(
    (o) => new Date(o.active_from).getTime() <= watermarkMs
  );

  const renderFailures: Record<string, unknown>[] = [];
  let rendererPayload: Record<string, unknown>;

  switch (lens.renderer) {
    case "provenance-chain": {
      rendererPayload = renderProvenanceChain(selectedEvents, selectedObjects, selectedObligations) as unknown as Record<
        string,
        unknown
      >;
      break;
    }
    case "object-transformation": {
      const result = renderObjectTransformation(selectedEvents, selectedObjects, selectedAssertions, selectedObligations);
      rendererPayload = result.payload as unknown as Record<string, unknown>;
      renderFailures.push(...result.renderFailures);
      break;
    }
    case "parallel-positions": {
      const result = renderParallelPositions(selectedEvents, selectedObjects, selectedAssertions, selectedObligations);
      rendererPayload = result.payload as unknown as Record<string, unknown>;
      renderFailures.push(...result.renderFailures);
      break;
    }
    default: {
      // Unknown renderer name itself is a rupture, not a crash (work order "unknown types are
      // first-class"): the whole map becomes one big render_failure, but every included id is
      // still reported (never dropped/renamed).
      renderFailures.push({
        kind: "unrendered_renderer",
        renderer: lens.renderer,
        reason: `no renderer implementation registered for "${lens.renderer}"`
      });
      rendererPayload = {};
    }
  }

  if (!RENDERERS_WITH_ASSERTION_FORMS.has(lens.renderer)) {
    for (const assertion of selectedAssertions) {
      renderFailures.push({
        kind: "unrendered_predicate",
        assertion_id: assertion.assertion_id,
        predicate: assertion.predicate,
        reason: `renderer "${lens.renderer}" has no assertion rendering forms at all`
      });
    }
  }

  // Exclusions: the lens's own static declarations, verbatim, plus data-backed synthesized
  // entries for whatever this run actually left out (spec 05 §3.15 "first-class").
  const exclusions: Record<string, unknown>[] = [...lens.declared_exclusions];
  const omittedAssertionIds = records.assertions
    .filter((a) => !selectedAssertions.some((sel) => sel.assertion_id === a.assertion_id))
    .map((a) => a.assertion_id);
  if (omittedAssertionIds.length > 0) {
    exclusions.push({
      kind: "editorial scope",
      reason: "Not selected by this lens's own scope.",
      excluded_assertion_ids: omittedAssertionIds,
      synthesized: true
    });
  }
  const omittedEventIds = records.events
    .filter((e) => !selectedEvents.some((sel) => sel.event_id === e.event_id))
    .map((e) => e.event_id);
  if (omittedEventIds.length > 0) {
    exclusions.push({
      kind: "editorial scope",
      reason: "Not selected by this lens's own scope, or outside the event watermark.",
      excluded_event_ids: omittedEventIds,
      synthesized: true
    });
  }

  const accessible_summary = buildAccessibleSummary({
    lens,
    encounter: records.encounter,
    participants: records.participants,
    watermark,
    selectedEvents,
    selectedAssertions,
    selectedObligations,
    exclusions,
    renderFailures
  });

  const content: MapContent = {
    encounter_id: records.encounter.encounter_id,
    lens: { lens_id: lens.lens_id, version: lens.version },
    event_watermark: watermark,
    included: {
      events: selectedEvents.map((e) => e.event_id),
      objects: selectedObjects.map((o) => o.id),
      assertions: selectedAssertions.map((a) => a.assertion_id),
      obligations: selectedObligations.map((o) => o.id)
    },
    projection: rendererPayload,
    exclusions,
    render_failures: renderFailures,
    accessible_summary,
    renderer_version: engineVersion
  };

  const content_hash = protocolContentHash(content as unknown as Record<string, unknown>);

  return { ...content, content_hash };
}
