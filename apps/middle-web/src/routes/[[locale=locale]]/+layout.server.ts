import type { LayoutServerLoad } from "./$types.js";

/** Threads locale (from the `[[locale=locale]]` param, resolved in hooks.server.ts) and the
 * persisted theme cookie down to the root layout — no i18n framework, no client-side flash. */
export const load: LayoutServerLoad = async ({ locals }) => {
  return { locale: locals.locale, theme: locals.theme };
};
