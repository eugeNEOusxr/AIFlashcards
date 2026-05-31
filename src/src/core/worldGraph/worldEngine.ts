import type { LearningNode, NodeQuestion, WorldProgress } from "./types";
import { NODE_QUESTIONS, SEED_EDGES, SEED_NODES } from "./seedWorld";

const STORAGE_KEY = "cls:learning-world:v1";

export type WorldSnapshot = {
  nodes: LearningNode[];
  edges: typeof SEED_EDGES;
  progress: WorldProgress;
};

function cloneNodes(): LearningNode[] {
  return SEED_NODES.map((n) => ({ ...n }));
}

function defaultProgress(firstUnlockedId: string): WorldProgress {
  return {
    completedNodeIds: [],
    activeNodeId: firstUnlockedId,
    questionIndexByNode: {},
  };
}

export function isNodeUnlocked(node: LearningNode, completed: Set<string>): boolean {
  return node.prerequisites.every((pid) => completed.has(pid));
}

export function applyUnlocks(nodes: LearningNode[], completed: Set<string>): LearningNode[] {
  return nodes.map((n) => ({
    ...n,
    unlocked: isNodeUnlocked(n, completed),
    completed: completed.has(n.id),
  }));
}

export function loadWorld(): WorldSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const completed = new Set<string>();
      const nodes = applyUnlocks(cloneNodes(), completed);
      const first = nodes.find((n) => n.unlocked)?.id ?? nodes[0]?.id ?? null;
      return {
        nodes,
        edges: SEED_EDGES,
        progress: defaultProgress(first ?? ""),
      };
    }
    const parsed = JSON.parse(raw) as Partial<WorldSnapshot>;
    const completed = new Set(parsed.progress?.completedNodeIds ?? []);
    let nodes = cloneNodes();
    nodes = applyUnlocks(nodes, completed);
    nodes = nodes.map((n) => ({ ...n, completed: completed.has(n.id) }));
    const active = parsed.progress?.activeNodeId ?? nodes.find((n) => n.unlocked)?.id ?? null;
    return {
      nodes,
      edges: SEED_EDGES,
      progress: {
        completedNodeIds: [...completed],
        activeNodeId: active,
        questionIndexByNode: parsed.progress?.questionIndexByNode ?? {},
      },
    };
  } catch {
    const completed = new Set<string>();
    const nodes = applyUnlocks(cloneNodes(), completed);
    const first = nodes.find((n) => n.unlocked)?.id ?? null;
    return { nodes, edges: SEED_EDGES, progress: defaultProgress(first ?? "") };
  }
}

export function persistWorld(snap: WorldSnapshot): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        progress: {
          completedNodeIds: snap.progress.completedNodeIds,
          activeNodeId: snap.progress.activeNodeId,
          questionIndexByNode: snap.progress.questionIndexByNode,
        },
      })
    );
  } catch {
    /* quota */
  }
}

export function getQuestionsForNode(nodeId: string): NodeQuestion[] {
  return NODE_QUESTIONS[nodeId] ?? [];
}

export function getCurrentQuestion(
  nodeId: string,
  progress: WorldProgress
): NodeQuestion | null {
  const qs = getQuestionsForNode(nodeId);
  if (qs.length === 0) return null;
  const idx = progress.questionIndexByNode[nodeId] ?? 0;
  return qs[idx] ?? null;
}

/** Advance after any substantive answer (gating is node-level, not grading). */
export function advanceQuestionOrComplete(
  snap: WorldSnapshot,
  nodeId: string
): WorldSnapshot {
  const qs = getQuestionsForNode(nodeId);
  const idx = snap.progress.questionIndexByNode[nodeId] ?? 0;
  const completed = new Set(snap.progress.completedNodeIds);
  const qib = { ...snap.progress.questionIndexByNode };

  if (qs.length === 0) {
    completed.add(nodeId);
    const qibDone = { ...qib, [nodeId]: 0 };
    const nodes = applyUnlocks(cloneNodes(), completed).map((n) => ({
      ...n,
      completed: completed.has(n.id),
    }));
    const nextActive =
      nodes.find((n) => n.unlocked && !n.completed)?.id ??
      snap.progress.activeNodeId ??
      nodeId;
    const next: WorldSnapshot = {
      nodes,
      edges: snap.edges,
      progress: {
        completedNodeIds: [...completed],
        activeNodeId: nextActive,
        questionIndexByNode: qibDone,
      },
    };
    persistWorld(next);
    return next;
  }

  if (idx + 1 >= qs.length) {
    completed.add(nodeId);
    qib[nodeId] = qs.length;
    const nodes = applyUnlocks(cloneNodes(), completed).map((n) => ({
      ...n,
      completed: completed.has(n.id),
    }));
    const nextActive =
      nodes.find((n) => n.unlocked && !n.completed)?.id ??
      snap.progress.activeNodeId ??
      nodeId;
    const next: WorldSnapshot = {
      nodes,
      edges: snap.edges,
      progress: {
        completedNodeIds: [...completed],
        activeNodeId: nextActive,
        questionIndexByNode: qib,
      },
    };
    persistWorld(next);
    return next;
  }

  qib[nodeId] = idx + 1;
  const next: WorldSnapshot = {
    ...snap,
    progress: {
      ...snap.progress,
      questionIndexByNode: qib,
    },
  };
  persistWorld(next);
  return next;
}

export function setActiveNode(snap: WorldSnapshot, nodeId: string | null): WorldSnapshot {
  const node = snap.nodes.find((n) => n.id === nodeId);
  if (!node || !node.unlocked) return snap;
  const next = {
    ...snap,
    progress: { ...snap.progress, activeNodeId: nodeId },
  };
  persistWorld(next);
  return next;
}

export function resetWorld(): WorldSnapshot {
  localStorage.removeItem(STORAGE_KEY);
  return loadWorld();
}

/** Polar layout: phase → radius; index within phase → angle. */
export function layoutWorldNodes(
  nodes: LearningNode[],
  cx: number,
  cy: number,
  maxPhase = 4
): Map<string, { x: number; y: number; phase: number }> {
  const map = new Map<string, { x: number; y: number; phase: number }>();
  const byPhase = new Map<number, LearningNode[]>();
  for (const n of nodes) {
    const p = n.phase;
    if (!byPhase.has(p)) byPhase.set(p, []);
    byPhase.get(p)!.push(n);
  }

  const inner = 48;
  const ring = (Math.min(cx, cy) - inner - 20) / Math.max(maxPhase, 1);

  for (let phase = 0; phase <= maxPhase; phase++) {
    const list = byPhase.get(phase as 0 | 1 | 2 | 3 | 4) ?? [];
    const r = inner + phase * ring;
    const n = list.length;
    list.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2;
      map.set(node.id, {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        phase,
      });
    });
  }
  return map;
}
