import { getAssertionById, getActor } from "$lib/server/data.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ params }) => {
  const { assertion, authorCollective, encounter } = await getAssertionById(params.id);
  const actor = await getActor(assertion.author.actor_id);
  const authorName = authorCollective?.current_name ?? actor?.display_name ?? assertion.author.actor_id;
  return { assertion, authorCollective, encounter, authorName };
};
