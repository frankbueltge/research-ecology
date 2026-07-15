# Work Order — Phase C1: apps/atelier — App-Gerüst + das Blatt (datengetrieben)

**Grundlage (bindend):** ADR 0010 (eigene App, KEINE geteilte visuelle Grammatik),
`docs/design/atelier-aesthetik-2026-07-15.md` (Zeichen, Palette, IA, Blattrand),
`docs/design/variants-2026-07-15/atelier-blatt.html` + `atelier_viz.py` (die visuelle
Spezifikation — Layoutkonstanten/Zeichen daraus übernehmen), Delta-Audit §8,
spec-v2.1 §4.3–4.5. Bei Konflikt: STOP und berichten.

**Ein Repo:** research-ecology, main, Commits erlaubt. Engine-Repos strikt read-only.
Site-Repo NICHT anfassen. middle-web NICHT verändern (Test §6.4 erzwingt Trennung).

## 0. Harte Regeln

Additiv; bestehende Tests unverändert grün; Zitate/Labels byte-genau aus den Daten
(nie aus dem Design-HTML abtippen — das HTML ist visuelle Spez, die WORTE kommen aus
dem Store); Englisch-only; keine KI-Produkt-Credits; keine neuen Runtime-Dependencies
über das hinaus, was middle-web schon nutzt (SvelteKit-Stack spiegeln);
STOP-and-report bei Unklarheit statt improvisieren.

## 1. Daten: Atelier-Bundle auffrischen

`apps/loader`/Adapter-CLI (bestehend) erneut gegen `~/Documents/GitHub/
irrtum-als-methode` laufen lassen (read-only): das Bundle muss die S26–S28-Rhizom-
Kanten tragen (19 edges, nodes; rhizome.json @ c27857d). Neues Bundle + import_record
committen (deterministisch; gleiche Datenlage ⇒ byte-identisch). Wirft der Adapter
Kinds/Strukturen, die er nicht kennt: exclusions/import_records nutzen wie gehabt,
NICHTS erfinden. Falls der Adapter rhizome.json noch gar nicht liest: STOP-and-report
mit Befund (dann wird der Adapter-Ausbau ein eigenes Paket).

## 2. App-Gerüst `apps/atelier`

SvelteKit, Konfiguration gespiegelt von middle-web (adapter, CSP strikt, keine
Analytics, SSR/No-JS-vollständig, Englisch-only), eigener Dev-Port (5174).
**Kein Import aus `apps/middle-web`** (weder Komponenten noch CSS — ADR 0010;
Kernel-Packages protocol/domain/projections sind erlaubt und erwünscht).

## 3. Design-Tokens & Theme

CSS-Custom-Properties exakt aus der Ästhetik-Spez: Werkstattlicht/Abendstudio-Paletten
(validiert: hell `#2c46c8/#b03a30` auf `#f6f1e7`; dunkel `#5c76e6/#cc584a` auf
`#1b1815`; Graphit neutral), Serifen-Display (Iowan/Georgia-Stack) + Mono-Record,
Theme-Controller = Site-Konvention (auto→light→dark, localStorage 'theme',
data-theme immer aufgelöst), **Default hell**. Blattrand-Navigation als Komponente
(this sheet · sheets · works · journal · material · apparatus · → the middle).

## 4. Routen (Slice C1)

- **`/` = das Blatt:** aktueller Problematik-Thread (epistemic-thing-subtraction,
  per Auswahlregel: jüngster Thread-Knoten mit Kanten — Regel sichtbar im Fußtext).
  Deterministisches Layout als **pures Modul** `src/lib/sheet/` (Store-Daten →
  SVG-Struktur; Konstanten aus atelier_viz.py übernehmen; kein Zufall, keine Uhr).
  Zeichen: Faden/Swerve/Tafel/Geister-Regal/bridge/complement/grounds/Tür — wie
  Ästhetik-Spez §2. Hover = Kanten-Detail; Klick auf Tafeln → bestehende
  Site-Werk-URLs (frankbueltge.de/atelier/werke/… als externe Links, TODO-Marker).
  Unter dem Blatt: **Edge-Register-Tabelle, unkomprimiert, aus dem Store.**
  Reservierte Tür: leer, mit dem Empty-State-Text („…once it exists").
- **`/apparatus`:** Manifest-/Protokoll-Stand aus dem Store (Kernel-Wiederverwendung),
  Links Repo/Verfassung/REQUESTS (extern), Rahmungstext-Platzhalter
  (`<!-- WORDING: Frank -->`).
- Blattrand-Einträge ohne Ziel in C1 (sheets/journal/material) als Stub-Routen mit
  ehrlichem Platzhalter („room follows — Phase C2") — keine toten Links.

## 5. Was C1 NICHT ist

Keine Problem-/Operation-Lens-Engine-Formen (C2), keine Fehlerkataster-/Closure-
Marginalien (C2), kein Session-Register (C2), keine Extraktion von middle-web-
Primitiven (erst bei echtem Bedarf), kein Deployment, keine Site-Änderung.

## 6. Tests

1. Unit: Sheet-Layout deterministisch — gleicher Store-Inhalt ⇒ byte-identische
   SVG-Struktur (zweimal rendern, vergleichen).
2. Unit: alle gerenderten Labels (Thread-/Werk-/Quellen-Namen, Kanten-Kinds) sind
   byte-gleich im Bundle vorhanden (Verbatim-Guard — nichts stammt aus Hardcode).
3. Contract: Auswahlregel des Eingangs-Threads ist pure Funktion der Daten (Test mit
   Fixture-Variation).
4. Contract/Static: **apps/atelier importiert nichts aus apps/middle-web** (Grep-Test
   über die Source; ADR-0010-Guard) — und umgekehrt bleibt middle-web unberührt
   (git diff leer außerhalb von apps/atelier, packages-Erweiterungen, Bundle, Tests).
5. Playwright (eigene Suite, eigener Port): Blatt rendert Thread-Titel wörtlich;
   Edge-Tabelle vollständig (19 Zeilen bei aktuellem Stand); Tür-Empty-State
   vorhanden; Theme-Toggle zykelt auto→light→dark; No-JS: Tabelle + Inhalte lesbar.
6. Alle bestehenden Suiten unverändert grün.

## 7. Abschluss

Alle Suiten grün ⇒ thematische Commits auf main (bundle/scaffold/tokens/sheet/routes/
tests). Abschlussbericht: Dateiliste, Test-Zahlen vorher/nachher, Bundle-Diff-Befund
(welche Kanten/Knoten neu), Auswahlregel-Wortlaut, offene Befunde/STOP-Punkte. Rohdaten.
