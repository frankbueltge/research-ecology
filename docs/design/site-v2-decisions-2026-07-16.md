# Site-v2 — Entscheidungen der Grundsatz-Session (2026-07-16, ab 00:30)

Fortschreibung des Briefings (`site-v2-briefing.md`). Frank hat entschieden; die
Begründungen der Kandidaten stehen im Session-Verlauf. Mockup: `variants-2026-07-16-hub/`
(hub-a.html + Generator `hub_pulse_viz.py`, Partitur-Embed aus dem Site-Renderer).

## 1. Entschieden (Frank, 00:45–01:00)

1. **Name = beschreibender Titel:** „a federated research ecology", klein gesetzt —
   kein Eigenname. Prinzip dazu: *Namen werden gefunden, nicht erfunden* (dieselbe
   Geste wie beim ersten Encounter); bildet sich später ein echter Name heraus, wird
   er dann angenommen. Kurzform im Sprechen: „the ecology". Domain bleibt
   frankbueltge.de; der einzige Eigenname im System ist der des Menschen.
2. **Hub-Hero = der Puls der Ökologie:** Joy-Division-Ridgeline, getrieben von den
   ECHTEN Commit-/Ereignisdaten der fünf Ökologie-Repos (eine Zeile pro ISO-Woche,
   x = Stunde der Woche, UTC). Nicht die generative Fassung (wäre Dekor nach
   shifts.md-Maßstab), nicht GISTEMP (thematisch fremd). Stumme Wochen bleiben blass
   sichtbar; die laufende Woche endet an der as-of-Kante. Ehrliche Bildunterschrift
   nennt Datenquelle, Bins und Glättung.
3. **Hub-Dramaturgie:** Hero → **aktuelle Begegnung (prominent, direkt unter dem
   Hero)** → vier Türen (Atelier/Field/Studio/The Middle, Praxisfarben, echte
   last-recorded-Daten) → „where works travel" (Projects: datavism, data-snack — Orte,
   an die hiesige Werke weiterwandern) → „also on this site" (Holdings, Atlas, About).
   Auswahlregel der Begegnung sichtbar (spec §4.3/§7.3: der Hub RAHMT den Eingang).
4. **/lab → 301 auf /bestaende.** Keine zwei Sammelseiten; das „Labor als vierte
   Praxis"-Manifest ist ein eigenes späteres Paket.
