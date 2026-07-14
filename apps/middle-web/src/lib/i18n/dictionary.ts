/**
 * Chrome string dictionary (work order §0 i18n): a minimal typed module, no framework.
 * Records themselves stay source-language (English) even inside `/de/...` pages — only the
 * surrounding chrome (nav, headings, labels, status words) is translated. German strings are
 * written as real, careful German (neutral register, no "du"), not machine-literal renderings
 * of the English (work order "Critical integrity rules").
 */

export interface Dictionary {
  common: {
    skipToContent: string;
    siteName: string;
    siteTagline: string;
    languageSwitch: string;
    themeLight: string;
    themeDark: string;
    themeToggleLabel: string;
    doorwayLead: string;
    doorwayRepo: string;
    doorwayCommit: string;
    doorwayCta: string;
    noSharedResolution: string;
    pendingApprovalLabel: string;
    draftAttribution: string;
    recordsStayEnglish: string;
    exclusionsLabel: string;
    unknownTypesLabel: string;
    lensManifestToggleHint: string;
    printCitationHint: string;
    yes: string;
    no: string;
  };
  nav: {
    encounter: string;
    compare: string;
    ledger: string;
    lenses: string;
    apparatus: string;
    archive: string;
    about: string;
  };
  encounter: {
    kicker: string;
    propositionHeading: string;
    propositionAuthorPrefix: string;
    offeredHeading: string;
    receiverActionHeading: string;
    disputedHeading: string;
    sourcesHeading: string;
    participantsHeading: string;
    roleSource: string;
    roleReceiver: string;
    roleConductor: string;
    statusHeading: string;
    obligationsHeldHeading: string;
    unresolvedObjectionsHeading: string;
    closureHeading: string;
    eventTraceHeading: string;
    eventTraceIntro: string;
    objectsHeading: string;
    obligationsHeading: string;
    mapsHeading: string;
    mapsIntro: string;
    compareCta: string;
    nonParticipationHeading: string;
    nonParticipationIntro: string;
    resolutionNoteHeading: string;
    sourceNoteHeading: string;
    openLensManifest: string;
  };
  event: {
    issuedBy: string;
    source: string;
    obligationsAcceptedHere: string;
    payloadExcerpt: string;
    gapHeading: string;
    gapBody: string;
  };
  object: {
    kicker: string;
    homeAddress: string;
    lifecycleStatus: string;
    epistemicStatus: string;
    interoperabilityClass: string;
    contentHash: string;
    sourceCommit: string;
    assertionsAboutHeading: string;
    noAssertions: string;
  };
  assertion: {
    kicker: string;
    authorLabel: string;
    predicateLabel: string;
    subjectLabel: string;
    objectLabel: string;
    rationaleHeading: string;
    evidenceHeading: string;
    statusLabel: string;
    epistemicStatusLabel: string;
    encounterContext: string;
  };
  lens: {
    kicker: string;
    authorLabel: string;
    purposeHeading: string;
    selectionHeading: string;
    exclusionsHeading: string;
    unknownTypePolicyLabel: string;
    rendererLabel: string;
    versionsHeading: string;
    viewMapCta: string;
    implementationHashLabel: string;
  };
  map: {
    kicker: string;
    manifestHeading: string;
    manifestAuthor: string;
    manifestBasis: string;
    manifestSelection: string;
    manifestExclusions: string;
    manifestUnknownTypes: string;
    manifestEngineVersion: string;
    manifestVersion: string;
    manifestHash: string;
    manifestWatermark: string;
    accessibleSummaryHeading: string;
    ruptureHeading: string;
    ruptureLead: string;
    citationHeading: string;
    citationUrl: string;
    citationHash: string;
    citationWatermark: string;
    printedOn: string;
  };
  compare: {
    kicker: string;
    intro: string;
    positionSwitcherLabel: string;
    showBoth: string;
  };
  apparatus: {
    kicker: string;
    intro: string;
    actorsHeading: string;
    actorId: string;
    actorName: string;
    actorKind: string;
    actorCollective: string;
    sentinelHeading: string;
    sentinelBody: string;
    pipelineHeading: string;
    pipelineBody: string;
    pinningHeading: string;
    pinningBody: string;
    analyticsHeading: string;
    analyticsBody: string;
    limitationsHeading: string;
    limitations: string[];
    authorshipHeading: string;
    authorshipBody: string;
  };
  archive: {
    kicker: string;
    intro: string;
    liveNotice: string;
    snapshotsHeading: string;
    snapshotCollective: string;
    snapshotFile: string;
    snapshotCommit: string;
    visitCta: string;
  };
  about: {
    kicker: string;
    propositionHeading: string;
    autonomyHeading: string;
    limitsHeading: string;
    limits: string[];
  };
  ledger: {
    kicker: string;
    intro: string;
    pageLabel: string;
    nextCta: string;
    prevCta: string;
  };
  poster: {
    headline: string;
    invitation: string;
    footnote: string;
  };
  narrative: {
    viewRecordCta: string;
    viewDivergenceCta: string;
    authoredByPrefix: string;
  };
  divergence: {
    kicker: string;
    heading: string;
    context: string;
    backboneHeading: string;
    appellateFindingLabel: string;
    meridianLabel: string;
    ensembleLabel: string;
    bothStandNote: string;
    fullMapsHeading: string;
  };
  footer: {
    apparatusLink: string;
    aboutLink: string;
    noAnalytics: string;
  };
}

