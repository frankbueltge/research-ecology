import { expect, test } from "@playwright/test";

/**
 * No-JS journey (work order §6 test 5: "No-JS: Tabelle + Inhalte lesbar"). Runs only under the
 * `no-js` Playwright project (javaScriptEnabled: false, playwright.config.ts). The theme toggle
 * is explicitly NOT exercised here — it requires JavaScript by design (ThemeToggle.svelte's own
 * doc comment) — this file only checks that the sheet's actual content survives without it.
 */

const ENTRANCE_THREAD_TITLE = "Error subtracted to a special case of the epistemic thing";

test.describe("no-JS: the sheet's content is complete", () => {
  test("headline, status line and edge register table render without JavaScript", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#sheet-headline")).toHaveText(ENTRANCE_THREAD_TITLE);
    await expect(page.locator(".status").first()).toBeVisible();
    const rows = page.locator("section.record table tbody tr");
    await expect(rows).toHaveCount(23);
  });

  test("the SVG figure and its labels render without JavaScript (SSR, not client-drawn)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("svg#score")).toBeVisible();
    await expect(page.locator("svg#score text.t-thread").first()).toBeVisible();
  });

  test("the theme default without JS is the static light fallback", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "auto");
  });

  test("margin rail links are real anchors, reachable without JS", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('nav.blattrand a[href="/apparatus"]')).toBeVisible();
  });
});
