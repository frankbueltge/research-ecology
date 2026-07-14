import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

/** Print stylesheet (work order §1): map version page prints with a citation block (URL, hash,
 * watermark); chrome (header/footer/nav/controls) is hidden. */
test.describe("print stylesheet", () => {
  test("map version page: citation block visible, header/footer hidden, hint suppressed", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/provenance-v1@1`);
    await page.emulateMedia({ media: "print" });

    const headerDisplay = await page.locator(".site-header").evaluate((el) => getComputedStyle(el).display);
    expect(headerDisplay).toBe("none");
    const footerDisplay = await page.locator(".site-footer").evaluate((el) => getComputedStyle(el).display);
    expect(footerDisplay).toBe("none");

    const citation = page.locator(".citation");
    await expect(citation).toBeVisible();
    await expect(citation).toContainText("sha256:");
    await expect(citation).toContainText("2026-07-1");

    const printHintDisplay = await page.locator(".citation__print-hint").evaluate((el) => getComputedStyle(el).display);
    expect(printHintDisplay).toBe("none");
  });

  test("map version page: the interactive lens-manifest panel is suppressed in print — the .citation block is the guaranteed print record instead", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1`);
    await page.emulateMedia({ media: "print" });
    const manifestDisplay = await page.locator("details.lens-manifest").evaluate((el) => getComputedStyle(el).display);
    expect(manifestDisplay).toBe("none");
    await expect(page.locator(".citation")).toBeVisible();
  });
});
