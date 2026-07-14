#!/usr/bin/env node
/**
 * Loader CLI (work order §0 "Loader"):
 *
 *   npx tsx apps/loader/src/cli.ts \
 *     --bundles-dir import/bundles --fixture-dir fixtures/enc-2026-001-calibration-gap-travels \
 *     --lenses-dir lenses [--database-url postgres://...]
 *
 * Without --database-url (and no DATABASE_URL env var), runs the whole load against a fresh,
 * in-process MemoryStore and reports the same summary a Postgres run would — a dry validation
 * pass with nothing persisted beyond this process (work order §0: MemoryStore doubles as the
 * no-DB local dev mode). With a connection string, loads into PostgresStore for real.
 */

import path from "node:path";
import { MemoryStore, PostgresStore, runFullLoad, type FullLoadSummary, type LoaderStore } from "@research-ecology/domain";

interface Args {
  bundlesDir: string;
  fixtureDir: string;
  lensesDir: string;
  databaseUrl?: string;
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
  return {
    bundlesDir: path.resolve(process.cwd(), map.get("bundles-dir") ?? "import/bundles"),
    fixtureDir: path.resolve(process.cwd(), map.get("fixture-dir") ?? "fixtures/enc-2026-001-calibration-gap-travels"),
    lensesDir: path.resolve(process.cwd(), map.get("lenses-dir") ?? "lenses"),
    databaseUrl: map.get("database-url") ?? process.env.DATABASE_URL
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const usingPostgres = Boolean(args.databaseUrl);
  const store: LoaderStore = usingPostgres ? new PostgresStore(args.databaseUrl!) : new MemoryStore();

  let summary: FullLoadSummary;
  try {
    summary = await runFullLoad(store, {
      bundlesRootDir: args.bundlesDir,
      fixtureDir: args.fixtureDir,
      lensesDir: args.lensesDir
    });
  } finally {
    if (usingPostgres) await (store as PostgresStore).close();
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        mode: usingPostgres ? "postgres" : "memory (dry validation — nothing persisted beyond this process)",
        seed: summary.seed,
        bundles: summary.bundles.map((b) => ({
          collectiveId: b.collectiveId,
          objectsInserted: b.objectsInserted,
          eventsInserted: b.eventsInserted,
          assertionsInserted: b.assertionsInserted,
          importRecordsInserted: b.importRecordsInserted,
          rejected: b.rejected
        })),
        fixture: summary.fixture,
        lenses: summary.lenses
      },
      null,
      2
    )}\n`
  );

  const anyRejected =
    summary.bundles.some((b) => b.rejected.length > 0) || summary.fixture.rejected.length > 0 || summary.lenses.rejected.length > 0;
  if (anyRejected) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).stack ?? String(error)}\n`);
  process.exitCode = 1;
});
