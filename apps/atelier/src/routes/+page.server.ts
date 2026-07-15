import { getAtelierData } from "$lib/server/store.js";
import { buildEdgeRegister, extractSheetData, layoutSheet, RULE_DESCRIPTION, selectEntranceThread } from "$lib/sheet/index.js";
import type { PageServerLoad } from "./$types.js";

/**
 * The sheet route (work order §4 "/ = das Blatt"). All server-side: extraction, thread
 * selection, layout and the edge register are pure functions of the store's data — no request
 * state, no randomness, no clock (work order §6 test 1's determinism holds at every layer).
 */
export const load: PageServerLoad = async () => {
  const { collective, objects, assertions } = await getAtelierData();
  const sheet = extractSheetData(assertions, objects);
  const entranceThread = selectEntranceThread(sheet);
  const layout = layoutSheet(sheet);
  const edgeRegister = buildEdgeRegister(sheet);

  const threadCount = [...sheet.nodes.values()].filter((n) => n.kind === "thread").length;
  const sourceCount = [...sheet.nodes.values()].filter((n) => n.kind === "source").length;
  const workCount = [...sheet.nodes.values()].filter((n) => n.kind === "work").length;
  const bridgeCount = sheet.edges.filter((e) => e.kind === "bridge").length;

  return {
    collectiveName: collective?.current_name,
    repositoryUrl: collective?.repository_url,
    entranceThreadLabel: entranceThread?.label,
    layout,
    edgeRegister,
    counts: { threads: threadCount, sources: sourceCount, works: workCount, bridges: bridgeCount },
    ruleDescription: RULE_DESCRIPTION,
    unlaidCount: layout.unlaid.length
  };
};
