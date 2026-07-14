import { getObjectByCollectiveAndLocalId, getActor, getCollective } from "$lib/server/data.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
  const { object, collective, assertionsAbout } = await getObjectByCollectiveAndLocalId(params.collective, params.localId);

  const authorNames: Record<string, string> = {};
  for (const assertion of assertionsAbout) {
    const actor = await getActor(assertion.author.actor_id);
    authorNames[assertion.assertion_id] = actor?.display_name ?? assertion.author.collective_id ?? assertion.author.actor_id;
  }

  const sourceCollective = collective ?? (await getCollective(params.collective));

  return { object, collective: sourceCollective, assertionsAbout, authorNames };
};
