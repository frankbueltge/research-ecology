import { getEncounterBundle, buildActorNames } from "$lib/server/data.js";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import type { PageServerLoad } from "./$types.js";

const PAGE_SIZE = 4;

/** `/ledger` — the complete, raw append-only event stream for the encounter (spec 04 §4),
 * cursor-paged. Deliberately more complete than the `provenance-v1` lens's chain, which
 * excludes the synthesized `editorial.encounter_assembled` event by declared exclusion
 * (lenses/provenance-v1.json: "Visible on /apparatus instead") — here it stays fully honest
 * about the whole append-only record, apparatus event included.
 */
export const load: PageServerLoad = async ({ url }) => {
  const bundle = await getEncounterBundle(CURRENT_ENCOUNTER_ID);
  const actorNames = await buildActorNames(bundle);

  const totalPages = Math.max(1, Math.ceil(bundle.events.length / PAGE_SIZE));
  const requestedPage = Number(url.searchParams.get("cursor") ?? "0");
  const page = Number.isInteger(requestedPage) && requestedPage >= 0 && requestedPage < totalPages ? requestedPage : 0;

  const events = bundle.events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return {
    events,
    actorNames,
    page,
    totalPages,
    hasNext: page + 1 < totalPages,
    hasPrev: page > 0,
    encounterId: CURRENT_ENCOUNTER_ID
  };
};
