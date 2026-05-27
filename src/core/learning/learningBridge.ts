/**
 * Binds graph, physics atom, reflection, and extraction into one learning trace.
 */

import type { LearningEvent } from "./LearningEvent";
import { addEvent, getEventsByNode } from "./learningEventStore";
import type { KnowledgeNode } from "../graph/KnowledgeNode";
import type { KnowledgeEdge } from "../graph/KnowledgeEdge";
import {
  getGraphStoreState,
  mergeGraphPayload,
  addNode,
  updateNode,
  subscribeGraphStore,
} from "../graph/graphStore";
import { clusterGraph } from "../clustering/clusterGraph";
import type { Atom } from "../physics/atomModel";
import { netCharge } from "../physics/atomModel";
import { setActiveNodeFromGraph } from "../state/learningState";

export const PHYSICS_CONCEPT_NODE_ID = "kn_physics_field";

export type PhysicsAtomSnapshot = {
  protons: number;
  electrons: number;
  netCharge: number;
  ionLabel: string;
};

export type LearningContext = {
  node: KnowledgeNode | null;
  edges: KnowledgeEdge[];
  physicsSnapshot: PhysicsAtomSnapshot | null;
  reflections: LearningEvent[];
  timeline: LearningEvent[];
};

let activeKnowledgeNodeId: string | null = null;
let activePhysicsNodeId: string | null = null;
let lastPhysicsSnapshot: PhysicsAtomSnapshot | null = null;

