import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

/** Mobile (390×844, work order §1): event cards stack, position switcher sticky, no horizontal
 * scroll. This file only runs under the `mobile` Playwright project (configured in
 * playwright.config.ts). */
test.describe("mobile layout", () => {
  test("encounter page: no horizontal scroll, first-screen items stack in one column", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1: rounding tolerance

    const firstScreenColumns = await page.evaluate(() => {
      const el = document.querySelector(".first-screen");
      return el ? getComputedStyle(el).gridTemplateColumns.split(" ").length : 0;
    });
    expect(firstScreenColumns).toBe(1);
  });

  test("event trace cards stack vertically (single column ledger)", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    const positions = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".ledger > li")).map((el) => el.getBoundingClientRect().left)
    );
    // All ledger entries share the same left edge (stacked, not side by side).
    const distinctLefts = new Set(positions.map((n) => Math.round(n)));
    expect(distinctLefts.size).toBe(1);
  });

  test("compare view: sticky position switcher visible, no horizontal scroll", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/compare`);
    const switcher = page.locator(".compare-switcher");
    await expect(switcher).toBeVisible();
    const position = await switcher.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("sticky");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Only one compare panel is visible at a time on mobile.
    const visiblePanels = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".compare-panel")).filter((el) => getComputedStyle(el).display !== "none").length
    );
    expect(visiblePanels).toBe(1);
  });

  test("object-transformation map: three columns collapse to one on mobile", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1`);
    const columns = await page.evaluate(() => {
      const el = document.querySelector(".transformation");
      return el ? getComputedStyle(el).gridTemplateColumns.split(" ").length : 0;
    });
    expect(columns).toBe(1);
  });

  test("no route overflows horizontally at 390px", async ({ page }) => {
    for (const route of [`/encounters/${ENCOUNTER_ID}`, `/apparatus`, `/archive`, `/ledger`]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
});
