import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";

/**
 * Sets the persisted light/dark preference (design §5: "persisted, no flash" — the cookie is
 * read server-side in hooks.server.ts before the first byte, so the next response already has
 * the right `data-theme` attribute). A plain form POST + redirect: works with JavaScript
 * disabled (full navigation) and is progressively enhanced client-side via `use:enhance`.
 */
export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const form = await request.formData();
  const theme = form.get("theme");
  const next = form.get("next");

  if (theme === "light" || theme === "dark") {
    cookies.set("the-middle-theme", theme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: !dev
    });
  }

  // Only ever redirect back to a same-origin relative path — never an open redirect.
  const target = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  throw redirect(303, new URL(target, url.origin));
};
