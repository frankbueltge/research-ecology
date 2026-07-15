import type { Handle } from "@sveltejs/kit";

/**
 * Server hooks (work order §2, mirrors middle-web's non-CSP security-header baseline — CSP
 * itself is SvelteKit's own `csp` config in svelte.config.js). No locale handling (English-only,
 * no locale param route in this app at all) and no theme cookie: theme is resolved client-side
 * only, by the inline script in `src/app.html` (design §3 "same mechanic as the site" —
 * localStorage, not a server cookie; see that file's comment for why).
 */
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
};
