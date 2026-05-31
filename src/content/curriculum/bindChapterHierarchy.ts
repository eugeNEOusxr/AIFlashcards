import type { LearningFrame, LearningModule } from "../frames/types";
import type { CurriculumChapter, QuestionContentLayer, QuestionDepthLevel } from "./questionHierarchy";

export type FramePlacement = {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  landmarkId: string;
  moduleOrderInChapter: number;
  level: QuestionDepthLevel;
  contentLayer: QuestionContentLayer;
  sequenceInChapter: number;
};

export type BoundLearningModule = LearningModule & {
  chapterId: string;
  chapterNumber: number;
  landmarkId: string;
  orderInChapter: number;
};

export type BoundLearningFrame = LearningFrame & FramePlacement;

function bindFrame(frame: LearningFrame, placement: FramePlacement): BoundLearningFrame {
  return { ...frame, ...placement };
}

/** Attach chapter / level / layer metadata from the curriculum tree */
export function bindModuleToChapter(
  module: LearningModule,
  chapter: CurriculumChapter,
  landmarkId: string
): BoundLearningModule {
  const modSlot = chapter.modules.find(
    (m) => m.moduleId === module.id && m.landmarkId === landmarkId
  );
  if (!modSlot) {
    throw new Error(`bindModuleToChapter: ${module.id} not in ${chapter.id}`);
  }

  const frameMap = new Map(modSlot.frames.map((f) => [f.frameId, f]));
  const boundFrames: BoundLearningFrame[] = module.frames.map((frame) => {
    const slot = frameMap.get(frame.id);
    if (!slot) {
      throw new Error(`bindModuleToChapter: frame ${frame.id} missing from chapter plan`);
    }
    return bindFrame(frame, {
      chapterId: chapter.id,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.title,
      landmarkId,
      moduleOrderInChapter: modSlot.orderInChapter,
      level: slot.level,
      contentLayer: slot.contentLayer,
      sequenceInChapter: slot.sequenceInChapter,
    });
  });

  return {
    ...module,
    chapterId: chapter.id,
    chapterNumber: chapter.chapterNumber,
    landmarkId,
    orderInChapter: modSlot.orderInChapter,
    frames: boundFrames,
  };
}

export function getFramePlacement(
  module: BoundLearningModule,
  frameId: string
): FramePlacement | null {
  const frame = module.frames.find((f) => f.id === frameId) as BoundLearningFrame | undefined;
  if (!frame) return null;
  return {
    chapterId: frame.chapterId,
    chapterNumber: frame.chapterNumber,
    chapterTitle: frame.chapterTitle,
    landmarkId: frame.landmarkId,
    moduleOrderInChapter: frame.moduleOrderInChapter,
    level: frame.level,
    contentLayer: frame.contentLayer,
    sequenceInChapter: frame.sequenceInChapter,
  };
}
