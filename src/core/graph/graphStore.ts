/**
 * Global knowledge graph state — cognitive layer.
 * localStorage only (local-first).
 */

import type { KnowledgeNode } from "./KnowledgeNode";
import type { KnowledgeEdge, KnowledgeRelationship } from "./KnowledgeEdge";

export type ViewLevel = "city" | "district" | "node";

const STORAGE_KEY = "cls:knowledge-graph-store:v1";

export interface GraphStoreState {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  viewLevel: ViewLevel;
}

const defaultState = (): GraphStoreState => ({
  nodes: [],
  edges: [],
  viewLevel: "city",
});

function load(): GraphStoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<GraphStoreState>;
    return {
      nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
      edges: Array.isArray(parsed.edges) ? parsed.edges : [],
      viewLevel:
        parsed.viewLevel === "district" || parsed.viewLevel === "node"
          ? parsed.viewLevel
          : "city",
    };
  } catch {
    return defaultState();
  }
}

function persist(s: GraphStoreState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* quota */
  }
}

let state = load();
const listeners = new Set<() => void>();

export function getGraphStoreState(): GraphStoreState {
  return state;
}

export function subscribeGraphStore(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit(): void {
  persist(state);
  listeners.forEach((fn) => fn());
}

export function setViewLevel(level: ViewLevel): void {
  state = { ...state, viewLevel: level };
  emit();
}

export function addNode(node: KnowledgeNode): void {
  if (state.nodes.some((n) => n.id === node.id)) return;
  state = { ...state, nodes: [...state.nodes, node] };
  emit();
}

export function addEdge(edge: KnowledgeEdge): void {
  if (state.edges.some((e) => e.id === edge.id)) return;
  state = { ...state, edges: [...state.edges, edge] };
  emit();
}

export function updateNode(id: string, patch: Partial<KnowledgeNode>): void {
  state = {
    ...state,
    nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
  };
  emit();
}

let edgeCounter = 0;

export function linkNodes(
  from: string,
  to: string,
  relationship: KnowledgeRelationship = "related_to",
  strength = 0.5,
  createdFrom: KnowledgeEdge["createdFrom"] = "inference"
): KnowledgeEdge | null {
  if (from === to) return null;
  if (!state.nodes.some((n) => n.id === from) || !state.nodes.some((n) => n.id === to)) {
    return null;
  }
  const exists = state.edges.some((e) => e.from === from && e.to === to && e.relationship === relationship);
  if (exists) return null;
  edgeCounter += 1;
  const edge: KnowledgeEdge = {
    id: `ke_${Date.now()}_${edgeCounter}`,
    from,
    to,
    relationship,
    strength,
    createdFrom,
    timestamp: Date.now(),
  };
  addEdge(edge);
  return edge;
}

/** Append many nodes/edges (e.g. after extraction). Skips duplicate node ids. */
export function mergeGraphPayload(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): void {
  let nextNodes = [...state.nodes];
  const seen = new Set(nextNodes.map((n) => n.id));
  for (const n of nodes) {
    if (!seen.has(n.id)) {
      seen.add(n.id);
      nextNodes.push(n);
    }
  }
  let nextEdges = [...state.edges];
  const seenE = new Set(nextEdges.map((e) => e.id));
  for (const e of edges) {
    if (!seenE.has(e.id) && seen.has(e.from) && seen.has(e.to)) {
      seenE.add(e.id);
      nextEdges.push(e);
    }
  }
  state = { ...state, nodes: nextNodes, edges: nextEdges };
  emit();
}
