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

## 5. Informationsarchitektur: der Blattrand (Franks Frage 2026-07-15)

`/atelier` heute (EnginePage): Lede, Werke-Galerie, „Texte & Kataster", endloses
Journal, Links Repo/Verfassung/Team-Kanal, Cockpit-Link. Neu nach Spec §4.3/4.5:
**Eingang = das aktuelle Blatt, kein Gesamtüberblick.** Orientierung durch zwei Mittel:

1. **Der Blattrand** — die EINZIGE stehende Navigation, eine schmale Zeile:
   `this sheet · sheets · works · journal · material · apparatus · → the middle`.
   Kein Mega-Menü, keine Sidebar. (Mock ist im Blatt und im Buchrücken eingebaut.)
2. **Jedes Zeichen ist eine Tür** — die Karte IST die Navigation: Tafel → Werkseite,
   Quellen-Stummel → Material-Eintrag, rote S-Marke → Journal-Seite (`…#s26`),
   Faden-Titel → Problem-Blatt. Der Rand ist nur der Rückfallweg.
   Rückweg-Konvention auf jeder Unterseite: „← back to the sheet".

Zimmer-Zuordnung des Bestands (URLs bleiben stabil):

| heute | wohin | Spec-Lens |
|---|---|---|
| Werke-Galerie + /atelier/werke/* | `works` — Routen unverändert; erreichbar über Tafeln | Operation |
| Journal (endlose Liste) | `journal` = **Session-Register S1–S28**: eine Zeile pro Seite, Anker `#sNN`, jüngste aufgeklappt — die Endlos-Liste stirbt | Provenienz |
| Atlas (im alten Cockpit) | `material` — der Atlas zieht als Quellen-Regal um; Quellen-Stummel der Blätter verlinken hierher | Material |
| Repo, Verfassung (protocol.astro), Team-Kanal (requests.astro), Nightly-Maschinerie | `apparatus` — alles „wie die Maschine läuft" wohnt in EINEM Zimmer, nicht im Eingangs-Chrome | Apparat |
| Cockpit | `/atelier/archive/cockpit` — datiertes Artefakt (ADR 0008), URL bleibt; dort Hinweis „the atlas now lives in material" | — |
| Franks Rahmungstext (Lede) | 2 Sätze am Blatt-Fuß; volle Rahmung in `apparatus` | Apparat |
| Counter-Maps | eigenes Zimmer erst, wenn es echte gibt (keine leere Rubrik) | Counter |

Routen-Namen englisch (English-only-Entscheid); bestehende deutsche URLs
(`/atelier/werke/*`, `/atelier/cockpit`) bleiben als Archiv-Pfade unangetastet.

## 6. Historie: der Buchrücken (nicht die Partitur)

Atelier-eigene Historienform (`variants-2026-07-15/atelier-historie.html`,
Generator `atelier_history_viz.py`): **die Praxis zählt in Sessions, nicht in Tagen.**
Alle 28 Journal-Seiten als Buchrücken (Daten als Marginalien darunter), Werke hängen
als Tafeln unter ihrer Nacht (Git-Add-Daten), der Fehlerkataster streicht in Rotstift
darüber (21), Verfassungsänderungen als Graphit-✳ (7, PROTOCOL.md-Git-Daten), die drei
Fäden werden sichtbar erst aus S26–S28 geboren und bleiben offen. Datenkante ist die
**ungeschriebene nächste Seite** (gestrichelt) — das Atelier-Pendant zur as-of-Kante,
ohne deren Zeichen zu teilen. Skalenregel (§7 der Zeichengrammatik, Atelier-Geschmack):
wächst der Rücken über das Blatt hinaus, bündeln sich Seiten zu **Lagen/Heften**
(Buchbinder-Geste statt Wochen-Bins).

## 7. Offen für den Phase-C-Slice

Problem-/Operation-/Counter-Lens-Layouts aus dieser Sprache ableiten; Irrtums-Marken
und Closure-Marginalien am echten Fehlerkataster erproben; Blattrand verdrahten
(Routen aus §5); Session-Register bauen; Ort der App (Pfad vs. Subdomain) bleibt
Deployment-Frage.
