import { getLensVersions, getLatestMapVersionNumber, buildLensManifestView } from "$lib/server/data.js";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
  const versions = await getLensVersions(params.id);
  const latest = versions[versions.length - 1]!;
  const latestMapVersion = await getLatestMapVersionNumber(params.id);
  const manifest = await buildLensManifestView(params.id, latestMapVersion);
  return { lensId: params.id, versions, latest, manifest, encounterId: CURRENT_ENCOUNTER_ID, latestMapVersion };
};
