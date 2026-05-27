import type { ModuleProgressState } from "./types";

type EngineSlice = {
  currentLessonIndex: number;
  maxUnlockedLessonIndex: number;
  chapterComplete: boolean;
};

export function moduleProgressForLesson(
  lessonIndex: number,
  engine: EngineSlice
): ModuleProgressState {
  if (engine.chapterComplete || lessonIndex < engine.currentLessonIndex) {
    return "done";
  }
  if (lessonIndex > engine.maxUnlockedLessonIndex) {
    return "locked";
  }
  if (lessonIndex === engine.currentLessonIndex) {
    return "active";
  }
  return "unlocked";
}
