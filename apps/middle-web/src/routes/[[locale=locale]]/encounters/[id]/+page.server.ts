import {
  getEncounterBundle,
  getMapVersion,
  getLatestMapVersionNumber,
  buildActorNames,
  buildLensManifestView,
  getApplicableProfileFor
} from "$lib/server/data.js";
import type { StoredPracticeProfileVersion } from "@research-ecology/domain";
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

  // Position display (spec-v2.1 §7.1, ADR 0011, work order phase-b-profiles.md §5): one
  // applicable profile lookup per DISTINCT participant collective — never a global/all-
  // collectives fetch, so a non-participant (e.g. Ulysses in enc-2026-001) never enters this
  // map at all and therefore never gets a position block (work order §5 "kein Positions-Block
  // für Ulysses" — the documented non-relation stays exactly as it is).
  const participantCollectiveIds = [
    ...new Set(bundle.participants.map((p) => p.collective_id).filter((id): id is string => Boolean(id)))
  ];
  const profileEntries = await Promise.all(
    participantCollectiveIds.map(async (collectiveId) => [collectiveId, await getApplicableProfileFor(collectiveId)] as const)
  );
  const profilesByCollective: Record<string, StoredPracticeProfileVersion | undefined> = Object.fromEntries(profileEntries);

  return {
    bundle,
    eventTrace: provenanceMap.projection as unknown as ProvenanceChainPayload,
    lensManifests,
    actorNames,
    profilesByCollective
  };
};