const en: Dictionary = {
  common: {
    skipToContent: "Skip to content",
    siteName: "The Middle",
    siteTagline: "A public contact zone between independent research practices.",
    languageSwitch: "Deutsch",
    themeLight: "Light",
    themeDark: "Dark",
    themeToggleLabel: "Toggle colour scheme",
    doorwayLead: "This object lives at",
    doorwayRepo: "repository",
    doorwayCommit: "commit",
    doorwayCta: "Open at the source ↗",
    noSharedResolution: "No shared resolution — the participants' statuses stay distinct rather than being flattened into one.",
    pendingApprovalLabel: "pending approval",
    draftAttribution: "draft — pending Frank Bültge's approval",
    recordsStayEnglish: "Records on this page are shown in their original English; only this chrome is translated.",
    exclusionsLabel: "This view excludes",
    unknownTypesLabel: "unknown types",
    lensManifestToggleHint: "Press “m” to open or close the lens manifest.",
    printCitationHint: "Printing shows the citation block: URL, content hash and watermark.",
    yes: "yes",
    no: "no"
  },
  nav: {
    encounter: "Encounter",
    compare: "Compare",
    ledger: "Ledger",
    lenses: "Lenses",
    apparatus: "Apparatus",
    archive: "Archive",
    about: "About"
  },
  encounter: {
    kicker: "Record",
    propositionHeading: "Editorial proposition",
    propositionAuthorPrefix: "Proposed by",
    offeredHeading: "Who offered what",
    receiverActionHeading: "What the receiver did",
    disputedHeading: "What is disputed or unresolved",
    sourcesHeading: "Where the sources live",
    participantsHeading: "Participant positions",
    roleSource: "source",
    roleReceiver: "receiver",
    roleConductor: "conductor",
    statusHeading: "Current state",
    obligationsHeldHeading: "Obligations held",
    unresolvedObjectionsHeading: "Unresolved objections",
    closureHeading: "Local closure or next action",
    eventTraceHeading: "Event trace",
    eventTraceIntro: "A chronological, append-only record. Events are factual; interpretive labels appear separately.",
    objectsHeading: "Objects in this encounter",
    obligationsHeading: "Obligations",
    mapsHeading: "Local maps",
    mapsIntro: "Three authored lenses on this encounter. Switching lenses changes what is included, not just its colour.",
    compareCta: "Compare two positions",
    nonParticipationHeading: "Documented non-participation",
    nonParticipationIntro: "Not every collective in the lab is part of every encounter. This section names who is absent here and why — a documented non-relation, never an inferred refusal.",
    resolutionNoteHeading: "On the absence of a shared resolution",
    sourceNoteHeading: "A note on how this encounter began",
    openLensManifest: "Open lens manifest"
  },
  event: {
    issuedBy: "issued by",
    source: "source",
    obligationsAcceptedHere: "Obligations accepted here",
    payloadExcerpt: "Payload excerpt",
    gapHeading: "The two publication events",
    gapBody: "The studio's own graduation into its sovereign archive and the later site-gate republication are two distinct apparatus acts, not a duplicate of the same fact."
  },
  object: {
    kicker: "Object",
    homeAddress: "Home address",
    lifecycleStatus: "Lifecycle status",
    epistemicStatus: "Epistemic status",
    interoperabilityClass: "Interoperability class",
    contentHash: "Content hash",
    sourceCommit: "Source commit",
    assertionsAboutHeading: "Authored assertions about this object",
    noAssertions: "No authored assertions reference this object in the current encounter."
  },
  assertion: {
    kicker: "Assertion",
    authorLabel: "Author",
    predicateLabel: "Predicate",
    subjectLabel: "Subject",
    objectLabel: "Object",
    rationaleHeading: "Rationale",
    evidenceHeading: "Evidence",
    statusLabel: "Lifecycle status",
    epistemicStatusLabel: "Epistemic status",
    encounterContext: "In the context of encounter"
  },
  lens: {
    kicker: "Lens",
    authorLabel: "Author",
    purposeHeading: "Purpose",
    selectionHeading: "Selection",
    exclusionsHeading: "Declared exclusions",
    unknownTypePolicyLabel: "Unknown-type policy",
    rendererLabel: "Renderer",
    versionsHeading: "Versions",
    viewMapCta: "View this lens's map of the encounter",
    implementationHashLabel: "Implementation hash"
  },
  map: {
    kicker: "Map version",
    manifestHeading: "Lens manifest",
    manifestAuthor: "Author",
    manifestBasis: "Basis",
    manifestSelection: "Selection",
    manifestExclusions: "Excluded",
    manifestUnknownTypes: "Unknown types",
    manifestEngineVersion: "Generated by",
    manifestVersion: "Map version",
    manifestHash: "Content hash",
    manifestWatermark: "Event watermark",
    accessibleSummaryHeading: "Textual summary",
    ruptureHeading: "Unrendered relation",
    ruptureLead: "No renderer form exists for this record. It is shown, not hidden.",
    citationHeading: "Citation",
    citationUrl: "URL",
    citationHash: "Content hash",
    citationWatermark: "Event watermark",
    printedOn: "Printed"
  },
  compare: {
    kicker: "Compare",
    intro: "Two incompatible local maps of the same encounter: Ensemble's transformation reading beside Meridian's register-state reading. Neither resolves the other.",
    positionSwitcherLabel: "Show",
    showBoth: "Both"
  },
  apparatus: {
    kicker: "Apparatus",
    intro: "The infrastructure, actors and editorial rules that shaped this encounter and this interface. Disclosure does not remove power; it makes power discussable.",
    actorsHeading: "Actors",
    actorId: "Id",
    actorName: "Name",
    actorKind: "Kind",
    actorCollective: "Collective",
    sentinelHeading: "The editorial sentinel",
    sentinelBody: "Events issued by The Middle's own editorial apparatus (the assembly of this encounter record, this proposition's draft state) carry the issuer collective_id “the-middle-editorial” — a sentinel value, never a fourth sovereign collective. It marks apparatus authorship so it can never be mistaken for a collective's own voice.",
    pipelineHeading: "Import and projection pipeline",
    pipelineBody: "Records enter through read-only adapters over pinned commits of the three sovereign repositories, plus one hand-built, fully cited fixture for this encounter. Three lenses project the stored records into map versions through a pure, deterministic engine; each map version is content-addressed by a sha256 hash over its own canonical JSON.",
    pinningHeading: "How an encounter is pinned",
    pinningBody: "The current encounter is selected by an explicit editorial rule, stated on the encounter page itself, together with who pinned it and its approval state. Nothing here is chosen by an engagement metric.",
    analyticsHeading: "On analytics",
    analyticsBody: "This interface runs no analytics, no tracking pixels and no third-party scripts. No visitor behaviour is recorded. The only server-side state is a single cookie that remembers a manual light/dark preference.",
    limitationsHeading: "Current limitations",
    limitations: [
      "Exactly one encounter is public in this release; nothing here generalises to the whole lab.",
      "There are no write paths yet — no visitor submissions, corrections or forks. That begins only after this read-only system is stable.",
      "The Ulysses cockpit (frankbueltge.de/atelier) is a live local instrument of that practice, not archived material of The Middle; it is younger than nothing here and stays authoritative on its own state.",
      "Map content hashes are not yet treated as permanent citation guarantees before the conceptual review this work order defers to."
    ],
    authorshipHeading: "Authorship of this design",
    authorshipBody: "The routes, renderers and visual system on this page follow docs/design/phase-3-vertical-slice-design.md, a lab-session design document dated 2026-07-14."
  },
  archive: {
    kicker: "Archive",
    intro: "The Ulysses cockpit is a live local instrument of the atelier practice, not a retired interface of The Middle (ADR 0008). This page documents dated snapshots of its data that were imported here, and links out to the cockpit itself.",
    liveNotice: "The cockpit is live and younger than this archive entry.",
    snapshotsHeading: "Imported snapshots",
    snapshotCollective: "Collective",
    snapshotFile: "Bundle",
    snapshotCommit: "Commit",
    visitCta: "Visit the live cockpit ↗"
  },
  about: {
    kicker: "About",
    propositionHeading: "Working proposition",
    autonomyHeading: "Autonomy statement",
    limitsHeading: "Limits of this interface",
    limits: [
      "The Middle shows one encounter at a time, never the lab's complete state.",
      "No global graph or shared research-health score exists here, by design (ADR 0001).",
      "A published inter-practice refusal does not yet exist, so /refusals is deferred rather than shown empty.",
      "Internal kill records and private deliberation live in the sovereign archives, not here."
    ]
  },
  ledger: {
    kicker: "Ledger",
    intro: "An append-only, chronological list of this encounter's recorded events.",
    pageLabel: "Page",
    nextCta: "Older →",
    prevCta: "← Newer"
  },
  poster: {
    headline: "A work found the flaw in the instrument it was built from.",
    invitation: "Follow the material ↓",
    footnote:
      "The record of an encounter between independent research practices. Everything evidenced, nothing resolved."
  },
  narrative: {
    viewRecordCta: "View the record →",
    viewDivergenceCta: "View the divergence →",
    authoredByPrefix: "Narrated by"
  },
  divergence: {
    kicker: "Divergence",
    heading: "One case, two registers",
    context: "The Minnesota case, read twice: inside Meridian's claims register, and inside Ensemble's declined evidence.",
    backboneHeading: "The shared record",
    appellateFindingLabel: "Appellate finding",
    meridianLabel: "Meridian — register line",
    ensembleLabel: "Ensemble — declines to carry",
    bothStandNote: "both stand, today",
    fullMapsHeading: "Full maps"
  },
  footer: {
    apparatusLink: "Apparatus",
    aboutLink: "About",
    noAnalytics: "No analytics. No tracking."
  }
};

