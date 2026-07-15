# Site-v2 — Briefing für die Grundsatz-Session (ab 2026-07-16, ~00:30)

**Franks Auftrag (2026-07-15, 23:20, wörtlich sinngemäß):** Keine oberflächliche
Ergänzung. Es geht um **eine Einstiegsseite / einen Hub für das gesamte Projekt** —
und das Gesamtprojekt braucht vermutlich **eine Bezeichnung**. Messlatte: *„Stell dir
vor, du kommst als Mensch zum ersten Mal auf die Site — du verstehst einfach null und
bist sofort wieder weg."* Gründlich planen: Struktur, Header-Navigation, was mit /lab
passiert. Und: **„Ich will meine Joy-Division-Header-Animation zurück."**

## 1. Die Kernfragen (in dieser Reihenfolge denken)

1. **Name des Gesamtprojekts.** Spannungsfeld ist dokumentiert: shifts.md 2026-07-15
   sagt „Wir bauen kein Rhizom; wir bauen Bedingungen … intern darf das Ganze unbenannt
   bleiben; ‚The Middle' und ‚research-ecology' sind Arbeitstitel". ABER: öffentlich
   braucht ein Experiment dieser Größe einen Griff. Optionen ehrlich abwägen:
   öffentlicher Eigenname vs. beschreibender Titel (z. B. „a federated research
   ecology") vs. bewusste Unbenanntheit als Statement. Interne Register-Idee:
   „Forschungsverfassung". Frank entscheidet; Session liefert 3–5 durchdachte
   Kandidaten MIT Begründung und Konsequenzen (Domain? Header? Repo-Namen bleiben!).
2. **Der Hub (Startseite).** Erzählt in ~30 Sekunden: WAS ist das (ein Experiment:
   drei autonome KI-Forschungspraktiken + eine Kontaktzone, alles nachprüfbar, Git als
   Archiv, Frank als Architekt/Conductor), WER sind die Bewohner (4 Türen: Atelier /
   Field / Studio / The Middle), WAS ist gerade los (aktuelle Begegnung, letzte
   Premiere, letzte Session — datengetrieben), WO ist der Rest (Bestände, Atlas,
   About/Projects — Franks berufliche Seite nicht vergessen: die Site ist AUCH
   Personal Site). Besucher-Journeys explizit entwerfen (Neuling / Wiederkehrer /
   Fachpublikum).
3. **Joy-Division-Header zurück:** die alte Hero-Animation (`HeroField.astro`,
   GISTEMP-Klimadaten als Ridgeline — lebt noch im Git-Verlauf von main vor Merge
   63692ae und auf /de). Entscheiden: Hub-Held mit der Animation + Projekt-Prolog?
   Sie IST datengetrieben und damit grammatik-verwandt. Einbau-Ort gehört zur
   Hub-Komposition.
4. **Header-Navigation.** Heute: Lab · Field · Studio · Atlas · Projects · About ·
   Contact (+ Atelier fehlt!). Vorschlag entwickeln — Kandidat zum ZERREDEN, nicht
   übernehmen: [Name/Logo=Hub] · Begegnungen · Atelier · Field · Studio · Bestände ·
   Atlas · About. Fragen: „The Middle" als eigener Punkt oder = Begegnungen?
   Projects/Work (data-snack, datavism) wohin? DE-Spiegel-Zugang?
5. **Was passiert mit /lab.** Bestände-Umwidmung existiert (/bestaende); /lab ist
   heute Alt-Index mit Hinweis. Entscheiden: /lab → Redirect auf /bestaende? Oder
   /lab = das LABOR als vierte Praxis (Manifest, war ohnehin geplant — Handoff
   „Labor als vierte Praxis")? Nicht zwei halbgare Sammelseiten behalten.
6. **Atlas-Dualität** (Frank: „2 Atlanten machen keinen Sinn"): Franks Atlas
   (214 Datenkunst-Werke, /atlas) = Referenzsammlung des Labors, bleibt /atlas.
   Ulysses' Papers-Regal (Artistic-Research-Quellen aus irrtum-als-methode/atlas/)
   = Material der Praxis → /atelier/material (IA aus atelier-aesthetik §5), vom
   Blatt verlinkt. Beide verweisen aufeinander. Frank hat dem sinngemäß noch NICHT
   zugestimmt — als Vorschlag präsentieren.
7. **Praxis-Seiten auf der Site:** /atelier /field /studio bekommen die vier Sprachen
   (Blatt/Buchrücken, Kontrollblatt/Streifen, Bühne/Abendzettel — Design-Docs + 
   Generatoren in docs/design/). Staging: Site-Seiten statisch aus den Daten (wie
   BegegnungEntrance heute) ODER Links auf die deployten Apps — entscheiden.
   Middle-App-Statisch-Umbau (Theme auf Site-Konvention, Ledger pfadbasiert) gehört
   dazu (C3-STOP, Runbook docs/runbooks/apps-deploy.md).

## 2. Bindende Grundlagen (VOR dem Entwerfen lesen)

docs/shifts.md (bindend!) · docs/design/zeichengrammatik-2026-07-15.md + die drei
Praxis-Ästhetiken · docs/design/wortlaute-2026-07-15.md (Zwei-Schichten-Regel!) ·
docs/design/atelier-aesthetik §5 (Blattrand-IA) · spec-v2.1 §4.3/§7.3 (Eingang durch
Begegnung/Konstellation, „selection rule visible" — der Hub muss das RAHMEN, nicht
ersetzen) · ADR 0010 (keine geteilte Grammatik zwischen den Oberflächen; der Hub
braucht daher eine EIGENE, fünfte Stimme: die des Labors/der Verfassung — bewusst
zurückhaltend, die Praktiken glänzen lassen).

## 3. Stand heute Nacht (was live/fertig/offen ist)

- LIVE: frankbueltge.de = Partitur-Eingang (63692ae), /begegnungen /praktiken
  /bestaende; research-ecology öffentlich (github.com/frankbueltge/research-ecology).
- FERTIG lokal: Atelier-App statisch (5 Routen) + Deploy-Workflow (Secrets fehlen);
  Middle-App (dev); alle 8 Design-Artefakte; Profile ACTIVE (Team-Amendments in den
  drei Engine-PROTOCOLs, gepusht); Wortlaute freigegeben & live.
- OFFEN: Site-v2 (dieses Briefing) · CF-Secrets + DNS · Middle-Statisch-Paket ·
  Engine-Läufe mit docs/requests-drafts/ (Frank macht sie ggf. morgen früh, sein
  anderer Account hat wieder Limit ab morgen) · Fable→Atlas-Encounter + Konstellation
  (Phase D) · /de-Spiegel des neuen Eingangs (C2-Befund #7).

## 4. Arbeitsmodus der Grundsatz-Session

Erst DENKEN (Optionen, Journeys, Name-Kandidaten — mit Frank im Dialog), dann
Mockups (gebaute HTML wie heute — der Modus hat sich bewährt), dann EIN Umsetzungs-
Paket auf Branch `site-v2`. NICHTS auf main ohne Franks Go. Modell-Ökonomie:
stärkstes Modell fürs Denken/Design, Sonnet für die Umsetzung.

## 5. Arbeitsstrang: Nightly-Kette Ende-zu-Ende, OHNE manuelle Nacharbeit (Frank, 00:25)

Befund heute Nacht: **Atelier-Integrate war seit 14.07. rot** — Ulysses führte neue
Kanten-Kinds ein (continues/complement/grounds), das Cockpit-Gate lehnte ehrlich ab,
und niemand bemerkte es → Werke fehlten tagelang live. Fix ist deployt (ed9ea9a,
Werke wieder live). Franks Anforderung: *„sicherstellen, dass alles, was in den
Routinen produziert wird, auch wirklich auf der Live-Site erscheint — zukünftig ohne
manuelle Nacharbeit."* Meridian/Studio vermutlich ebenfalls nicht taufrisch —
Integration NACH dem Redesign, aber die Kette gehört zum Paket:

1. **Sichtbarkeit statt Stille:** Jeder rote Integrate-/Nightly-Run muss ALARM
   schlagen (GitHub-Notification an Frank / Badge auf einer internen Statusseite /
   Issue-Bot). Ein ehrliches Gate, das niemand hört, ist ein stilles Loch.
2. **Ökologie-Glied automatisieren:** research-ecology bekommt den nächtlichen
   Workflow importer→(Tests)→export→Commit in die Site (Runbook site-export.md
   existiert; Workflow fehlt). Dazu: Apps-Rebuild (atelier statisch) am selben Strang.
3. **Gate-Failure-Policy:** Wenn Engines neues Vokabular erfinden (das SOLLEN sie),
   ist der rote Run der Normalfall, nicht der Störfall → definierter Halbautomatik-
   Pfad: Alarm + vorbereiteter „Vokabular bewusst erweitern"-PR statt tagelanger Stau.
4. **Frische-Audit** aller Integrates (atelier ✅ repariert, meridian/studio prüfen:
   Läufe grün ≠ Inhalt aktuell) + Ende-zu-Ende-Smoke: „jüngstes Engine-Werk ↔ live
   sichtbar" als täglicher Check.
