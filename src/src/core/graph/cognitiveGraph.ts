/**
 * Cognitive Memory Graph — deterministic data model (no UI, no AI).
 */

import type { MeaningType } from "../meaning/meaningEngine";

const GRAPH_STORAGE_KEY = "cls:cognitive-graph:v1";

export type EdgeRelation =
  | "confuses"
  | "clarifies"
  | "reflects"
  | "attached_to"
  | "engages"
  | "explores";

export interface ConceptNode {
  id: string;
  kind: "concept";
  title: string;
  createdAt: number;
}

export interface CognitiveEventNode {
  id: string;
  kind: "cognitive_event";
  meaningType: MeaningType;
  sourceEventId: string;
  intensity: number;
  label: string;
  createdAt: number;
}

export type GraphNode = ConceptNode | CognitiveEventNode;

export interface Edge {
  id: string;
  from: string;
  to: string;
  relation: EdgeRelation;
  weight: number;
  updatedAt: number;
}

export interface CognitiveGraph {
  version: number;
  concepts: Record<string, ConceptNode>;
  events: Record<string, CognitiveEventNode>;
  edges: Record<string, Edge>;
  activeConceptId: string | null;
}

export interface GraphDebugEntry {
  timestamp: number;
  meaningSourceEventId: string;
  action: "concept_added" | "event_added" | "edge_created" | "edge_weight_changed";
  detail: string;
}

function edgeKey(from: string, to: string, relation: EdgeRelation): string {
  return `${from}|${relation}|${to}`;
}

function emptyGraph(): CognitiveGraph {
  return {
    version: 1,
    concepts: {},
    events: {},
    edges: {},
    activeConceptId: null,
  };
}

export function loadCognitiveGraph(): CognitiveGraph {
  try {
    const raw = localStorage.getItem(GRAPH_STORAGE_KEY);
    if (!raw) return emptyGraph();
    const parsed = JSON.parse(raw) as CognitiveGraph;
    return {
      version: parsed.version ?? 1,
      concepts: parsed.concepts ?? {},
      events: parsed.events ?? {},
      edges: parsed.edges ?? {},
      activeConceptId: parsed.activeConceptId ?? null,
    };
  } catch {
    return emptyGraph();
  }
}

export function saveCognitiveGraph(graph: CognitiveGraph): void {
  try {
    localStorage.setItem(GRAPH_STORAGE_KEY, JSON.stringify(graph));
  } catch {
    /* quota */
  }
}

/** Deterministic concept node. */
export function addConceptNode(
  graph: CognitiveGraph,
  title: string,
  id?: string
): ConceptNode {
  const node: ConceptNode = {
    id: id ?? `concept_${Date.now()}`,
    kind: "concept",
    title: title.trim() || "Untitled concept",
    createdAt: Date.now(),
  };
  graph.concepts[node.id] = node;
  if (!graph.activeConceptId) graph.activeConceptId = node.id;
  return node;
}

/** Deterministic cognitive event node (thinking behavior). */
export function addCognitiveEvent(
  graph: CognitiveGraph,
  params: {
    meaningType: MeaningType;
    sourceEventId: string;
    intensity: number;
    label?: string;
  }
): CognitiveEventNode {
  const node: CognitiveEventNode = {
    id: `evt_${params.sourceEventId}`,
    kind: "cognitive_event",
    meaningType: params.meaningType,
    sourceEventId: params.sourceEventId,
    intensity: params.intensity,
    label: params.label ?? params.meaningType,
    createdAt: Date.now(),
  };
  graph.events[node.id] = node;
  return node;
}

export type ConnectResult = {
  edge: Edge;
  created: boolean;
  weightChanged: boolean;
  previousWeight: number;
};

/**
 * Connect two nodes. Same (from, to, relation) merges by increasing weight.
 */
export function connectNodes(
  graph: CognitiveGraph,
  from: string,
  to: string,
  relation: EdgeRelation,
  options?: { initialWeight?: number; increment?: number }
): ConnectResult {
  const key = edgeKey(from, to, relation);
  const existing = graph.edges[key];
  const now = Date.now();
  const increment = options?.increment ?? 0.15;
  const initialWeight = options?.initialWeight ?? 1;

  if (existing) {
    const previousWeight = existing.weight;
    existing.weight = Math.round((existing.weight + increment) * 1000) / 1000;
    existing.updatedAt = now;
    return {
      edge: existing,
      created: false,
      weightChanged: true,
      previousWeight,
    };
  }

  const edge: Edge = {
    id: key,
    from,
    to,
    relation,
    weight: initialWeight,
    updatedAt: now,
  };
  graph.edges[key] = edge;
  return {
    edge,
    created: true,
    weightChanged: false,
    previousWeight: 0,
  };
}

export function getNode(graph: CognitiveGraph, id: string): GraphNode | undefined {
  return graph.concepts[id] ?? graph.events[id];
}

export function ensureActiveConcept(
  graph: CognitiveGraph,
  conceptId: string,
  title: string
): { concept: ConceptNode; created: boolean } {
  const existing = graph.concepts[conceptId];
  if (existing) {
    graph.activeConceptId = conceptId;
    return { concept: existing, created: false };
  }
  const concept = addConceptNode(graph, title, conceptId);
  graph.activeConceptId = concept.id;
  return { concept, created: true };
}