const de: Dictionary = {
  common: {
    skipToContent: "Zum Inhalt springen",
    siteName: "The Middle",
    siteTagline: "Eine öffentliche Kontaktzone zwischen unabhängigen Forschungspraktiken.",
    languageSwitch: "English",
    themeLight: "Hell",
    themeDark: "Dunkel",
    themeToggleLabel: "Farbschema umschalten",
    doorwayLead: "Dieses Objekt liegt bei",
    doorwayRepo: "Repository",
    doorwayCommit: "Commit",
    doorwayCta: "Zur Quelle öffnen ↗",
    noSharedResolution: "Keine gemeinsame Auflösung — die Stände der Beteiligten bleiben nebeneinander bestehen, statt zu einem einzigen zusammengefasst zu werden.",
    pendingApprovalLabel: "Freigabe steht aus",
    draftAttribution: "Entwurf — Freigabe durch Frank Bültge steht noch aus",
    recordsStayEnglish: "Die Aufzeichnungen auf dieser Seite bleiben im englischen Original; übersetzt ist nur diese Umrahmung.",
    exclusionsLabel: "Diese Ansicht schließt aus",
    unknownTypesLabel: "unbekannte Typen",
    lensManifestToggleHint: "Taste „m“ öffnet oder schließt das Linsen-Manifest.",
    printCitationHint: "Der Ausdruck zeigt den Zitationsblock: URL, Prüfsumme und Wasserzeichen.",
    yes: "ja",
    no: "nein"
  },
  nav: {
    encounter: "Begegnung",
    compare: "Vergleich",
    ledger: "Register",
    lenses: "Linsen",
    apparatus: "Apparat",
    archive: "Archiv",
    about: "Über"
  },
  encounter: {
    kicker: "Akte",
    propositionHeading: "Redaktionelle These",
    propositionAuthorPrefix: "Vorgeschlagen von",
    offeredHeading: "Wer bot was an",
    receiverActionHeading: "Was die empfangende Seite damit tat",
    disputedHeading: "Was strittig oder ungeklärt ist",
    sourcesHeading: "Wo die Quellen liegen",
    participantsHeading: "Positionen der Beteiligten",
    roleSource: "Quelle",
    roleReceiver: "Empfängerin",
    roleConductor: "Übermittler",
    statusHeading: "Aktueller Stand",
    obligationsHeldHeading: "Gehaltene Verpflichtungen",
    unresolvedObjectionsHeading: "Ungeklärte Einwände",
    closureHeading: "Örtlicher Abschluss oder nächster Schritt",
    eventTraceHeading: "Ereignisspur",
    eventTraceIntro: "Eine chronologische, nur ergänzbare Aufzeichnung. Ereignisse sind Tatsachen; interpretierende Einordnungen erscheinen gesondert.",
    objectsHeading: "Objekte dieser Begegnung",
    obligationsHeading: "Verpflichtungen",
    mapsHeading: "Örtliche Karten",
    mapsIntro: "Drei verfasste Linsen auf diese Begegnung. Ein Linsenwechsel ändert, was einbezogen wird — nicht nur die Farbe.",
    compareCta: "Zwei Positionen vergleichen",
    nonParticipationHeading: "Dokumentierte Nicht-Beteiligung",
    nonParticipationIntro: "Nicht jedes Kollektiv im Lab ist Teil jeder Begegnung. Dieser Abschnitt nennt, wer hier fehlt und warum — eine dokumentierte Nicht-Beziehung, niemals eine unterstellte Verweigerung.",
    resolutionNoteHeading: "Zum Fehlen einer gemeinsamen Auflösung",
    sourceNoteHeading: "Wie diese Begegnung begann",
    openLensManifest: "Linsen-Manifest öffnen"
  },
  event: {
    issuedBy: "ausgestellt von",
    source: "Quelle",
    obligationsAcceptedHere: "Hier angenommene Verpflichtungen",
    payloadExcerpt: "Auszug der Nutzdaten",
    gapHeading: "Die beiden Veröffentlichungs-Ereignisse",
    gapBody: "Die eigene Aufnahme des Studios in sein souveränes Archiv und die spätere Veröffentlichung über das Site-Gate sind zwei getrennte Apparat-Akte, kein doppelter Eintrag desselben Sachverhalts."
  },
  object: {
    kicker: "Objekt",
    homeAddress: "Heimatadresse",
    lifecycleStatus: "Lebenszyklus-Status",
    epistemicStatus: "Epistemischer Status",
    interoperabilityClass: "Interoperabilitätsklasse",
    contentHash: "Inhalts-Prüfsumme",
    sourceCommit: "Quell-Commit",
    assertionsAboutHeading: "Verfasste Aussagen zu diesem Objekt",
    noAssertions: "Keine verfasste Aussage bezieht sich in dieser Begegnung auf dieses Objekt."
  },
  assertion: {
    kicker: "Aussage",
    authorLabel: "Autor·in",
    predicateLabel: "Prädikat",
    subjectLabel: "Subjekt",
    objectLabel: "Objekt",
    rationaleHeading: "Begründung",
    evidenceHeading: "Belege",
    statusLabel: "Lebenszyklus-Status",
    epistemicStatusLabel: "Epistemischer Status",
    encounterContext: "Im Zusammenhang der Begegnung"
  },
  lens: {
    kicker: "Linse",
    authorLabel: "Autor·in",
    purposeHeading: "Zweck",
    selectionHeading: "Auswahl",
    exclusionsHeading: "Erklärte Ausschlüsse",
    unknownTypePolicyLabel: "Umgang mit unbekannten Typen",
    rendererLabel: "Renderer",
    versionsHeading: "Versionen",
    viewMapCta: "Die Karte dieser Linse zur Begegnung ansehen",
    implementationHashLabel: "Implementierungs-Prüfsumme"
  },
  map: {
    kicker: "Kartenversion",
    manifestHeading: "Linsen-Manifest",
    manifestAuthor: "Autor·in",
    manifestBasis: "Grundlage",
    manifestSelection: "Auswahl",
    manifestExclusions: "Ausgeschlossen",
    manifestUnknownTypes: "Unbekannte Typen",
    manifestEngineVersion: "Erzeugt von",
    manifestVersion: "Kartenversion",
    manifestHash: "Inhalts-Prüfsumme",
    manifestWatermark: "Ereignis-Wasserzeichen",
    accessibleSummaryHeading: "Textzusammenfassung",
    ruptureHeading: "Nicht dargestellte Relation",
    ruptureLead: "Für diesen Eintrag existiert keine Darstellungsform. Er wird gezeigt, nicht verborgen.",
    citationHeading: "Zitation",
    citationUrl: "URL",
    citationHash: "Inhalts-Prüfsumme",
    citationWatermark: "Ereignis-Wasserzeichen",
    printedOn: "Gedruckt"
  },
  compare: {
    kicker: "Vergleich",
    intro: "Zwei unvereinbare örtliche Karten derselben Begegnung: Ensembles Lesart der Transformation neben Meridians Lesart des Register-Zustands. Keine löst die andere auf.",
    positionSwitcherLabel: "Zeigen",
    showBoth: "Beide"
  },
  apparatus: {
    kicker: "Apparat",
    intro: "Die Infrastruktur, die Akteur·innen und die redaktionellen Regeln, die diese Begegnung und diese Oberfläche geformt haben. Offenlegung nimmt Macht nicht weg — sie macht sie besprechbar.",
    actorsHeading: "Akteur·innen",
    actorId: "Id",
    actorName: "Name",
    actorKind: "Art",
    actorCollective: "Kollektiv",
    sentinelHeading: "Der redaktionelle Platzhalter-Wert",
    sentinelBody: "Ereignisse, die vom eigenen redaktionellen Apparat von The Middle ausgestellt werden (die Zusammenstellung dieser Begegnung, der Entwurfsstatus dieser These), tragen als ausstellendes collective_id den Wert „the-middle-editorial“ — einen Platzhalter, niemals ein viertes souveränes Kollektiv. Er markiert Apparat-Autorschaft, damit sie nie mit der Stimme eines Kollektivs verwechselt werden kann.",
    pipelineHeading: "Import- und Projektions-Pipeline",
    pipelineBody: "Aufzeichnungen gelangen über schreibgeschützte Adapter zu festgelegten Commits der drei souveränen Repositories herein, dazu eine von Hand erstellte, vollständig belegte Fixture für diese Begegnung. Drei Linsen projizieren die gespeicherten Aufzeichnungen über eine reine, deterministische Engine zu Kartenversionen; jede Kartenversion ist über einen sha256-Hash ihres eigenen kanonischen JSON inhaltsadressiert.",
    pinningHeading: "Wie eine Begegnung angeheftet wird",
    pinningBody: "Die aktuelle Begegnung wird nach einer ausdrücklichen redaktionellen Regel ausgewählt, die auf der Begegnungsseite selbst benannt wird — zusammen damit, wer sie angeheftet hat und in welchem Freigabestatus sie steht. Nichts hier wird nach einer Engagement-Kennzahl gewählt.",
    analyticsHeading: "Zur Analytik",
    analyticsBody: "Diese Oberfläche betreibt keine Analytik, keine Tracking-Pixel und keine Skripte Dritter. Es wird kein Besuchsverhalten aufgezeichnet. Der einzige serverseitige Zustand ist ein einzelnes Cookie, das eine manuell gewählte Hell/Dunkel-Präferenz merkt.",
    limitationsHeading: "Derzeitige Grenzen",
    limitations: [
      "In dieser Fassung ist genau eine Begegnung öffentlich; nichts hier verallgemeinert auf das ganze Lab.",
      "Es gibt noch keine Schreibpfade — keine Beiträge, Korrekturen oder Abzweigungen von Besucher·innen. Das beginnt erst, wenn dieses lesende System stabil ist.",
      "Das Ulysses-Cockpit (frankbueltge.de/atelier) ist ein lebendiges örtliches Instrument dieser Praxis, kein archiviertes Material von The Middle; es ist jünger als alles hier und bleibt maßgeblich für seinen eigenen Zustand.",
      "Kartenprüfsummen gelten vor der in diesem Arbeitsauftrag vorgesehenen inhaltlichen Prüfung noch nicht als dauerhafte Zitationsgarantie."
    ],
    authorshipHeading: "Autorschaft dieses Entwurfs",
    authorshipBody: "Die Routen, Renderer und das visuelle System dieser Seite folgen docs/design/phase-3-vertical-slice-design.md, einem Lab-Sitzungs-Dokument vom 14.07.2026."
  },
  archive: {
    kicker: "Archiv",
    intro: "Das Ulysses-Cockpit ist ein lebendiges örtliches Instrument der Atelier-Praxis, keine stillgelegte Oberfläche von The Middle (ADR 0008). Diese Seite dokumentiert datierte Momentaufnahmen seiner Daten, die hier importiert wurden, und verweist auf das Cockpit selbst.",
    liveNotice: "Das Cockpit ist live und jünger als dieser Archiveintrag.",
    snapshotsHeading: "Importierte Momentaufnahmen",
    snapshotCollective: "Kollektiv",
    snapshotFile: "Bündel",
    snapshotCommit: "Commit",
    visitCta: "Zum lebenden Cockpit ↗"
  },
  about: {
    kicker: "Über",
    propositionHeading: "Arbeitsthese",
    autonomyHeading: "Autonomie-Erklärung",
    limitsHeading: "Grenzen dieser Oberfläche",
    limits: [
      "The Middle zeigt jeweils eine Begegnung, niemals den vollständigen Zustand des Labs.",
      "Es gibt hier bewusst keinen globalen Graphen und keinen gemeinsamen Forschungs-Gesundheitswert (ADR 0001).",
      "Eine veröffentlichte zwischenpraktische Verweigerung existiert noch nicht; /refusals entfällt deshalb, statt leer angezeigt zu werden.",
      "Interne Abbruch-Aufzeichnungen und private Beratungen liegen in den souveränen Archiven, nicht hier."
    ]
  },
  ledger: {
    kicker: "Register",
    intro: "Eine chronologische, nur ergänzbare Liste der aufgezeichneten Ereignisse dieser Begegnung.",
    pageLabel: "Seite",
    nextCta: "Älter →",
    prevCta: "← Neuer"
  },
  poster: {
    headline: "Ein Werk fand den Fehler im Instrument, aus dem es gebaut war.",
    invitation: "Dem Material folgen ↓",
    footnote: "Aufzeichnung einer Begegnung zwischen unabhängigen Forschungspraktiken. Alles belegt, nichts aufgelöst."
  },
  narrative: {
    viewRecordCta: "Akte einsehen →",
    viewDivergenceCta: "Zur Divergenz-Ansicht →",
    authoredByPrefix: "Erzählt von"
  },
  divergence: {
    kicker: "Divergenz",
    heading: "Ein Fall, zwei Register",
    context: "Der Minnesota-Fall, zweimal gelesen: einmal in Meridians Aussagenregister, einmal in Ensembles verweigerter Beweisführung.",
    backboneHeading: "Der gemeinsame Bestand",
    appellateFindingLabel: "Appellationsbefund",
    meridianLabel: "Meridian — Registerzeile",
    ensembleLabel: "Ensemble — verweigert die Übernahme",
    bothStandNote: "beide gelten, heute",
    fullMapsHeading: "Vollständige Karten"
  },
  footer: {
    apparatusLink: "Apparat",
    aboutLink: "Über",
    noAnalytics: "Keine Analytik. Kein Tracking."
  }
};

export const dictionary: Record<"en" | "de", Dictionary> = { en, de };
