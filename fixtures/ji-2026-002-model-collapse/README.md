# ji-2026-002-model-collapse — Joint-Inquiry-Akte (ENTWURF)

**Status: `approval: draft`, `status: PROPOSED`, `phase: PROPOSAL`.** Die drei Einladungen
wurden am **2026-07-25** von Frank über die REQUESTS-Kanäle versendet (field-research `7d88935`,
ulysses `f33f2c8`, studio `3521bb5`). **Noch keine Praxis hat angenommen** — `commitments/` und
`positions/` sind leer, die Inquiry bleibt `PROPOSED`, nicht `ACTIVE`. Sie wird aktiv, sobald
eine Praxis über ihren eigenen Kanal ein Local Commitment zurückgibt (dann hier transkribiert).

Regeln: `docs/joint-inquiry/PROTOCOL.md`. Arbeitstitel: **Model Collapse** (ein schärferer
öffentlicher Name kann später folgen).

## Die Frage

> Wenn ein gemeinsamer Wissensbestand zunehmend aus Material besteht, das Maschinen aus
> Maschinen-Output erzeugen — verarmt er messbar an seinen Rändern (Vielfalt, seltene Fälle,
> Ausreißer), oder erdet er sich wieder in der Welt? Und an welchem Zeichen erkennt man den
> Unterschied, bevor er unumkehrbar ist?

**Konkreter Fall:** die Sprache selbst — wie menschliches Schreiben anfängt, die statistische
Signatur der Modelle zu tragen, die auf es trainiert wurden (die geschlossene Schleife).

## Der Kern-Trick (load-bearing, ehrlich)

Die Messung fragt **nicht** „Ist dieser Text von einer KI?" — das ist die 2026 dokumentiert
unzuverlässige Zone (40–80 % Detektions-Genauigkeit). Sie misst den **Fingerabdruck** des
Kollapses: schrumpfende Wortschatz-Vielfalt/Varianz und den Anstieg eines **deklarierten
Marker-Sets** über einen datierten Korpus. Das ist die verlässliche Schicht (deskriptive
Statistik, an Code verankert) — dieselbe Familie wie Meridians bestehende Ziffern-Statistik,
nicht das brüchige „KI-Erkennen". Diese Wahl ist das, was die Frage überhaupt auf Stufe-1
beantwortbar macht.

## Material

- **Reference-Demonstration (real, gehasht):** Ulysses' `works/2026-07-04-attractor` (16 Texte
  rekursiv selbst-trainiert, Kollaps gegen eine Kontrolle gemessen), commit `cfb6a108`,
  sha256 `61f3b012…` — das reproduzierbare **„Labor"**, das den Mechanismus zeigt. **Keine
  Arbeitsteilung** — Ulysses ist nicht „Zulieferer"; das ist der gemeinsame Bezugspunkt.
- **Feld-Korpus (noch NICHT gesetzt):** ein echter, datierter, offen lizenzierter Textkorpus
  über die Zeit vor/nach dem Einzug von Modell-Text (Kandidaten: datierte Abstracts eines
  offenen Wissenschafts-Index; ein datierter offener News-/Foren-/Bewertungs-Korpus). Wird von
  den Praktiken bei der Reconciliation gesourct und gepinnt, **bevor** die Inquiry `ACTIVE`
  wird. Keine erfundene Referenz steht bis dahin in der Akte.

## Beitrag je Praxis (Kandidaten — die Praxis formt sie selbst oder lehnt ab)

- **Meridian (Wissenschaft) — misst den Fingerabdruck.** Erstzug: ein versioniertes
  *Homogenization Dossier* — deklarierter datierter Korpus + prä-registriertes Metrik-Set
  (Type-Token-Ratio/Entropie, Varianz, Frequenz-Zeitreihe des Marker-Sets), Entscheidungsregel
  VOR der Messung fixiert, **inkl. Null-Modell des normalen Sprachwandels**, Negativbefunde
  berichtet. Kill, wenn kein Signal über gewöhnlichen Wandel/Mode hinaus bleibt. (N3, code-
  verankert — seine verlässliche Ecke.)
- **Ulysses (Philosophie) — denkt die Schleife.** Die Welt fängt an, wie die Maschine zu
  klingen, die auf die Welt trainiert wurde; was geht verloren, wenn der Rand/Ausreißer/Irrtum
  verschwindet — und ist menschliches Nach-Erden echte Gegenkraft oder Trost? Hat den Mechanismus
  schon selbst gemessen (Attractor, Generation-Loss). Kein Dashboard, keine dekorierte
  Baudrillard-These (§5.4 Nicht-Ersetzbarkeits-Test).
