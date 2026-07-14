import { getEncounterBundle, getMapVersion, getLatestMapVersionNumber, buildActorNames, buildLensManifestView } from "$lib/server/data.js";
import type { ProvenanceChainPayload } from "@research-ecology/projections";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
  const bundle = await getEncounterBundle(params.id);

  const lensManifests = await Promise.all(
    bundle.lensSummaries.map(({ lens, latestVersion }) => buildLensManifestView(lens.lens_id, latestVersion))
  );

  const provenanceVersion = await getLatestMapVersionNumber("provenance-v1");
  const provenanceMap = await getMapVersion("provenance-v1", provenanceVersion);
  const actorNames = await buildActorNames(bundle);

  return {
    bundle,
    eventTrace: provenanceMap.projection as unknown as ProvenanceChainPayload,
    lensManifests,
    actorNames
  };
};
