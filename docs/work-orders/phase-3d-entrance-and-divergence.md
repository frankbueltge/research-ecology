> **status: HISTORICAL** (implementation brief of its date, banner added 2026-07-24) — kept as
> audit trail; the work it ordered has shipped or been superseded. For what is current, see
> README.md, `docs/shifts.md` and the dated `docs/design/` decisions.

# Work Order — Phase 3d: Das Blatt, die Erzählung, die Divergenz-Ansicht

**Scope:** neuer Eingang der The-Middle-App nach
`docs/design/redesign-after-first-critique.md` (§1–§3, bindend) und dem
„spektakulär"-Mandat aus `docs/design/site-restructure-concept.md` §3.
Repo: `/Users/frankbultge/Documents/GitHub/research-ecology`. Alle bestehenden Tests
bleiben grün.

## 0. Routen-Umbau (locked)

- `/` (beide Locales) rendert NEU **das Blatt** (Ebene 1) und scrollt in **die Erzählung**
  (Ebene 2) — kein Redirect mehr auf die Akte.
- Die bisherige Encounter-Seite bleibt unter `/encounters/[id]` als **Akte** (Ebene 3);
  ihr H1-Kicker wird „AKTE / RECORD" statt „ENCOUNTER".
- `/encounters/[id]/compare` wird die **Divergenz-Ansicht** (Design §3); der heutige
  Umschalter-Stand bleibt als Unterabschnitt „Vollständige Karten" verlinkt erhalten
  (keine Löschung, Demotion).

## 1. Das Blatt (Ebene 1) — spektakulär, fast leer

- Vollbild (100dvh), Papier/Ink-System, Display-Typo: der Satz in Literata,
  `clamp(2.5rem, 9vw, 7.5rem)`, max. 3 Zeilen, DE/EN nach Locale:
  - DE: „Ein Werk fand den Fehler im Instrument, aus dem es gebaut war."
  - EN: "A work found the flaw in the instrument it was built from."
- Darunter der **Glyph** als Inline-SVG, einmalige Selbstzeichnung beim ersten Viewport-
  Eintritt (stroke-dashoffset, ~2.4s, `prefers-reduced-motion` ⇒ sofort fertig gezeichnet):
  eine lange Transferlinie links→rechts (Ink), darunter versetzt ein kürzerer
  Korrektur-Pfeil rechts→links (Terrakotta, gestrichelt). Keine Loops, nichts pulsiert.
- Eine Einladung (Mono, klein): DE „Dem Material folgen ↓" / EN "Follow the material ↓" —
  scrollt zu Beat 1.
- Eine stille Fußzeile (eine Zeile): DE „Aufzeichnung einer Begegnung zwischen
  unabhängigen Forschungspraktiken. Alles belegt, nichts aufgelöst." / EN "The record of
  an encounter between independent research practices. Everything evidenced, nothing
  resolved."
- KEINE Kollektiv-Namen, keine Zahlen, keine weiteren UI-Elemente über dem Falz; das
  Menü bleibt als schmale, stille Kopfzeile erhalten (bestehende Chrome).

## 2. Die Erzählung (Ebene 2) — sechs Beats, authored content (locked, verbatim)

Implementierung: die Beats sind ein redaktionelles Datenobjekt
(`narratives/enc-2026-001.json`, schema-frei aber validiert im Code), authored_by
`the-middle-editorial`, `approval: "pending"` — der Pending-Badge erscheint dezent am Ende
der Sequenz, nicht auf jedem Beat. Jeder Beat: eine Viewport-Höhe (min-height, natürliches
Scrollen, KEIN Scrolljacking), Klartext-Überschrift (Literata, groß), EIN wörtliches
Belegzitat (Mono, eingerückt, mit AuthoredStroke), Attribution NACH dem Material (klein),
Link „Akte einsehen →" auf das jeweilige Ziel. Am Rand wächst der Glyph als
Zustands-Miniatur mit (statisch pro Beat, kein JS nötig).

Inhalte (DE / EN Überschriften von mir autorisiert; Zitate MÜSSEN wörtlich aus Fixture
oder — wo nötig — per `git show` aus den Quell-Repos verifiziert werden; bei Abweichung
STOP und melden):

1. **„Ein Instrument, unter Bedingungen." / "An instrument, under conditions."**
   Zitat: "a caveat stated once here must not go unstated twice downstream" —
   Attribution: „stehende Selbstbindung der Quelle, Session 22" → Akte: contract.published.
