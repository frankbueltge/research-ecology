import { getEncounterBundle, getMapVersion, getLatestMapVersionNumber, buildActorNames, buildLensManifestView } from "$lib/server/data.js";
import type { ObjectTransformationPayload, ParallelPositionsPayload } from "@research-ecology/projections";
import type { PageServerLoad } from "./$types.js";

const COMPARE_LENSES = ["ensemble-transformation-v1", "meridian-position-v1"] as const;

/** `/encounters/[id]/compare` — the divergence view (work order phase-3d §3), backboned on the
 * Minnesota case (object claims-row-12 + Ensemble's boundary case). Reuses the SAME two lens
 * maps the pre-existing switcher already fetched (`ensemble-transformation-v1`,
 * `meridian-position-v1`) rather than re-deriving the divergence from raw records — the
 * `object-transformation` renderer's "declined-to-carry" band entry IS Ensemble's refusal, and
 * the `parallel-positions` renderer's `appellate_caveat`/`current_framing`/`register_rows` ARE
 * Meridian's register line; no new projection logic needed. The two source events for the
 * backbone's shared facts (case caption, appellate-finding date) come straight off the
 * already-loaded event bundle. */
export const load: PageServerLoad = async ({ params }) => {
  const bundle = await getEncounterBundle(params.id);
  const actorNames = await buildActorNames(bundle);

  const panels = await Promise.all(
    COMPARE_LENSES.map(async (lensId) => {
      const version = await getLatestMapVersionNumber(lensId);
      const map = await getMapVersion(lensId, version);
      const manifest = await buildLensManifestView(lensId, version);
      const unrenderedAssertions = map.render_failures
        .filter((f) => f.kind === "unrendered_predicate")
        .map((f) => ({
          assertion_id: String(f.assertion_id ?? ""),
          predicate: String(f.predicate ?? ""),
          reason: String(f.reason ?? "")
        }));
      return { lensId, map, manifest, unrenderedAssertions };
    })
  );

  const ensemblePanel = panels.find((p) => p.lensId === "ensemble-transformation-v1")!;
  const meridianPanel = panels.find((p) => p.lensId === "meridian-position-v1")!;

  const objectTransformation = ensemblePanel.map.projection as unknown as ObjectTransformationPayload;
  const parallelPositions = meridianPanel.map.projection as unknown as ParallelPositionsPayload;

  const declineEntry = objectTransformation.transformation_band.find((entry) => entry.category === "declined-to-carry");
  const baselineRow = parallelPositions.register_rows.find((row) => row.state === "baseline");
  const correctedRow = parallelPositions.register_rows.find((row) => row.state === "corrected");

  const translationEvent = bundle.events.find((e) => e.event_type === "translation.loss_declared");
  const correctionIssuedEvent = bundle.events.find((e) => e.event_type === "correction.issued");

  const divergence = {
    caption: typeof translationEvent?.payload.caption === "string" ? translationEvent.payload.caption : undefined,
    appellateFindingQuote: parallelPositions.appellate_caveat?.text,
    appellateFindingDate: correctionIssuedEvent?.occurred_at,
    watermark: meridianPanel.manifest.watermark,
    meridian: {
      framingValue: typeof parallelPositions.current_framing?.value === "string" ? parallelPositions.current_framing.value : undefined,
      framingRationale: parallelPositions.current_framing?.rationale,
      assertionId: parallelPositions.current_framing?.assertion_id,
      baselineText: baselineRow?.text,
      correctedText: correctedRow?.text
    },
    ensemble: {
      label: declineEntry?.label,
      rationale: declineEntry?.rationale,
      assertionId: declineEntry?.assertion_id
    }
  };

  return { bundle, actorNames, panels, divergence };
};
