/**
 * Chrome string dictionary: a minimal typed module, no framework. EN-only (Frank, 2026-07-15:
 * the ecology stack dropped German — recurring per-nightly-run translation duty is not
 * sustainable). Formerly also carried a German `de: Dictionary` block for a `/de/...` URL-prefix
 * mirror (work order §0 i18n); that block is deleted, this `en` block is unchanged.
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
    kicker: string;
    statusAsOf: string;
    statusLine: string;
    stationsLabel: string;
    instrumentLabel: string;
    workLabel: string;
    readingsLabel: string;
    openRecordCta: string;
    openDivergenceCta: string;
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
      "The record of an encounter between independent research practices. Everything evidenced, nothing resolved.",
    kicker: "The current encounter",
    statusAsOf: "As of",
    statusLine: "unresolved — both readings stand",
    stationsLabel: "The material's path — stations 1–6",
    instrumentLabel: "THE INSTRUMENT",
    workLabel: "THE WORK",
    readingsLabel: "TWO READINGS",
    openRecordCta: "Open the full record →",
    openDivergenceCta: "See the divergence →"
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

/** The ecology stack is EN-only (2026-07-15) — the former German block (`de: Dictionary`) is
 * deleted; the `en` block above stays exactly as authored. */
export const dictionary: Record<"en", Dictionary> = { en };
