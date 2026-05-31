/**
 * Per-concept cognitive memory — structured thoughts + inferred understanding.
 * Separate from the learning bridge event log (cls:learning-events:v1).
 */

import type {
  CognitiveNode,
  CognitiveState,
  LearningEvent,
  LearningEventType,
} from "./learningTypes";

const STORAGE_KEY = "cls:cognitive-memory:v1";

const CONFIDENCE_DELTA: Record<LearningEventType, number> = {
  question: 0,
  insight: 0.2,
  confusion: -0.2,
  reflection: 0.05,
};

function clampConfidence(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function confidenceToState(confidence: number): CognitiveState {
  if (confidence > 0.7) return "understood";
  if (confidence > 0.3) return "partial";
  return "unknown";
}

type PersistedShape = { nodes: CognitiveNode[] };

function load(): Map<string, CognitiveNode> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as PersistedShape;
    if (!parsed?.nodes || !Array.isArray(parsed.nodes)) return new Map();
    const map = new Map<string, CognitiveNode>();
    for (const node of parsed.nodes) {
      if (node?.concept) {
        map.set(node.concept, {
          concept: node.concept,
          state: node.state ?? "unknown",
          confidence: clampConfidence(node.confidence ?? 0.2),
          events: Array.isArray(node.events) ? node.events : [],
        });
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

function persist(nodes: Map<string, CognitiveNode>): void {
  try {
    const payload: PersistedShape = {
      nodes: Array.from(nodes.values()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota */
  }
}

let nodes = load();
/** Stable array reference for useSyncExternalStore — rebuild only when data changes. */
let nodesListCache: CognitiveNode[] = buildNodesList();

function buildNodesList(): CognitiveNode[] {
  return Array.from(nodes.values()).sort((a, b) => a.concept.localeCompare(b.concept));
}

const listeners = new Set<() => void>();

function notify(): void {
  nodesListCache = buildNodesList();
  persist(nodes);
  listeners.forEach((fn) => fn());
}

export function subscribeCognitiveStore(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getOrCreateNode(concept: string): CognitiveNode {
  const key = concept.trim();
  let node = nodes.get(key);
  if (!node) {
    node = {
      concept: key,
      state: "unknown",
      confidence: 0.2,
      events: [],
    };
    nodes.set(key, node);
  }
  return node;
}

export function addLearningEvent(event: LearningEvent): void {
  const key = event.concept.trim();
  if (!key) return;

  const node = getOrCreateNode(key);
  const delta = CONFIDENCE_DELTA[event.type] ?? 0;
  const nextConfidence = clampConfidence(node.confidence + delta);
  const nextState = confidenceToState(nextConfidence);

  const stored: LearningEvent = {
    ...event,
    concept: key,
    confidenceDelta: delta,
    stateAfter: nextState,
  };

  node.confidence = nextConfidence;
  node.state = nextState;
  node.events = [...node.events, stored];
  nodes.set(key, { ...node });

  notify();
}

export function getCognitiveNodes(): CognitiveNode[] {
  return nodesListCache;
}
