# Impulse — Besucher schreiben sich ein
## Design-Skizze als Auftakt der nächsten Design-Session · 2026-07-16 · Status: SKIZZE (nichts entschieden außer der Absicht)

**Franks Absicht (2026-07-16 vormittags, wörtlich sinngemäß):** ein Feature, „bei dem Impulse
von außen kommen und User oder Websitebesucher mitentscheiden können, wohin die Reise geht,
und somit auch Teil des Werks werden und sich quasi in die Geschichte des Werks einschreiben."
Frank hat der Skizze zugestimmt („ok"); Bauen ist Phase D (erster echter Schreibfall der
Ökologie — hier beginnt ADR 0005s „writeable federation", hier wird ADR 0006s Neon real).

## 1. Die eine tragende Idee: der Impuls ist ein Angebot, kein Kommentar

Die Verfassung hat die Form dafür schon: **Angebote unter Bedingungen, die eine souveräne
Praxis annehmen, ablehnen oder beschweigen darf** (spec/02 §9 — dieselbe Grammatik wie Franks
Seeds in REQUESTS.md). Ein Besucher-Impuls ist ein solches Angebot von außen:

- Kein Voting, das eine Praxis bindet („mitentscheiden" heißt: die Reise ändern KÖNNEN,
  nicht sie steuern — sonst wäre die Praxis ein Automat mit Publikums-Fernbedienung).
- Angenommene Impulse werden **Ereignisse im Ledger** — zitierbar, mit eigenem Zeichen,
  im Session-Journal erwähnt. DAS ist das Einschreiben in die Werkgeschichte: nachprüfbar
  im Register, nicht behauptet in einer Kommentarspalte.
- Abgelehnte/beschwiegene Impulse bleiben im Record (Ablehnung ist legitimer Zustand,
  Verfassungs-Leitplanke 9) — aber sie werden nicht Teil des Werks.

**Glücksfall Atelier:** Ulysses' Protokoll (v3, „The Atlas and the swerve") nennt als
Swerve-Quelle bereits wörtlich „a reader impulse (see REQUESTS.md)" — die Praxis hat das
Konzept eines Leser-Impulses also selbst schon im Vokabular. Der Vertical Slice (unten §5)
setzt genau dort an.

## 2. Ereignis-Familie (Vorschlag fürs Protokoll-Schema)

Neue Familie `impulse.*` im offenen Vokabular (Zeichengrammatik §2: Zuordnung über die
Familie; bis zur Abnahme eines eigenen Zeichens greift das dokumentierte Fallback):

| Ereignis | Bedeutung | Issuer |
|---|---|---|
| `impulse.offered` | Besucher reicht einen Impuls ein (Typ, Text/Verweis, Ziel-Praxis oder Ziel-Werk) | visitor (pseudonym) |
| `impulse.accepted` | Praxis nimmt an — mit Verweis auf die Session, die ihn aufnimmt | die Praxis |
| `impulse.declined` | Praxis lehnt ab, mit oder ohne Grund | die Praxis |
| `impulse.expired` | ohne Antwort nach definierter Frist archiviert (Schweigen sichtbar machen, nicht erzwingen) | Middle |

**Zeichen in der Partitur (Design-Session-Aufgabe):** ein eigenes Zeichen für `impulse.*` —
Vorschlag zum Zerreden: ein **kleiner offener Pfeil von außerhalb der Bahnen** (von unterhalb
der untersten Bahn kommend — Besucher haben keine eigene Bahn, sie sind kein Kollektiv;
der Pfeil endet als Punkt auf der Bahn der annehmenden Praxis erst bei `accepted`).
Nicht-Angenommenes bleibt außerhalb der Bahnen sichtbar — dieselbe Ehrlichkeit wie die Gasse
der Bühne.

## 3. Consent, Identität, Recht (Entscheidungen für Frank)

1. **Identität:** Vorschlag pseudonym — frei wählbares Handle (oder anonym), KEINE E-Mail-
   Pflicht, keine Accounts. Das Handle wird Teil des öffentlichen, unveränderlichen Registers
   → der Consent-Text muss genau das sagen („dein Impuls und dein Handle werden dauerhaft
   Teil eines öffentlichen Forschungsregisters; Impulse sind Angebote, kein Anspruch auf
   Aufnahme"). Keine PII im Ledger; IP/Technisches bleibt in der Queue-Schicht und wird
   nicht exportiert.
2. **Moderation (Freigabematrix A4):** Besucher-Inhalte sind Bedeutungsänderung. Vorschlag
   zweistufig: automatische Filter (Rate-Limit, Turnstile, Wortfilter) → **sichtbare Queue**
   (spec/08 §4, `import_records` existiert im Schema genau dafür) → Freigabe in die Inbox der
   Praxis. Wer freigibt (Frank manuell vs. enge Content-Policy automatisch), entscheidet die
   Session — A4 erlaubt beides, verlangt nur bewusste Autorisierung der Bedeutungsebene.
3. **Was der Besucher zurückbekommt:** eine permanente Impuls-URL (sein Registereintrag —
   „hier bin ich eingeschrieben"), Status sichtbar (offered/accepted/declined/expired).

## 4. Technik (bewusst klein — die Architektur existiert schon)

```
Besucher (Werk-/Praxis-Seite)
  → POST an Worker-Endpoint (Cloudflare, Turnstile, Rate-Limit)
    → Neon: import_records (Queue) → nach Freigabe: events (impulse.offered)   [ADR 0002/0006]
      → Digest-Job schreibt offene Impulse als Angebote in REQUESTS.md der Ziel-Praxis
        (der existierende Team-Kanal — die Engine liest ihre Inbox mit Bordmitteln)
        → Praxis antwortet in ihrer Session (Annahme/Ablehnung = Event zurück)
          → ecology-integrate exportiert wie gehabt: Git bleibt das Archiv,
            die Partitur zeigt den Impuls mit eigenem Zeichen
```

Neu zu bauen: der Endpoint, die Queue-Ansicht, der Digest-Job, das Zeichen, das kleine
Formular auf den Werkseiten. NICHT neu: Schema (db/0001 + import_records), Export-Kette
(seit heute automatisiert), REQUESTS-Kanal, Annahme-Grammatik, Freigabematrix.

## 5. Vertical Slice (Vorschlag für den ersten Ausbau)

**Eine Praxis, ein Impuls-Typ, einmal komplett durch:** das Atelier, Impuls-Typ
**Swerve-Angebot** — ein Besucher bietet EIN Außen-Element an (eine Quelle, ein Material,
eine Frage), als Kandidat für Ulysses' Clinamen. Warum dieser Slice: die Praxis kennt
Leser-Impulse als Swerve-Quelle bereits aus ihrem eigenen Protokoll; die Wirkung ist
maximal werkbildend (ein angenommener Swerve LENKT die Linie — „mitentscheiden, wohin die
Reise geht", in der stärksten verfassungskonformen Form); und der Umfang ist klein
(ein Formular, ein Ereignistyp, eine Inbox).

Abnahme-Kriterien des Slices: Impuls einreichen → in der Queue sehen → Freigabe → erscheint
in Ulysses' REQUESTS → Ulysses nimmt an oder lehnt ab (echte Session) → Ereignis im Ledger →
Zeichen auf der Karte → Besucher-URL zeigt den Status. Jeder Schritt nachprüfbar, kein
Schritt erfunden.

## 6. Was diese Skizze NICHT entscheidet

Wortlaute (alle Formulare/Texte: Design-Session + Franks Freigabe) · das endgültige Zeichen ·
Moderations-Tiefe · Fristen für `expired` · ob weitere Impuls-Typen (Richtungs-Votum,
Kommission ans Studio — dessen Protokoll kennt „a commission" als Session-Öffner) im ersten
Ausbau dabei sind · Neon-Region/Account (Franks Handgriff, ADR 0006 formal noch PROPOSED).
