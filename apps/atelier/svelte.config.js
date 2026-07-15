import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Static adapter (work order C3 §1): the whole app is prerendered at build time — the
    // MemoryStore hydrates once during `vite build` (same store, same data as dev), every route
    // is a pure function of that build-time snapshot, and there is no runtime server code left
    // in this app (checked: no +server.ts, no form actions, no request-time cookies/query-string
    // reads — unlike apps/middle-web, see work order C3 report). `fallback` stays undefined
    // (no SPA mode): every route here is a fixed path, nothing to fall back for.
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    csp: {
      // Hash mode (was "auto", which resolves to nonce mode — work order C3 §1: a nonce is
      // per-response by definition and cannot exist in a file written once at build time;
      // SvelteKit refuses to prerender any page whose template still contains the literal
      // "%sveltekit.nonce%" placeholder). Hash mode computes a sha256 of the exact inline
      // script content in `src/app.html` at build time and adds it to `script-src` — same
      // "no unsafe-inline" guarantee, just resolved statically instead of per-request.
      mode: "hash",
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": ["self", "unsafe-inline"],
        "img-src": ["self"],
        "font-src": ["self"],
        "connect-src": ["self"],
        "object-src": ["none"],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["none"]
      }
    }
  }
};

export default config;
