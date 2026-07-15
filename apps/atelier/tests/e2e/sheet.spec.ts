import { expect, test } from "@playwright/test";

/**
 * Work order §6 test 5 (own suite, own port — ADR 0010): the sheet renders the current thread
 * title verbatim, the edge register table is complete (23 rows at the current bundle), the
 * reserved door's empty-state text is present, and the theme toggle cycles auto→light→dark.
 */

const ENTRANCE_THREAD_TITLE = "Error subtracted to a special case of the epistemic thing";

test.describe("the sheet renders the current thread verbatim", () => {
  test("h1 is the entrance thread's own label, byte-exact", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#sheet-headline")).toHaveText(ENTRANCE_THREAD_TITLE);
  });

  test("the edge register table has all 23 rows", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator("section.record table tbody tr");
    await expect(rows).toHaveCount(23);
  });

  test("the reserved door's empty-state text is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("doorway reserved — for an external encounter, once it exists")).toBeVisible();
  });

  test("the selection rule is stated in the footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("current thread: the thread node with the most edges");
  });

  test("a work slab links out to the existing site (external, verified live pattern)", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('a[href="https://frankbueltge.de/atelier/werke/2026-07-13-generative-unknowing"]');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("target", "_blank");
  });
});

test.describe("margin rail", () => {
  test("current room is marked, other rooms are linked", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav.blattrand .br-here")).toHaveText("this sheet");
    await expect(page.locator('nav.blattrand a[href="/sheets"]')).toBeVisible();
    await expect(page.locator('nav.blattrand a[href="/apparatus"]')).toBeVisible();
  });
});

test.describe("theme toggle cycles auto → light → dark", () => {
  test("clicking the toggle twice moves through the whole cycle back to auto", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme-mode", "auto");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.locator("button.theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme-mode", "light");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.locator("button.theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme-mode", "dark");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.locator("button.theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme-mode", "auto");
  });

  test("the choice persists across reload via localStorage", async ({ page }) => {
    await page.goto("/");
    await page.locator("button.theme-toggle").click(); // -> light
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "light");
  });
});

test.describe("apparatus room", () => {
  test("renders the collective manifest fields from the store", async ({ page }) => {
    await page.goto("/apparatus");
    await expect(page.getByText("Ulysses").first()).toBeVisible();
    await expect(page.locator('a[href="https://github.com/frankbueltge/irrtum-als-methode"]')).toBeVisible();
  });
});

test.describe("stub rooms", () => {
  for (const room of ["sheets", "journal", "material"]) {
    test(`${room} is an honest stub, not a dead link`, async ({ page }) => {
      const response = await page.goto(`/${room}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByText("room follows — Phase C2.")).toBeVisible();
      await expect(page.getByRole("link", { name: "← back to the sheet" })).toBeVisible();
    });
  }
});
