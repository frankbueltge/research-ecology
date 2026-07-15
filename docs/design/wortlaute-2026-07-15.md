# Wortlaute — Architektur & Vorschläge (2026-07-15 abends)

Franks Frage: „Müssen die statisch sein, oder können die auch passend zur jeweiligen
Karte geschrieben werden?" — Antwort: **Beides existiert, und die Grenze verläuft
genau zwischen Grammatik und Erzählung.**

## 1. Die Zwei-Schichten-Regel

| Schicht | Beispiele | Verhalten | Freigabe |
|---|---|---|---|
| **Grammatik-Wortlaute** (Teil des Zeichensystems) | Datenkanten-Formeln, Positions-Formel, Legenden-Texte, Chip-Texte | **STATISCH pro Oberfläche** — ein Wortlaut pro Zeichen, unter Testschutz (Protokoll-Prinzip: Test-Strings nie aufweichen). Ihr Sinn wird situativ durch die DATEN, nicht durch Umformulierung. Wiedererkennung = Orientierung. | einmal (jetzt) |
| **Erzähl-Wortlaute** (redaktionelle Ebene) | Headline, Stations-Überschriften, Statuszeile, Karten-Headlines | **PRO BEGEGNUNG/KARTE neu geschrieben** (the-middle-editorial), immer `approval: pending` bis Frank freigibt. Die 6 Überschriften gelten NUR für enc-2026-001; enc-002 bekommt eigene. | pro Stück |
| (Dritte Schicht: **Daten-Zitate** — byte-genau aus den Repos, niemand „schreibt" sie) | Beat-Zitate, Profiltexte, Kill-Gründe | unantastbar | keine (nur Quelle) |

## 2. Vorschläge — Datenkanten-Formeln (Grammatik, statisch)

Alle vier als EINE Familie: Präsens, unvollendet, Material-Substantiv. Drei sitzen
schon; die Middle-Formel ist der technische Ausreißer („as-of edge · data ends here").

| Oberfläche | VORSCHLAG | Status |
|---|---|---|
| Middle | **„here ends what the ledger knows"** (+ as-of-Datum als kleines Randnotat) | NEU statt „as-of edge · data ends here" |
| Atelier | „tonight's page is not yet written" | bleibt |
| Field | „the pen has not lifted" | bleibt |
| Studio | „the next bill is not yet printed" | bleibt |

## 3. Vorschlag — Positions-Formel (Grammatik, statisch; Werte bleiben wörtlich)

Bisher: `Position in this encounter: {orientation}` / `Accountability: {question}`.
Die zweite Zeile trägt eine volle FRAGE — das Label soll das ausspielen:

> **Position in this encounter:** philosophical and artistic research practice
> **Held accountable to:** “What problem is being produced here, which assumptions
> organise it, and what changes through the artistic operation?”

„Held accountable to:" statt „Accountability:" — die Frage wird als Frage gerahmt,
bleibt wörtlich aus dem Profil. Formel statisch, Draft-Chip unverändert.

## 4. Stations-Überschriften enc-2026-001 (Erzählung, nur dieses Stück)

Bestand hält der Prüfung stand; eine Konsistenz-Korrektur vorgeschlagen:

1. „An instrument, under conditions." — bleibt
2. „A work takes it on — conditions included." — bleibt
3. „The receiver declines the most spectacular case." — bleibt
4. **„The correction flows upstream."** — VORSCHLAG statt „…backwards." (die Karte
   sagt „correction · upstream ↑"; Erzählung und Zeichenschlüssel sollten dasselbe
   Wort benutzen — ein Vokabular, weniger Umrechnen beim Leser)
5. „The source re-examines itself." — bleibt
6. „Two readings remain. Both stand." — bleibt (die stärkste Zeile)

Künftige Begegnungen: Überschriften werden je Encounter neu geschrieben (editorial,
pending) — Stil-Leitplanke: kurz, konkret, keine Metaphern ohne Datendeckung, das
Zitat trägt die Beweislast, die Überschrift nur die Neugier.

## 5. Status

Wartet auf Franks Entscheid zu §2 (Middle-Formel), §3 (Held accountable to),
§4 Punkt 4 (upstream). Alles andere: Freigabe des Bestands wie gelistet.
Nach Entscheid: Grammatik-Formeln unter Testschutz stellen (Work-Order-Punkt für
das jeweilige Verdrahtungs-Paket).
