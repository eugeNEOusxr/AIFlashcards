/**
 * PHASE 1 — Core experience lock.
 * Do not enable advanced systems until Phase 2+.
 */
export const PHASE1 = {
  /** Subject world → lesson map → lesson chamber only */
  screens: ["HOME", "SUBJECT", "LESSON"] as const,
  /** In-lesson extras disabled for stability */
  showCognitiveFeedbackBar: false,
  /** Post-explanation reflection checkpoint (replaces static feedback bar) */
  showCognitiveCheckpoint: true,
  showAIGuideOrb: false,
  showCuriosityNodes: true,
} as const;
