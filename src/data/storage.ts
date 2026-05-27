import type { GraphSnapshot } from "../core/types";

const STORAGE_KEY = "cls:cognitive-graph:v1";

export const emptySnapshot = (): GraphSnapshot => ({
  nodes: [],
  edges: [],
  traces: [],
  activeTraceId: null,
  selectedNodeId: null,
});

export function loadSnapshot(): GraphSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot();
    const parsed = JSON.parse(raw) as Partial<GraphSnapshot>;
    return {
      nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
      edges: Array.isArray(parsed.edges) ? parsed.edges : [],
      traces: Array.isArray(parsed.traces) ? parsed.traces : [],
      activeTraceId: typeof parsed.activeTraceId === "string" ? parsed.activeTraceId : null,
      selectedNodeId: typeof parsed.selectedNodeId === "string" ? parsed.selectedNodeId : null,
    };
  } catch {
    return emptySnapshot();
  }
}

export function saveSnapshot(snapshot: GraphSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota */
  }
}
