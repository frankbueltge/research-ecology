import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config (work order §6, own suite / own port — ADR 0010: the Atelier does not
 * share middle-web's config or a running server with it). `webServer` builds+previews so tests
 * exercise the same SSR output `npm run build` produces, on the app's own preview port (4174,
 * distinct from middle-web's 4173) so both suites could run concurrently without colliding.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4174",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run build && npm run preview -- --port 4174",
    url: "http://localhost:4174",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/no-js.spec.ts"]
    },
    {
      name: "no-js",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
      testMatch: ["**/no-js.spec.ts"]
    }
  ]
});
