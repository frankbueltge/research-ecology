import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(here, "screenshots");

/** One screenshot per renderer, light + dark (work order §1, extended by phase-3d §4: poster
 * light+dark, beat 3, divergence view light+dark). Visual review artifacts, not pixel-diff
 * assertions (no baseline images exist yet — that is a 3c/visual-review concern); this suite's
 * job is to guarantee every renderer form renders without throwing, in both colour schemes,
 * and leave a dated artifact behind for human review. `selector`, when present, scopes the
 * screenshot to that element instead of the full page (poster/beat-3 sit inside a long
 * scrolling `/` page — a full-page shot would not isolate them). */
const TARGETS: Array<{ name: string; path: string; selector?: string }> = [
  { name: "poster", path: "/", selector: ".poster" },
  { name: "beat-3", path: "/#beat-3", selector: "#beat-3" },
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
