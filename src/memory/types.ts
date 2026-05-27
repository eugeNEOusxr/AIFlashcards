import type { PhaseMode } from "../content/curriculumTypes";
import type { NavScreen, PathwayId } from "../world/types";
import type { ReinforcementSource, SignalEvent, UnderstandingSignal } from "../cognitive/types";

/** Adaptive tier — drives future question selection and map visualization. */
export type MasteryTier = "unknown" | "weak" | "learning" | "strong" | "mastered";

export type SessionPathwaySlice = {
  currentLessonIndex: number;
  currentQuestionIndex: number;
  correctAnswersPerLesson: number;
  currentMode: PhaseMode;
  selectedAnswerIndex: number | null;
  submittedNumericValue: number | null;
  lastAnswerCorrect: boolean | null;
  chapterComplete: boolean;
  maxUnlockedLessonIndex: number;
};

export type SessionVisualState = {
  dynamicMotifs: string[];
  overlayClasses: string[];
  collisionOverlay: boolean;
};

/** Layer 1 — immediate lesson engine state (restored on app load). */
export type SessionMemory = {
  pathwayId: PathwayId;
  pathways: Partial<Record<PathwayId, SessionPathwaySlice>>;
  activeLessonId: string | null;
  activeQuestionId: string | null;
  visualState: SessionVisualState | null;
  navScreen: NavScreen | null;
  lastActiveAt: number;
};

export type AnswerRecord = {
  id: string;
  pathwayId: PathwayId;
  lessonId: string;
  questionId: string;
  correct: boolean;
  selectedIndex: number | null;
  numericValue?: number;
  conceptTags: string[];
  timestamp: number;
};

/** Layer 2 — performance telemetry. */
export type PerformanceMemory = {
  answers: AnswerRecord[];
  seenQuestionIds: Record<string, string[]>;
  questionAttempts: Record<string, number>;
};

export type ConceptMemoryRecord = {
  conceptId: string;
  tier: MasteryTier;
  masteryScore: number;
  confusionCount: number;
  correctCount: number;
  incorrectCount: number;
  positiveSignals: number;
  lastSignal?: UnderstandingSignal;
  needsReinforcement: boolean;
  lessonIds: string[];
  lastSeenAt: number;
};

/** Layer 3 — global concept mastery (adaptive intelligence). */
export type ConceptMemory = {
  concepts: Record<string, ConceptMemoryRecord>;
};

export type PathwayCurriculumState = {
  maxUnlockedLessonIndex: number;
  chapterComplete: boolean;
  completedModuleIds: string[];
};

/** Layer 4 — world map progression. */
export type CurriculumMemory = {
  completedLessonIds: string[];
  completedPathwayIds: PathwayId[];
  pathwayProgress: Partial<Record<PathwayId, PathwayCurriculumState>>;
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

/**
 * Structural placeholders for graph memory hooks — persistence not implemented yet.
 * Keys come from lesson.memoryHooks (conceptMasteryKey, questionHistoryKey, confusionMapKey).
 */
export type GraphMemoryPlaceholders = {
  conceptMastery: Record<string, { masteryScore: number | null; tier: MasteryTier | null }>;
  questionHistory: Record<string, string[]>;
  confusionMap: Record<string, Record<string, number>>;
};

export type LearningMemory = {
  version: 1;
  session: SessionMemory;
  performance: PerformanceMemory;
  concept: ConceptMemory;
  curriculum: CurriculumMemory;
  /** Graph-linked memory slots (Lesson 1 & 2) — structure only */
  graphMemory: GraphMemoryPlaceholders;
  signals: SignalEvent[];
  reinforcementQueue: ReinforcementCard[];
  updatedAt: number;
};
