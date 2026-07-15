<script lang="ts">
  import { dictionary } from "$lib/i18n";
  import { localizedPath } from "$lib/i18n";
  import DoorwayLink from "$lib/ui/DoorwayLink.svelte";
  import UnresolvedRule from "$lib/ui/UnresolvedRule.svelte";
  import PendingApprovalBadge from "$lib/ui/PendingApprovalBadge.svelte";
  import ObligationClause from "$lib/ui/ObligationClause.svelte";
  import LensManifestPanel from "$lib/ui/LensManifestPanel.svelte";
  import RecordFrame from "$lib/ui/RecordFrame.svelte";
  import ProvenanceChain from "$lib/renderers/ProvenanceChain.svelte";
  import { objectHref } from "$lib/object-ref.js";
  import type { PageData } from "./$types.js";

  const { data }: { data: PageData } = $props();
  const dict = $derived(dictionary[data.locale]);

  const { encounter, participants, nonParticipants, objects, obligations } = $derived(data.bundle);
  const profilesByCollective = $derived(data.profilesByCollective);

  const sourceParticipants = $derived(participants.filter((p) => p.role === "source"));
  const receiverParticipants = $derived(participants.filter((p) => p.role === "receiver"));
  const apparatusParticipants = $derived(participants.filter((p) => p.role !== "source" && p.role !== "receiver"));

  const sourceObjects = $derived(objects.filter((o) => o.collective_id !== "ensemble"));
</script>

<svelte:head>
  <title>{encounter.title ?? encounter.encounter_id} — {dict.common.siteName}</title>
</svelte:head>

