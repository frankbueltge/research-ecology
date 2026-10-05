/**
 * The encounter-fixture verifier (tools/verify-encounter-fixtures.mjs) and the dated redaction
 * marker of 2026-10-05: a manifest line whose quote field is exactly the privacy-rule marker is
 * counted as redacted and is never fetched or failed; every other quote is still checked.
 * Offline on purpose: the manifests below pin no resolvable source, so a line that is not a
 * marker must fail before any fetch could happen.
 */
import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, "../..");
const VERIFIER = path.join(REPO_ROOT, "tools/verify-encounter-fixtures.mjs");

const MARKER = "[redacted 2026-10-05 under the privacy rule; wording private]";

function run(manifestLines: string[]): { status: number | null; out: string } {
  const dir = mkdtempSync(path.join(tmpdir(), "enc-fixture-"));
  writeFileSync(path.join(dir, "events.json"), "[]\n", "utf8");
  writeFileSync(
    path.join(dir, "QUOTE-MANIFEST.tsv"),
    ["location\tsource\tquote\twrapped", ...manifestLines].join("\n") + "\n",
    "utf8"
  );
  const res = spawnSync(process.execPath, [VERIFIER, dir], { cwd: REPO_ROOT, encoding: "utf8" });
  return { status: res.status, out: `${res.stdout}${res.stderr}` };
}

describe("verify-encounter-fixtures: the dated redaction marker", () => {
  it("accepts a redacted quote without fetching its source and counts it apart from the verified ones", () => {
    const { status, out } = run([
      `events.json/e1/quote_x\tstudio:WORKBOARD.md@e006789cb9bebdb80104268249beb9581bbc5396\t${MARKER}\tno`
    ]);
    expect(out).toContain("0 Zitate ok, 0 Fehler, 1 redacted");
    expect(status).toBe(0);
  });

  it("still refuses a quote that is not the marker (no resolvable pin, so it fails before any fetch)", () => {
    const { status, out } = run(["events.json/e1/quote_x\tstudio:WORKBOARD.md\tsome words of a source\tno"]);
    expect(out).toContain("KEIN COMMIT AUFFINDBAR");
    expect(status).toBe(1);
  });

  it("does not accept a marker of another shape (undated, or with other wording)", () => {
    for (const odd of ["[redacted]", "[redacted 2026-10-05]", "[redacted 2026-10-05 under the privacy rule]"]) {
      const { status, out } = run([`events.json/e1/quote_x\tstudio:WORKBOARD.md\t${odd}\tno`]);
      expect(out, odd).not.toContain("1 redacted");
      expect(status, odd).toBe(1);
    }
  });
});
