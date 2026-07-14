import { error } from "@sveltejs/kit";
import { getEncounterBundle, getMapVersion, getLensVersions, buildActorNames, buildLensManifestView, isKnownLensId } from "$lib/server/data.js";
import type {
  ObjectTransformationPayload,
  ParallelPositionsPayload,
  ProvenanceChainPayload
} from "@research-ecology/projections";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
  const { lensId } = params;
  const version = Number(params.version);
  if (!isKnownLensId(lensId) || !Number.isInteger(version) || version < 1) {
    throw error(404, `No map version "${params.version}" for lens "${lensId}".`);
  }

  const bundle = await getEncounterBundle(params.id);
  const map = await getMapVersion(lensId, version);
  const lensVersions = await getLensVersions(lensId);
  const lens = lensVersions.find((l) => l.version === map.lens.version) ?? lensVersions[lensVersions.length - 1]!;
  const actorNames = await buildActorNames(bundle);
  const manifest = await buildLensManifestView(lensId, version);

  const unrenderedAssertions = map.render_failures
    .filter((f) => f.kind === "unrendered_predicate")
    .map((f) => ({
      assertion_id: String(f.assertion_id ?? ""),
      predicate: String(f.predicate ?? ""),
      reason: String(f.reason ?? "")
    }));

  return { bundle, map, lens, actorNames, unrenderedAssertions, manifest };
};

export type { ObjectTransformationPayload, ParallelPositionsPayload, ProvenanceChainPayload };
