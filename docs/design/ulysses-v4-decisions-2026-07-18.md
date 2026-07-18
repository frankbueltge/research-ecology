# Ulysses Protokoll v4 — Entscheidungen (2026-07-18)

Aus dem Ulysses-v4-Implementierungspaket v1.1 (abgeleitet aus der fünf-Tranchen Research
Foundation; Paket archiviert in frankbueltge.de `docs/ulysses-v4-protocol-package-v1.1/`).
Entschieden von Frank Bültge, 2026-07-18; wirksam mit dem Merge der Migrations-PRs
(irrtum-als-methode#2, frankbueltge.de#100). Betrifft NUR die lokale Souveränität des
Ateliers — Meridian, Ensemble und der Scribe bleiben unberührt (spec/02, lokale Protokolle).

## D-ULY-01 — Projekt ersetzt generische Session

- **Status:** `ACCEPTED`
- **Entscheidung:** Ulysses arbeitet in umgrenzten Projekten, die in konkreten
  Ausgangssituationen gründen. Eine uhrgetriggerte Session ist nicht länger die Einheit
  der Praxis.
- **Grund:** Der Session-Takt produzierte Aktivität und Artefakte unabhängig von der
  Stärke des Problems.

## D-ULY-02 — Stehendes Mandat ersetzt tägliche Freigabe

- **Status:** `ACCEPTED`
- **Entscheidung:** Frank genehmigt ein dauerhaftes, versioniertes Betriebsmandat
  (`governance/STANDING-DELEGATION.md` v1). Innerhalb dessen darf Ulysses gewöhnliche
  Projekte ohne projektspezifische menschliche Freigabe initiieren, ausführen,
  überarbeiten, archivieren und beenden.
- **Grund:** Menschliche Verantwortlichkeit darf das Experiment nicht in tägliches
  manuelles Projektmanagement verwandeln.
- **Konsequenzen:** Das Mandat definiert Kapazität (2 aktive Projekte, 30 Tage Laufzeit),
  Kosten (keine neuen externen Kosten ohne Eskalation), erlaubte Pfade, geschützte Pfade
  und Eskalationstrigger.

## D-ULY-03 — Sicheres Auto-Land bleibt

- **Status:** `ACCEPTED`
- **Entscheidung:** Der alte Auto-Land-plus-Site-Dispatch-Workflow ist entfernt; die
  automatische Integration validierter, reversibler Forschungsaufzeichnungen bleibt über
  einen enger gefassten, allowlist-basierten Workflow (`research-auto-land.yml`) erlaubt.
- **Grund:** Repository-Integration nützt Kontinuität und Provenienz; der Fehler war,
  sie als Veröffentlichung per Nebenwirkung zu behandeln.
- **Konsequenzen:** Auto-Land kann keine geschützten Pfade ändern, keine Eskalationen
  auflösen, keine Publikationsfreigabe erzeugen und kein Projekt auf die kuratierte
  Werk-Oberfläche bringen.

## D-ULY-04 — Repository-Aufzeichnung und kuratiertes Werk sind verschieden

- **Status:** `ACCEPTED`
- **Entscheidung:** Aktive Projekte, Studien, Fehlschläge, beendete Linien und
  Publikations-Kandidaten dürfen im öffentlichen Forschungs-Repository existieren, ohne
  kuratierte Atelier-Werke zu werden.
- **Grund:** Öffentliche Zugänglichkeit, archivische Integration und künstlerische
  Billigung sind verschiedene Status.

## D-ULY-05 — Die menschliche Rolle ist konstitutionell und editorial, nicht täglich-operativ

- **Status:** `ACCEPTED`
- **Entscheidung:** Franks Routine-Rolle beschränkt sich auf Mandat-/Protokoll-
  Entscheidungen, Publikationsprüfung, Hochrisiko-Ausnahmen, Korrekturen und
  Beendigungsbefugnisse.
- **Grund:** Das Projekt soll dauerhafte maschinelle Teilhabe erproben, nicht eine
  tägliche editoriale Arbeitslast erzeugen.

## D-ULY-06 — Kuratierte Veröffentlichung bleibt menschlich

- **Status:** `ACCEPTED`
- **Entscheidung:** Ein v4-Projekt erreicht die kuratierte Werk-Oberfläche nur über ein
  projektspezifisches, menschlich freigegebenes Publikationsmanifest (`PUBLICATION.json`
  mit benanntem Freigebenden und Zeitstempel; site-seitig erzwungen im Integrator).
- **Grund:** Veröffentlichung umfasst Autorschaft, Rechte, öffentliche Behauptungen und
  Verantwortung, die sich nicht aus einem grünen Build oder einem Modell-Urteil ableiten
  lassen.

## D-ULY-07 — Projektlokale Automatisierung ist erlaubt

- **Status:** `ACCEPTED`
- **Entscheidung:** Asynchrone, ereignisgesteuerte oder geplante Läufe sind erlaubt,
  wenn sie an ein aktives Projekt gebunden, durch dessen Score begründet und durch das
  Mandat begrenzt sind. Generische Produktion, nur weil ein Zeitplan gefeuert hat, ist
  verboten. Die bestehende Cloud-Routine läuft weiter (Franks Entscheidung, 2026-07-18)
  — als Dispatcher-Tick ohne Output-Pflicht (`docs/ROUTINE-PROMPTS.md`).
- **Grund:** Autonomie braucht Kontinuität, aber der Takt muss dem Forschungsproblem
  folgen, statt es zu ersetzen.

## D-ULY-08 — Offenlegung ist Register-Sache (Amendment, 2026-07-19)

- **Status:** `ACCEPTED`
- **Entscheidung:** Die No-Vendor-Regel wird zur **Stimm-Regel** präzisiert. In der eigenen
  Stimme der Praxis (Werke, Texte, Commits, Branch-Namen, Autor-Identitäten) bleiben
  Produkt- und Anbieternamen ungenannt — eine ästhetische Entscheidung, keine
  Geheimhaltung. Apparatus-Records (Protokoll v4 §4.2), Forschungs-Expositionen und das
  Paper-Register legen Modelle, Versionen, Werkzeuge und Infrastruktur vollständig offen.
- **Grund:** Eine Praxis mit Nachprüfbarkeit als Kernwert darf ihr Hauptinstrument nicht
  verschweigen; die alte Totalregel widersprach zudem v4 §4.2, das die Modell-Angabe im
  Apparatus-Record ausdrücklich verlangt (und war faktisch nie dicht — die Werkzeuge sind
  als Contributors der Repos öffentlich sichtbar).
- **Entschieden von:** Frank Bültge, 2026-07-19.
