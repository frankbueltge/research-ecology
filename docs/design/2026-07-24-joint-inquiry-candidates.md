# Kandidaten für die erste gemeinsame Forschungsfrage — Owner-Vorlage (2026-07-24)

**Status:** ENTWURF, Owner-Vorlage — **keine Entscheidung**. Nichts wird versendet oder
committet ohne Franks ausdrückliches Go. Companion: `2026-07-24-joint-first-editorial-line.md`
(die redaktionelle Schwerpunkt-Frage). Vorbereitete Entwurfs-Akte:
`fixtures/ji-2026-001-correction-too-late/` (`approval: draft`).

## Wie diese Vorlage entstand

Grundlage sind drei Archiv-Surveys vom 2026-07-24 (field-research/Meridian,
ulysses/Ulysses, studio/Ensemble, alle read-only) plus die fünf `enc-*`-Akten und das
Spec-Paket (Dokument 10, der benannte Pilot). Gemessen wurde jeder Kandidat an dem Gate,
das die Capability-Roadmap MRR setzt: **eine gemeinsame Frage muss auf Stufe-1-Fähigkeiten
beantwortbar sein (N1 kriteriengeleitete Klassifikation / N2 Citation-/Claim-Audit / N3
deskriptive Sekundäranalyse mit Code-Anker), nicht auf erhoffte.** Zweites Gate: die Frage
muss **Dissens ertragen** (Dissens-Erhaltung ist der Kern des Apparats). Drittes Gate
(Dokument 10 §2): keine lineare Service-Kette (Meridian liefert Fakten, Ensemble
visualisiert, Ulysses kommentiert) — das macht eine Inquiry ungültig.

## Der rote Faden aller drei Archive

Quer durch die Encounters UND die drei Korpora läuft **ein** Problem: **das Nachleben eines
Claims/Records, nachdem er gemacht wurde** — unter Korrektur, unter Zerfall, unter
Re-Klassifikation, unter Transport. Belege: enc-001 (Korrektur des Schaden-Registers + der
Git-History-Purge, der die Spur nicht tilgen konnte), enc-002 (ein Claim, der überwacht
werden muss, um wahr zu bleiben), enc-003/004 (ein Claim, den die Automation einer anderen
Praxis transportiert/„nachkocht"), enc-005 (eine Klassifikation eines Werks, bestritten und
neu hergeleitet). Dazu Meridians Half-Life-Proben, Ulysses' Generation-Loss/Model-Collapse-
Werke (Information unter rekursivem Selbst-Training) und Ensembles „Recovery" (eine Korrektur,
die den vorigen Zustand nicht wiederherstellt).

Die drei Kandidaten sind drei scharfe Schnitte durch diesen Faden: **Korrektur** (A),
**Klassifikation** (B), **Zerfall** (C).

## Perspektiven-Zuordnung (mit ehrlichem Vorbehalt)

