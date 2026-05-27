/** Cognitive feedback + progression memory — structured telemetry, not adaptive AI yet. */

export type UnderstandingSignal =
  | "understand"
  | "partial"
  | "confusing"
  | "need_visual"
  | "repeat";

export type EducationalTier = "beginner" | "intermediate" | "advanced";

export type ChamberMood = "neutral" | "positive" | "confused" | "visual" | "reframe";

export type ReinforcementSource = "missed" | "confusion" | "low_confidence";

export type SignalEvent = {
  id: string;
  lessonId: string;
  questionId?: string;
  conceptTags: string[];
  signal: UnderstandingSignal;
  timestamp: number;
};

export type ConceptMasteryRecord = {
  conceptId: string;
  lessonId: string;
  masteryScore: number;
  confusionCount: number;
  positiveCount: number;
  lastSignal?: UnderstandingSignal;
  needsReinforcement: boolean;
};

export type ReinforcementCard = {
  id: string;
  lessonId: string;
  questionId?: string;
  conceptTags: string[];
  front: string;
  back: string;
  source: ReinforcementSource;
  createdAt: number;
};

export type ProgressionSnapshot = {
  signals: SignalEvent[];
  concepts: Record<string, ConceptMasteryRecord>;
  reinforcementQueue: ReinforcementCard[];
  completedLessonIds: string[];
};
