# db — migrations

PostgreSQL 16+ is the operational source of truth for The Middle (ADR 0002). Phase 1 ships one
migration: `migrations/0001_initial.sql` — the spec's baseline schema
(`docs/spec/db/0001_initial.sql`) plus the two ADR 0002 amendments (`import_records`, and the
`events.external_event_id` comment documenting the idempotency scheme).

No ORM, no migration runner yet — this is a plain `.sql` file applied with `psql`.

## `DATABASE_URL` convention

Scripts and tests in this repo read a standard libpq connection string from the `DATABASE_URL`
environment variable, e.g.:

```
postgres://<user>:<password>@<host>:<port>/<database>
```

Nothing in Phase 1 requires a live database — `DATABASE_URL` is entirely optional. When unset,
`tests/contract/migration.test.ts` skips itself rather than failing.

## Applying the migration locally

```bash
createdb research_ecology_dev
export DATABASE_URL=postgres://localhost:5432/research_ecology_dev
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/0001_initial.sql
```

## Applying to a scratch schema (used by the migration test)

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "CREATE SCHEMA IF NOT EXISTS scratch_migration_test;"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SET search_path TO scratch_migration_test;" -f db/migrations/0001_initial.sql
```

`tests/contract/migration.test.ts` does the equivalent programmatically (via the `pg` client,
only when `DATABASE_URL` is set) and asserts that the core tables — including `import_records`
— exist afterwards, then drops the scratch schema.
