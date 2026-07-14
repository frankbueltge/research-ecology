import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "@playwright/test";
import { ENCOUNTER_ID } from "./fixtures.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(here, "screenshots");

/** One screenshot per renderer, light + dark (work order §1). Visual review artifacts, not
 * pixel-diff assertions (no baseline images exist yet — that is a 3c/visual-review concern);
 * this suite's job is to guarantee every renderer form renders without throwing, in both
 * colour schemes, and leave a dated artifact behind for human review. */
const TARGETS: Array<{ name: string; path: string }> = [
  { name: "encounter-page", path: `/encounters/${ENCOUNTER_ID}` },
  { name: "provenance-chain", path: `/encounters/${ENCOUNTER_ID}/maps/provenance-v1@1` },
  { name: "object-transformation", path: `/encounters/${ENCOUNTER_ID}/maps/ensemble-transformation-v1@1` },
  { name: "parallel-positions-obligation-matrix", path: `/encounters/${ENCOUNTER_ID}/maps/meridian-position-v1@1` },
  { name: "compare-view", path: `/encounters/${ENCOUNTER_ID}/compare` },
  { name: "text-montage-assertion", path: "/assertions/assert-enc2026001-ensemble-transformation-claim" },
  { name: "object-page-doorway", path: "/objects/meridian/instrument-001" },
  { name: "lens-manifest-open-by-default", path: "/lenses/provenance-v1" }
];

for (const target of TARGETS) {
  for (const scheme of ["light", "dark"] as const) {
    test(`screenshot: ${target.name} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(target.path, { waitUntil: "networkidle" });
      await page.screenshot({ path: path.join(OUT_DIR, `${target.name}--${scheme}.png`), fullPage: true });
    });
  }
}
