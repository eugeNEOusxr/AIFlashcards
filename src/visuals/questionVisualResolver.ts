import type { Lesson, LessonQuestion, PhaseMode } from "../content/curriculumTypes";
import type { LessonVisualTheme } from "./types";
import {
  resolvePersistentScene,
  resolveQuestionOverlays,
  resolveTeachingOverlays,
} from "./sceneLayers";
import type { TeachingBlock } from "../content/curriculumTypes";

export type ResolvedQuestionVisuals = {
  coreTheme: Pick<LessonVisualTheme, "backgroundScene" | "accentColors">;
  anchorId: string | null;
  dynamicMotifs: string[];
  overlayClasses: string[];
  collisionOverlay: boolean;
};

/** @deprecated Prefer resolvePersistentScene + resolveQuestionOverlays in LearningApp */
export function resolveQuestionVisuals(
  lesson: Lesson,
  question: LessonQuestion | null,
  mode: PhaseMode
): ResolvedQuestionVisuals {
  const persistent = resolvePersistentScene(lesson);
  const questionLayer = resolveQuestionOverlays(lesson, question, mode, persistent.anchorId);
  return {
    coreTheme: persistent.coreTheme,
    anchorId: persistent.anchorId,
    dynamicMotifs: questionLayer.dynamicMotifs,
    overlayClasses: questionLayer.overlayClasses,
    collisionOverlay: questionLayer.collisionOverlay,
  };
}

/** @deprecated Prefer resolveTeachingOverlays */
export function resolveTeachBlockVisuals(
  lesson: Lesson,
  _visualTag: string | undefined,
  question: LessonQuestion | null,
  block?: TeachingBlock
): ResolvedQuestionVisuals {
  const persistent = resolvePersistentScene(lesson);
  const teach = block ? resolveTeachingOverlays(block) : { visualEvents: [], overlayClasses: [] };
  const questionLayer = resolveQuestionOverlays(lesson, question, "TEACH", persistent.anchorId);
  return {
    coreTheme: persistent.coreTheme,
    anchorId: persistent.anchorId,
    dynamicMotifs: questionLayer.dynamicMotifs,
    overlayClasses: [...teach.overlayClasses, ...questionLayer.overlayClasses],
    collisionOverlay: questionLayer.collisionOverlay,
  };
}
