import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { ENCOUNTER_ID } from "./fixtures.js";

/**
 * Position display on the encounter page (spec-v2.1 §7.1, ADR 0011, work order
 * phase-b-profiles.md §5/§6 item 6): every participating practice shows "Position in this
 * encounter: …" / "Held accountable to: …" from its applicable profile; the draft chip is
 * state-aware — profiles were ACTIVATED on 2026-07-15 (team amendment, ADR 0011 addendum);
 * Ulysses (documented non-participant in enc-2026-001) gets no position block at all; the
 * wording never hardens into a fixed department label.
 */

test.describe("encounter page: practice position display", () => {
  const profileStatus = (name: string): string =>
    JSON.parse(readFileSync(new URL(`../../../../fixtures/practice-profiles/${name}.json`, import.meta.url), "utf8")).status;

  test("Meridian and Ensemble each show a Position/Accountability block; chip matches profile status", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);

    const meridianCard = page.locator(".participant").filter({ has: page.getByRole("heading", { name: /^Meridian/ }) });
    await expect(meridianCard).toContainText("Position in this encounter:");
    await expect(meridianCard).toContainText("scientific research practice.");
    await expect(meridianCard).toContainText("Held accountable to:");
    await expect(meridianCard).toContainText("What justifies this claim, and under which conditions could it fail?");
    if (profileStatus("meridian") === "draft") {
      await expect(meridianCard).toContainText("draft — compiled from the practice's protocol, pending local confirmation");
    } else {
      // activated 2026-07-15 (team amendment) — the pending chip must be gone
      await expect(meridianCard.locator(".pending-badge")).toHaveCount(0);
    }

    const ensembleCard = page.locator(".participant").filter({ has: page.getByRole("heading", { name: /^Ensemble/ }) });
    await expect(ensembleCard).toContainText("Position in this encounter:");
    await expect(ensembleCard).toContainText("Held accountable to:");
    await expect(ensembleCard).toContainText("What does the form do, and what becomes thinkable, perceptible or possible only through this work?");
    if (profileStatus("ensemble") === "draft") {
      await expect(ensembleCard).toContainText("draft — compiled from the practice's protocol, pending local confirmation");
    } else {
      // activated 2026-07-15 (team amendment) — the pending chip must be gone
      await expect(ensembleCard.locator(".pending-badge")).toHaveCount(0);
    }
  });

  test("exactly two position blocks render (Meridian source + Ensemble receiver) — the conductor gets none", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    await expect(page.locator("text=Position in this encounter:")).toHaveCount(2);
  });

  test("Ulysses (documented non-participant) gets no position block anywhere on the page", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);

    // Ulysses appears only in the "Documented non-participation" section, never with a
    // position block of its own.
    const nonParticipationSection = page.locator(".non-participation-section");
    await expect(nonParticipationSection).toContainText("ulysses");
    await expect(nonParticipationSection.locator("text=Position in this encounter:")).toHaveCount(0);

    const ulysses = page.locator(".participant", { hasText: "Ulysses" });
    await expect(ulysses).toHaveCount(0);
  });

  test("no fixed department label (e.g. 'the scientific practice') appears anywhere — position wording is encounter-situated, not a category tag", async ({
    page
  }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    const bodyText = await page.locator("body").innerText();
    for (const forbidden of ["the scientific practice", "the artistic practice", "the philosophical practice"]) {
      expect(bodyText.toLowerCase()).not.toContain(forbidden);
    }
  });
});
