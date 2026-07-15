import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID, STATION_CAPTIONS } from "./fixtures.js";

/** No-JS journey (work order §1): the encounter page and a map version page render complete,
 * readable records with JavaScript disabled — SSR-first, progressive enhancement only (work
 * order §0). This file only runs under the `no-js` Playwright project (javaScriptEnabled:
 * false), configured in playwright.config.ts. */

/** Re-scoped for the 2026-07-15 entrance rebuild ("no-JS: Sequenz erreichbar" still holds, in a
 * new shape): the six-station tableau is CSS-only (`:has(#st-N:checked)` sibling selectors, no
 * script), so it renders complete AND stays fully switchable with JavaScript disabled — clicking
 * a `<label for="st-N">` natively checks its radio, a browser feature, not a script one. The old
 * self-drawing glyph is gone from `/` entirely (replaced by the tableau's SVG, which is static,
 * not animated), so there is no longer a "drawing completes without JS" case to cover here. */
test.describe("no-JS: entrance renders complete", () => {
  test("headline, status line, SVG drawing and all six station captions are present in plain markup", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#entrance-headline")).toBeVisible();
    await expect(page.locator(".entrance__status")).toBeVisible();
    await expect(page.locator(".tableau__svg")).toHaveCount(1);
    await expect(page.locator(".tableau__caption")).toHaveCount(6);

    // Station 1 is checked by default (SSR markup): its caption is visible, the rest are not —
    // still present in the DOM (readable by assistive tech / view-source), just hidden.
    await expect(page.locator(".cap-1")).toBeVisible();
    for (const cap of STATION_CAPTIONS.slice(1)) {
      await expect(page.locator(`.${cap}`)).toBeHidden();
    }
  });

  test("stations switch via the CSS-only radios — no JS required", async ({ page }) => {
    await page.goto("/");

    await page.locator('label[for="st-3"]').click();
    await expect(page.locator(".cap-3")).toBeVisible();
    await expect(page.locator(".cap-1")).toBeHidden();

    await page.locator('label[for="st-6"]').click();
    await expect(page.locator(".cap-6")).toBeVisible();
    await expect(page.locator(".cap-3")).toBeHidden();
  });
});

test.describe("no-JS: encounter page renders complete", () => {
  test("full record content is present without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);

    await expect(page.locator("h1")).toContainText("Calibration Gap");
    // First-screen four sections (work order §0), all present in the static markup.
    await expect(page.getByRole("heading", { name: "Who offered what" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What the receiver did" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What is disputed or unresolved" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where the sources live" })).toBeVisible();

    // Event trace: all 7 ledger entries rendered (no client-side "load more").
    const eventCount = await page.locator(".ledger > li").count();
    expect(eventCount).toBe(7);

    // Obligations render without JS — appears twice by design (design §6.3 anchors it at its
    // accepting event in the ledger AND §6.5's standalone "Obligations" panel repeats it).
    await expect(page.getByText("Live status travels with every derived operation").first()).toBeVisible();
    expect(await page.getByText("Live status travels with every derived operation").count()).toBeGreaterThanOrEqual(2);

    // The lens manifest panel is a native <details> — collapsed content still exists in the DOM
    // (readable by assistive tech / view-source) even though it renders closed by default here.
    const manifestCount = await page.locator("details.lens-manifest").count();
    expect(manifestCount).toBe(3);
  });

  test("theme toggle degrades to a plain form POST without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    const darkForm = page.locator('form[action="/theme-toggle"]', { has: page.locator('input[value="dark"]') });
    await expect(darkForm).toHaveAttribute("method", "POST");
  });
});

test.describe("no-JS: map version page renders complete", () => {
  test("full renderer output, manifest and citation block present without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1`);

    await expect(page.getByRole("heading", { name: "Parallel positions (Meridian)" })).toBeVisible();
    await expect(page.locator("details.lens-manifest")).toHaveCount(1);
    await expect(page.getByText("BASELINE (STRUCK, NOT ERASED)")).toBeVisible();
    await expect(page.locator(".parallel__caveat")).toContainText("appellate caveat");
    await expect(page.locator(".citation")).toContainText("sha256:");
  });

  test("object-transformation map renders the negative band without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1`);
    await expect(page.locator(".transformation__negative-band")).toBeVisible();
    await expect(page.getByText("A work about machine judgment may not borrow stakes")).toBeVisible();
  });
});
