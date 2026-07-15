import { getNarrative } from "$lib/server/narrative.js";
import { getEncounterBundle } from "$lib/server/data.js";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import type { PageServerLoad } from "./$types.js";

/** `/` (and `/de`) — the entrance tableau: the current encounter as one composed screen
 * (kicker + explicit status line + headline + the six-station drawing with captions),
 * per the 2026-07-15 critique iteration ("kein ewiges Scrollen; was ist das hier?").
 * The record (Akte) lives one level deeper at `/encounters/[id]`. */
export const load: PageServerLoad = async () => {
  const bundle = await getEncounterBundle(CURRENT_ENCOUNTER_ID);
  const lastEventDate = bundle.events
    .map((e) => e.occurred_at)
    .sort()
    .at(-1)
    ?.slice(0, 10);

  return {
    narrative: getNarrative(),
    encounterId: CURRENT_ENCOUNTER_ID,
    lastEventDate
  };
};
