import { getChapterForPathway, pathwayHasChapter } from "../content/chapterRegistry";
import type { PathwayId } from "./types";
import type { ModuleProgressState } from "./types";

type PathwaySlice = {
  chapterComplete: boolean;
  maxUnlockedLessonIndex: number;
};

type EngineSlice = {
  chapterComplete: boolean;
  maxUnlockedLessonIndex: number;
  pathwayId: PathwayId;
};

const PATHWAY_ORDER: PathwayId[] = [
  "motion-forces",
  "energy",
  "electricity",
  "waves",
  "thermodynamics",
];

import { isPathwayCompletedMemory, markPathwayCompletedMemory } from "../memory/memoryStore";

export function markPathwayCompleted(pathwayId: PathwayId): void {
  markPathwayCompletedMemory(pathwayId, getChapterForPathway(pathwayId).length);
}

export function isPathwayCompleted(pathwayId: PathwayId): boolean {
  return isPathwayCompletedMemory(pathwayId);
}

export function pathwayOrder(): PathwayId[] {
  return PATHWAY_ORDER;
}

export function pathwayHasContent(pathwayId: PathwayId): boolean {
  return pathwayHasChapter(pathwayId);
}

function sliceFor(
  pathwayId: PathwayId,
  engine: EngineSlice,
  getSlice?: (id: PathwayId) => PathwaySlice
): PathwaySlice {
  if (engine.pathwayId === pathwayId) {
    return {
      chapterComplete: engine.chapterComplete,
      maxUnlockedLessonIndex: engine.maxUnlockedLessonIndex,
    };
  }
  return getSlice?.(pathwayId) ?? { chapterComplete: false, maxUnlockedLessonIndex: 0 };
}

function motionReachedLesson2(motion: PathwaySlice): boolean {
  return motion.chapterComplete || motion.maxUnlockedLessonIndex >= 1;
}

function energyStarted(energy: PathwaySlice): boolean {
  return energy.chapterComplete || energy.maxUnlockedLessonIndex >= 1;
}

/**
 * Subject-map pathway states — tunnels light only through unlocked nodes.
 * Motion → Energy → Electricity unlock in sequence for Lesson 1.
 */
export function pathwayProgressForPathway(
  pathwayId: PathwayId,
  engine: EngineSlice,
  getSlice?: (id: PathwayId) => PathwaySlice
): ModuleProgressState {
  if (!pathwayHasChapter(pathwayId)) return "locked";

  if (isPathwayCompleted(pathwayId)) return "done";

  const motion = sliceFor("motion-forces", engine, getSlice);
  const energy = sliceFor("energy", engine, getSlice);
  const electricity = sliceFor("electricity", engine, getSlice);

  if (pathwayId === "motion-forces") {
    if (engine.pathwayId === "motion-forces" && !engine.chapterComplete) return "active";
    if (motion.maxUnlockedLessonIndex > 0 || motion.chapterComplete) return "unlocked";
    return "active";
  }

  if (pathwayId === "energy") {
    if (!motionReachedLesson2(motion)) return "locked";
    if (engine.pathwayId === "energy" && !engine.chapterComplete) return "active";
    if (isPathwayCompleted("energy") || energy.chapterComplete) return "done";
    return "unlocked";
  }

  if (pathwayId === "electricity") {
    if (!motionReachedLesson2(motion)) return "locked";
    if (!energyStarted(energy) && !isPathwayCompleted("energy")) return "locked";
    if (engine.pathwayId === "electricity" && !engine.chapterComplete) return "active";
    if (isPathwayCompleted("electricity") || electricity.chapterComplete) return "done";
    return "unlocked";
  }

  const waves = sliceFor("waves", engine, getSlice);
  const thermo = sliceFor("thermodynamics", engine, getSlice);

  if (pathwayId === "waves") {
    if (!isPathwayCompleted("electricity") && !electricity.chapterComplete) return "locked";
    if (engine.pathwayId === "waves" && !engine.chapterComplete) return "active";
    if (isPathwayCompleted("waves") || waves.chapterComplete) return "done";
    return "unlocked";
  }

  if (pathwayId === "thermodynamics") {
    if (!isPathwayCompleted("electricity") && !electricity.chapterComplete) return "locked";
    if (!waves.chapterComplete && !isPathwayCompleted("waves")) return "locked";
    if (engine.pathwayId === "thermodynamics" && !engine.chapterComplete) return "active";
    if (isPathwayCompleted("thermodynamics") || thermo.chapterComplete) return "done";
    return "unlocked";
  }

  return "locked";
}
