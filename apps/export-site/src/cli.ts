#!/usr/bin/env node
/**
 * Export-Site CLI (work order phase-3e-plumbing.md §1 "Export-Job"):
 *
 *   npx tsx apps/export-site/src/cli.ts --site ../frankbueltge.de
 *
 * Thin argv wrapper around `runExport` (see export.ts for the actual, testable logic — same
 * split as packages/domain/src/hydrate.ts vs apps/loader/src/cli.ts). Deterministic and
 * idempotent: re-running against the same repo state and the same target directory overwrites
 * with byte-identical content every time.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExport } from "./export.js";

// apps/export-site/src/cli.ts -> repo root is three levels up.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

interface Args {
  site: string;
}

function parseArgs(argv: string[]): Args {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token?.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`missing value for --${key}`);
      }
      map.set(key, value);
      i += 1;
    }
  }
  const site = map.get("site");
  if (!site) throw new Error("missing required --site <path-to-frankbueltge.de-checkout>");
  return { site: path.resolve(process.cwd(), site) };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const result = await runExport({ researchEcologyRoot: REPO_ROOT, siteDir: args.site });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).stack ?? String(error)}\n`);
  process.exitCode = 1;
});
