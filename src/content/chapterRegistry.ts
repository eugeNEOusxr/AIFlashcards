import type { Lesson } from "./curriculumTypes";
import { chaptersForSubject, getChapter } from "./curriculum/frameChapterRegistry";
import { PHYSICS_CHAPTER_1 } from "./curriculum/physicsChapter1Hierarchy";
import type { PathwayId } from "../world/types";

/**
 * Legacy lesson arrays are empty — frame chapters drive progression.
 * @see frameChapterRegistry.ts and physicsChapter1Hierarchy.ts
 */
export function getChapterForPathway(pathwayId: PathwayId): Lesson[] {
  if (pathwayId === "motion-forces") return [];
  return [];
}

export function pathwayHasChapter(pathwayId: PathwayId): boolean {
  return pathwayId === "motion-forces";
}

export function getFrameChapterForPathway(pathwayId: PathwayId) {
  if (pathwayId === "motion-forces") return getChapter(PHYSICS_CHAPTER_1.id);
  return null;
}

export { chaptersForSubject, getChapter, PHYSICS_CHAPTER_1 };
