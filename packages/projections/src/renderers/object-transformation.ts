/**
 * `object-transformation` renderer (design §3.2/§4): layered lineage grouped by material tier,
 * not time — source column, transformation band (preserved / re-voiced / declined-to-carry /
 * imagined), derivative column. The Minnesota omission renders as a visible NEGATIVE band with
 * Ensemble's own verbatim rationale (design's explicit requirement), not a silent gap.
 *
 * Only two predicates have a registered form in v1 (below). Any OTHER predicate the lens hands
 * this renderer still appears — in an `unclassified` band, never dropped — AND is reported in
 * `render_failures` (epistemic contract test 4's second half).
 */

import type { ProjectionAssertion, ProjectionEvent, ProjectionObject, ProjectionObligation } from "../types.js";

type TransformationCategory = "preserved" | "re-voiced" | "declined-to-carry" | "imagined" | "unclassified";

/** Registered predicate → category forms (v1). Extending this list is how a future lens
 * version registers a new predicate's rendered form; anything absent is a rupture, not a
 * silent drop (design §4 "Unknown-type rupture blocks are part of the registry contract"). */
const KNOWN_PREDICATE_CATEGORY: Record<string, TransformationCategory> = {
  "transforms-detection-mechanism-into-disclosed-reconstruction": "re-voiced",
  "declines-to-carry": "declined-to-carry"
};

export interface TransformationBandEntry {
  category: TransformationCategory;
  label: string;
  is_negative_band: boolean;
  source: "event_payload" | "assertion";
  assertion_id?: string;
  rationale?: string;
  local_epistemic_status?: string;
}

export interface ObjectTransformationPayload {
  source_column: Array<{ id: string; canonical_uri: string; local_object_type: string; local_epistemic_status?: string }>;
  derivative_column: Array<{ id: string; canonical_uri: string; local_object_type: string; local_epistemic_status?: string }>;
  transformation_band: TransformationBandEntry[];
  tier_legend: string[];
  obligations: Array<{ id: string; clause_text: string; status: string; prominence: string }>;
}

export interface ObjectTransformationResult {
  payload: ObjectTransformationPayload;
  renderFailures: Record<string, unknown>[];
}

export function renderObjectTransformation(
  events: ProjectionEvent[],
  objects: ProjectionObject[],
  assertions: ProjectionAssertion[],
  obligations: ProjectionObligation[]
): ObjectTransformationResult {
  const sourceObjects = objects.filter((o) => o.interoperability_class === "instrument" || o.interoperability_class === "claim");
  const derivativeObjects = objects.filter((o) => o.interoperability_class === "work");

  const band: TransformationBandEntry[] = [];
  const renderFailures: Record<string, unknown>[] = [];

  // Fixture-sourced preserved/transformed/imagined arrays (evt-06's own payload — the studio's
  // graduation event), reused verbatim, never re-derived or paraphrased.
  const graduationEvent = events.find(
    (e) => Array.isArray(e.payload.preserved) && Array.isArray(e.payload.transformed) && Array.isArray(e.payload.imagined)
  );
  if (graduationEvent) {
    for (const label of graduationEvent.payload.preserved as string[]) {
      band.push({ category: "preserved", label, is_negative_band: false, source: "event_payload" });
    }
    for (const label of graduationEvent.payload.transformed as string[]) {
      band.push({ category: "re-voiced", label, is_negative_band: false, source: "event_payload" });
    }
    for (const label of graduationEvent.payload.imagined as string[]) {
      band.push({ category: "imagined", label, is_negative_band: false, source: "event_payload" });
    }
  }

  for (const assertion of assertions) {
    const category = KNOWN_PREDICATE_CATEGORY[assertion.predicate];
    if (category === undefined) {
      renderFailures.push({
        kind: "unrendered_predicate",
        assertion_id: assertion.assertion_id,
        predicate: assertion.predicate,
        reason: `no registered renderer form for predicate "${assertion.predicate}" under renderer "object-transformation"`
      });
      band.push({
        category: "unclassified",
        label: assertion.predicate,
        is_negative_band: false,
        source: "assertion",
        assertion_id: assertion.assertion_id,
        rationale: assertion.rationale,
        local_epistemic_status: assertion.local_epistemic_status
      });
      continue;
    }
    band.push({
      category,
      label: assertion.predicate,
      is_negative_band: category === "declined-to-carry",
      source: "assertion",
      assertion_id: assertion.assertion_id,
      rationale: assertion.rationale,
      local_epistemic_status: assertion.local_epistemic_status
    });
  }

  return {
    payload: {
      source_column: sourceObjects.map((o) => ({
        id: o.id,
        canonical_uri: o.canonical_uri,
        local_object_type: o.local_object_type,
        local_epistemic_status: o.local_epistemic_status
      })),
      derivative_column: derivativeObjects.map((o) => ({
        id: o.id,
        canonical_uri: o.canonical_uri,
        local_object_type: o.local_object_type,
        local_epistemic_status: o.local_epistemic_status
      })),
      transformation_band: band,
      tier_legend: ["VERIFIED", "DISCLOSED RECONSTRUCTION", "IMAGINED"],
      obligations: obligations.map((o) => ({ id: o.id, clause_text: o.clause_text, status: o.status, prominence: o.prominence }))
    },
    renderFailures
  };
}
