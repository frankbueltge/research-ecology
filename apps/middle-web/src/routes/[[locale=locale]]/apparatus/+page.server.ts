import { ACTOR_SEED, COLLECTIVE_SEED } from "@research-ecology/domain";
import { PROJECTIONS_ENGINE_VERSION } from "@research-ecology/projections";
import { listImportRecordsForCollective, getEncounterBundle } from "$lib/server/data.js";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
  const importRecords = await Promise.all(
    COLLECTIVE_SEED.map(async (collective) => ({
      collectiveId: collective.id,
      records: await listImportRecordsForCollective(collective.id)
    }))
  );

  // The synthesized `editorial.encounter_assembled` event: lenses/provenance-v1.json's own
  // declared exclusion promises it is "Visible on /apparatus instead" of the provenance chain.
  const bundle = await getEncounterBundle(CURRENT_ENCOUNTER_ID);
  const assemblyEvent = bundle.events.find((e) => e.event_type === "editorial.encounter_assembled");

  return {
    actors: ACTOR_SEED,
    collectives: COLLECTIVE_SEED,
    engineVersion: PROJECTIONS_ENGINE_VERSION,
    importRecords,
    assemblyEvent
  };
};
