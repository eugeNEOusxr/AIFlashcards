import type { ReflectionChoice } from "./reflectionTypes";

/** Future analytics — structural hooks only (Phase 2+). */
export type HesitationContext = {
  lessonId: string;
  questionId?: string;
  durationMs: number;
};

export type HoverDurationContext = {
  lessonId: string;
  targetId: string;
  durationMs: number;
};

export type IdleStateContext = {
  lessonId: string;
  idleMs: number;
  screen: "TEACH" | "ASK" | "FEEDBACK" | "ADVANCE";
};

export type RevisitPressureContext = {
  lessonId: string;
  conceptId: string;
  pressureScore: number;
};

export type ReflectionHookContext = {
  lessonId: string;
  choice: ReflectionChoice;
  timestamp: number;
};

export type LearningSignalHooks = {
  onHesitationStart?: (ctx: Omit<HesitationContext, "durationMs">) => void;
  onHesitationEnd?: (ctx: HesitationContext) => void;
  onHoverDuration?: (ctx: HoverDurationContext) => void;
  onIdleState?: (ctx: IdleStateContext) => void;
  onRevisitPressure?: (ctx: RevisitPressureContext) => void;
  onReflectionCheckpoint?: (ctx: ReflectionHookContext) => void;
};

/** Global hook registry — wire analytics later without touching UI. */
export const learningSignalHooks: LearningSignalHooks = {};
