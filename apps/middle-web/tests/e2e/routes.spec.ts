import { expect, test } from "@playwright/test";
import { ALL_ROUTES, ENCOUNTER_ID } from "./fixtures.js";

test.describe("route inventory", () => {
  for (const route of ALL_ROUTES) {
    test(`GET ${route} → 200, SSR HTML, correct <html lang>`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const lang = await page.getAttribute("html", "lang");
      // EN-only (2026-07-15: the ecology stack dropped German — every route is "en" now).
      expect(lang).toBe("en");
      // SSR-first (work order §0): the record content is already in the markup before any
      // client script runs — check via the raw response body, not the (possibly hydrated) DOM.
      const body = await response!.text();
      expect(body.length).toBeGreaterThan(500);
    });
  }

  // Work order phase-3d §0: `/` now renders the poster directly (no redirect to the record) —
  // the guarantee this replaces ("/ reliably lands you on real, addressable content") still
  // holds, just without leaving `/`.
  test("/ renders the poster directly, no redirect", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "commit" });
    expect(response?.request().redirectedFrom()).toBeFalsy();
    await expect(page).toHaveURL(/\/$/);
  });

  test("/de 404s (EN-only, 2026-07-15: the ecology stack dropped German — no more /de mirror)", async ({ page }) => {
    const response = await page.goto("/de");
    expect(response?.status()).toBe(404);
  });

  test("unknown encounter id → 404", async ({ page }) => {
    const response = await page.goto("/encounters/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("unknown lens id on a map route → 404", async ({ page }) => {
    const response = await page.goto(`/encounters/${ENCOUNTER_ID}/maps/bogus-lens@1`);
    expect(response?.status()).toBe(404);
  });

  test("out-of-range map version → 404", async ({ page }) => {
    const response = await page.goto(`/encounters/${ENCOUNTER_ID}/maps/provenance-v1@999`);
    expect(response?.status()).toBe(404);
  });

  test("unknown object → 404", async ({ page }) => {
    const response = await page.goto("/objects/meridian/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("unknown assertion → 404", async ({ page }) => {
    const response = await page.goto("/assertions/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("a genuinely unmatched path (no /api/graph route at all) → 404", async ({ page }) => {
    const response = await page.goto("/api/graph");
    expect(response?.status()).toBe(404);
  });
});
