> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order — C3: Apps statisch bauen + Cloudflare-Pages-Deploy vorbereiten

**Entscheid (Frank „wir machen alles", 2026-07-15; Architektur: v1 read-only statisch
= ADR 0005/0006-konform, kein Neon nötig):** middle-web und atelier werden statisch
prerendered und via Cloudflare Pages ausgeliefert (Subdomains, DNS macht Frank im
CF-Dashboard). Dieses Paket macht beide Apps prerender-fähig, baut sie nachweislich,
und legt Workflow + Runbook an. Der ERSTE echte Deploy passiert NICHT hier (braucht
CF-Token-Secret, das Frank im neuen GitHub-Repo setzt).

**Repo:** research-ecology, main (Remote existiert jetzt: frankbueltge/research-ecology
— pushen ERLAUBT für dieses Paket). Engine-Repos read-only. Site-Repo nicht anfassen.

## 1. Prerender beider Apps

- `@sveltejs/adapter-static` als devDependency (einzige neue Dependency, erlaubt);
  `export const prerender = true` im Root-Layout beider Apps; dynamische Routen über
  `entries`/Crawling vollständig erfassen (alle Encounter-/Objekt-/Assertion-/Lens-IDs
  aus dem Store aufzählen — deterministisch, kein Hardcode).
- Der MemoryStore hydriert zur BUILD-Zeit (wie heute im Dev) — prüfen, dass kein
  Runtime-Server-Code übrig bleibt (keine Actions/Endpoints; falls doch einer existiert:
  STOP-and-report statt wegbiegen).
- `npm run build` je App erzeugt komplette statische Sites; ein Smoke-Skript prüft,
  dass Kernrouten im Output existieren (Blatt, Encounter-Seite, /apparatus, /ledger).
- Playwright-Suiten laufen danach gegen `preview` (statisch) — ALLE bestehenden Tests
  unverändert grün; No-JS-Vollständigkeit bleibt der Vertrag.

## 2. Deploy-Maschinerie (vorbereitet, nicht ausgelöst)

- `.github/workflows/deploy-apps.yml`: baut beide Apps und deployt via
  `cloudflare/wrangler-action` auf zwei CF-Pages-Projekte (`ecology-middle`,
  `ecology-atelier`), Trigger: push auf main + workflow_dispatch. Secrets:
  `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (dokumentieren, nicht erfinden).
- `docs/runbooks/apps-deploy.md`: Schritte für Frank (Secrets setzen, CF-Pages-Projekte
  beim ersten wrangler-Deploy automatisch, Custom Domains z. B. middle.frankbueltge.de
  + atelier.frankbueltge.de im Dashboard anbinden), Rollback (Pages-Deployments-Liste),
  und wie die Site-Links (`/akte/…`-Platzhalter, „record app not deployed yet",
  Blattrand „→ the middle", Atelier-Werk-Links) NACH dem ersten Deploy umgestellt
  werden (eigenes kleines Site-Paket, nicht hier).
- Nightly-Gedanke nur dokumentieren (Runbook-Verweis auf docs/runbooks/site-export.md),
  keine weiteren Workflows anlegen.

## 3. Grenzen & Abschluss

Keine KI-Produkt-Credits. Keine Site-Änderungen. Kein echter CF-Aufruf aus diesem Paket.
Alle Suiten (root + beide Apps unit/e2e) grün ⇒ thematische Commits auf main + push.
Bericht: Dateiliste, Routenzahl je App im statischen Output, Testzahlen, offene
Punkte (Secrets/DNS), STOP-Punkte.
