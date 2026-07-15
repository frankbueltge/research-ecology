import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node"
  },
  server: {
    // Own dev port (work order §2: 5174 — distinct from middle-web's 5173/4173 so both apps can
    // run side by side). No external runtime requests: only this app's own origin is ever
    // served; the type stack (Iowan Old Style/Georgia, IBM-free system serif) needs no font
    // files at all, so there is no CDN dependency to rule out here either.
    port: 5174,
    strictPort: true,
    fs: { allow: ["."] }
  },
  preview: {
    port: 4174,
    strictPort: true
  }
});
