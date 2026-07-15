# Zeichengrammatik — The Middle
## Design-Session 2026-07-15 · Entwurf (stärkstes Modell), wartet auf Franks Abnahme

**Brief (Frank, 2026-07-15):** Mischung aus clean-wissenschaftlich und kreativ-ästhetisch,
leicht futuristische Dashboard-Optik mit nützlichen Visualisierungen; kein Spektakel,
nicht verspielt, seriös; präsentierbar im Terminal wie auf großer Leinwand (ZKM) — es
geht um ein Kunstwerk und künstlerische Forschung, nicht um ein textbasiertes Archiv.
Begriffsrahmen: föderierte Forschungsökologie / kartografische Maschine; Deleuze:
**„Macht Karten, keine Kopien"** — was das System bereits strukturell ist (ADR 0001:
kein kanonischer Graph; nur situierte Linsen = „die Linse").

**Referenzanker aus Franks Atlas** (214 Werke, `src/data/atlas/werke.json`):
`axis_pole: investigation` dominiert 114:11 gegen `spectacle`; Leitwerke der Sammlung
sind forensische Groß-Diagramme (Crawford/Joler *Anatomy of an AI System*, *Calculating
Empires* — eine 24-Meter-Karte). Die Ästhetik der Sammlung IST der Referenzrahmen:
recherchierte Kartografie in Ausstellungsqualität, Wucht durch Material/Typo/Maßstab.

---

## 1. Grundform: die Begegnung als Partitur

Eine Begegnungskarte ist eine **deterministische Projektion des Event-Ledgers** — kein
Illustrationsbild, sondern eine zweite Leseform desselben Registers (dieselbe Ethik wie
das Protokoll: nichts erfunden, alles adressierbar).

- **Bahnen (horizontal):** eine je beteiligter Praxis, in fester Rollenordnung
  (source oben, receiver unten). Der **Conductor** ist eine schmale Vermittlerspur
  **in der Mitte** — The Middle liegt wörtlich dazwischen. Bahnfarbe = Praxisfarbe.
- **Zeit (links→rechts):** ordinal nach Ledger-Reihenfolge, mit Tages-Lineal;
  ungleiche Abstände werden nicht linear gelogen, das Lineal zeigt die echten Daten.
  Rechter Rand = **as-of-Kante** (Datenstand), dahinter ist nichts.
- **Stromrichtung (vertikal):** downstream = abwärts (source→receiver), upstream =
  aufwärts. Eine Korrektur, die stromaufwärts fließt, steigt sichtbar gegen die
  Transferrichtung an — die Kernaussage von enc-2026-001 wird Geometrie.
- **Erzählung ≠ Register:** Stationsnummern (①–⑥) markieren die narrative Reihenfolge
  auf der ledger-geordneten Karte; wo beide auseinanderlaufen (Beat 3/4), zeigt die
  Karte das ehrlich, statt es zu glätten.

## 2. Zeichen-Inventar (Ereignistyp-Familien → Zeichen)

Offenes Vokabular: Zuordnung über die Familie (Präfix vor dem Punkt); unbekannte
Familien bekommen das dokumentierte Fallback, nie ein geratenes Zeichen.

| Familie | Zeichen | Begründung |
|---|---|---|
| `contract.*` | Schwellen-Klammer (offener Rahmen ⟨‖) | ein Angebot unter Bedingungen: eine Tür, kein Besitz |
| `object.*` | gefülltes Quadrat ■ | ein Werk/Objekt tritt ein: massiv, materiell |
| `translation.*` | schraffierte Lücke ▨ ▨ (mit sichtbarem Void) | erklärter Verlust: eine gestaltete Leerstelle, kein Fehler |
| `correction.*` issued | Rauten-Umriss ◇ + gestrichelte Strecke | unterwegs, noch nicht angenommen |
| `correction.*` applied | Haken-Anschluss ✓ mit Pfeilkopf in die Bahn | angekommen und eingearbeitet |
| `derivative.*` | kleiner Kreis am Stiel unterhalb der Bahn ○ | Abkömmling: gehört zur Praxis, hängt am Vorgang |
| unbekannt | punktierter Kreis + Roh-Typlabel | ehrliches Fallback, im Schlüssel ausgewiesen |

