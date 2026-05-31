/**
 * Layer 1 — raw learning truth.
 * No visual logic. Never pass to renderer directly.
 */
export type MemoryTruth = {
  conceptMastery: Record<string, number>;
  questionHistory: Record<string, boolean[]>;
  confusionCount: Record<string, number>;
};
