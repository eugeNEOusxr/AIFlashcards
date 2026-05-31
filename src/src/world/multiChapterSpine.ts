import type { PathwayId } from "./types";
import type { CurriculumSpineNode } from "./physicsCurriculumSpine";

/** Legacy spine disabled — frame map is the only progression surface. */
export function getPhysicsCurriculumSpine(): CurriculumSpineNode[] {
  return [];
}

export function spineLessonNodes(): Extract<CurriculumSpineNode, { kind: "lesson" }>[] {
  return [];
}

export function getSpineSuccessor(
  _completedPathwayId: PathwayId
): { pathwayId: PathwayId; lessonIndex: number } | null {
  return null;
}
