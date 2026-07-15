import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

/**
 * Position display on the encounter page (spec-v2.1 §7.1, ADR 0011, work order
 * phase-b-profiles.md §5/§6 item 6): every participating practice shows "Position in this
 * encounter: …" / "Accountability: …" from its applicable profile, with a visible draft chip;
 * Ulysses (documented non-participant in enc-2026-001) gets no position block at all; the
 * wording never hardens into a fixed department label.
 */

test.describe("encounter page: practice position display", () => {
  test("Meridian and Ensemble each show a Position/Accountability block with a draft chip", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);

    const meridianCard = page.locator(".participant").filter({ has: page.getByRole("heading", { name: /^Meridian/ }) });
    await expect(meridianCard).toContainText("Position in this encounter:");
    await expect(meridianCard).toContainText("scientific research practice.");
    await expect(meridianCard).toContainText("Accountability:");
    await expect(meridianCard).toContainText("What justifies this claim, and under which conditions could it fail?");
    await expect(meridianCard).toContainText("draft — compiled from the practice's protocol, pending local confirmation");

    const ensembleCard = page.locator(".participant").filter({ has: page.getByRole("heading", { name: /^Ensemble/ }) });
    await expect(ensembleCard).toContainText("Position in this encounter:");
    await expect(ensembleCard).toContainText("Accountability:");
    await expect(ensembleCard).toContainText("What does the form do, and what becomes thinkable, perceptible or possible only through this work?");
    await expect(ensembleCard).toContainText("draft — compiled from the practice's protocol, pending local confirmation");
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