2. **„Ein Werk übernimmt — und die Auflagen gleich mit." / "A work takes it on — conditions
   included."** Zitat: "Live status travels; load-bearing caveats survive re-voicing;
   corrections flow upstream, never silently sideways" — „Übernahmevertrag im Werk selbst,
   Session 07" → Akte: object.admitted.
3. **„Der Empfänger verweigert den spektakulärsten Fall." / "The receiver declines the most
   spectacular case."** Zitat: "A work about machine judgment may not borrow stakes the
   record does not attribute to the machine" — „Begründung im Werk, Session 08" → Akte:
   translation.loss_declared.
4. **„Die Korrektur fließt rückwärts." / "The correction flows backwards."**
   Zitat: "Although the panel did not rely on AI-detection evidence, it credited graders'
   ability to identify AI-written work, pointed to irrelevant sources that raised concerns
   about AI use, and cited [the student]'s lack of citations, repeated excuses, and inconsistent
   testimony." — „vom Werk ins Quellarchiv gemeldet, überbracht durch den Dirigenten" →
   Akte: correction.issued.
5. **„Die Quelle prüft sich selbst." / "The source re-examines itself."**
   Zitat (aus Fixture-Event correction.applied bzw. claims-row-12, verifizieren): "Arrived
   as the collective's first downstream correction report" — „Register revidiert nach
   erneutem Prüf-Durchlauf, Session 33" → Akte: correction.applied.
6. **„Zwei Lesarten bleiben. Beide gelten." / "Two readings remain. Both stand."**
   Kein Zitat, sondern die Divergenz-Miniatur: links Meridians Rahmung ("a
   detector-in-the-accusation observation, not court-attributed detector harm"), rechts
   Ensembles Verweigerungsband; darunter die offene Linie + DE „keine gemeinsame
   Auflösung" / EN "no shared resolution" → Link zur Divergenz-Ansicht UND zur Akte.

## 3. Divergenz-Ansicht (ersetzt Compare als Primärform)

Rückgrat: der Minnesota-Fall (Objekt claims-row-12 + Ensembles boundary case). Aufbau:
1. Kopf: „Ein Fall, zwei Register" / "One case, two registers", eine Zeile Kontext.
2. Das Rückgrat als vertikale Spur (Mono): die Fall-Fakten, die BEIDE Seiten teilen
   (Fallname/Caption, Daten, Appellationsbefund-Zitat) — einmal, nicht doppelt.
3. GENAU an den Abzweigpunkten öffnen sich zwei kurze Positionen nebeneinander
   (Grid 2×, bei <64rem untereinander): Meridians Registerzeile (mit Appellations-Caveat,
   struck-not-erased-Overlay) ↔ Ensembles declines-to-carry (Terrakotta-Band). Nur die
   Divergenz, je ≤6 Zeilen, beide mit „view authored assertion →".
4. Endzustand: offene Linie, „beide gelten, heute" / "both stand, today", Datum/Watermark.
5. Fußbereich „Vollständige Karten": der bestehende Umschalter mit beiden Karten
   (heutiger Interims-Stand), eingeklappt/nachgeordnet.

## 4. Tests (ergänzend; alle bestehenden bleiben grün)

- Blatt: axe light+dark; no-JS (Glyph statisch fertig, Sequenz erreichbar); reduced-motion
  (keine Zeichnung); mobile 390px (Satz bricht sauber, kein Overflow); Screenshot
  light+dark.
- Erzählung: alle 6 Beat-Zitate stammen wörtlich aus Fixture/Quell-Repos (Test vergleicht
  gegen die Fixture-Payloads); Attribution folgt dem Zitat im DOM; jeder Beat verlinkt in
  die Akte; kein Kollektiv-Name erscheint im DOM vor Beat 1 (Identitäts-Rezession als
  Test!).
- Divergenz: geteilte Fakten erscheinen genau einmal; beide Positionen wörtlich; kein
  Merge-Text; „no shared resolution" vorhanden; Screenshot light+dark.
- Poster-Performance: `/` SSR, LCP-Element ist der Satz (kein Bild), keine externen
  Requests.

## 5. Grenzen

Engine-Repos read-only; `docs/spec/` unberührt; keine neuen Runtime-Dependencies; kein
Scrolljacking/keine Scroll-Libraries; keine KI-Produkt-Credits; nicht committen. Bei
Zitat-Abweichung oder Design-Konflikt: STOP und melden. Abschlussbericht: Dateiliste,
Test-Summaries, Screenshot-Pfade (Blatt hell/dunkel, Beat 3, Divergenz), Diskrepanzen —
Rohdaten.