function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `le_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function record(event: Omit<LearningEvent, "id" | "timestamp"> & { timestamp?: number }): LearningEvent {
  const full: LearningEvent = {
    id: newEventId(),
    timestamp: event.timestamp ?? Date.now(),
    source: event.source,
    nodeId: event.nodeId,
    payload: event.payload ?? {},
  };
  addEvent(full);
  return full;
}

export function getActiveKnowledgeNodeId(): string | null {
  return activeKnowledgeNodeId;
}

export function getActivePhysicsNodeId(): string | null {
  return activePhysicsNodeId;
}

export function setActiveKnowledgeNode(nodeId: string | null): void {
  activeKnowledgeNodeId = nodeId;
  const node = nodeId ? getGraphStoreState().nodes.find((n) => n.id === nodeId) : null;
  if (node) {
    setActiveNodeFromGraph({ id: node.id, title: node.title });
  }
}

/** Map visible atom → knowledge node (nucleus = concept, electrons = complexity, ion = confidence). */
export function syncPhysicsAtomToKnowledgeNode(atom: Atom): string {
  const electrons = atom.electrons.length;
  const q = netCharge(atom);
  const confusionLevel = q > 0 ? Math.min(1, 0.35 + q * 0.08) : q < 0 ? 0.15 : 0.1;
  const confidence = Math.max(0.15, Math.min(1, 1 - Math.abs(q) * 0.12));

  const title = `Field: ${atom.nucleus.protons} protons`;
  const content = `Electrons ${electrons} · net charge ${q}`;

  const existing = getGraphStoreState().nodes.find((n) => n.id === PHYSICS_CONCEPT_NODE_ID);
  if (!existing) {
    const node: KnowledgeNode = {
      id: PHYSICS_CONCEPT_NODE_ID,
      title,
      content,
      type: "concept",
      source: { type: "manual" },
      tags: ["physics", "atom", "field"],
      confusionLevel,
      confidence,
      importance: Math.min(1, electrons / 12),
    };
    addNode(node);
  } else {
    updateNode(PHYSICS_CONCEPT_NODE_ID, {
      title,
      content,
      confusionLevel,
      confidence,
      importance: Math.min(1, electrons / 12),
    });
  }

  activePhysicsNodeId = PHYSICS_CONCEPT_NODE_ID;
  setActiveKnowledgeNode(PHYSICS_CONCEPT_NODE_ID);

  lastPhysicsSnapshot = {
    protons: atom.nucleus.protons,
    electrons,
    netCharge: q,
    ionLabel: q === 0 ? "neutral" : q > 0 ? `+${q}` : `${q}`,
  };

  return PHYSICS_CONCEPT_NODE_ID;
}

export function recordPhysicsAtomDisplayed(atom: Atom): void {
  const nodeId = syncPhysicsAtomToKnowledgeNode(atom);
  record({
    source: "physics_atom",
    nodeId,
    payload: {
      concept: "Atom field displayed",
      electronCount: atom.electrons.length,
      netCharge: netCharge(atom),
      intensity: 0.3,
    },
  });
}

export function recordPhysicsAddElectron(atom: Atom): void {
  const nodeId = syncPhysicsAtomToKnowledgeNode(atom);
  record({
    source: "physics_atom",
    nodeId,
    payload: {
      action: "electron_added",
      concept: "Exploration increase",
      electronCount: atom.electrons.length,
      netCharge: netCharge(atom),
      intensity: 0.55,
    },
  });
}

export function recordPhysicsRemoveElectron(atom: Atom): void {
  const nodeId = syncPhysicsAtomToKnowledgeNode(atom);
  record({
    source: "physics_atom",
    nodeId,
    payload: {
      action: "electron_removed",
      concept: "Simplification / ionization",
      electronCount: atom.electrons.length,
      netCharge: netCharge(atom),
      intensity: 0.65,
    },
  });
}

export function recordPhysicsEnergyPulse(atom: Atom): void {
  const nodeId = syncPhysicsAtomToKnowledgeNode(atom);
  record({
    source: "physics_atom",
    nodeId,
    payload: {
      action: "energy_pulse",
      concept: "Concept reinforcement",
      electronCount: atom.electrons.length,
      intensity: 0.75,
    },
  });
}

export function recordGraphNodeFocus(node: KnowledgeNode): void {
  setActiveKnowledgeNode(node.id);
  record({
    source: "graph_node",
    nodeId: node.id,
    payload: {
      concept: node.title,
      tags: node.tags,
      intensity: node.importance ?? 0.5,
    },
  });
}

export function recordGraphEdgeCreated(edge: KnowledgeEdge, fromNode: KnowledgeNode, toNode: KnowledgeNode): void {
  record({
    source: "graph_node",
    nodeId: fromNode.id,
    payload: {
      concept: `Linked to ${toNode.title}`,
      tags: [...new Set([...fromNode.tags, ...toNode.tags])],
      intensity: edge.strength,
      action: `edge:${edge.relationship}`,
    },
  });
}

export function recordGraphClustersRecomputed(): void {
  const clusters = clusterGraph(getGraphStoreState().nodes);
  for (const c of clusters) {
    for (const nodeId of c.nodeIds) {
      const node = getGraphStoreState().nodes.find((n) => n.id === nodeId);
      if (!node) continue;
      record({
        source: "graph_node",
        nodeId,
        payload: {
          concept: node.title,
          tags: [...node.tags, `cluster:${c.name}`],
          intensity: c.coherence,
          action: "cluster_recomputed",
        },
      });
    }
  }
}

export function bridgeMergeGraphExtraction(nodes: KnowledgeNode[], edges: KnowledgeEdge[]): void {
  mergeGraphPayload(nodes, edges);

  record({
    source: "extraction",
    payload: {
      concept: `Extracted ${nodes.length} nodes`,
      intensity: 0.5,
    },
  });

  for (const node of nodes) {
    record({
      source: "graph_node",
      nodeId: node.id,
      payload: {
        concept: node.title,
        tags: node.tags,
        intensity: 0.4,
        action: "extraction_node",
      },
    });
  }

  for (const edge of edges) {
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);
    if (fromNode && toNode) {
      recordGraphEdgeCreated(edge, fromNode, toNode);
    }
  }

  if (nodes[0]) {
    setActiveKnowledgeNode(nodes[0].id);
  }
}

export function recordReflectionLearning(
  text: string,
  action: string,
  intensity: number
): void {
  const nodeId = activeKnowledgeNodeId ?? activePhysicsNodeId ?? undefined;
  record({
    source: "reflection",
    nodeId,
    payload: {
      text: text.slice(0, 200),
      intensity,
      action,
      concept: action,
      electronCount: lastPhysicsSnapshot?.electrons,
      netCharge: lastPhysicsSnapshot?.netCharge,
    },
  });
}

export function getLearningContext(nodeId: string): LearningContext {
  const graph = getGraphStoreState();
  const node = graph.nodes.find((n) => n.id === nodeId) ?? null;
  const edges = graph.edges.filter((e) => e.from === nodeId || e.to === nodeId);
  const timeline = getEventsByNode(nodeId);
  const reflections = timeline.filter((e) => e.source === "reflection");
  const physicsSnapshot = nodeId === activePhysicsNodeId ? lastPhysicsSnapshot : null;

  return {
    node,
    edges,
    physicsSnapshot,
    reflections,
    timeline,
  };
}

export { subscribeGraphStore };
