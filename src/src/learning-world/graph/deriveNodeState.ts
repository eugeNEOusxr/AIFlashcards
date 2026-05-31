import type { NodeState } from "../types";
import type { MemoryTruth } from "../memory/MemoryTruth";
import type { GraphNodeDef } from "./graphDefinitions";

function prerequisitesMet(node: GraphNodeDef, mastery: Record<string, number>): boolean {
  const reqs = node.prerequisites;
  if (!reqs) return true;
  return Object.entries(reqs).every(([id, min]) => (mastery[id] ?? 0) >= min);
}

/**
 * Score → state rules (graph engine brain).
 * Confusion overrides when elevated.
 */
export function deriveNodeStateFromScore(
  score: number,
  confusion: number,
  unlocked: boolean
): NodeState {
  if (!unlocked) return "locked";
  if (confusion >= 2 && score < 0.5) return "confused";
  if (score > 0.8) return "mastered";
  if (score > 0.4) return "learning";
  if (score < 0.2 && confusion >= 1) return "confused";
  if (score >= 0.12) return "learning";
  return "locked";
}

export function deriveNodeStateForDef(node: GraphNodeDef, truth: MemoryTruth): NodeState {
  const score = truth.conceptMastery[node.memoryKey] ?? 0;
  const confusion = truth.confusionCount[node.memoryKey] ?? 0;
  const unlocked = prerequisitesMet(node, truth.conceptMastery);
  return deriveNodeStateFromScore(score, confusion, unlocked);
}
