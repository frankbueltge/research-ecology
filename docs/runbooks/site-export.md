# Runbook: Export nach frankbueltge.de

(work order `docs/work-orders/phase-3e-plumbing.md` §3: „Nightly-Anbindung: NUR dokumentieren" —
dieses Dokument beschreibt den Ablauf; es legt **keinen** Workflow an.)

## Was das ist

`apps/export-site` liest denselben Datenbestand, den `apps/project` für die Karten dieses Repos
verwendet (Bundles unter `import/bundles/**`, die Fixture unter
`fixtures/enc-2026-001-calibration-gap-travels/`, `lenses/*.json`, `narratives/enc-2026-001.
json`), erzeugt daraus deterministisch vier Artefakte und schreibt sie in den Ziel-Site-Checkout
(`frankbueltge.de`) unter `src/data/begegnungen/`:

- `entrance.json` — kompakter Eingangs-Datensatz für die Astro-Seite `/`
- `<slug>/narrative.json` — die Erzählung, byte-identisch aus `narratives/enc-2026-001.json`
  kopiert
- `<slug>/maps/<lensId>@<v>.json` — die drei Karten-Exporte (dieselbe `project()`-Engine, dieselbe
  Validierung wie `apps/project --export`)
- `README.md` — Provenienz-Notiz (research-ecology-Commit, Generator-Version, datengetragenes
  Datum — kein Erzeugungs-Zeitstempel)

## Manueller Ablauf (heute)

Aus dem research-ecology-Repo-Root, mit einem lokalen Checkout von `frankbueltge.de` als
Geschwister-Verzeichnis (wie in den anderen Runbooks dieses Labs üblich):

```bash
# 1. import: die drei Kollektiv-Repos (Meridian/Ensemble/Ulysses) als read-only Bundles ziehen
npx tsx apps/importer/src/cli.ts   # siehe apps/importer/src/cli.ts für Optionen

# 2. project: Karten lokal generieren/prüfen (optional, zur Kontrolle vor dem Export)
npx tsx apps/project/src/cli.ts --export /tmp/maps-check

# 3. export-site: die Site-Artefakte schreiben
npx tsx apps/export-site/src/cli.ts --site ../frankbueltge.de

# 4. Commit im Site-Branch (NICHT auf main pushen ohne Franks Go — Branch-Disziplin siehe
#    phase-3e-plumbing.md §0)
cd ../frankbueltge.de
git add src/data/begegnungen
git commit -m "ecology: Begegnungs-Export vom <Datum aus README.md>"
```

Der Export ist deterministisch und idempotent (`tests/contract/export-site.test.ts`): derselbe
research-ecology-Stand erzeugt byte-identische Dateien, ein erneuter Lauf gegen denselben
Ziel-Checkout überschreibt mit identischem Inhalt.

## Spätere Automation (kommt erst nach Franks Freigaben)

Sobald das Deployment-Paket ansteht (nach den Engine-Integrates, siehe
`docs/design/site-restructure-concept.md` §4 „Umsetzungsweg"), wird daraus ein nächtlicher
GitHub-Actions-Workflow, analog zu den bestehenden Site-Pipelines
(`frankbueltge.de/.github/workflows/{protokoll,praemie,parallaxe}.yml`):

1. Import + Project + Export-Site laufen in research-ecology (oder einem CI-Job mit beiden
   Repos ausgecheckt).
2. Der Export committet direkt in einen Site-Branch (nicht `main` — Branch-Disziplin bleibt
   auch für die Automation verbindlich) oder öffnet einen PR; welches der beiden, entscheidet
   Frank vor der Aktivierung.
3. Der Site-Rebuild läuft wie bei den übrigen Pipelines über `workflow_run` nach dem
   nächtlichen Commit (ein Push mit eingebautem `GITHUB_TOKEN` löst `on: push` nicht aus).

Diese Automation existiert **noch nicht** — dieses Dokument beschreibt nur, wie sie aussehen
würde, sobald Frank sie freigibt.
