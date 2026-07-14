import { redirect } from "@sveltejs/kit";
import { CURRENT_ENCOUNTER_ID } from "$lib/constants.js";
import { localizedPath } from "$lib/i18n";
import type { PageServerLoad } from "./$types.js";

/** `/` (and `/de`) → 302 to the current encounter (design §2: "the honest single-encounter
 * state" — there is exactly one, so the redirect names it rather than pretending a homepage
 * needs to choose). */
export const load: PageServerLoad = async ({ locals }) => {
  throw redirect(302, localizedPath(locals.locale, `/encounters/${CURRENT_ENCOUNTER_ID}`));
};
