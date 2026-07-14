/**
 * Object reference id parsing, shared by every renderer/route that needs to link an object ref
 * id (`<collective_id>:<local_object_id>@<shortSha>`, `packages/adapters` convention) to its
 * `/objects/[collective]/[localId]` page — never re-implemented ad hoc per component.
 */
export interface ParsedObjectRef {
  collectiveId: string;
  localObjectId: string;
  shortSha?: string;
}

export function parseObjectRefId(id: string): ParsedObjectRef {
  const [collectiveAndLocal, shortSha] = id.split("@");
  const [collectiveId, ...localParts] = (collectiveAndLocal ?? "").split(":");
  return {
    collectiveId: collectiveId ?? "",
    localObjectId: localParts.join(":"),
    shortSha
  };
}

export function objectHref(id: string, localePrefix: ""|"/de"): string {
  const { collectiveId, localObjectId } = parseObjectRefId(id);
  return `${localePrefix}/objects/${collectiveId}/${localObjectId}`;
}
