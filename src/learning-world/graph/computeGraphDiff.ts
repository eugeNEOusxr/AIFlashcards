import type {
  GraphAmbience,
  GraphNodeState,
  GraphState,
  GraphStateDiff,
  NodeStatePatch,
} from "../types";

function visualEqual(a: GraphNodeState["visual"], b: GraphNodeState["visual"]): boolean {
  return (
    a.glow === b.glow &&
    a.opacity === b.opacity &&
    a.motion === b.motion &&
    a.jitter === b.jitter &&
    a.pulseSpeed === b.pulseSpeed &&
    a.colorToken === b.colorToken &&
    a.position[0] === b.position[0] &&
    a.position[1] === b.position[1]
  );
}

export function computeGraphDiff(prev: GraphState | null, next: GraphState): GraphStateDiff {
  const nodePatches: NodeStatePatch[] = [];
  const prevById = new Map(prev?.nodes.map((n) => [n.id, n]) ?? []);

  for (const node of next.nodes) {
    const before = prevById.get(node.id);
    if (
      !before ||
      before.state !== node.state ||
      before.intensity !== node.intensity ||
      !visualEqual(before.visual, node.visual)
    ) {
      nodePatches.push({
        id: node.id,
        visualState: node.state,
        visual: node.visual,
        intensity: node.intensity,
      });
    }
  }

  const edgePatches: GraphStateDiff["edgePatches"] = [];
  const prevEdges = new Map(prev?.edges.map((e) => [e.id, e]) ?? []);
  for (const edge of next.edges) {
    const before = prevEdges.get(edge.id);
    if (!before || before.energy !== edge.energy) {
      edgePatches.push({ id: edge.id, energy: edge.energy });
    }
  }

  const ambience =
    !prev ||
    prev.ambience.calmFactor !== next.ambience.calmFactor ||
    prev.ambience.noiseFactor !== next.ambience.noiseFactor
      ? next.ambience
      : undefined;

  const forceNode = next.nodes.find((n) => n.id === "force");
  const anchorOverlay =
    forceNode && (!prev || prev.nodes.find((n) => n.id === "force")?.state !== forceNode.state)
      ? {
          glow: 0.35 + forceNode.intensity * 0.5,
          pulseSpeed: forceNode.visual.pulseSpeed,
          shaderClass: `anchor--${forceNode.state}`,
        }
      : undefined;

  return {
    revision: next.revision,
    nodePatches,
    edgePatches,
    ambience,
    anchorOverlay,
  };
}

export function diffHasChanges(diff: GraphStateDiff): boolean {
  return (
    diff.nodePatches.length > 0 ||
    diff.edgePatches.length > 0 ||
    diff.ambience !== undefined ||
    diff.anchorOverlay !== undefined
  );
}

export function computeAmbience(nodes: GraphNodeState[]): GraphAmbience {
  if (nodes.length === 0) return { calmFactor: 0.5, noiseFactor: 0.3, particleSpeed: 8 };
  const mastered = nodes.filter((n) => n.state === "mastered").length / nodes.length;
  const confused = nodes.filter((n) => n.state === "confused").length / nodes.length;
  const calmFactor = Math.min(1, 0.35 + mastered * 0.65 - confused * 0.2);
  const noiseFactor = Math.min(1, 0.15 + confused * 0.75);
  const particleSpeed = 6 + noiseFactor * 4 - calmFactor * 2;
  return { calmFactor, noiseFactor, particleSpeed };
}

export function edgeEnergy(
  from: GraphNodeState,
  to: GraphNodeState,
  weight: number
): number {
  const stateEnergy: Record<string, number> = {
    locked: 0.08,
    learning: 0.45,
    mastered: 1,
    confused: 0.35,
  };
  const fromE = stateEnergy[from.state] ?? 0.1;
  const toE = stateEnergy[to.state] ?? 0.1;
  return Math.min(1, weight * Math.min(fromE, toE) + (from.intensity + to.intensity) * 0.1);
}
