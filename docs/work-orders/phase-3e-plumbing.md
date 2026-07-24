> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order — Phase 3e (Plumbing): Datenexport App→Site + Astro-Skelett

**Scope:** NUR Maschinerie, KEIN UI-Feinschliff — die visuelle Sprache kommt aus einer
eigenen Design-Session und zieht später über App und Site gleichzeitig. Alles Sichtbare
auf der Site ist bewusst schmuckloses, semantisches Skelett mit dem bestehenden
Site-Grundstil und `<!-- DESIGN-SESSION: ... -->`-Markern.

Zwei Repos:
- `/Users/frankbultge/Documents/GitHub/research-ecology` (Export-Seite; committen erlaubt, main)
- `/Users/frankbultge/Documents/GitHub/frankbueltge.de` (Site; NUR auf einem neuen Branch
  `ecology-restructure` arbeiten — NIE auf main. Push des Branches ist ok, main-Push =
  Production-Deploy = VERBOTEN.)

## 0. Branch-Disziplin Site-Repo (hart)

- `git switch -c ecology-restructure` von main.
- Das Arbeitsverzeichnis enthält fremde uncommittete Dateien (Logo-Dateien,
  `docs/federated-research-ecology/`, `logo/`): NICHT anfassen, NICHT committen, NICHT
  stagen. Nur selbst erstellte/geänderte 3e-Dateien committen (gezieltes `git add <pfad>`).
- Vor Abschluss: `npm run build && npm run check && npm test` im Site-Repo grün.

## 1. Export-Job (research-ecology, `apps/export-site`)

CLI: `npx tsx apps/export-site/src/cli.ts --site ../frankbueltge.de` — deterministisch,
idempotent (byte-identisch bei gleicher Datenlage). Schreibt in die Site:

```
src/data/begegnungen/entrance.json        kompakter Eingangs-Datensatz: encounter_id, title,
                                          headline (DE/EN aus dem Narrative), status
                                          (as-of-Datum = jüngstes Event, statusLine DE/EN),
                                          participants mit local_status, stations (aus den
                                          6 Beats: id, heading DE/EN, quote, attribution
                                          DE/EN, akte_event_id), links (akte-URL-Pfad,
                                          divergenz-Pfad), authored_by, approval
src/data/begegnungen/enc-2026-001/narrative.json   das Narrative-Objekt verbatim
src/data/begegnungen/enc-2026-001/maps/<lensId>@<v>.json   die drei Map-Version-Exporte
src/data/begegnungen/README.md            Provenienz-Notiz: erzeugt aus research-ecology
                                          Commit <sha>, Generator-Version, Datum aus Daten
```

Quelle ist der MemoryStore (Bundles + Fixture + Lenses + generierte Maps) — dieselbe
Ladelogik wie die App (`packages/domain` wiederverwenden, nichts duplizieren). Kein
Zeitstempel außer datengetragenen. Vitest-Test in research-ecology: Export zweimal in
Temp-Verzeichnisse ⇒ byte-identisch; entrance.json validiert gegen ein neues kleines
Schema `packages/protocol/schemas/site-entrance.schema.json` (additiv anlegen, additionalProperties true).

## 2. Astro-Skelett (Site, Branch)

Erst die bestehende i18n-Konvention der Site VERIFIZIEREN (CLAUDE.md sagt „de unter /,
en unter /en"; die Engine-Seiten wirken EN-root mit /de-Spiegeln — im Zweifel der
tatsächlichen Mehrheits-Konvention der bestehenden Seiten folgen und die Wahl im
Commit-Text dokumentieren). Dann:

- **`/` (index.astro) NEU auf dem Branch:** rendert `entrance.json` als semantisches
  Skelett — Kicker + Statuszeile, Headline, Stationsliste (als schlichte nummerierte
  Liste mit Zitat/Attribution/Akte-Link — KEINE SVG-Karte, die kommt aus der
  Design-Session), CTAs (Akte-App-Link als Platzhalter-Pfad `/akte/…` mit TODO-Marker,
  Divergenz analog), Fußzeile mit authored_by/approval-Pending. Alte index.astro-Inhalte
  nicht löschen, sondern als `index-vorher.astro.bak`-Kommentarblock im Commit erhalten?
  NEIN — Git ist das Archiv; einfach ersetzen, der Branch-Diff dokumentiert.
- **`/begegnungen/index.astro`** — Liste (aktuell 1 Eintrag) aus `src/data/begegnungen/`.
- **`/begegnungen/enc-2026-001/index.astro`** — Narrative als vertikale Skelett-Sequenz.
- **`/praktiken/index.astro`** — stiller Index: Atelier/Field/Studio (bestehende Routen
  verlinken, je 1 Satz aus den bestehenden werke.ts-Texten zitiert) + „das Labor"
  (Platzhalter mit TODO: Manifest folgt).
- **`/bestaende/index.astro`** — Umwidmung: die bisherigen Experimente aus
  `src/data/werke.ts` (ohne die drei Engines) als „Bestände des Labors — Material, der
  Ökologie angeboten" gelistet, jede bestehende Route bleibt unverändert erreichbar.
  KEINE bestehende Experiment-Seite wird verändert oder gelöscht.
- **`/lab`** bleibt bestehen, bekommt oben einen schlichten Hinweisblock mit Links auf
  /praktiken und /bestaende (kein Redirect, keine Löschung).
- DE/EN gemäß verifizierter Konvention (mindestens die Startseite in beiden Sprachen;
  Skelett-Chrome-Strings inline, mit DESIGN-SESSION-Markern).

## 3. Nightly-Anbindung: NUR dokumentieren

Keine Workflow-Datei anlegen/ändern. Stattdessen `docs/runbooks/site-export.md` in
research-ecology: manueller Ablauf (import → project → export-site → Commit im
Site-Branch), und wie die spätere Automation aussieht (nightly Action nach den
Engine-Integrates; kommt erst mit dem Deployment-Paket nach Franks Freigaben).

## 4. Grenzen

Engine-Repos read-only. docs/spec/ unberührt. Site-main unberührt. Keine neuen
Dependencies in der Site. Keine KI-Produkt-Credits (Site-Regel beachten: keine
Co-Authored-By-Trailer o. Ä.). Commits im Site-Branch mit klaren deutschen Messages im
Stil des Repos („ecology: …"). research-ecology-Commits auf main erlaubt (Export-Job).
Abschlussbericht: Dateilisten beider Repos, Test-/Build-Ergebnisse beider Repos,
i18n-Konventions-Befund, Diskrepanzen. Rohdaten.