<article class="content">
  <p class="kicker">{dict.encounter.kicker}</p>
  <h1>{encounter.title ?? encounter.encounter_id}</h1>

  <div class="encounter-lede">
    <p class="encounter-lede__proposition" lang="en">{encounter.editorial_proposition}</p>
    <p class="encounter-lede__attribution">
      {dict.encounter.propositionAuthorPrefix}
      {encounter.proposition_author?.actor_id ?? "the-middle-editor"}
      {#if encounter.pin_state === "pending_approval"}
        <PendingApprovalBadge label={dict.common.draftAttribution} />
      {/if}
    </p>
  </div>

  <!-- FIRST SCREEN (spec 04 §5.3 / work order §0): who offered what, what the receiver did,
       what is disputed/unresolved, where the sources live — in exactly this order, before any
       further detail. -->
  <section class="first-screen" aria-label="Encounter summary">
    <div class="first-screen__item">
      <h2>{dict.encounter.offeredHeading}</h2>
      {#each sourceParticipants as participant (participant.actor_id)}
        <p>
          <strong>{participant.collective?.current_name ?? participant.actor_id}</strong>
          {#if participant.local_status_rationale}— {participant.local_status_rationale}{/if}
        </p>
      {/each}
    </div>

    <div class="first-screen__item">
      <h2>{dict.encounter.receiverActionHeading}</h2>
      {#each receiverParticipants as participant (participant.actor_id)}
        <p>
          <strong>{participant.collective?.current_name ?? participant.actor_id}</strong>
          {#if participant.local_status_rationale}— {participant.local_status_rationale}{/if}
        </p>
      {/each}
    </div>

    <div class="first-screen__item">
      <h2>{dict.encounter.disputedHeading}</h2>
      {#if encounter.shared_resolution === null}
        <UnresolvedRule text={dict.common.noSharedResolution} note={encounter.resolution_note} />
      {:else}
        <p>{encounter.shared_resolution}</p>
      {/if}
    </div>

    <div class="first-screen__item">
      <h2>{dict.encounter.sourcesHeading}</h2>
      {#each sourceObjects as object (object.id)}
        <DoorwayLink
          href={object.canonical_uri}
          lead={`${dict.common.doorwayLead} — ${object.title_cache ?? object.local_object_id}`}
          cta={dict.common.doorwayCta}
          repoLabel={dict.common.doorwayRepo}
          commit={object.source_commit}
          commitLabel={dict.common.doorwayCommit}
        />
      {/each}
    </div>
  </section>
  <!-- END FIRST SCREEN -->

  <h2>{dict.encounter.participantsHeading}</h2>
  {#each participants as participant (participant.actor_id)}
    {@const profile = participant.collective_id ? profilesByCollective[participant.collective_id] : undefined}
    <div class="participant">
      <h3>
        {participant.collective?.current_name ?? participant.actor?.display_name ?? participant.actor_id}
        <span class="mono participant__role">
          ({participant.role === "source"
            ? dict.encounter.roleSource
            : participant.role === "receiver"
              ? dict.encounter.roleReceiver
              : dict.encounter.roleConductor})
        </span>
      </h3>
      {#if participant.local_status}
        <p class="participant__status mono">{participant.local_status}</p>
      {/if}
      {#if participant.local_status_rationale}
        <p>{participant.local_status_rationale}</p>
      {/if}
      <!-- Position display (spec-v2.1 §7.1, ADR 0011, work order phase-b-profiles.md §5):
           encounter-situated only — never a global/persistent practice label, and never shown
           for a participant with no collective (the conductor) or no loaded profile (a
           non-participant such as Ulysses in this encounter never reaches this branch at all,
           since profilesByCollective is built only from this encounter's own participants). -->
      {#if profile}
        <RecordFrame variant="plain">
          <p class="position-block__line">{dict.encounter.positionPrefix} {profile.orientation}</p>
          <p class="position-block__line">{dict.encounter.accountabilityPrefix} {profile.accountability_questions[0]}</p>
          {#if profile.status === "draft"}
            <PendingApprovalBadge label={dict.encounter.profileDraftLabel} />
          {/if}
        </RecordFrame>
      {/if}
    </div>
  {/each}

  <h2 id="event-trace">{dict.encounter.eventTraceHeading}</h2>
  <p class="lede">{dict.encounter.eventTraceIntro}</p>
  <ProvenanceChain payload={data.eventTrace} actorNames={data.actorNames} {dict} />

  <h2>{dict.encounter.objectsHeading}</h2>
  <ul class="record-list objects-grid">
    {#each objects as object (object.id)}
      <li class="objects-grid__item">
        <a class="mono" href={objectHref(object.id)}>{object.title_cache ?? object.local_object_id}</a>
        <p class="objects-grid__type">{object.local_object_type}</p>
      </li>
    {/each}
  </ul>

  <h2>{dict.encounter.obligationsHeading}</h2>
  {#each obligations as obligation (obligation.id)}
    <ObligationClause
      clauseText={obligation.clause_text}
      status={obligation.status}
      prominence={obligation.prominence}
      proposerLabel={obligation.proposer_collective_id ? data.actorNames[obligation.proposer_collective_id] : undefined}
      obligatedLabel={obligation.obligated_collective_id ? data.actorNames[obligation.obligated_collective_id] : undefined}
    />
  {/each}

  <h2>{dict.encounter.mapsHeading}</h2>
  <p class="lede">{dict.encounter.mapsIntro}</p>
  {#each data.lensManifests as manifest (manifest.lensId)}
    <div class="map-link">
      <h3><a href={`/encounters/${encounter.encounter_id}/maps/${manifest.lensId}@${manifest.version}`}>{manifest.name}</a></h3>
      <LensManifestPanel
        lensName={manifest.name}
        authorLabel={manifest.authorLabel}
        basis={manifest.basis}
        selectionSummary={manifest.selectionSummary}
        exclusions={manifest.exclusions}
        unknownTypesCount={manifest.unknownTypesCount}
        engineVersion={manifest.engineVersion}
        mapId={manifest.mapId}
        mapVersion={manifest.version}
        contentHash={manifest.contentHash}
        watermark={manifest.watermark}
        openByDefault={false}
        labels={dict.map}
        toggleHint={dict.common.lensManifestToggleHint}
      />
    </div>
  {/each}
  <p><a href={localizedPath(data.locale, `/encounters/${encounter.encounter_id}/compare`)}>{dict.encounter.compareCta} →</a></p>

  {#if apparatusParticipants.length > 0}
    <h2>Apparatus participation</h2>
    {#each apparatusParticipants as participant (participant.actor_id)}
      <p class="apparatus-note">
        <strong>{participant.actor?.display_name ?? participant.actor_id}</strong>
        ({dict.encounter.roleConductor}) — {participant.local_status_rationale}
      </p>
    {/each}
  {/if}

  <section class="non-participation-section" aria-label={dict.encounter.nonParticipationHeading}>
    <h2>{dict.encounter.nonParticipationHeading}</h2>
    <p class="lede">{dict.encounter.nonParticipationIntro}</p>
    {#each nonParticipants as nonParticipant (nonParticipant.collective_id)}
      <div class="non-participant">
        <p class="mono non-participant__id">{nonParticipant.collective_id}</p>
        <p>{nonParticipant.note}</p>
      </div>
    {/each}
  </section>

  {#if encounter.source_note}
    <h2>{dict.encounter.sourceNoteHeading}</h2>
    <p>{encounter.source_note}</p>
  {/if}
</article>

<style>
  .encounter-lede {
    margin-bottom: var(--space-6);
  }

  .encounter-lede__proposition {
    font-size: var(--step-2);
    font-family: var(--font-editorial);
    font-style: italic;
    color: var(--ink);
  }

  .encounter-lede__attribution {
    font-family: var(--font-record);
    font-size: var(--step--1);
    color: var(--ink-faint);
    display: flex;
    gap: var(--space-2);
    align-items: center;
    flex-wrap: wrap;
  }

  .first-screen {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    border: var(--border-strong);
    padding: var(--space-6);
    margin: var(--space-6) 0 var(--space-8);
    background: var(--paper-raised);
  }

  @media (min-width: 50rem) {
    .first-screen {
      grid-template-columns: 1fr 1fr;
    }
  }

  .first-screen h2 {
    margin-top: 0;
    font-size: var(--step-1);
  }

  .participant {
    border-top: var(--border-thin);
    padding-top: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .participant__role {
    color: var(--ink-faint);
    text-transform: uppercase;
    font-size: var(--step--1);
  }

  .participant__status {
    color: var(--ink-soft);
  }

  .position-block__line {
    margin: 0 0 var(--space-2);
  }

  .position-block__line:last-of-type {
    margin-bottom: var(--space-3);
  }

  .objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: var(--space-4);
  }

  .objects-grid__item {
    border: var(--border-thin);
    padding: var(--space-3);
  }

  .objects-grid__type {
    color: var(--ink-faint);
    font-size: var(--step--1);
    margin: var(--space-1) 0 0;
  }

  .map-link {
    margin-bottom: var(--space-5);
  }

  .apparatus-note {
    color: var(--ink-soft);
    font-size: var(--step--1);
  }

  .non-participant {
    border: 1px dashed var(--rule-strong);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .non-participant__id {
    color: var(--ink-faint);
  }
</style>
