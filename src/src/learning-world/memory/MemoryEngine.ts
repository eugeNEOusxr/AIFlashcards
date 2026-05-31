import { normalizeConceptId } from "../../memory/conceptMemory";
import { loadMemory } from "../../memory/memoryStore";
import type { LearningMemory } from "../../memory/types";
import type { MemoryTruth } from "./MemoryTruth";

const NODE_ALIASES: Record<string, string[]> = {
  force: ["force", "interaction", "push"],
  friction: ["friction", "contact_force", "contact", "normal_force", "air_resistance"],
  motion: ["motion", "velocity", "acceleration"],
  inertia: ["inertia", "newton_first_law", "net_force", "newton first law"],
  energy: ["energy", "kinetic", "work"],
};

function aggregateScore(mem: LearningMemory, aliases: string[]): number {
  let best = 0;
  for (const alias of aliases) {
    const rec = mem.concept.concepts[normalizeConceptId(alias)];
    if (rec) best = Math.max(best, rec.masteryScore / 100);
  }
  return best;
}

function aggregateConfusion(mem: LearningMemory, aliases: string[]): number {
  let max = 0;
  for (const alias of aliases) {
    const rec = mem.concept.concepts[normalizeConceptId(alias)];
    if (rec) max = Math.max(max, rec.confusionCount);
  }
  return max;
}

function buildQuestionHistory(mem: LearningMemory): Record<string, boolean[]> {
  const history: Record<string, boolean[]> = {};
  for (const answer of mem.performance.answers) {
    for (const tag of answer.conceptTags) {
      const key = normalizeConceptId(tag);
      if (!key) continue;
      if (!history[key]) history[key] = [];
      history[key].push(answer.correct);
    }
  }
  return history;
}

/**
 * Memory Engine — reads/writes truth only.
 * Visual systems must call `readTruth()` never `loadMemory()` directly.
 */
export class MemoryEngine {
  static readTruth(mem: LearningMemory = loadMemory()): MemoryTruth {
    const conceptMastery: Record<string, number> = {};
    const confusionCount: Record<string, number> = {};

    for (const [nodeId, aliases] of Object.entries(NODE_ALIASES)) {
      conceptMastery[nodeId] = aggregateScore(mem, aliases);
      confusionCount[nodeId] = aggregateConfusion(mem, aliases);
    }

    return {
      conceptMastery,
      questionHistory: buildQuestionHistory(mem),
      confusionCount,
    };
  }
}
