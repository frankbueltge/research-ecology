import { getEncounterBundle, getMapVersion, getLatestMapVersionNumber, buildActorNames, buildLensManifestView } from "$lib/server/data.js";
import type { PageServerLoad } from "./$types.js";

const COMPARE_LENSES = ["ensemble-transformation-v1", "meridian-position-v1"] as const;

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

  return { bundle, actorNames, panels };
};
