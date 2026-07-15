/**
 * Prerender the whole app (work order C3 §1): every route here is a pure function of the
 * build-time MemoryStore snapshot (`$lib/server/store.ts`'s `getAtelierData`, hydrated once per
 * process) — no request-time state anywhere in this app, so `adapter-static` can turn the whole
 * tree into static files. Fixed paths only (`/`, `/apparatus`, `/journal`, `/material`,
 * `/sheets`) — no dynamic route segments, so no `entries()` enumeration is needed here (contrast
 * apps/middle-web, which has `[id]`-shaped routes and, separately, request-time code that blocks
 * prerendering entirely — see the work order C3 report).
 */
export const prerender = true;
