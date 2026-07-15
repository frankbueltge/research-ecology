/**
 * Applies db/migrations/0001_initial.sql then 0002_profiles_constellations.sql to a scratch
 * schema and asserts the new tables/columns exist. Skips entirely unless `DATABASE_URL` is
 * set, same convention as migration.test.ts (this repo intentionally carries no `pg`/ORM
 * dependency — shells out to the `psql` CLI instead).
 */

import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const migration0001Path = path.resolve(currentDir, "../../db/migrations/0001_initial.sql");
const migration0002Path = path.resolve(currentDir, "../../db/migrations/0002_profiles_constellations.sql");

const databaseUrl = process.env.DATABASE_URL;
const scratchSchema = "scratch_migration_test_phase_b";

const describeIfDatabase = databaseUrl ? describe : describe.skip;

describeIfDatabase("db/migrations/0002_profiles_constellations.sql (requires DATABASE_URL)", () => {
  it("applies cleanly on top of 0001 and creates the new tables/columns", () => {
    const url = databaseUrl as string;

    const run = (sql: string): string =>
      execFileSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-t", "-A", "-c", sql], {
        encoding: "utf8"
      });
    const runFile = (file: string): void => {
      execFileSync(
        "psql",
        [url, "-v", "ON_ERROR_STOP=1", "-c", `SET search_path TO ${scratchSchema};`, "-f", file],
        { encoding: "utf8" }
      );
    };

    try {
      run(`DROP SCHEMA IF EXISTS ${scratchSchema} CASCADE;`);
      run(`CREATE SCHEMA ${scratchSchema};`);

      runFile(migration0001Path);
      runFile(migration0002Path);

      const tablesOutput = run(
        `SELECT string_agg(table_name, ',') FROM information_schema.tables WHERE table_schema = '${scratchSchema}';`
      );
      const tables = tablesOutput
        .trim()
        .split(",")
        .map((t) => t.trim());

      for (const expected of ["practice_profile_versions", "constellations", "constellation_encounters"]) {
        expect(tables).toContain(expected);
      }

      // non_exclusive CHECK actually rejects a literal false.
      run(
        `SET search_path TO ${scratchSchema}; INSERT INTO collectives (id, current_name) VALUES ('test-practice', 'Test Practice');`
      );
      expect(() =>
        run(
          `SET search_path TO ${scratchSchema}; INSERT INTO practice_profile_versions ` +
            `(collective_id, version, public_name, orientation, primary_commitment, accountability_questions, non_exclusive, status) ` +
            `VALUES ('test-practice', 1, 'Test', 'test', 'test', '["q"]'::jsonb, false, 'draft');`
        )
      ).toThrow();

      // accountability_questions empty-array CHECK.
      expect(() =>
        run(
          `SET search_path TO ${scratchSchema}; INSERT INTO practice_profile_versions ` +
            `(collective_id, version, public_name, orientation, primary_commitment, accountability_questions, status) ` +
            `VALUES ('test-practice', 2, 'Test', 'test', 'test', '[]'::jsonb, 'draft');`
        )
      ).toThrow();

      // A well-formed row is accepted.
      run(
        `SET search_path TO ${scratchSchema}; INSERT INTO practice_profile_versions ` +
          `(collective_id, version, public_name, orientation, primary_commitment, accountability_questions, status) ` +
          `VALUES ('test-practice', 1, 'Test', 'test', 'test', '["q"]'::jsonb, 'draft');`
      );
      const count = run(
        `SET search_path TO ${scratchSchema}; SELECT count(*) FROM practice_profile_versions;`
      );
      expect(count.trim()).toBe("1");
    } finally {
      run(`DROP SCHEMA IF EXISTS ${scratchSchema} CASCADE;`);
    }
  });
});