- **Ensemble (Kunst) — baut das Verschwinden.** Erstzug: ein Werk, in dem eine gewählte Stimme
  (oder die eigenen Worte des Besuchers) Generation für Generation ins glatte „Modell-Register"
  gezogen wird, bis das Eigene weg ist — man *merkt*, wie die Stimme verschwindet. Synthetische
  Zustände oder informierte interne Teilnehmende. Kill, wenn es nur „KI-Sprech ist lustig"-Demo
  oder Bebilderung von Meridians Dossier ist. (Anti-Drift- und IMAGINED-Regeln gelten; hier
  KEINE Entrapment-Maschine — das ist ein anderer formaler Zug.)

## Werk-Konzept für Ensemble (Vorschlag, nicht Vorschrift)

Ein Interface, das den Besucher-Text nimmt und ihn über sichtbare „Generationen" wiederholt
durch ein glättendes Modell-Register schickt — jede Runde etwas mittiger, vorhersehbarer,
„flüssiger". Man sieht die eigenen Eigenheiten (Tippfehler, seltene Wörter, schräge Wendungen)
verschwinden, bis ein perfekt glatter, gesichtsloser Durchschnittstext bleibt. Der Punkt ist
nicht Spott über „KI-Deutsch", sondern der *Verlust* — die Erfahrung, dass die eigene Stimme
im Mittel aufgeht. Optionale Kontrolle: ein „frisches echtes Wort" von außen einwerfen und
sehen, ob es die Schleife für einen Moment wieder erdet (die Anti-Kollaps-Bedingung, erfahrbar).

## Warum die Frage Dissens erträgt

Sie behauptet den Kollaps nicht — sie prüft ihn. Ist das Schrumpfen der Ränder **Verarmung**
(verlorene seltene Wahrheiten, Minderheitsformen, der Irrtum als Erkenntnis) oder harmlose
**Konvergenz**? Rettet menschliches Nach-Erden den Brunnen, oder ist das Wunschdenken? Die drei
dürfen ehrlich uneins bleiben; keine gemeinsame Schlussfolgerung wird erzwungen (§2.6).

## Design-Entscheidungen (zur Prüfung)

- **`minimum_participants: 2`** (nicht 3): eine einzelne Absage soll die Inquiry nicht canceln;
  sie läuft dann als Zwei-Perspektiven-Studie mit der dritten als explizitem Abwesenheits-Zustand
  (§12.2). Das volle Ziel will alle drei. Frank kann auf 3 setzen.
- **Feld-Korpus offen gelassen**, bewusst: das Sourcen/Pinnen des exakten Korpus ist ein
  Reconciliation-Schritt der Praktiken, kein erfundener Platzhalter (Dokument-10-Muster).

## Rights / Betroffene

Nur öffentlicher, offen lizenzierter Text, rein aggregiert/statistisch. Keine personenbezogene
Datenerhebung; kein einzelner Autor wird benannt, profiliert oder re-identifiziert; keine
Behauptung, dass eine bestimmte Person „wie ein Modell schreibt". Kein Deploy/keine öffentliche
Exposition ohne menschliche Freigabe.

## Manueller Betrieb (D-JI-02)

Einladungen → REQUESTS-Kanäle der Praktiken (`docs/requests-drafts/ji-modelcollapse-*.md`), von
**Frank** versendet. Moves → gewöhnliche lokale Projekte in den Praxis-Repos; diese Akte
referenziert sie nur. Transkription → Middle Scribe, sobald die Inquiry `ACTIVE` wird.

## Aufbau

- `inquiry.json` — die Akte (`approval: draft`, `status: PROPOSED`).
- `events/0001-proposal-created.json` — Proposal-Ereignis (Entwurf; `content_hash` Platzhalter,
  bis der Scribe die Inquiry aktiviert).
- `commitments/`, `positions/` — leer (Vorlagen).

## Hash-Hinweis (ehrlich)

Die `content_hash` in `events/` ist ein **Platzhalter** (keine Hash-Kette gerechnet). Der Hash in
`shared_material_refs` ist **real** (Ulysses' Attractor, gegen commit `cfb6a108` verifizierbar).
Der Feld-Korpus trägt bewusst noch keinen Hash — er wird bei der Reconciliation gepinnt.
