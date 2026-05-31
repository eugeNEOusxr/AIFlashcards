/**
 * Single source of truth for the cognitive graph.
 * UI must never mutate nodes/edges/traces directly — use these APIs only.
 */

import type { Edge, EdgeType, GraphSnapshot, Node, NodeType, ThoughtTrace } from "./types";
import { loadSnapshot, saveSnapshot } from "../data/storage";

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

let snapshot: GraphSnapshot = loadSnapshot();
const listeners = new Set<() => void>();

function emit(): void {
  saveSnapshot(snapshot);
  listeners.forEach((fn) => fn());
}

export function subscribeGraph(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSnapshot(): GraphSnapshot {
  return snapshot;
}

function ensureActiveTrace(): ThoughtTrace {
  if (snapshot.activeTraceId) {
    const existing = snapshot.traces.find((t) => t.id === snapshot.activeTraceId);
    if (existing) return existing;
  }
  const trace: ThoughtTrace = {
    id: newId("trace"),
    path: [],
    timestamp: Date.now(),
  };
  snapshot = {
    ...snapshot,
    traces: [...snapshot.traces, trace],
    activeTraceId: trace.id,
  };
  return trace;
}

export function getAllNodes(): Node[] {
  return [...snapshot.nodes].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getAllEdges(): Edge[] {
  return [...snapshot.edges];
}

export function getNode(id: string): Node | undefined {
  return snapshot.nodes.find((n) => n.id === id);
}

export function getNeighbors(id: string): { node: Node; edge: Edge; direction: "out" | "in" }[] {
  const results: { node: Node; edge: Edge; direction: "out" | "in" }[] = [];
  for (const edge of snapshot.edges) {
    if (edge.from === id) {
      const node = getNode(edge.to);
      if (node) results.push({ node, edge, direction: "out" });
    } else if (edge.to === id) {
      const node = getNode(edge.from);
      if (node) results.push({ node, edge, direction: "in" });
    }
  }
  return results;
}

export function getSelectedNodeId(): string | null {
  return snapshot.selectedNodeId;
}

export function getSelectedNode(): Node | undefined {
  return snapshot.selectedNodeId ? getNode(snapshot.selectedNodeId) : undefined;
}

export function selectNode(nodeId: string | null): void {
  snapshot = { ...snapshot, selectedNodeId: nodeId };
  if (nodeId) recordVisit(nodeId);
  emit();
}

export function createNode(
  title: string,
  content: string,
  type: NodeType = "concept"
): Node {
  const now = Date.now();
  const node: Node = {
    id: newId("node"),
    title: title.trim() || "Untitled",
    content: content.trim(),
    type,
    strength: 0.3,
    createdAt: now,
    updatedAt: now,
  };
  snapshot = {
    ...snapshot,
    nodes: [...snapshot.nodes, node],
    selectedNodeId: node.id,
  };
  recordVisit(node.id, { skipSelect: true });
  emit();
  return node;
}

export function updateNode(
  id: string,
  patch: Partial<Pick<Node, "title" | "content" | "type">>
): Node | undefined {
  const idx = snapshot.nodes.findIndex((n) => n.id === id);
  if (idx < 0) return undefined;
  const prev = snapshot.nodes[idx];
  const next: Node = {
    ...prev,
    ...patch,
    title: patch.title !== undefined ? patch.title.trim() || prev.title : prev.title,
    content: patch.content !== undefined ? patch.content.trim() : prev.content,
    updatedAt: Date.now(),
  };
  const nodes = [...snapshot.nodes];
  nodes[idx] = next;
  snapshot = { ...snapshot, nodes };
  emit();
  return next;
}

export function createEdge(from: string, to: string, type: EdgeType = "relates"): Edge | null {
  if (from === to) return null;
  if (!getNode(from) || !getNode(to)) return null;
  const duplicate = snapshot.edges.some(
    (e) => e.from === from && e.to === to && e.type === type
  );
  if (duplicate) return null;

  const edge: Edge = {
    id: newId("edge"),
    from,
    to,
    type,
    weight: 0.5,
  };
  snapshot = { ...snapshot, edges: [...snapshot.edges, edge] };
  emit();
  return edge;
}

export function adjustStrength(nodeId: string, delta: number): Node | undefined {
  const node = getNode(nodeId);
  if (!node) return undefined;
  const idx = snapshot.nodes.findIndex((n) => n.id === nodeId);
  const next: Node = {
    ...node,
    strength: clamp01(node.strength + delta),
    updatedAt: Date.now(),
  };
  const nodes = [...snapshot.nodes];
  nodes[idx] = next;
  snapshot = { ...snapshot, nodes };
  emit();
  return next;
}

export function markLearned(nodeId: string): Node | undefined {
  return adjustStrength(nodeId, 0.15);
}

export function recordVisit(
  nodeId: string,
  opts?: { skipSelect?: boolean }
): void {
  if (!getNode(nodeId)) return;

  const trace = ensureActiveTrace();
  const last = trace.path[trace.path.length - 1];
  const nextPath = last === nodeId ? trace.path : [...trace.path, nodeId];

  const traces = snapshot.traces.map((t) =>
    t.id === trace.id ? { ...t, path: nextPath, timestamp: Date.now() } : t
  );

  snapshot = {
    ...snapshot,
    traces,
    ...(opts?.skipSelect ? {} : { selectedNodeId: nodeId }),
  };
  emit();
}

export function getCurrentTrace(): ThoughtTrace | null {
  if (!snapshot.activeTraceId) return null;
  return snapshot.traces.find((t) => t.id === snapshot.activeTraceId) ?? null;
}

export function clearCurrentTrace(): void {
  const trace: ThoughtTrace = {
    id: newId("trace"),
    path: [],
    timestamp: Date.now(),
  };
  snapshot = {
    ...snapshot,
    traces: [...snapshot.traces, trace],
    activeTraceId: trace.id,
  };
  emit();
}

export function searchNodes(query: string): Node[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllNodes();
  return getAllNodes().filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q)
  );
}

/** Seed demo graph when storage is empty (first run). */
export function seedIfEmpty(): void {
  if (snapshot.nodes.length > 0) return;
  const a = createNode("Neural elasticity", "How quickly concepts remap when feedback arrives.", "concept");
  const b = createNode("Confusion signal", "Confusion is data — not failure.", "fact");
  const c = createNode("Active recall", "Retrieving memory strengthens paths.", "skill");
  createEdge(a.id, b.id, "relates");
  createEdge(b.id, c.id, "depends");
  createEdge(a.id, c.id, "relates");
}

// Initialize trace on first load if missing
if (!snapshot.activeTraceId) {
  ensureActiveTrace();
  saveSnapshot(snapshot);
}
