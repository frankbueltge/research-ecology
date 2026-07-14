import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config (work order §1): a11y (axe-core), keyboard journey, no-JS journey,
 * reduced-motion, mobile (390×844), print stylesheet and per-renderer screenshot tests.
 * `webServer` builds+previews so tests exercise the same SSR output `npm run build` produces.
 *
 * Projects are scoped by `testMatch`/`testIgnore` rather than letting every project run every
 * spec file: `mobile`/`no-js`/`reduced-motion` each run only their own single spec (the
 * viewport/JS/motion condition IS the point of that file), `chromium` runs everything else.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/mobile.spec.ts", "**/no-js.spec.ts", "**/reduced-motion.spec.ts"]
    },
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
      testMatch: ["**/mobile.spec.ts"]
    },
    {
      name: "no-js",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
      testMatch: ["**/no-js.spec.ts"]
    },
    {
      name: "reduced-motion",
      use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" },
      testMatch: ["**/reduced-motion.spec.ts"]
    }
  ]
});