**System-Zeichen** (keine Events): Obligation = Haltelinie (Haarlinie vom auslösenden
Event bis zur as-of-Kante, Label „active"); Divergenz-Terminal = **zwei offene Ringe,
die nie konvergieren**, dazwischen der Status („both readings stand") — Nicht-Auflösung
ist ein darstellbarer Endzustand, kein fehlendes Happy End; Nicht-Beziehung (Ulysses in
enc-2026-001) wird **nicht gezeichnet**, nur im Schlüssel vermerkt — dokumentierte
Abwesenheit bekommt keine Kante.

## 3. Farbregeln (validiert, nicht geschätzt)

Identität = Praxis, fest zugeordnet, nie rotierend (Farbe folgt der Praxis, nie dem
Rang): **Meridian Blau · Ensemble Oxidorange · Ulysses Violett · Infrastruktur/Conductor
neutrales Grau (keine Serie)**. Text trägt IMMER Text-Farben, nie Serienfarbe.
Status (active/pending/…) ist ein eigener Kanal (Chip + Wort, nie Farbe allein).

Validator-Läufe (dataviz-Skill, `validate_palette.js`), alle Checks PASS:
- dunkel (Surface `#101318` / `#0c0e10`): `#3987e5, #d95926, #9085e9`
- hell (Surface `#f7f4ee`): `#2a78d6, #c1481c, #4a3aa7`

CVD-Separation schlechtestes Paar ΔE ≈ 90+ (Ziel ≥12). Schraffur bleibt als
Textur-Kanal für translation-Zeichen und forced-colors/Print.

## 4. Interaktion

Hover auf ein Ereignis-Zeichen = **Registerauszug** (Typ, Datum, Issuer, wörtliches
Zitat + Attribution), Klick = Sprung in die Akte. Kein JS nötig fürs Lesen: unter der
Karte steht immer die semantische Ereignis-Tabelle (zugleich der A11y-/Tabellen-View).
Keine Loops, nichts pulsiert (Bestandsregel); allenfalls einmaliges Einzeichnen,
`prefers-reduced-motion` rendert sofort fertig.

## 5. Determinismus-Vertrag (für den Generator, Phase nach Abnahme)

Gleicher Ledger ⇒ byte-gleiches SVG. Eingaben: encounter-Bundle (Events, Obligations,
Divergenz, Teilnehmer+Rollen) + Lens-Config. Verboten: Zufall, Uhrzeit, Layout-Physik
(Force-Layouts). Bahnordnung = Rollenordnung; x = Ledger-Ordnung; alle Maße aus
Konstanten. Der Generator wird ein pures Modul in `packages/projections` (neue
Renderer-Form `score`), map_versions wie gehabt gehasht.

## 6. Was die drei Art-Direction-Varianten teilen — und was nicht

**Geteilt (die Grammatik):** Partitur-Form, Zeichen-Inventar, Farb-Identitäten,
as-of-Kante, Divergenz-Terminal, Registerauszug-Hover, Ereignis-Tabelle.
**Variantenspezifisch (das Material):** Oberfläche/Licht, Typografie, Rahmen-Chrome,
Dichte der Randnotate. Varianten in `docs/design/variants-2026-07-15/`:

- **A — Observatorium:** dunkle Leinwand, Instrumenten-Ruhe, große Grotesk,
  Mono-Notate, Graticule. Der ZKM-Projektions-Kandidat.
- **B — Kartenwerk:** helles Papier, Stich/Print-Forensik (Calculating-Empires-Geste),
  Serifen-Display, Plattenrahmen, Kartenschlüssel als Legendenkasten.
- **C — Konsole:** strenges Monospace-Raster, Terminal-Chrome, Statuszeile —
  wörtlich im Terminal präsentierbar (die Grammatik überlebt sogar TTY).

**ADR-0010-Grenze:** Diese Grammatik gilt für The Middle (App + Site-Eingang
gleichzeitig). Das Atelier bekommt ausdrücklich eine EIGENE Bildsprache —
eigener Entwurf, eigene Session-Etappe, nicht dieses Dokument.
