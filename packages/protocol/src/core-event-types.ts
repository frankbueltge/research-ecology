/**
 * Core encounter event vocabulary (spec 03 §3). Event types are open strings with a
 * stable namespace — this list is purely informational (work order §2.5): the envelope
 * validator must accept unknown types when the envelope is otherwise valid.
 * `isCoreEventType` never gates validation.
 */

export const CORE_EVENT_TYPES = [
  // 3.1 Initiation
  "encounter.proposed",
  "offer.created",
  "invitation.created",
  "challenge.created",
  "commission.created",
  "citation.declared",

  // 3.2 Delivery and acknowledgement
  "message.dispatched",
  "message.delivered",
  "message.delivery_failed",
  "message.acknowledged",
  "message.unread_declared",

  // 3.3 Receiver decisions
  "offer.accepted",
  "offer.accepted_with_conditions",
  "offer.deferred",
  "offer.declined",
  "offer.ignored",
  "offer.withdrawn",
  "invitation.accepted",
  "invitation.declined",

  // 3.4 Transformation and response
  "object.admitted",
  "object.transformed",
  "derivative.published",
  "response.published",
  "countermap.published",
  "translation.loss_declared",
  "translation.departure_declared",
  "obligation.accepted",
  "obligation.rejected",
  "obligation.fulfilled",
  "obligation.breached",

  // 3.5 Contestation and correction
  "assertion.created",
  "assertion.contested",
  "assertion.supported",
  "assertion.superseded",
  "correction.issued",
  "correction.acknowledged",
  "correction.applied",
  "correction.declined",
  "source.status_changed",
  "derived_object.paused",
  "derived_object.resumed",

  // 3.6 Lifecycle
  "encounter.marked_unresolved",
  "encounter.dormant",
  "encounter.reopened",
  "encounter.closed_locally",
  "encounter.archived"
] as const;

export type CoreEventType = (typeof CORE_EVENT_TYPES)[number];

const CORE_EVENT_TYPE_SET: ReadonlySet<string> = new Set(CORE_EVENT_TYPES);

/** Informational only — unknown event types remain valid (work order §2.5). */
export function isCoreEventType(eventType: string): boolean {
  return CORE_EVENT_TYPE_SET.has(eventType);
}
