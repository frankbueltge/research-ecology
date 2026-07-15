# Atelier-Ästhetik — das Blatt
## Design-Session 2026-07-15, zweite Etappe · Entwurf, wartet auf Franks Abnahme

**ADR-0010-Auftrag:** Das Atelier bekommt eine EIGENE Bildsprache — ausdrücklich keine
geteilte visuelle Grammatik mit The Middle. Dieses Dokument definiert sie; Nachweis:
`variants-2026-07-15/atelier-blatt.html` (Generator `atelier_viz.py`), gebaut aus dem
realen Phase-C-Material (S26–S28, wörtlich aus `irrtum-als-methode/pulse/rhizome.json`
@ c27857d, read-only).

## 1. Grundform: das Blatt (nicht die Partitur)

The Middle ist ein Observatorium: Bahnen, Zeitachse, Registerruhe. Das Atelier ist eine
**Werkstatt**: ein Arbeitsblatt ohne Zeitachse, auf dem eine Praxis ihre eigene Lektüre
zieht. Orientierung ist relational, nicht chronologisch — Daten stehen als Marginalien
an den Werken, nicht als Achse.

| | The Middle (Partitur) | Atelier (Blatt) |
|---|---|---|
| Geometrie | horizontale Bahnen, Zeit → | Fläche; Fäden ziehen Lektüren |
| Linie | Instrumenten-gerade | Tinte, gekrümmt, Hand-Duktus |
| Typo | Grotesk + Mono | **Serife (kursiv als Stimme)** + Mono-Notate |
| Licht | Observatorium (dunkel/kühl-hell) | **Werkstattlicht: warmes Papier / Abendstudio** |
| Farbe | Praxis-Identitäten (Föderationspalette) | **Material: Tinte, Rotstift, Graphit** |
| Rand | as-of-Kante (Datenstand) | **reservierte Tür** (Ausgang zu Encounters) |

## 2. Zeichen des Blatts (keines mit der Partitur geteilt)

- **Faden (Tinte, Ultramarin):** ein Thread — eine Lektüre, quer über Werke gezogen;
  der Faden-Titel ist wörtlich das Thread-Label der Praxis.
- **Swerve (Rotstift):** der Clinamen — eine Quelle knickt in einen Faden ein; die
  Session-Nummer (S26…) steht in Rot am Knick. Ulysses' Methode wird Geste.
- **Werk (Tintentafel):** aufrecht stehender Block; Regal-Werke (präsent, nicht neu
  gemacht) als gestrichelte Geister.
- **Bindungen:** elaborates (dünne Tinte), **bridge (Doppellinie, beschriftet mit den
  eigenen Worten der Praxis** — „they are one fact"), complement (Graphit, gestrichelt),
  grounds (Fundamentstrich unter dem Werk).
- **Tür (Randzeichen):** reserviert für externe Encounters — **leer, bis einer
  existiert.** Nichts wird gezeichnet, bevor es geschieht.
- Geplant für den Slice (Phase C): **Irrtums-Marken** aus dem Fehlerkataster —
  durchgestrichen, aber lesbar (kassiert, nie gelöscht) — und **Closure-Marginalien**
  als CONJECTURE-Selbsteinschätzungen, nie als Metrik.

## 3. Material-Palette (validiert)

Werkstattlicht (Papier `#f6f1e7`): Tinte `#2c46c8`, Rotstift `#b03a30` — PASS.
Abendstudio (`#1b1815`): `#5c76e6`, `#cc584a` — PASS (nach Nachstufung ins
Lightness-Band). Graphit `#8a8377`/`#97907f` ist bewusst neutraler Kanal (Quellen,
Geister), keine Serie. Theme-Verhalten: gleiche Mechanik wie die Site
(auto→light→dark), aber **Default-Charakter hell** — eine Werkstatt arbeitet bei Licht.

## 4. Gemeinsame Lab-Ethik (bleibt trotz getrennter Grammatik)

Wörtlichkeit + Provenienz (jedes Label aus dem Repo, Quelle im Fußtext), Vollständigkeit
(die Kantentabelle unter dem Blatt komprimiert nie), ehrliche Leere (die Tür), keine
Loops/Puls. Getrennt ist die SPRACHE, nicht die Wahrhaftigkeit.

## 5. Offen für den Phase-C-Slice

Problem-/Operation-/Counter-Lens-Layouts aus dieser Sprache ableiten; Irrtums-Marken
und Closure-Marginalien am echten Fehlerkataster erproben; Blatt-Navigation (mehrere
Blätter = mehrere Threads); Ort der App (Pfad vs. Subdomain) bleibt Deployment-Frage.
