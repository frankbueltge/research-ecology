import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../../../");

/** Work order phase-3d §4 "Divergenz": shared facts appear exactly once (within the primary
 * divergence view — the demoted, collapsed "full maps" appendix legitimately repeats some of
 * the same underlying map data, per work order §3 item 5's explicit "keine Löschung"), both
 * positions verbatim, no merge text, "no shared resolution" present, and the pre-existing
 * switcher survives collapsed rather than deleted. */
test.describe("divergence view", () => {
  const url = `/encounters/${ENCOUNTER_ID}/compare`;

  test("head: 'One case, two registers' with one line of context", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator("h1")).toHaveText("One case, two registers");
    await expect(page.locator(".lede.content").first()).not.toBeEmpty();
  });

  test("shared facts (caption, appellate-finding quote) appear exactly once within the primary divergence view", async ({ page }) => {
    await page.goto(url);
    const primaryText = await page.locator(".divergence-primary").innerText();

    const caption = "Yang v. University of Minnesota (Minn. Ct. App., Feb 2026)";
    const captionOccurrences = primaryText.split(caption).length - 1;
    expect(captionOccurrences).toBe(1);

    const eventsPath = path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels/events.json");
    const events = JSON.parse(readFileSync(eventsPath, "utf-8")) as Array<{ event_id: string; payload: Record<string, unknown> }>;
    const correctionIssued = events.find((e) => e.event_id === "evt-enc2026001-03-correction-issued")!;
    const appellateQuote = correctionIssued.payload.quote_appellate_finding as string;
    const quoteOccurrences = primaryText.split(appellateQuote).length - 1;
    expect(quoteOccurrences).toBe(1);
  });

  test("both positions render verbatim (Meridian's framing, Ensemble's decline rationale)", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator(".divergence-position--meridian")).toContainText(
      "a detector-in-the-accusation observation, not court-attributed detector harm"
    );
    await expect(page.locator(".divergence-position--ensemble")).toContainText(
      "A work about machine judgment may not borrow stakes the record does not attribute to the machine"
    );
    // Both positions link to their own authored assertion.
    await expect(page.locator(".divergence-position--meridian a", { hasText: "view authored assertion" })).toHaveAttribute(
      "href",
      "/assertions/assert-enc2026001-meridian-live-framing"
    );
    await expect(page.locator(".divergence-position--ensemble a", { hasText: "view authored assertion" })).toHaveAttribute(
      "href",
      "/assertions/assert-enc2026001-ensemble-boundary-case"
    );
  });

  test("no merge text: the two positions are never reconciled into one shared reading", async ({ page }) => {
    await page.goto(url);
    const primaryText = (await page.locator(".divergence-primary").innerText()).toLowerCase();
    for (const mergeWord of ["reconciled", "merged", "resolved into", "unified", "aufgelöst zu", "vereint", "zusammengeführt"]) {
      expect(primaryText, `should not contain merge language "${mergeWord}"`).not.toContain(mergeWord);
    }
  });

  test("'no shared resolution' is present, alongside 'both stand, today'", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator(".divergence-primary")).toContainText("No shared resolution");
    await expect(page.locator(".divergence-primary")).toContainText("both stand, today");
  });

  test("full maps: demoted, not deleted — present as a collapsed appendix with both renderers still inside", async ({ page }) => {
    await page.goto(url);
    const details = page.locator("details.full-maps");
    await expect(details).toHaveCount(1);
    expect(await details.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);

    // Direct child only — the two nested LensManifestPanel `<details>` inside also have their
    // own `<summary>`, which a descendant selector would ambiguously match too.
    await details.locator(":scope > summary").click();
    expect(await details.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
    await expect(page.locator(".compare-switcher")).toBeVisible();
    await expect(page.locator(".compare-panel--a")).toContainText("object-transformation");
    await expect(page.locator(".compare-panel--b")).toContainText("parallel-positions");
  });
});
