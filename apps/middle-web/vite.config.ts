import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node"
  },
  server: {
    // No external runtime requests (work order §3): dev server only ever serves this app's
    // own origin; fonts are self-hosted under static/fonts (no Google Fonts CDN at runtime).
    fs: { allow: ["."] }
  }
});
