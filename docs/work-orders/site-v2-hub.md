# Work Order: site-v2 — Hub-Eingang, Nav, DE-Abbau (frankbueltge.de)

**Grundlage:** `docs/design/site-v2-decisions-2026-07-16.md` (Franks Entscheidungen §1,
Abgleich §2) · Mockup `docs/design/variants-2026-07-16-hub/hub-a.html` (+ Generator
`hub_pulse_viz.py` — die Referenz für Puls-Geometrie und Hub-Dramaturgie).
**Branch:** `site-v2` in frankbueltge.de. **NICHTS auf main, kein Deploy, kein Merge** —
Branch bauen, committen, pushen, fertig. Wortlaute sind DRAFT bis Franks Freigabe.

## Paket-Inhalt (in dieser Reihenfolge sinnvoll)

### 1. Naming-Config (Abgleich A1)
Zentrale Stelle (z. B. `src/config/site.ts`): Titel „a federated research ecology"
(klein gesetzt), Beschreibungszeile, Conductor-Zeile, Hub-Wortlaute (doors, travel,
rest, Puls-Caption) als EIN Dictionary-Modul mit `approval: 'draft'`-Flag; der Hub
zeigt bei draft einen dezenten Mono-Vermerk (Muster: score-Chip „wording approved").
Eine spätere Umbenennung/Freigabe = Config-Änderung, keine Migration.

### 2. Puls (Hero)
- `scripts/fetch-pulse.ts` (Muster: `scripts/fetch-climate.ts`): liest die lokalen
  Schwester-Checkouts (field-research, irrtum-als-methode, studio, research-ecology,
  frankbueltge.de) per `git log --format=%aI` und schreibt Snapshot
  `src/data/pulse/pulse.json`: ISO-Wochen (rollierend letzte 13) × 84 2h-Bins (UTC),
  Meta: as_of, Repo-Liste, Gesamtzahl. npm-Script `pulse:refresh`. Snapshot EINMAL
  jetzt erzeugen und committen (Git ist das Archiv; nächtliche Auffrischung kommt im
  Nightly-Ketten-Strang, nicht hier).
- `src/lib/pulse/render.ts`: deterministischer SVG-Builder — Port der Logik aus
  `hub_pulse_viz.py` (Glättung: gleitendes Mittel Fenster 3 ×2; stumme Wochen
  opacity .33; laufende Woche ENDET am letzten vollen Bin vor as_of, Fläche
  geschlossen/Strich offen; Notat-Randspalte rechts; keine Uhr-Reads im Renderer —
  as_of kommt aus dem Snapshot). Tests wie `score.test.ts`: gleicher Input ⇒
  byte-gleicher Output; Kanten-Fälle (leere Woche, angebrochene Woche).
- Hero-Komponente gemäß Mockup: eyebrow „FRANK BÜLTGE · DATA & AI ENGINEER" → H1
  (Titel) → Sub → Conductor-Zeile → Puls → Caption (nennt Quelle, Fenster, Bins,
  Glättung, as_of). Statisches SVG, keine Animation (reduced-motion damit erfüllt).

### 3. Hub-Seite (neue Startseite)
`src/pages/index.astro` → rendert neuen Hub (`src/components/pages/HubEntrance.astro`):
1. Hero (s. o.)
2. **NOW**: kondensierte aktuelle Begegnung — kicker, headline, Statuszeile,
   Partitur-SVG (`buildScoreSvg(currentScore)` wiederverwenden, `.score-map`-Styles
   sind global in BegegnungEntrance — sauber teilen, nicht duplizieren),
   Auswahlregel-Zeile (Wortlaut aus Mockup), Link „read the full score →" auf
   `/begegnungen` (dort rendert weiterhin die volle BegegnungEntrance — prüfen, dass
   das nach dem Umbau so ist; URLs von enc-2026-001 bleiben stabil).
3. **Vier Türen** (Praxisfarben-Haarlinie wie Mockup): Atelier /atelier, Field /field,
   Studio /studio, The Middle /begegnungen. „last recorded"-Daten aus den bereits
   committeten Daten-JSONs der Site ableiten (jüngstes Datum je Praxis; deterministisch
   zur Buildzeit, KEINE Netz-/Uhr-Zugriffe). The Middle: „no resident — kept by the
   conductor".
4. **Where works travel**: datavism.org, data-snack.com (Texte aus Dictionary).
5. **Also on this site**: Holdings → /bestaende · Atlas → /atlas · Apparatus →
   /apparatus (neu, s. 4.) · About → /about (About trägt Contact mit; /contact bleibt).
Semantisches HTML (h1/h2/section/nav), mobil brauchbar, Tastatur-navigierbar.

### 4. /apparatus (v1, klein und ehrlich)
Stimme der Verfassung, nur belegbare Fakten: welche nächtlichen Workflows laufen
(Namen aus .github/workflows), welche Engines/Personas es gibt (Repos verlinken),
welche Gates existieren (Tests, Integrate-Workflows, approval-Felder), Franks Rolle
(architect & conductor), Lizenz, AuthorshipNote-Komponente wiederverwenden.
**Werkzeuge generisch benennen** — keine KI-Produktnamen (Team-Regel).

### 5. Navigation + Footer
TopBar: [Frank Bültge → /] · Encounters /begegnungen · Atelier /atelier · Field
/field · Studio /studio · Holdings /bestaende · Atlas /atlas · Projects /work ·
About /about. Sprach-Toggle entfernt. Footer: Contact, Impressum, Datenschutz,
Lizenz-Zeile, GitHub.

### 6. DE-Abbau (Frank: „überall de erstmal raus")
- `src/pages/de/**` löschen; Sprach-Toggle und hasAlternate-Logik aus TopBar;
  astro-i18n-Konfiguration entfernen bzw. auf en-only reduzieren; `t()`/
  getRelativeLocaleUrl-Aufrufe auf EN-Strings vereinfachen (mechanisch, Route für
  Route; tote i18n-Keys entfernen, aber `src/i18n/ui.ts` darf als EN-Wörterbuch
  weiterleben, wenn das den Diff klein hält).
- **Impressum + Datenschutz bleiben** (deutsch, Rechtspflicht, Root-Routen).
- Alte Home-Komponenten (`Home.astro`, `HeroField.astro`): unverlinkt lassen oder
  entfernen — Git ist das Archiv; wenn entfernen, im Commit-Text sagen, wo sie leben.

### 7. Redirects + Matrix (Abgleich A2)
- `public/_redirects` (Cloudflare Pages): `/de/* /:splat 301` (nur wo EN-Pendant
  existiert — prüfen; Sonderfälle einzeln), `/lab /bestaende 301`, `/lab/*` → Ziel je
  nach Bestand (Tiefen-Slugs: auf ihr /bestaende- bzw. Werk-Pendant, sonst behalten —
  NICHT blind brechen; ueberflug-studie prüfen).
- `docs/redirect-matrix-site-v2.md` im Site-Repo: Tabelle alt → neu → Status → Test.
- Vitest-Test: jede entfernte Route hat einen Matrix-/Redirects-Eintrag (statisch
  gegen die _redirects-Datei prüfen).

### 8. Definition of Done
`npm run test` (Register-/Score-Tests UNANGETASTET grün) · `npm run check` ·
`npm run build` grün · keine toten Primärlinks (alles zeigt auf existierende
statische Routen; keine App-Links) · Commits deutsch, klein geschnitten, KEINE
KI-Produkt-Credits · nur Paket-Dateien committen (untracked Fremddateien wie
logo/, *.webp, *.xcf, docs/federated-research-ecology* NICHT anfassen) ·
Branch `site-v2` nach origin pushen.
