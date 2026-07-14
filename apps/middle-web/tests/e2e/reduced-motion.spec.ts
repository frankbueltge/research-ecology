import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

/** Reduced motion (work order §1 / design §5.3): no transitions when `prefers-reduced-motion`.
 * This file only runs under the `reduced-motion` Playwright project (configured in
 * playwright.config.ts, `reducedMotion: "reduce"`). `page.emulateMedia` is called explicitly
 * inside each test too (redundant with the project's context-level option, but avoids any
 * emulation/navigation race before the very first computed-style read). */
test("the --motion-fast/--motion-base tokens themselves collapse to 0 under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/encounters/${ENCOUNTER_ID}`);
  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return { fast: cs.getPropertyValue("--motion-fast").trim(), base: cs.getPropertyValue("--motion-base").trim() };
  });
  // Chromium's computed-style serialization may normalise "0ms" to "0s" (same duration,
  // different spelling) — assert the numeric value, not the exact unit string.
  expect(parseFloat(tokens.fast)).toBe(0);
  expect(parseFloat(tokens.base)).toBe(0);
});

test("skip-link transition duration collapses to 0 under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/encounters/${ENCOUNTER_ID}`);
  const duration = await page.locator(".skip-link").evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(duration).toBe("0s");
});
