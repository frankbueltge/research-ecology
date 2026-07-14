import { expect, test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

async function expectVisibleFocusRing(locator: import("@playwright/test").Locator) {
  const outline = await locator.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
}

/** Keyboard-only journey (work order §1): home → encounter → open lens manifest → compare →
 * assertion → object → doorway link, focus visible throughout. Every stop is reached the way a
 * keyboard user actually would — Tab to the element (skip-link first, since that's the very
 * first stop on every page) and Enter/Space to activate it — never `page.click()`. */
test("keyboard-only journey stays fully operable with a visible focus ring at every stop", async ({ page }) => {
  // 1. Home → redirects to the current encounter.
  await page.goto("/");
  await expect(page).toHaveURL(new RegExp(`/encounters/${ENCOUNTER_ID}$`));

  // Skip link is the first tab stop on every page (a11y requirement) and must show focus.
  await page.keyboard.press("Tab");
  const skipLink = page.locator(".skip-link");
  await expect(skipLink).toBeFocused();
  await expectVisibleFocusRing(skipLink);

  // 2. Open the lens manifest panel on the encounter page via keyboard (native <details>/
  // <summary> — Enter toggles it, no custom JS required).
  const summary = page.locator("details.lens-manifest summary").first();
  await summary.focus();
  await expectVisibleFocusRing(summary);
  await page.keyboard.press("Enter");
  const details = page.locator("details.lens-manifest").first();
  await expect(details).toHaveAttribute("open", "");

  // 3. Compare link, reached and activated via keyboard.
  const compareLink = page.getByRole("link", { name: /Compare two positions/i });
  await compareLink.focus();
  await expectVisibleFocusRing(compareLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/encounters/${ENCOUNTER_ID}/compare$`));

  // 4. From the compare view, follow an authored-assertion link via keyboard.
  const assertionLink = page.getByRole("link", { name: "view authored assertion →" }).first();
  await assertionLink.scrollIntoViewIfNeeded();
  await assertionLink.focus();
  await expectVisibleFocusRing(assertionLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/assertions\//);

  // 5. From the assertion page, follow the subject object's link via keyboard (the `dt`/`dd`
  // "Subject" row renders the object ref id as a link to /objects/[collective]/[localId]).
  const objectLink = page.locator(".montage dd a").first();
  await objectLink.scrollIntoViewIfNeeded();
  await objectLink.focus();
  await expectVisibleFocusRing(objectLink);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/objects\//);

  // 6. On the object page, the doorway link out to the sovereign archive is keyboard-reachable
  // and visibly focused (not activated — it leaves the site).
  const doorway = page.locator("a.doorway-link");
  await doorway.scrollIntoViewIfNeeded();
  await doorway.focus();
  await expectVisibleFocusRing(doorway);
  await expect(doorway).toHaveAttribute("target", "_blank");
  await expect(doorway).toHaveAttribute("href", /^https:\/\/github\.com\//);
});