5. **Deutsch fliegt komplett raus** („erstmal raus", Frank 00:55): alle /de-Routen
   weg, Sprach-Toggle weg, i18n-Vereinfachung; /de/* bekommt Redirects auf die
   EN-Pendants. (Verschärft den English-only-Entscheid aus shifts.md.)
6. **Projects bleibt Projects** (kein „Work"): Seiten-Projekte, die mit der Ökologie
   verbunden sind — sie nehmen Werke von hier auf und präsentieren sie in anderem
   Kontext. Im Hub als eigener Block erzählt, nicht als Bio-Fußnote.
7. **Nav-Kandidat** (Feinschliff in den Mockups): [Frank Bültge=Hub] · Encounters ·
   Atelier · Field · Studio · Holdings · Atlas · Projects · About. The Middle ohne
   eigenen Nav-Punkt (Encounters ist sein Register; als Tür heißt er The Middle).

Noch offen: Kernfrage 6 (Atlas-Dualität — als Vorschlag im Mockup, Franks Zustimmung
aussteht), Kernfrage 7 (Praxis-Seiten statisch vs. App-Links), Wortlaut-Redaktion
(alles im Mockup ist DRAFT), „Holdings" als englisches Bestände-Label.

**Nachtrag 16.07. vormittags — alles Offene geschlossen** (Frank: „wortlaute sind
freigegeben. bitte durchziehen und selber entscheiden"): Wortlaute approved
(`naming.ts`, ein Fix: Holdings nennt „The Policy" statt „Police"); Kernfrage 6 wie
vorgeschlagen entschieden (Franks Atlas bleibt /atlas als Referenzsammlung; Ulysses'
Papers-Regal zieht in einem späteren Paket nach /atelier/material, beide verweisen
aufeinander); Kernfrage 7: Praxis-Seiten bleiben statisch aus den committeten Daten
(kein App-Link, solange die Apps nicht deployt sind — Abgleich A6); Label „Holdings"
bleibt. Freigabe-Trail: frankbueltge.de `docs/decision-log.md`.

## 2. Abgleich mit der Außenperspektive (ChatGPT-Brief, 2026-07-15)

Quelle: `~/Downloads/CLAUDE-CODE-HANDOFF-SITE-REPOS-AUTOMATION.md`. Der Brief
verlangt selbst, die laufende Arbeit nicht zu verwerfen (§1.1, §4.2) und liefert in
§12 das Format dieses Abgleichs. Kurzfassung: **weitgehend deckungsgleich mit
spec-v2.1/ADRs/shifts.md**; die verfassungsartigen Leitplanken (§2) sind unsere
eigenen Prinzipien in anderer Formulierung. Abweichungen und Übernahmen:

### Übernommen (accepted / adapted)

| # | Empfehlung | Entscheidung |
|---|---|---|
| A1 | **Naming als Config, nicht als verstreute Strings** (§4.5) | accepted — Titel/Labels/Intro der Site wandern in eine zentrale Konfigurationsstelle; eine spätere „gefundene" Umbenennung ist dann eine Config-Änderung, keine Migration. Passt exakt zum Namens-Prinzip aus §1.1. |
| A2 | **Route- & Redirect-Matrix mit Canonicals** (§4.7/§4.8) | accepted — die Migration (DE-Abbau, /lab, Nav-Umbau) bekommt eine dokumentierte Redirect-Matrix mit Tests; keine stillen Brüche externer Links. |
| A3 | **Apparat & menschliche Verantwortung als auffindbare Funktion** (§4.3/§4.4) | adapted — kein eigener Nav-Punkt, aber „also on this site" erhält einen Apparatus-Eintrag (wie die Maschinerie läuft, wer verantwortet, was Frank beeinflusst) — die Fachpublikums-Journey braucht das. |
| A4 | **Freigabematrix / „grüner Build ≠ redaktionelle Freigabe"** (§6.1/§6.7) | accepted für den Nightly-Ketten-Arbeitsstrang (Briefing §5): Regeneration freigegebener Projektionen bleibt automatisch; Bedeutungsänderungen (neue Encounters, Protokolle, Selbstbeschreibungen, Startseite) brauchen dokumentierte Freigabe. Produktions-Deploy über geschützte Umgebung prüfen. |
| A5 | **Frische-Wächter ≠ Aktivitäts-SLA** (§6.8) | accepted als Korrektiv zu Briefing §5.4: Alarme gelten roten Läufen und gerissenen Ketten (Integrationsehrlichkeit), nie dem Schweigen einer Praxis. Schweigen ist legitim. |
| A6 | **Keine toten Primäraktionen auf nicht deployte Apps** (§4.4) | accepted als Abnahmekriterium — Hub verlinkt statische Site-Routen, solange middle-web/atelier-App nicht deployt sind. |
| A7 | **Abnahmekriterien §10.1** (mobil, Tastatur, reduced motion, semantisches HTML, Redirect-Tests) | accepted in die Definition of Done des Pakets. Der Puls ist statisches SVG (keine Motion-Pflicht); falls später animiert: prefers-reduced-motion wie beim alten Hero. |

### Abgelehnt (rejected) — mit Beleg

| # | Empfehlung | Grund |
|---|---|---|
| R1 | Alternative Nav „Now/Encounters/Practices/Works/Apparatus/Archive/About" (§4.3) | Ein „Practices"-Sammelpunkt und ein zentraler „Works"-Katalog widersprechen den vier souveränen Türen und der lokalen Werk-Hoheit (ADR 0001/0010; Werke wohnen in ihren Praktiken). Die Funktionen des Vorschlags sind anders abgedeckt: Now = Begegnungs-Block, Archive = Holdings + lokale Archive, Apparatus = A3. |
| R2 | „Frank Bültge / Research Ecology" als öffentliche Arbeitsbezeichnung (§4.5) | Von Franks Entscheidung §1.1 überholt — der klein gesetzte beschreibende Titel ist präziser und markenfreier als die kapitalisierte Kurzform. Inhaltlich derselbe Geist. |
| R3 | Sprachparität DE/EN herstellen (§4.8) | Von Franks Entscheidung §1.5 überholt (DE fällt weg); übernommen wird nur die Migrations-Hygiene daraus (Redirects, Canonicals → A2). |
| R4 | Neue Dokumentfamilie (§8: fünf+ neue Docs) | Der Brief warnt selbst vor redundanter Dokumentenlandschaft. Bestehende Orte reichen: dieses Dokument (= Reconciliation), Redirect-Matrix (A2), Nightly-Strang im Briefing §5. |

### Vertagt (deferred)

- **Workstream B (Repo-Protokoll-Sprache: wing-Logik, Ensemble-Rollen, §5):** Die
  Profile-/PROTOCOL-Amendments (Phase B, „Profile ACTIVE") haben das Gröbste
  adressiert; ein Sprachaudit der READMEs gegen §5.2–5.4 ist sinnvoll, gehört aber
  nicht ins Site-v2-Paket. Eigener, späterer Arbeitsstrang. — **Aktiviert durch
  Frank 2026-07-16 01:35, Audit-Ergebnis: `docs/REPOSITORY-SEMANTIC-ALIGNMENT.md`.**
- **Workstream D (Federation-Manifeste/Outboxes, §7):** ausdrücklich „nur soweit es
  zum Stand passt" — unsere Import-Bundle-/Profil-Architektur ist weiter; kein
  Parallelsystem bauen. Prüffragen aus §7.2 als Review-Kriterien übernehmen, wenn
  Phase D (schreibbare Föderation) ansteht.
- **lab-pipelines-Rollenklärung (§5.5):** betrifft das Akte-/Protokoll-Erbe, nicht
  die Ökologie; separat prüfen.

## 3. Konsequenz fürs Umsetzungs-Paket (Branch site-v2)

Zum bereits geplanten Umfang (Hub, Nav, /lab-Redirect, DE-Abbau, Wortlaut-Verdrahtung
nach Freigabe) kommen aus dem Abgleich: Naming-Config (A1), Redirect-Matrix mit Tests
(A2), Apparatus-Eintrag (A3), DoD-Kriterien (A6/A7). Der Nightly-Strang (Briefing §5)
wird um A4/A5 präzisiert. NICHTS geht auf main ohne Franks Go.
