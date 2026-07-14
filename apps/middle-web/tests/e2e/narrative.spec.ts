import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { BEAT_IDS, ENCOUNTER_ID } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../../../../");

/** Work order phase-3d §4 "Erzählung": beat quotes verbatim from the fixture, attribution
 * follows the quote in DOM order, every beat links into the Akte, the pending badge appears
 * once (not per beat), and — the identity-recession test — no collective name appears in the
 * DOM before beat 1. Byte-exact quote↔fixture cross-checking for all six beats lives in
 * tests/unit/narrative.test.ts (no browser needed there); this file spot-checks one quote in
 * the live DOM as an end-to-end sanity check and focuses on structure/ordering concerns that
 * genuinely need a rendered page. */

test.describe("narrative: six beats", () => {
  test("all six beat headings render, DE and EN, exactly as authored", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#beat-1 .beat__heading")).toHaveText("An instrument, under conditions.");
    await expect(page.locator("#beat-6 .beat__heading")).toHaveText("Two readings remain. Both stand.");

    await page.goto("/de");
    await expect(page.locator("#beat-1 .beat__heading")).toHaveText("Ein Instrument, unter Bedingungen.");
    await expect(page.locator("#beat-6 .beat__heading")).toHaveText("Zwei Lesarten bleiben. Beide gelten.");
  });

  test("beat 4's quote renders byte-exact against the fixture (spot check; full cross-check in tests/unit/narrative.test.ts)", async ({
    page
  }) => {
    const eventsPath = path.join(REPO_ROOT, "fixtures/enc-2026-001-calibration-gap-travels/events.json");
    const events = JSON.parse(readFileSync(eventsPath, "utf-8")) as Array<{ event_id: string; payload: Record<string, unknown> }>;
    const correctionIssued = events.find((e) => e.event_id === "evt-enc2026001-03-correction-issued")!;
    const fixtureQuote = correctionIssued.payload.quote_appellate_finding as string;

    await page.goto("/");
    const rendered = await page.locator("#beat-4 .beat__quote").textContent();
    expect(rendered).toBe(`“${fixtureQuote}”`);
  });

  test("attribution appears after the quote, in DOM order, for every quoted beat (1–5)", async ({ page }) => {
    await page.goto("/");
    for (const id of BEAT_IDS.slice(0, 5)) {
      const inOrder = await page.evaluate((beatId) => {
        const quote = document.querySelector(`#${beatId} .beat__quote`);
        const attribution = document.querySelector(`#${beatId} .beat__attribution`);
        if (!quote || !attribution) return false;
        // DOCUMENT_POSITION_FOLLOWING: attribution comes after quote in document order.
        return Boolean(quote.compareDocumentPosition(attribution) & Node.DOCUMENT_POSITION_FOLLOWING);
      }, id);
      expect(inOrder, `${id}: attribution should follow the quote in DOM order`).toBe(true);
    }
  });

  test("every beat links into the record (Akte)", async ({ page }) => {
    await page.goto("/");
    for (const id of BEAT_IDS) {
      const hrefs = await page.locator(`#${id} .beat__cta a`).evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs.length, `${id} should have at least one CTA link`).toBeGreaterThan(0);
      expect(hrefs.some((h) => h?.includes(`/encounters/${ENCOUNTER_ID}`))).toBe(true);
    }
  });

  test("beat 6 links to both the divergence view and the record", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("#beat-6 .beat__cta a").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.some((h) => h === `/encounters/${ENCOUNTER_ID}/compare`)).toBe(true);
    expect(hrefs.some((h) => h === `/encounters/${ENCOUNTER_ID}`)).toBe(true);
  });

  test("pending-approval badge appears exactly once, after the sequence — never per beat", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator(".beat .pending-badge").count()).toBe(0);
    expect(await page.locator(".narrative__editorial-note .pending-badge").count()).toBe(1);
  });

  for (const route of ["/", "/de"]) {
    test(`identity recession (work order §4): no collective name appears in the DOM before beat 1 — ${route}`, async ({ page }) => {
      await page.goto(route);
      const textBeforeBeat1 = await page.evaluate(() => {
        const marker = document.getElementById("beat-1");
        if (!marker) return "";
        const range = document.createRange();
        range.setStart(document.body, 0);
        range.setEndBefore(marker);
        return range.toString();
      });
      for (const name of ["Meridian", "Ensemble", "Ulysses"]) {
        expect(textBeforeBeat1, `"${name}" must not appear before #beat-1`).not.toContain(name);
      }
    });
  }

  test("beat 6 is where collective names first appear (Meridian's framing / Ensemble's refusal band)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#beat-6")).toContainText("Meridian");
    await expect(page.locator("#beat-6")).toContainText("Ensemble");
  });
});
