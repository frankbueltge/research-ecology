# Verschiebungen / Shifts

Ein Protokoll der Denk-Verschiebungen, nicht der Ergebnisse. Angeregt durch Franks
Gespräch mit einem anderen KI-System (2026-07-15, auszugsweise im Repo-Gedächtnis):
*„Dokumentiere diese Entwicklung. Nicht nur die Ergebnisse. Auch die Verschiebungen."*
Diese Momente sind Teil der Forschung — hier wird sichtbar, wie die Ökologie selbst
entstanden ist.

---

**2026-07-14 — Vom Cockpit zur Ökologie.** Die vorige Spezifikation baute eine
kartografische Maschine um Ulysses. Die neue erkennt: Das Labor enthält mehrere souveräne
Praktiken; die gemeinsame Schicht zeichnet Begegnungen auf, nicht Bedeutung.

**2026-07-14 — Der erste Encounter wurde gefunden, nicht erfunden.** Das Audit ergab genau
einen vollständig belegten Vorgang — und seine stärkste Eigenschaft widerspricht dem
Klischee: Die wichtigste Korrektur floss stromaufwärts, vom Werk zurück ins Instrument.

**2026-07-14 — Commit-Hashes sind sterblich.** field-research hatte seine Git-Historie
dokumentiert umgeschrieben. Seitdem gilt: Inhalts-Hashes sind die Identität, Commits sind
Zeiger, und ein History-Rewrite ist selbst ein Apparatus-Ereignis.

**2026-07-15 — Das Register ist nicht der Eingang.** Die erste menschliche Kritik (Frank):
Der Slice ist vollständig, ehrlich — und erschlägt. Niemand würde ihn freiwillig lesen.
Der Fehler war, die Akte (Ebene 3) als Erzählung (Ebene 1/2) zu verwenden. Die Spec hatte
diesen Stopp vorgesehen: redesign, not expand.

**2026-07-15 — Identität tritt hinter die Praxis zurück.** (Aus Franks externem Gespräch,
übernommen als Gestaltungsprinzip:) Der Besucher betritt nicht „Ulysses" — er betritt eine
Forschungslandschaft: ein Instrument, eine Karte, einen Widerspruch, eine offene Frage.
Erst später merkt er, von wem etwas stammt. Nicht der Name legitimiert die Erkenntnis,
sondern die Qualität der Praxis.

**2026-07-15 — Die Site ist das Experiment.** Frank: Die Ökologie ist das Einzige, was ihn
wirklich interessiert; die übrigen Experimente sind verzichtbar — oder besser: Sie werden
**Material**. frankbueltge.de wird komplett um die Ökologie herum neu strukturiert; die
alten Experimente (Protokoll, Parallaxe, Police, …) werden nicht gelöscht, sondern als
Bestände des Labors der Ökologie zum Gebrauch angeboten — dieselbe Geste wie Meridians
stehendes Angebot mit Bedingungen. Und: Der Eingang muss spektakulär sein — Wucht durch
Maßstab, Typografie und die Dramatik des echten Materials, nicht durch Dekor.

**2026-07-15 — Einsprachig: Englisch.** Frank: kein Deutsch im Ökologie-Stack. Die
Erzähl-Inhalte entstehen nächtlich; eine Übersetzungspflicht pro Lauf wäre wiederkehrende
Arbeit ohne Ertrag. Die Engine-Repos schreiben ohnehin Englisch, die Site ist EN-first.
(Die deutschen Alt-Seiten der Site außerhalb der Ökologie bleiben unberührt, bis der
Site-Umbau gemergt wird.)

**2026-07-15 — Wir bauen kein Rhizom; wir bauen Bedingungen.** Ebenfalls übernommen: Die
Form wird nicht implementiert — die Möglichkeit von Formen wird gestaltet. Intern darf das
Ganze unbenannt bleiben; „The Middle" und „research-ecology" sind Arbeitstitel, keine
Namen. Das treffendste interne Register bisher: eine **Forschungsverfassung** — sie sagt
nicht, wie geforscht werden muss, sondern unter welchen Bedingungen Verschiedenes
entstehen kann.

**2026-07-18 — Vom nächtlichen Takt zum Projekt.** Die fünf-Tranchen Research Foundation
zu Ulysses mündete in Protokoll v4: Nicht die Session ist die Einheit der Praxis, sondern
das umgrenzte Projekt mit konkreter Ausgangssituation, Budget und Kill-Bedingung. Der
Session-Takt hatte Aktivität erzeugt, unabhängig von der Stärke des Problems — genau die
Schleife, die das Cockpit maß. Die Korrektur trennt drei Dinge, die die alte Pipeline zu
einem verschmolz: Forschungsarchiv (landet automatisch, validiert), technische Integration
(publikationsneutral) und kuratierte Veröffentlichung (nur durch Franks explizite
Entscheidung, `PUBLICATION.json`). Und sie ersetzt tägliche Kontrolle durch ein stehendes
Mandat — menschliche Verantwortlichkeit ohne tägliches Projektmanagement
(D-ULY-01…07, `docs/design/ulysses-v4-decisions-2026-07-18.md`).

**2026-07-19 — Koordination ohne Koordinator.** Die Joint-Inquiry-Spezifikation wollte
Konzept und Maschine zugleich: Protokoll, Schemas, SQL, Adapter, Dispatcher. Übernommen
wurde nur die Akte — Konstellationen laufen manuell über die Angebots-Kanäle, die es
schon gibt. Die Einsicht dahinter, frisch aus der v4-Migration: Der Encounter brauchte
nie einen Encounter-Server, und die Konstellation braucht keinen Koordinator, solange
die Akte diszipliniert ist. Und wo doch einmal Transport nötig wird, existiert seine
Spezifikation bereits woanders — die Föderationsschicht der Meridian Research Runtime.
Dieselbe Maschine zweimal zu bauen wäre der eigentliche Konstruktionsfehler gewesen
(D-JI-01…04).
