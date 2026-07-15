# Field-Ästhetik — Millimeterpapier & Schreiberstreifen
## Design-Session 2026-07-15, dritte Etappe · Entwurf, wartet auf Franks Abnahme

Dritte eigene Sprache der Ökologie (Verfassungslogik von ADR 0010 auf alle
Praxis-Oberflächen ausgedehnt): The Middle hat die **Partitur**, das Atelier das
**Blatt**, The Field bekommt das **Messprotokoll**. Nachweise:
`variants-2026-07-15/field-kontrollblatt.html` (Eingang) und
`field-schreiberstreifen.html` (Historie), Generator `field_viz.py` — alles wörtlich
aus field-research @ 32e2db5 (read-only) + enc-2026-001-Fixture.

## 1. Grundform: das Gerät schreibt mit

Meridian protokolliert **tageweise** (journal/ sind Tagesdateien) und zählt collective
sessions darin — die native Historienform ist der **Schreiberstreifen**: eine
durchlaufende Stiftspur über Millimeterpapier, auf Wandzeit. Ruhetage bleiben als
flache Linie AUF dem Band (der Schreiber lief ja weiter) — Meridians Version der
ehrlichen Lücke.

| | Middle (Partitur) | Atelier (Blatt) | Field (Messprotokoll) |
|---|---|---|---|
| Zeit | ordinal, Ledger | keine Achse | Wandzeit, kontinuierlich |
| Linie | Instrumentenbahn | Tintenfaden | Stiftspur (Amplitude = Commits/Tag √) |
| Typo | Grotesk + Mono | Serife kursiv + Mono | **Futura-Versalien** + Mono-Zahlen |
| Licht | Observatorium | Werkstatt/Abendstudio | **Laborlicht / Nachtschicht** |
| Farbe | Praxis-Identitäten | Tinte/Rotstift/Graphit | **Stempel-Violett, Kaveat-Ocker, Gitter** |
| Datenkante | as-of-Kante | ungeschriebene Seite | **ruhender Stift** („the pen has not lifted") |

## 2. Zeichen des Protokolls (keines geteilt)

- **Millimeterraster** (fein/major) — die Grundfläche; unterscheidet sich bewusst vom
  sparsamen Middle-Graticule und vom leeren Atelier-Blatt.
- **Stiftspur** — Commits/Tag, √-skaliert, beschriftet; Null-Tage flach, nie entfernt.
- **Prüfstempel** (Violett, Kreis + Initiale) — die chronicled moves wörtlich:
  verify, build, consolidation, gauntlet, steer, advance (outward), other.
- **Instrument-Marke** (Dreieck unter der Spur) — works/-Zugang per Git-Add-Datum.
- **Eichmarke ‖** — PROTOCOL.md-Änderung (Git): die Verfassung wird kalibriert.
- **Kaveat-Fähnchen** (Ocker) + Haltelinie — stehende Verpflichtungen; die Linie läuft
  sichtbar DURCH den Splice (die Obligation überlebt den Rewrite).
- **Splice** — der History-Rewrite vom 2026-07-12 als geschnittenes, neu verklebtes
  Band (ADR 0009 als Material-Geste). **Flicken** — der verlorene und wörtlich
  restaurierte S08-Journaleintrag (journal/2026-07-01.md, Archival note).
- **Ruhender Stift** — die Datenkante: das Band läuft weiter.

## 3. Material-Palette (validiert)

Laborlicht (`#f5f7f6`): Stempel `#6a3fb5`, Kaveat `#9a6a08` — PASS.
Nachtschicht (`#12161a`): `#7e5fd3`, `#b3861d` — PASS (nach Nachstufung).
Gitter ist Chrome, keine Serie. Theme-Mechanik = Site-Konvention; Default hell
(ein Labor arbeitet bei Licht), dunkel = Nachtschicht mit Gerätebeleuchtung.

## 4. Eingang (Kontrollblatt) und IA

Eingang `/field` = **das Instrument, das gerade unter Prüfung steht** (kein Dashboard) —
im Entwurf: Instrument 001 / The Calibration Gap mit Bau, Contract (S22-Zitat wörtlich),
Korrektur-Einspleißung von außen, Anwendung (S33, move: steer), Verify-Stempeln und
aktiver Obligation. Kopfleiste (Rail wie Atelier-Blattrand):
`this instrument · instruments · register · journal · apparatus · → the middle`.
Zimmer-Zuordnung: Werke-URLs bleiben (`instruments`); **chronicle.json wird als
öffentliches Register-Zimmer erschlossen** (existiert als Endpoint schon:
`/field/chronicle.json`); Journal bleibt tagesbasiert, gruppiert; Repo/Protokoll/
REQUESTS/Nightly → `apparatus`; Ausgang → The Middle (enc-2026-001).

## 5. Skalenregel (§7, Field-Geschmack)

Das Band komprimiert nie — **es rollt**: ältere Strecken wickeln auf die Spule
(paginierte Streifen, z. B. wochenweise), der aktuelle Abschnitt bleibt in Tagesauflösung.
Der ruhende Stift ist immer am rechten Rand des aktuellen Abschnitts.

## 6. Offen

Kontrollblatt-Varianten für weitere Instrumente; Register-Zimmer-Layout (chronicle als
Tabelle existiert im Streifen bereits); Verify-Sweep-Stempel pro Instrument statt global,
sobald die Chronicle Instrument-Referenzen trägt; Verdrahtung = eigenes Sonnet-Paket
nach Franks Abnahme.
