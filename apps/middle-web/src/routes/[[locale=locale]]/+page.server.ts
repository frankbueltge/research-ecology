import { getNarrative } from "$lib/server/narrative.js";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import type { PageServerLoad } from "./$types.js";

/** `/` (and `/de`) — the poster (Ebene 1) scrolling into the six-beat narrative (Ebene 2),
 * per docs/work-orders/phase-3d-entrance-and-divergence.md §0: no redirect to the record
 * anymore (the honest single-encounter state now lives one level deeper, at
 * `/encounters/[id]`, reachable from every beat's "Akte einsehen →" link). */
export const load: PageServerLoad = async () => {
  return {
    narrative: getNarrative(),
    encounterId: CURRENT_ENCOUNTER_ID
  };
};
