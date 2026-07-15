# Work Order — C2-Site: Eingang der Site in Variante-A-Qualität (Partitur)

**Franks Kritik (2026-07-15 abends):** localhost:4321 ist „noch ziemlich dünn und
sollte genauso professionell und ästhetisch ansprechend sein wie die anderen Sachen,
die wir heute designed haben." Ziel: Der Site-Eingang wird die Partitur (Richtung A,
von Frank gewählt) — kein Skelett mehr.

**Bindend:** `docs/design/zeichengrammatik-2026-07-15.md` (Zeichen, §7),
`docs/design/variants-2026-07-15/a-observatorium.html` + `assemble_variants.py`
(visuelle Spez: Layout-Konstanten, Zeichen-Geometrie, CSS-Rollen, validierte Paletten
hell `#2a78d6/#c1481c/#4a3aa7` auf `#f4f6f9`, dunkel `#3987e5/#d95926/#9085e9` auf
`#101318`), `docs/design/wortlaute-2026-07-15.md` (FREIGEGEBENE Wortlaute — exakt so,
inkl. „here ends what the ledger knows"). Bei Konflikt: STOP und berichten.

**Zwei Repos:**
- frankbueltge.de: NUR Branch `ecology-restructure` (nie main; Franks untracked
  Dateien — Logos, docs/federated-*, logo/ — NIE anfassen/stagen). Push des Branches ok.
- research-ecology: main, Commits erlaubt (nur falls §2-Export-Erweiterung nötig).

## 1. Datenlage prüfen (zuerst!)

Der Score braucht die 7 Ledger-Events + Flüsse + Obligations + Divergenz.
Prüfen, was `src/data/begegnungen/` (Site) heute trägt: entrance.json (6 Stationen,
Typen, approval), narrative.json, maps/*.json. **Fehlen Event-Daten** (Reihenfolge,
Issuer, Daten, Obligations), dann in research-ecology `apps/export-site` **additiv**
erweitern: kompaktes `enc-…/score.json` (deterministisch, byte-stabil, Schema additiv
in packages/protocol wie site-entrance-Muster, Export-Determinismus-Test erweitern).
NICHTS hardcoden, was aus Daten kommen kann; NICHTS erfinden.

## 2. Der Eingang `/` (index.astro) — die Partitur

- **Build-Zeit-Generator** `src/lib/begegnungen/score.ts` (TS-Port von
  assemble_variants.py `build_svg()`: gleiche Konstanten, gleiche Zeichen pro
  Event-Familie, Bahnen source/conductor/receiver, Flüsse, Obligations-Haltelinien,
  Divergenz-Ringe, Stations-Badges ①–⑥, Ledger-Kanten-Formel wörtlich). Pur,
  deterministisch, kein Zufall/keine Uhr. Astro rendert das SVG statisch.
- **Komposition wie Variante A:** Kicker (The Middle · contact zone record ·
  encounter-id · as-of · approved-Chip), große Headline (freigegeben), Statuszeile,
  Partitur, Zeichenschlüssel (Practices/Signs/Currents als Legende), dann die
  **6 Stationen als Register** (Heading + wörtliches Zitat + Attribution + Akte-Link
  als deaktivierter „folgt"-Vermerk solange die App nicht deployt ist), Ereignis-
  Tabelle (unkomprimiert), Fußzeile mit Provenienz (Export-Commit) + approval-Note.
- **Theme:** an das BESTEHENDE Site-Theme-System andocken ([data-theme] von
  Base.astro) — Variante-A-Farbwerte für hell UND dunkel als Scoped-Styles/Tokens der
  Eingangs-Seite. Keine globale Skin-Änderung, keine neuen Dependencies.
- Hover-Registerauszug auf Event-Zeichen (progressive enhancement; ohne JS bleibt
  alles lesbar — Tabelle ist der Fallback). Nichts blinkt, keine Loops,
  prefers-reduced-motion respektiert.

## 3. Die übrigen Ökologie-Seiten — gleiche Familie, eine Stufe ruhiger

`/begegnungen` (Liste), `/begegnungen/enc-…` (Narrative-Sequenz mit den 6 Beats),
`/praktiken`, `/bestaende`: Typo-System der Variante A (Kicker/Headline/Mono-Notate/
Hairlines/Registertabellen), KEINE eigene neue Grammatik, kein Dekor. Die
DESIGN-SESSION-Marker-Kommentare der Skelette entfernen, wo eingelöst.

## 4. Grenzen

Alte Experiment-/Lab-/Engine-Seiten der Site UNVERÄNDERT. Kein Deploy, kein
main-Merge. Keine neuen Runtime-Dependencies. Englisch für Ökologie-Seiten.
Keine KI-Produkt-Credits. Bestehende Site-Tests unverändert grün + `npm run build`
+ `npm run check` grün. Commits im Site-Stil („ecology: …").

## 5. Abschluss

Beide Repos: Suiten/Builds grün ⇒ committen (Site: Branch; research-ecology: main,
nur falls Export erweitert). Bericht: Dateilisten, was aus welchen Daten kommt
(score.json ja/nein), Test-/Build-Ergebnisse, Screenshots-Hinweise (welche Routen
anschauen), Diskrepanzen/STOP-Punkte. Rohdaten.
