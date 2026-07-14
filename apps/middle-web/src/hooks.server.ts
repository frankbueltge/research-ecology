import type { Handle } from "@sveltejs/kit";

/**
 * Server hooks (work order §0 "Security headers"):
 *  - locale from the matched `[[locale=locale]]` route param (src/params/locale.ts) — no i18n
 *    framework, just a URL-prefix convention resolved once here via `event.params.locale`.
 *  - theme from a persisted cookie, applied server-side so there is no flash (design §5):
 *    the `<html data-theme="...">` attribute is set before the first byte reaches the client,
 *    never decided by a client script racing the paint.
 *  - security headers beyond CSP (CSP itself is SvelteKit's own `csp` config in
 *    svelte.config.js — strict, self-only, hashed inline scripts only, no external hosts):
 *    X-Content-Type-Options and a strict Referrer-Policy on every response.
 */
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.locale = event.params.locale === "de" ? "de" : "en";

  const themeCookie = event.cookies.get("the-middle-theme");
  event.locals.theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%lang%", event.locals.locale).replace("%theme%", event.locals.theme ?? "")
  });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
};
