/**
 * Applies db/migrations/0001_initial.sql to a scratch schema and asserts the core tables
 * exist — including the ADR 0002 `import_records` amendment. Skips entirely unless
 * `DATABASE_URL` is set (db/README.md documents the convention), since Phase 1 does not
 * require a live database and this repo intentionally carries no `pg`/ORM dependency —
 * the test shells out to the `psql` CLI instead.
 */

import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(currentDir, "../../db/migrations/0001_initial.sql");

const databaseUrl = process.env.DATABASE_URL;
const scratchSchema = "scratch_migration_test_phase1";

const describeIfDatabase = databaseUrl ? describe : describe.skip;

describeIfDatabase("db/migrations/0001_initial.sql (requires DATABASE_URL)", () => {
  it("applies cleanly and creates the expected tables, including import_records", () => {
    const url = databaseUrl as string;

    const run = (sql: string): string =>
      execFileSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-t", "-A", "-c", sql], {
        encoding: "utf8"
      });

    try {
      run(`DROP SCHEMA IF EXISTS ${scratchSchema} CASCADE;`);
      run(`CREATE SCHEMA ${scratchSchema};`);

      execFileSync(
        "psql",
        [url, "-v", "ON_ERROR_STOP=1", "-c", `SET search_path TO ${scratchSchema};`, "-f", migrationPath],
        { encoding: "utf8" }
      );

      const tablesOutput = run(
        `SELECT string_agg(table_name, ',') FROM information_schema.tables WHERE table_schema = '${scratchSchema}';`
      );
      const tables = tablesOutput
        .trim()
        .split(",")
        .map((t) => t.trim());

      for (const expected of [
        "collectives",
        "actors",
        "collective_versions",
        "local_object_refs",
        "encounters",
        "encounter_participants",
        "events",
        "offers",
        "responses",
        "obligations",
        "assertions",
        "assertion_responses",
        "lenses",
        "lens_versions",
        "maps",
        "map_versions",
        "machine_suggestions",
        "interventions",
        "import_records"
      ]) {
        expect(tables).toContain(expected);
      }
    } finally {
      run(`DROP SCHEMA IF EXISTS ${scratchSchema} CASCADE;`);
    }
  });
});
