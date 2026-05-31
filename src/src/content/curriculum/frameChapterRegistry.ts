import type { BoundLearningModule } from "./bindChapterHierarchy";
import { BIOLOGY_CHAPTER_1 } from "./biologyChapter1Hierarchy";
import { CHEMISTRY_CHAPTER_1 } from "./chemistryChapter1Hierarchy";
import { PHYSICS_CHAPTER_1 } from "./physicsChapter1Hierarchy";
import type { CurriculumChapter, WorldGraphSubjectNode } from "./questionHierarchy";

const CHAPTERS: Record<string, CurriculumChapter> = {
  [PHYSICS_CHAPTER_1.id]: PHYSICS_CHAPTER_1,
  [CHEMISTRY_CHAPTER_1.id]: CHEMISTRY_CHAPTER_1,
  [BIOLOGY_CHAPTER_1.id]: BIOLOGY_CHAPTER_1,
};

/** Study Worlds top layer — chapters only; subjective routing TBD */
export const WORLD_GRAPH_SUBJECTS: WorldGraphSubjectNode[] = [
  {
    subjectId: "physics",
    label: "Physics",
    available: true,
    chapterIds: [PHYSICS_CHAPTER_1.id],
  },
  {
    subjectId: "chemistry",
    label: "Chemistry",
    available: true,
    chapterIds: [CHEMISTRY_CHAPTER_1.id],
  },
  {
    subjectId: "biology",
    label: "Biology",
    available: true,
    chapterIds: [BIOLOGY_CHAPTER_1.id],
  },
];

export function getChapter(chapterId: string): CurriculumChapter | null {
  return CHAPTERS[chapterId] ?? null;
}

export function chaptersForSubject(subjectId: string): CurriculumChapter[] {
  return Object.values(CHAPTERS).filter((c) => c.subjectId === subjectId);
}

export function totalFramesInChapter(chapterId: string): number {
  const ch = getChapter(chapterId);
  if (!ch) return 0;
  return ch.modules.reduce((n, m) => n + m.frames.length, 0);
}

export function chapterLabelForModule(mod: BoundLearningModule): string {
  const ch = getChapter(mod.chapterId);
  return ch ? `Ch ${ch.chapterNumber} · ${ch.title}` : `Ch ${mod.chapterNumber}`;
}
