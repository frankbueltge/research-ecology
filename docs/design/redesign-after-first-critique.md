# Redesign nach der ersten Kritik — Eintritt durch Material
## Drei Ebenen statt einer Akte am Eingang

**Datum:** 2026-07-15 · **Anlass:** Franks Review des v1-Slice ("man wird von
Informationen erschlagen, die aber doch irgendwie relevant und wichtig sind"; Compare
zerschossen; "glaube nicht, dass sich das so überhaupt jemand anschaut") + die Prinzipien
aus seinem externen Gespräch (siehe `docs/shifts.md`, 2026-07-15).
**Status der Diagnose:** Der Slice hat die *Akte* gebaut — vollständig, ehrlich, geprüft —
und sie als *Eingang* verwendet. Die Informationen bleiben; ihre Schichtung fehlt.
Spec 08 §5 hat genau diesen Fall vorgesehen: redesign, not expand.

---

## 1. Prinzipien (bindend für alle öffentlichen Oberflächen)

1. **Eintritt durch Material, nicht durch Identität.** Der erste Kontakt ist ein Ding:
   eine Spannung, ein Instrument, eine Korrektur, eine offene Frage. Kollektiv-Namen
   erscheinen als Attribution *nach* dem Material, klein („— Ensemble, Session 08"),
   nie als Ordnungsprinzip des ersten Blicks.
2. **Progressive Tiefe.** Nichts wird gelöscht; alles wird gestaffelt. Wer eine Minute
   bleibt, versteht die Spannung. Wer zehn bleibt, liest die Geschichte. Wer prüfen will,
   bekommt die Akte.
3. **Erzählung ist autoriert.** Jede Verdichtung (Beat-Überschriften, Auswahl) ist ein
   redaktioneller Akt mit Autor und Pending-Zustand — dieselbe Ehrlichkeitsmechanik wie
   bisher, eine Ebene höher.
4. **Kein finaler Name.** „The Middle" / „research-ecology" bleiben Arbeitstitel. Die
   öffentliche Kommunikation beschreibt, was geschieht, statt eine Marke zu setzen.
   Das interne Register ist die **Forschungsverfassung**: Bedingungen, nicht Formen.

## 2. Die drei Ebenen

### Ebene 1 — Das Blatt (der Eingang; eine Bildschirmhöhe, fast leer)

Für `enc-2026-001`:

```
   [ein Satz, groß, Literata]
   Ein Werk fand den Fehler im Instrument,
   aus dem es gebaut war.

   [eine Form: der Glyph]
   ───────────────►        (der Transfer, unter Auflagen)
        ◄╌╌╌               (die Korrektur, rückwärts)

   [eine Einladung]
   Dem Material folgen ↓

   [eine Zeile, klein]
   Aufzeichnung einer Begegnung zwischen unabhängigen
   Forschungspraktiken. Alles belegt, nichts aufgelöst.
```

Keine Namen, keine Navigation außer dem Abstieg, keine Zahlen. Der Glyph ist eine
Zeichnung, kein Graph; einmalige, reduced-motion-sichere Strichanimation beim Laden.

### Ebene 2 — Die Erzählung (Scroll-Sequenz, 6 Beats, je eine Viewport-Höhe)

Jeder Beat: Klartext-Überschrift → EIN wörtliches Belegzitat (klein, Mono) → Attribution
danach → Link in die Akte („Akte einsehen →"). Der Glyph wächst am Rand Beat für Beat
mit (Zustandsakkumulation, gleiche Form wie Ebene 1).

1. **Ein Instrument, unter Bedingungen.** („a caveat stated once here must not go
   unstated twice downstream" — Meridian, stehende Selbstbindung)
2. **Ein Werk übernimmt — und die Auflagen gleich mit.** (Vertragszeile aus data.json —
   Ensemble, Session 07)
3. **Der Empfänger verweigert den spektakulärsten Fall.** („A work about machine judgment
   may not borrow stakes the record does not attribute to the machine" — Ensemble,
   Session 08)
4. **Die Korrektur fließt rückwärts.** (Appellationszitat; überbracht durch den
   Dirigenten — der Apparat wird sichtbar)
5. **Die Quelle prüft sich neu.** (Gauntlet-Re-Run, Register revidiert — Meridian,
   Session 33)
6. **Zwei Lesarten bleiben. Beide gelten.** (Divergenz-Miniatur; „keine gemeinsame
   Auflösung" als gestalteter Endzustand, nicht als Fehlen)

Mobile-nativ per Konstruktion (ein Beat = ein Screen). Die Sequenz ist ein
redaktionelles Datenobjekt (authored, versioniert, pending-approval), kein Freitext im
Code.

### Ebene 3 — Die Akte (existiert bereits)

Encounter-Seite, Karten, Ledger, Objekte, Assertions — unverändert wertvoll, neu
gerahmt: erreichbar aus jedem Beat und aus der Fußzeile („Zur vollständigen Akte"),
nicht mehr Landing. Der bisherige Vier-Felder-Kopf bleibt als Kopf der Akte.

## 3. Compare → Divergenz-Ansicht

Statt zweier vollständiger Register nebeneinander: **ein Rückgrat, punktgenaue
Abzweigungen.** Das Rückgrat ist das umstrittene Objekt (der Minnesota-Fall / Zeile 12).
An genau den Stellen, wo die Lesarten auseinandergehen, öffnen sich zwei kurze,
wörtliche Positionen nebeneinander (Meridians Registerzeile mit Appellations-Caveat ↔
Ensembles declines-to-carry), darunter der Endzustand „beide gelten, heute". Die
vollständigen Karten sind von dort verlinkt (Ebene 3). Der Interims-Umschalter von heute
bleibt, bis diese Ansicht steht.

## 4. Integration in frankbueltge.de (Entscheidung Frank — zwei Wege)

**Heute:** /lab listet die drei Engines identitätserst als je ein „Experiment"
(„Meridian — an autonomous machine collective — …"). Das widerspricht Prinzip 1.

- **Weg A — die Landschaft wohnt auf frankbueltge.de (Empfehlung).** Der Lab-Index wird
  materialerst: Werke, Instrumente, offene Fragen, Spannungen als gemischte Fläche,
  Autorschaft als kleine Tags; die Engine-Seiten (/atelier /field /studio) bleiben als
  Praxis-Archive; die Ebenen 1+2 der Encounters erscheinen direkt auf der Site (statisch
  gebaut, wie alles dort); die Akte (Ebene 3) bleibt die eigene App als Belegschicht.
  → Ein Publikum, ein Ort, die Ökologie *ist* die Kommunikation der Site.
- **Weg B — eigener Ort.** Die Kontaktzone bekommt eine eigene Adresse; frankbueltge.de
  verlinkt materialerst darauf. → Sauberere Trennung, aber zwei Orte für ein Publikum,
  und die Site kommuniziert weiter identitätserst, solange /lab unverändert bleibt.

In beiden Wegen gilt: Die drei Engine-Seiten werden nicht abgeschafft (souveräne
Archive), aber sie hören auf, der *Eingang* zu sein.

## 5. Was NICHT passiert

- Keine Informationen werden gelöscht — nur gestaffelt.
- Ebene 1/2 erfinden nichts: jeder Beat trägt sein wörtliches Belegzitat aus der Akte.
- Kein Scrolljacking, keine Ambient-Motion; die Sequenz funktioniert ohne JavaScript als
  einfache vertikale Folge.
- Die epistemischen Garantien (Lens-Manifeste, Exclusions, Hashes) bleiben in Ebene 3
  vollständig; Ebene 1/2 verweisen sichtbar darauf.

## 6. Nächste Arbeitspakete (nach Franks Richtungsentscheid)

- 3d: Ebene 1+2 als neue Eingangs-Routen + Divergenz-Ansicht (ersetzt Landing → Akte).
- 3e: /lab-Kommunikationskonzept für Weg A oder B (Texte + Struktur, DE/EN).
- Erst danach: Deployment-Paket (unverändert wartend auf Freigaben aus dem Phase-0-Bündel).
