import type { Lesson } from "./curriculumTypes";
import { electricityChapter1 } from "./electricityChapter1";
import { energyChapter1 } from "./energyChapter1";
import { physicsChapter1 } from "./physicsChapter1";
import type { PathwayId } from "../world/types";

const chapters: Partial<Record<PathwayId, Lesson[]>> = {
  "motion-forces": physicsChapter1,
  energy: energyChapter1,
  electricity: electricityChapter1,
};

export function getChapterForPathway(pathwayId: PathwayId): Lesson[] {
  return chapters[pathwayId] ?? [];
}

export function pathwayHasChapter(pathwayId: PathwayId): boolean {
  return (chapters[pathwayId]?.length ?? 0) > 0;
}
