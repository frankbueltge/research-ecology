# ADR 0006 — Deployment: Cloudflare + managed Postgres + GitHub Actions jobs (not GCP)

**Status:** PROPOSED — needs Frank's plain-language go (cost/vendor decision).

## Context

Spec 06 §2/§13 recommends GCP (Cloud Run + Cloud SQL + Cloud Run Jobs + Scheduler + Secret
Manager) while explicitly allowing alternatives: "A simpler first deployment may use managed
Postgres elsewhere. The epistemic architecture is more important than provider choice."

Audit facts against GCP here:

1. The lab took a deliberate **"no GCP" decision** (2026-06) and migrated the last GCP
   dependencies out of the pipelines.
2. Everything operational today is **GitHub Actions + Cloudflare Pages**, run by one person,
   at ~zero marginal cost. Cloud SQL alone starts at real monthly money and adds an IAM/VPC
   operational surface nobody here maintains.
3. Every job shape the spec needs (import, projection generation, Git export, scheduled
   polling) is the lab's proven Actions pattern — the three engine pipelines already run
   this way nightly.

## Decision

- **Web/API:** SvelteKit deployed to **Cloudflare Workers** (adapter-cloudflare) under the
  existing Cloudflare account/domain.
- **Database:** **Neon PostgreSQL 16+** (managed, serverless, EU region, free tier covers
  v1's volume by orders of magnitude), accessed via the Neon serverless driver /
  Hyperdrive; Drizzle ORM for typed queries and migrations. **Phase 3a amendment:** v1 read
  layer uses postgres.js with typed mappers; Drizzle enters with the first write feature.
- **Jobs:** importer, projection generator and Git exporter run as **GitHub Actions**
  (nightly cron after the engine integrates, plus manual dispatch), committing exports to a
  public Git archive — Git stays the durable public memory, per the lab's "Git is the
  archive" rule.
- **Secrets:** GitHub Actions secrets + Cloudflare secrets, as today.
- **Projection determinism beats runtime compute:** map versions are generated in jobs and
  stored immutably; the Worker mostly serves records — this sidesteps Workers' CPU limits by
  design, not by tuning.

## Consequences

- €0/month baseline; no new vendor except Neon; no GCP re-entry.
- One region DB (fine at this scale); if Neon's free tier ever binds, the ADR is revisited —
  the schema and Drizzle migrations are provider-portable.
- Local development: Dockerised Postgres or a Neon branch; CI uses a throwaway Postgres
  service container.
- Deviation from spec 06 is documented here, as the master prompt requires.
