import type { Lesson } from "./curriculumTypes";
import type { PathwayId } from "../world/types";

/**
 * Frame-only app: legacy chapter arrays are not loaded.
 * Do not import physicsChapter1 / energyChapter1 / etc. here.
 */
export function getChapterForPathway(_pathwayId: PathwayId): Lesson[] {
  return [];
}

export function pathwayHasChapter(_pathwayId: PathwayId): boolean {
  return false;
}
