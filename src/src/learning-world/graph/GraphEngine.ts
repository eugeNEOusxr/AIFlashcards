import type { MemoryTruth } from "../memory/MemoryTruth";
import type { CurriculumScene, GraphState, SceneEdge, SceneNode } from "../types";
import { getGraphDefinition, type GraphDefinition } from "./graphDefinitions";
import { deriveNodeStateForDef } from "./deriveNodeState";
import { visualFromState } from "./animationRules";
import { computeAmbience, edgeEnergy } from "./computeGraphDiff";

let revisionCounter = 0;

/**
 * Layer 2 — transforms memory truth into graph + scene structures.
 * Never touches DOM. Never reads storage directly.
 */
export class GraphEngine {
  derive(memory: MemoryTruth, graphId: string): GraphState | null {
    const def = getGraphDefinition(graphId);
    if (!def) return null;

    const nodes = def.nodes.map((nodeDef) => {
      const intensity = memory.conceptMastery[nodeDef.memoryKey] ?? 0;
      const state = deriveNodeStateForDef(nodeDef, memory);
      const visual = visualFromState(state, nodeDef.position, intensity);
      return {
        id: nodeDef.id,
        label: nodeDef.label,
        memoryKey: nodeDef.memoryKey,
        state,
        intensity,
        visual,
      };
    });

    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const edges = buildEdges(def, byId);

    return {
      graphId,
      revision: ++revisionCounter,
      nodes,
      edges,
      ambience: computeAmbience(nodes),
    };
  }

  /** Build immutable scene graph snapshot for initial mount. */
  buildScene(graph: GraphState, existingAnchors?: CurriculumScene["anchorObjects"]): CurriculumScene {
    const sceneNodes: SceneNode[] = graph.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      position: [
        n.visual.position[0],
        n.visual.position[1],
        0,
      ] as SceneNode["position"],
      visualState: n.state,
      visual: n.visual,
    }));

    const sceneEdges: SceneEdge[] = graph.edges.map((e) => ({
      id: e.id,
      from: e.from,
      to: e.to,
      weight: e.weight,
      energy: e.energy,
    }));

    return {
      sceneId: graph.graphId,
      nodes: sceneNodes,
      edges: sceneEdges,
      anchorObjects: existingAnchors ?? createDefaultAnchors(),
      ambience: graph.ambience,
    };
  }
}

function buildEdges(
  def: GraphDefinition,
  byId: Record<string, GraphState["nodes"][0]>
): GraphState["edges"] {
  const edges: GraphState["edges"] = [];
  const seen = new Set<string>();

  for (const node of def.nodes) {
    for (const [targetId, weight] of Object.entries(node.connections)) {
      const target = byId[targetId];
      if (!target) continue;
      const id = `${node.id}->${targetId}`;
      if (seen.has(id)) continue;
      seen.add(id);
      edges.push({
        id,
        from: node.id,
        to: targetId,
        weight,
        energy: edgeEnergy(byId[node.id]!, target, weight),
      });
    }
  }
  return edges;
}

function createDefaultAnchors(): CurriculumScene["anchorObjects"] {
  return {
    bowlingBall: {
      id: "bowling_ball",
      kind: "bowling_ball",
      element: null,
      overlay: { glow: 0.4, shaderClass: "anchor--learning", pulseSpeed: 1 },
    },
    hockeyPuck: {
      id: "hockey_puck",
      kind: "hockey_puck",
      element: null,
      overlay: { glow: 0.3, shaderClass: "anchor--locked", pulseSpeed: 0 },
    },
  };
}

export const graphEngine = new GraphEngine();
