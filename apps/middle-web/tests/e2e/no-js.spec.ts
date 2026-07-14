import { expect, test } from "@playwright/test";
import { BEAT_IDS, ENCOUNTER_ID } from "./fixtures.js";

/** No-JS journey (work order §1): the encounter page and a map version page render complete,
 * readable records with JavaScript disabled — SSR-first, progressive enhancement only (work
 * order §0). This file only runs under the `no-js` Playwright project (javaScriptEnabled:
 * false), configured in playwright.config.ts. */

/** Work order phase-3d §4 "no-JS (Glyph statisch fertig, Sequenz erreichbar)": the poster's
 * self-drawing glyph is pure CSS (no JS involved in the drawing at all), so it still completes
 * with JS disabled; and the six-beat sequence below it is reachable via a plain in-page anchor
 * link — no client script required for either. */
test.describe("no-JS: poster and narrative", () => {
  test("the invitation link and all six beat anchors exist as plain, reachable markup", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".poster__invitation")).toHaveAttribute("href", "#beat-1");
    for (const id of BEAT_IDS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("the glyph's CSS draw animation completes to fully-drawn without JS, and never loops", async ({ page }) => {
    await page.goto("/");
    const paths = page.locator(".poster .glyph--animated .glyph__transfer, .poster .glyph--animated .glyph__correction");
    await expect(paths).toHaveCount(2);

    // No loop, ever (work order §1 "Keine Loops, nichts pulsiert") — checkable immediately,
    // no need to wait for the animation to run first. `locator.evaluateAll` runs in
    // Playwright's own isolated world (unaffected by `javaScriptEnabled: false`, which only
    // disables the page's own main-world scripts) — unlike `page.evaluate`/`waitForFunction`,
    // which do NOT run under this project.
    const iterationCounts = await paths.evaluateAll((els) => els.map((el) => getComputedStyle(el).animationIterationCount));
    for (const count of iterationCounts) {
      expect(count).not.toBe("infinite");
    }

    // The animation is pure CSS (no JS involved in the drawing itself), so it still completes
    // with JS disabled — Playwright's web-first `toHaveCSS` assertion auto-retries/polls on its
    // own (via the isolated world too), so no manual wait is needed.
    const transfer = page.locator(".poster .glyph--animated .glyph__transfer");
    const correction = page.locator(".poster .glyph--animated .glyph__correction");
    await expect(transfer).toHaveCSS("stroke-dashoffset", /^0(px)?$/, { timeout: 3500 });
    await expect(correction).toHaveCSS("stroke-dashoffset", /^0(px)?$/, { timeout: 3500 });
  });
});

test.describe("no-JS: encounter page renders complete", () => {
  test("full record content is present without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);

    await expect(page.locator("h1")).toContainText("Calibration Gap");
    // First-screen four sections (work order §0), all present in the static markup.
    await expect(page.getByRole("heading", { name: "Who offered what" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What the receiver did" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What is disputed or unresolved" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where the sources live" })).toBeVisible();

    // Event trace: all 7 ledger entries rendered (no client-side "load more").
    const eventCount = await page.locator(".ledger > li").count();
    expect(eventCount).toBe(7);

    // Obligations render without JS — appears twice by design (design §6.3 anchors it at its
    // accepting event in the ledger AND §6.5's standalone "Obligations" panel repeats it).
    await expect(page.getByText("Live status travels with every derived operation").first()).toBeVisible();
    expect(await page.getByText("Live status travels with every derived operation").count()).toBeGreaterThanOrEqual(2);

    // The lens manifest panel is a native <details> — collapsed content still exists in the DOM
    // (readable by assistive tech / view-source) even though it renders closed by default here.
    const manifestCount = await page.locator("details.lens-manifest").count();
    expect(manifestCount).toBe(3);
  });

  test("theme toggle degrades to a plain form POST without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}`);
    const darkForm = page.locator('form[action="/theme-toggle"]', { has: page.locator('input[value="dark"]') });
    await expect(darkForm).toHaveAttribute("method", "POST");
  });
});

test.describe("no-JS: map version page renders complete", () => {
  test("full renderer output, manifest and citation block present without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1`);

    await expect(page.getByRole("heading", { name: "Parallel positions (Meridian)" })).toBeVisible();
    await expect(page.locator("details.lens-manifest")).toHaveCount(1);
    await expect(page.getByText("BASELINE (STRUCK, NOT ERASED)")).toBeVisible();
    await expect(page.locator(".parallel__caveat")).toContainText("appellate caveat");
    await expect(page.locator(".citation")).toContainText("sha256:");
  });

  test("object-transformation map renders the negative band without JS", async ({ page }) => {
    await page.goto(`/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1`);
    await expect(page.locator(".transformation__negative-band")).toBeVisible();
    await expect(page.getByText("A work about machine judgment may not borrow stakes")).toBeVisible();
  });
});
