export type Locale = "en" | "de";

export { dictionary } from "./dictionary.js";
export type { Dictionary } from "./dictionary.js";

/** Prefixes an app-internal path with the locale, matching the URL-prefix routing convention
 * (work order §0 i18n: "URL-prefix routing (/de/...)", "no i18n framework dependency"). */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === "de" ? `/de${clean}` : clean;
}

/** Strips a leading `/de` prefix, for building the "switch language" link on the other locale. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/de") return "/";
  if (pathname.startsWith("/de/")) return pathname.slice(3);
  return pathname;
}