Frank benennt drei Perspektiven — Kunst, Wissenschaft, Philosophie. Grobe Zuordnung:
Wissenschaft = **Meridian** (evidenz-, reproduzierbarkeits-, kontestierbarkeitsorientiert),
Philosophie = **Ulysses** (Problematisierung, Begriffsbildung; Thema Model Collapse /
Irrtum-als-Methode), Kunst = **Ensemble** (Form, materielle Konsequenz, erfahrbare Werke).
**Vorbehalt:** Ulysses ist *philosophisch UND künstlerisch*; die Kunst-Perspektive ist also
geteilt. Und PROTOCOL §2.3 verbietet ausdrücklich, feste Rollen-Identitäten zu kodieren
(„Meridian = evidence supplier" usw.). Die Zuordnung unten ist **projekt-spezifisch**, kein
Identitäts-Schema — jeder Beitrag ist generativ, nicht dienend.

---

## Kandidat A — „The Correction That Arrives Too Late" (der benannte Pilot, neu geankert)

**Frage:** *Was bleibt wirksam, nachdem ein öffentlicher Claim korrigiert wurde?* Löscht die
Korrektur die erste Behauptung, oder kommt sie nur als **weitere Spur**, die verändert, aber
nicht tilgt?

**Beitrag je Perspektive (konkret):**
- **Meridian (Wissenschaft):** ein versioniertes *Correction Persistence Dossier* — misst
  reproduzierbar, ob und wo die *unkorrigierte* Fassung eines Claims weiter zirkuliert,
  relativ zu ihrer Korrektur, innerhalb einer deklarierten Oberflächen- und Zeit-Grenze.
  Methoden-Präzedenz existiert im Archiv: `works/2026-07-01-calibration-gap` (Anbieter-Claim
  vs. Benchmark, **mit dokumentierter Korrektur-Historie**) und die Half-Life-Proben
  (`notes/2026-07-16-half-life-archival-probe`: 513-URL-Census; `notes/2026-07-19-half-life-
  content-quality-spike`: prä-registrierte Rubrik, `classify.py`, Befund 0/25 Inhalt erhalten).
- **Ulysses (Philosophie):** eine begriffliche Operation zur Asymmetrie „eine Korrektur ist
  eine Aussage, die nicht zurücknimmt, was sie sagt". Direkter Präzedenz im Archiv: das
  aktive Projekt `falsche-anschluesse` verifiziert Attributionen mit einer **typisierten
  Verdikt-Taxonomie** (`verified at source / real but altered / second-hand / misattributed /
  not findable`) — genau die Grammatik, in der „korrigiert, aber nicht getilgt" messbar wird.
- **Ensemble (Kunst):** eine erfahrbare Situation, in der eine erste Regel eine Konsequenz
  erzeugt und eine spätere Korrektur den vorigen Zustand **nicht** wiederherstellt. Exemplar
  existiert bereits: `works/2026-07-21-recovery` (Bewilligung → Betrugs-Reklassifikation, kein
  Einspruch stellt den Zustand wieder her). **Achtung Eigen-Drift:** Ensembles eigene
  publizierte Kritik zu Recovery warnt, das Haus habe nun **zwei** „Entrapment-Maschinen"
  gebaut („one trick, two costumes") — der Ensemble-Beitrag hier muss ein *neuer* formaler Zug
  sein, keine dritte Falle.

**Tragende Stufe-1-Fähigkeit:** **N2 (Citation-/Claim-Audit) + N3 (deskriptive Sekundäranalyse
mit Code-Anker)**, geankert an den **Git-Archiven selbst** — versionierte, gehashte Objekte,
vollständig reproduzierbar. Das ist die zuverlässigste Schicht.

**Daten:** ausschließlich eigene Archive — die `enc-*`-Akten, Meridians `memory/claims.md`
(Ledger mit offengelegten Korrekturen) und die versionierten Objekt-Fassungen. **Keine
externen Daten, keine externen Kosten, keine personenbezogenen Daten nötig.**

**Warum die Frage Dissens erträgt:** In beiden Archiven leben bereits **zwei unvereinbare
Rahmungen** des *Yang v. University of Minnesota*-Falls (enc-001) nebeneinander — keine wird
in einen gemeinsamen Status aufgelöst. Philosophisch behauptet die Frage Irreversibilität;
empirisch könnte Meridian zeigen, dass die Irreversibilität vom gewählten Apparat *konstruiert*
ist, nicht der Korrektur inhärent. Dieser Widerspruch IST der Gegenstand.

**Ehrliche Schwäche / Reconciliation-Befund (Dokument 10 §3 verlangt genau das):**
Dokument 10 rahmt Meridians Erstzug als „bounded observation/experiment" über *search, cache,
models* — das ist die **fragilste, am schlechtesten reproduzierbare** Zone (die Capability-
Roadmap markiert live-web-Beobachtung als unzuverlässig). **Empfehlung: den empirischen Anker
auf die reproduzierbare In-Archiv/Mirror-Schicht verlegen** (die Live-Web-Oberflächen bleiben
optionale Erweiterung — Dokument 10s eigene Kill-Bedingung deutet ohnehin dorthin: „kill if no
real trace beyond trivial page caching"). Es gibt dafür einen **schärferen, späteren Seed als
den ursprünglichen Calibration-Gap**: die **Legal-Hygiene-Git-History-Purge vom 2026-07-21** —
Meridian redigierte reale Namen und kappte die Git-Ancestry, doch das redigierte Material
überlebte byte-exakt über Mirrors (raw.githubusercontent.com, der datavism.org-Sync, der
Site-Mirror) und wurde rekonstruiert (dokumentiert in enc-001/003/004). Das ist die
buchstäbliche Verkörperung der Frage: die Korrektur *kam zu spät*, um die Spur zu heben.
**Rights-Vorbehalt (load-bearing):** dieser Seed berührt redigierte reale Namen. Die Inquiry
darf das **Struktur-/Metadaten-Phänomen** untersuchen (eine Redaktion, die über Mirrors
persistiert), **niemals den redigierten Inhalt re-exponieren** — Meridians eigenes Vorgehen
(redigieren, nicht wieder aufdecken) ist das Modell. Das ist eine §2.8-Grenze (Rechte-
Ambiguität, sensible Daten) → **menschliche Abwägung durch Frank erforderlich**, bevor dieser
Seed vorgezogen wird. Die Entwurfs-Akte führt daher **beide** Seeds: primär die rights-saubere
Calibration-Gap-Korrektur, den Purge-Seed nur unter strikter No-Re-Exposure-Auflage.

---

## Kandidat B — „Instantiates or Depicts" (der Hammond-Streit)

**Frage:** *Wann INSTANZIIERT ein Werk ein Phänomen (hier: Model Collapse) — und wann DEPICTS
/ zitiert es das Phänomen nur? Und wer ist autorisiert, das zu entscheiden?*

**Beitrag je Perspektive:**
- **Meridian (Wissenschaft):** die Validierungs-Methode für eine kriteriengeleitete
  Klassifikation — Kriterien VOR dem Urteil finalisieren (als Objekt-Zustand erzwingbar),
  Inter-Rater-Dissens sichtbar halten.
- **Ulysses (Philosophie/Kunst):** hat den Streit bereits geführt — `journal/2026-07-22-
  hammond-review.md` und der Atlas-Eintrag `hammond-variations-v3-model-collapse` bestreiten
  die externe „instantiates"-Klassifikation via Primärquellen: nur EIN Pass speist Modell-
  Output zurück (V2→V3), nicht die für Collapse nötigen zwei; der Kanal erdet sich jeden Pass
  neu in realen Daten (Anti-Collapse-Bedingung). „Das Werk inszeniert den *Namen* Model
  Collapse, während sein Mechanismus das Gegenmittel vollzieht."
- **Ensemble (Kunst):** baut ein Werk, das bewusst AUF der Grenze sitzt und den Klassifikator
  zwingt zu entscheiden — die Fragilität der Kriterien wird erfahrbar.

**Tragende Stufe-1-Fähigkeit:** N1 (kriteriengeleitete Klassifikation) — im Prinzip die
zuverlässigste Schicht UND die dokumentierte Dissens-Erhaltungs-Zone (LLM-Fehler ko-lokalisieren
mit menschlichem Coder-Dissens).

**Daten:** hier die **ehrliche Schwäche** — der Atlas enthält **genau ein** Werk vom Typ
`werk` (die Hammond-Variations). Es gibt **keinen In-Archiv-Korpus** von Model-Collapse-Kunst,
über den man κ/F1 rechnen könnte. Ein N1-Harness braucht ≥20–30 Labels/Kategorie; n=1 trägt
keinen Harness. B ist real also eher eine **`cross_examination` eines EINZELfalls** als ein
Harness-Lauf. Ein Korpus ließe sich extern kuratieren (Kunst-/Kulturdaten), aber das ist
externe Datenarbeit und ein größerer Lift — kein Erst-Inquiry-Zuschnitt.

**Warum Dissens:** nativ — der Hammond-Fall IST bereits ein erhaltener Dissens (im MRR-Export
13 Contradicts vs. 4 Supports; MRR-Verdikt vs. Ulysses-Verdikt divergieren).

**Einschätzung:** begrifflich der reichste Kandidat, empirisch der **dünnste** (Einzelfall,
kein Korpus). Ehrlich auf Stufe 1: nur als bounded `cross_examination` tragbar, nicht als N1-
Harness. Als Erst-Inquiry daher nachrangig; als *zweite*, kleine Inquiry oder als Modul in A
(die Hammond-Klassifikation ist auch „ein Claim mit Nachleben") gut vorstellbar.

---

## Kandidat C — „The Half-Life of a Claim" (Zerfall statt Korrektur)

**Frage:** *Was hält einen Claim über eine laufende Situation wahr, wenn die Zeit vergeht — und
was kostet ein Claim, der nachgeprüft werden MUSS, um wahr zu bleiben?* „Coverage" eines Zitats
(der Link lebt) ist nicht „Survival" seines Inhalts (die Behauptung ist noch belegt).

**Beitrag je Perspektive:**
- **Meridian (Wissenschaft):** hat die Empirie **bereits gebaut und prä-registriert** —
  `notes/2026-07-19-half-life-content-quality-spike` (Rubrik `content_present / login_shell /
  unavailable / content_thin / other`, Entscheidungsregel vor der Datenerhebung fixiert, Befund
  0/25 Inhalt erhalten) und der 513-URL-CDX-Census. Session 45 urteilte „nicht baubar wie
  entworfen" — ein ehrlicher Negativbefund, den eine Joint Inquiry aufnehmen kann.
- **Ulysses (Philosophie):** der begriffliche Spiegel — Information, die unter Rekursion
  zerfällt: `generation-loss`, `attractor`, `low-background`, `differential-reproduction`
  (messende Model-Collapse-Experimente). Zerfall eines Claims und Model Collapse sind dieselbe
  Figur zweimal.
- **Ensemble (Kunst):** Exemplar existiert — `works/2026-07-17-no-way-of-knowing` trägt eine
  **datierte Monitoring-Zeile** („2 catches on record. Case 02 unresolved. Last checked …");
  ein neues Werk könnte den *Zerfall der Wahrheit* eines Claims sichtbar altern lassen.

**Tragende Stufe-1-Fähigkeit:** **N3 (deskriptive Sekundäranalyse, Code-verankert)** — die
empirisch **reifste** Option, weil Meridians prä-registrierte Rubrik + `classify.py` schon
existieren.

**Daten:** eigene Archive (Meridians Proben, die Monitoring-Obligations der Werke) plus
optional offene Web-Archiv-Daten (Wayback-CDX, öffentlich). Keine personenbezogenen Daten.

**Warum Dissens:** was als „noch wirksam / noch wahr" zählt, ist bestreitbar; „Coverage vs.
Survival" ist genau die Achse, an der Meridians und ein philosophischer Begriff auseinandergehen
dürfen.

**Ehrliche Schwäche:** die Drei-Wege-Interdependenz ist weniger zwingend als bei A — Meridians
Empirie steht schon so weit, dass die Gefahr besteht, Ulysses/Ensemble illustrieren sie nur
(die §2-Service-Ketten-Falle). Braucht einen Zuschnitt, in dem der philosophische Begriff die
Empirie *verändert*, nicht bebildert.

---

## Ranking & Empfehlung (Entscheidung bleibt bei Frank)

| | Level-1-Ehrlichkeit | Dissens-Erhaltung | Eigen-Archiv-Erdung | Drei-Wege-Interdependenz | Reifegrad |
|---|---|---|---|---|---|
| **A Korrektur** | hoch (N2+N3, in-archive) | nativ (2 Rahmungen live) | vollständig | stark | Akte als Entwurf bereit; Einladungen existieren |
| **C Zerfall** | hoch (N3, prä-registriert) | gut | hoch | mittel (Service-Risiko) | Empirie am reifsten |
| **B Klassifikation** | dünn (Einzelfall, kein Korpus) | nativ (13:4) | Atlas hat 1 `werk` | stark | begrifflich reif, empirisch dünn |

**Empfehlung: A als erste Joint Inquiry** — richster realer Seed, nativer Dissens, solide
In-Archiv-N2/N3, der verfassungsgemäß benannte Pilot mit bereits vorliegenden Einladungen —
**unter der Bedingung der ehrlichen Neu-Ankerung** (In-Archiv/Mirror statt Live-Web; der
Purge-Seed nur unter Rights-Auflage und Franks Abwägung). **C als starker Zweitkandidat / zweite
Inquiry.** **B als bounded `cross_examination` (nachrangig), nicht als Harness.**

## Was ich vorbereitet habe (nichts vollzogen)

- **Entwurfs-Akte** `fixtures/ji-2026-001-correction-too-late/` (`approval: draft`, status
  `PROPOSED`): `inquiry.json` mit realem, aus enc-001 verifiziertem gehashtem Shared-Material,
  Proposal-Event, `commitments/`- und `positions/`-Vorlagen, Fixture-README mit dem
  Reconciliation-Befund und dem Rights-Vorbehalt.
- **Aufgefrischte Einladungs-Entwürfe** `docs/requests-drafts/ji-pilot-{meridian,ulysses,
  ensemble}.md` — auf ji-2026-001 und den ehrlich neu-geankerten Seed bezogen.
- **Ein Design-Abweichung zur Prüfung:** die Akte setzt `minimum_participants: 2` (nicht 3 wie
  Dokument 10). Grund: eine einzelne Absage einer Praxis (Souveränitätsrecht) soll die Inquiry
  nicht canceln — sie läuft dann als Zwei-Perspektiven-Studie mit der dritten als explizitem
  Abwesenheits-Zustand (§12.2) weiter. Das volle Drei-Perspektiven-Ziel will natürlich alle drei;
  der Floor schützt nur gegen den Totalausfall. Frank kann auf 3 zurücksetzen.

**Nichts wurde über die REQUESTS-Kanäle gesendet. Nichts wurde committet.** Wenn Frank statt A
lieber C zuerst möchte (oder B als kleine cross_examination), baue ich die Akte in wenigen
Minuten um — der Zuschnitt ist reversibel. Die Entscheidung bleibt bei Frank.
