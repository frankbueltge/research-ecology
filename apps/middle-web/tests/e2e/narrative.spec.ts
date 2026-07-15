import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import { ENCOUNTER_ID, STATION_CAPTIONS } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../../../");

/** Work order phase-3d §4 "Erzählung", re-scoped to the 2026-07-15 entrance rebuild (one
 * composed tableau, six CSS-only radio-driven stations instead of six scrolling beats): station
 * captions render their quote verbatim from the fixture, attribution follows the quote in DOM
 * order, every caption links into the Akte, the pending badge appears once (not per caption),
 * the identity-recession rule now reads "no collective name anywhere in the entrance except
 * inside station 6's caption" (there is no more "before beat 1" — all six captions live in the
 * DOM together, toggled by visibility, not by scroll position), and the radios are a real
 * keyboard-operable control. Byte-exact quote↔fixture cross-checking for all six beats lives in
 * tests/unit/narrative.test.ts (no browser needed there); this file spot-checks one quote in
 * the live DOM as an end-to-end sanity check and focuses on structure/ordering/keyboard concerns
 * that genuinely need a rendered page. */

/** A caption's heading is `<span class="cap-no">N</span> {heading text}` — strip the station
 * number so the assertion below is exact against the authored heading text, not the badge. */
async function captionHeadingText(page: Page, n: number): Promise<string> {
  return page.locator(`.cap-${n} .cap-heading`).evaluate((el) => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelector(".cap-no")?.remove();
    return (clone.textContent ?? "").trim();
  });
}

test.describe("narrative: six stations", () => {
  test("station 1 and station 6 headings render exactly as authored (EN-only, 2026-07-15)", async ({ page }) => {
    await page.goto("/");
    expect(await captionHeadingText(page, 1)).toBe("An instrument, under conditions.");
    expect(await captionHeadingText(page, 6)).toBe("Two readings remain. Both stand.");
  });

  test("station 4's quote renders byte-exact against the fixture (spot check; full cross-check in tests/unit/narrative.test.ts)", async ({
    page
  }) => {
    const eventsPath = path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels/events.json");
    const events = JSON.parse(readFileSync(eventsPath, "utf-8")) as Array<{ event_id: string; payload: Record<string, unknown> }>;
    const correctionIssued = events.find((e) => e.event_id === "evt-enc2026001-03-correction-issued")!;
    const fixtureQuote = correctionIssued.payload.quote_appellate_finding as string;

    await page.goto("/");
    const rendered = await page.locator(".cap-4 .cap-quote").textContent();
    expect(rendered).toBe(`“${fixtureQuote}”`);
  });

  test("attribution appears after the quote, in DOM order, for every quoted station (1–5)", async ({ page }) => {
    await page.goto("/");
    for (const cap of STATION_CAPTIONS.slice(0, 5)) {
      const inOrder = await page.evaluate((capClass) => {
        const quote = document.querySelector(`.${capClass} .cap-quote`);
        const attribution = document.querySelector(`.${capClass} .cap-attribution`);
        if (!quote || !attribution) return false;
        // DOCUMENT_POSITION_FOLLOWING: attribution comes after quote in document order.
        return Boolean(quote.compareDocumentPosition(attribution) & Node.DOCUMENT_POSITION_FOLLOWING);
      }, cap);
      expect(inOrder, `${cap}: attribution should follow the quote in DOM order`).toBe(true);
    }
  });

  test("every station links into the record (Akte)", async ({ page }) => {
    await page.goto("/");
    for (const cap of STATION_CAPTIONS) {
      const hrefs = await page.locator(`.${cap} .cap-links a`).evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs.length, `${cap} should have at least one CTA link`).toBeGreaterThan(0);
      expect(hrefs.some((h) => h?.includes(`/encounters/${ENCOUNTER_ID}`))).toBe(true);
    }
  });

  test("station 6 links to both the divergence view and the record", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator(".cap-6 .cap-links a").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.some((h) => h === `/encounters/${ENCOUNTER_ID}/compare`)).toBe(true);
    expect(hrefs.some((h) => h === `/encounters/${ENCOUNTER_ID}`)).toBe(true);
  });

  test("pending-approval badge never appears inside a station caption; footnote badge matches the narrative's approval state", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator(".tableau__caption .pending-badge").count()).toBe(0);
    // State-aware: the badge renders only while approval === "pending". The enc-2026-001
    // wording set was approved by Frank on 2026-07-15 (docs/design/wortlaute-2026-07-15.md),
    // so today the correct count is 0. A future pending narrative flips this back via data.
    const approval = JSON.parse(
      readFileSync(new URL("../../../../narratives/enc-2026-001.json", import.meta.url), "utf8")
    ).approval;
    expect(await page.locator(".entrance__footnote .pending-badge").count()).toBe(approval === "pending" ? 1 : 0);
  });

  for (const route of ["/"]) {
    test(`identity recession (work order §4): no collective name appears in the entrance outside station 6 — ${route}`, async ({
      page
    }) => {
      await page.goto(route);
      // All six captions are always in the DOM (only visibility toggles), so "before beat 1"
      // no longer means anything positional — the guarantee is now "nowhere in .entrance except
      // inside .cap-6". Clone the section and drop .cap-6 before reading its text.
      const textOutsideStation6 = await page.evaluate(() => {
        const entrance = document.querySelector("section.entrance");
        if (!entrance) return "";
        const clone = entrance.cloneNode(true) as Element;
        clone.querySelectorAll(".cap-6").forEach((el) => el.remove());
        return clone.textContent ?? "";
      });
      for (const name of ["Meridian", "Ensemble", "Ulysses"]) {
        expect(textOutsideStation6, `"${name}" must not appear in the entrance outside station 6`).not.toContain(name);
      }
    });
  }

  test("station 6 is where collective names first appear (Meridian's framing / Ensemble's refusal band)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".cap-6")).toContainText("Meridian");
    await expect(page.locator(".cap-6")).toContainText("Ensemble");
  });

  test("tableau radios are keyboard-reachable and switchable with arrow keys; the active badge shows a focus-visible ring", async ({
    page
  }) => {
    await page.goto("/");

    const radio1 = page.locator("#st-1");
    await radio1.focus();
    await expect(radio1).toBeFocused();
    await expect(radio1).toBeChecked();
    const outline1 = await page.locator('label[for="st-1"]').evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline1).not.toBe("none");

    // Native radio-group behaviour (shared `name="tableau-station"`): ArrowRight moves both
    // focus and selection to the next radio, no script involved.
    await page.keyboard.press("ArrowRight");
    const radio2 = page.locator("#st-2");
    await expect(radio2).toBeFocused();
    await expect(radio2).toBeChecked();
    await expect(page.locator(".cap-2")).toBeVisible();
    await expect(page.locator(".cap-1")).toBeHidden();
    const outline2 = await page.locator('label[for="st-2"]').evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline2).not.toBe("none");
  });
});
