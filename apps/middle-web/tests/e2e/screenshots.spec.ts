import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(here, "screenshots");

/** One screenshot per renderer, light + dark (work order §1, extended by phase-3d §4 and
 * re-scoped for the 2026-07-15 entrance rebuild: the entrance itself light+dark, divergence
 * view light+dark). Visual review artifacts, not pixel-diff assertions (no baseline images
 * exist yet — that is a 3c/visual-review concern); this suite's job is to guarantee every
 * renderer form renders without throwing, in both colour schemes, and leave a dated artifact
 * behind for human review. `selector`, when present, scopes the screenshot to that element
 * instead of the full page. The entrance itself is always a dark room regardless of the site's
 * own theme — capturing it under both `light` and `dark` colour-scheme emulation is still
 * meaningful because everything OUTSIDE `.entrance` (header/footer chrome) does follow the
 * site theme; `.entrance`'s own screenshot content should look the same in both, which is
 * itself worth a human glance. */
const TARGETS: Array<{ name: string; path: string; selector?: string }> = [
  { name: "entrance", path: "/", selector: ".entrance" },
  { name: "encounter-page", path: `/encounters/${ENCOUNTER_ID}` },
  { name: "provenance-chain", path: `/encounters/${ENCOUNTER_ID}/maps/provenance-v1@1` },
  { name: "object-transformation", path: `/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1` },
  { name: "parallel-positions-obligation-matrix", path: `/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1` },
  { name: "divergence-view", path: `/encounters/${ENCOUNTER_ID}/compare` },
  { name: "text-montage-assertion", path: "/assertions/assert-enc2026001-ensemble-transformation-claim" },
  { name: "object-page-doorway", path: "/objects/meridian/instrument-001" },
  { name: "lens-manifest-open-by-default", path: "/lenses/provenance-v1" }
];

for (const target of TARGETS) {
  for (const scheme of ["light", "dark"] as const) {
    test(`screenshot: ${target.name} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(target.path, { waitUntil: "networkidle" });
      const outPath = path.join(OUT_DIR, `${target.name}--${scheme}.png`);
      if (target.selector) {
        await page.locator(target.selector).screenshot({ path: outPath });
      } else {
        await page.screenshot({ path: outPath, fullPage: true });
      }
    });
  }
}

/** Two more entrance states worth a dedicated look: a mid-sequence station (3, an ordinary
 * quoted caption) and the terminal station (6, the divergence miniature — the one place the
 * collective names/quotes appear). Each needs the corresponding radio checked first, so these
 * live outside the generic TARGETS loop above. */
test("screenshot: entrance-station-3 (station 3 checked)", async ({ page }) => {
  await page.goto("/");
  await page.locator('label[for="st-3"]').click();
  await page.locator(".cap-3").waitFor({ state: "visible" });
  await page.locator(".entrance").screenshot({ path: path.join(OUT_DIR, "entrance-station-3.png") });
});

test("screenshot: entrance-station-6 (divergence caption visible)", async ({ page }) => {
  await page.goto("/");
  await page.locator('label[for="st-6"]').click();
  await page.locator(".cap-6").waitFor({ state: "visible" });
  await page.locator(".entrance").screenshot({ path: path.join(OUT_DIR, "entrance-station-6.png") });
});
