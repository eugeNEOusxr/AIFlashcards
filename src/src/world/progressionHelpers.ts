import { getChapterForPathway } from "../content/chapterRegistry";
import { isPathwayCompletedMemory } from "../memory/memoryStore";
import type { PathwayId } from "./types";

/** Highest lesson index the user may enter on this pathway (always replayable when completed). */
export function maxUnlockedLessonIndexForPathway(
  pathwayId: PathwayId,
  sliceMaxUnlocked: number
): number {
  const lastIndex = Math.max(0, getChapterForPathway(pathwayId).length - 1);
  if (isPathwayCompletedMemory(pathwayId)) return lastIndex;
  return Math.min(Math.max(0, sliceMaxUnlocked), lastIndex);
}
