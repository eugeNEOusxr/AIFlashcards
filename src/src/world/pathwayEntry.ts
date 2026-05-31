import { getChapterForPathway } from "../content/chapterRegistry";
import { maxUnlockedLessonIndexForPathway } from "./progressionHelpers";
import type { PathwayId } from "./types";

type PathwaySlice = {
  chapterComplete: boolean;
  currentLessonIndex: number;
  maxUnlockedLessonIndex: number;
};

/**
 * Lesson index when entering a pathway from the subject map.
 */
export function entryLessonIndexForPathway(
  pathwayId: PathwayId,
  getSlice: (id: PathwayId) => PathwaySlice
): number {
  const chapter = getChapterForPathway(pathwayId);
  if (chapter.length === 0) return 0;

  const slice = getSlice(pathwayId);
  const cap = maxUnlockedLessonIndexForPathway(pathwayId, slice.maxUnlockedLessonIndex);
  const preferred = slice.currentLessonIndex;

  if (preferred >= 0 && preferred <= cap) return preferred;
  return 0;
}

export function clampLessonIndex(pathwayId: PathwayId, index: number): number {
  const last = Math.max(0, getChapterForPathway(pathwayId).length - 1);
  return Math.max(0, Math.min(index, last));
}
