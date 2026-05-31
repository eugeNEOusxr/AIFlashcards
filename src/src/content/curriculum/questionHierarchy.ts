import type { SubjectId } from "../../world/types";

/**
 * Content stack (bottom → top). Worlds graph sits above this and may add
 * subjective routing later — not used for scoring or unlock in Phase 1.
 *
 * World → Subject → Chapter → Module (landmark) → Question level → Content layer → Frame (one MCQ)
 */

/** Depth within a chapter — 1 = core, 2 = connect, 3 = apply */
export type QuestionDepthLevel = 1 | 2 | 3;

/** Which slice of the frame card this question primarily teaches */
export type QuestionContentLayer = "concept" | "context" | "assessment";

export type ChapterFrameSlot = {
  frameId: string;
  level: QuestionDepthLevel;
  contentLayer: QuestionContentLayer;
  /** Order across the whole chapter (all modules) */
  sequenceInChapter: number;
};

export type ChapterModuleSlot = {
  landmarkId: string;
  moduleId: string;
  orderInChapter: number;
  frames: ChapterFrameSlot[];
};

export type CurriculumChapter = {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  subjectId: SubjectId;
  pathwayId: string;
  modules: ChapterModuleSlot[];
};

/** Top layer — subjective behavior hooks (interest, mood) reserved */
export type WorldGraphSubjectNode = {
  subjectId: SubjectId;
  label: string;
  available: boolean;
  chapterIds: string[];
};

export function levelLabel(level: QuestionDepthLevel): string {
  if (level === 1) return "Core";
  if (level === 2) return "Connect";
  return "Apply";
}

export function layerLabel(layer: QuestionContentLayer): string {
  if (layer === "concept") return "Concept";
  if (layer === "context") return "Scene";
  return "Check";
}

export function findFrameSlot(
  chapter: CurriculumChapter,
  frameId: string
): { chapter: CurriculumChapter; module: ChapterModuleSlot; slot: ChapterFrameSlot } | null {
  for (const mod of chapter.modules) {
    const slot = mod.frames.find((f) => f.frameId === frameId);
    if (slot) return { chapter, module: mod, slot };
  }
  return null;
}
