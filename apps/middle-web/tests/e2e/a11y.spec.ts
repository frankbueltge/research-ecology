import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ALL_ROUTES } from "./fixtures.js";

test.describe("accessibility (axe-core, no serious/critical violations)", () => {
  for (const route of ALL_ROUTES) {
    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }
});

/** Work order phase-3d §4 "Blatt: axe light+dark" — explicit both-colour-scheme coverage for the
 * poster specifically (the generic loop above only exercises the default scheme). */
test.describe("accessibility: poster, light + dark", () => {
  for (const route of ["/", "/de"]) {
    for (const scheme of ["light", "dark"] as const) {
      test(`axe: ${route} (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(route);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
      });
    }
  }
});
