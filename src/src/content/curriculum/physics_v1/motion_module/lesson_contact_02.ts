import type { CurriculumLessonNode } from "../../graphTypes";
import { lessonInertia01 } from "./lesson_inertia_01";

/**
 * Legacy graph id alias — same node as lesson.lesson_inertia_01 (no content duplication).
 */
export const lessonContact02: CurriculumLessonNode = {
  ...lessonInertia01,
  id: "lesson.lesson_contact_02",
};

/** Spec alias for tooling that references lesson_inertia_01 as Module 2 slot */
export const lessonInertia01Alias = lessonInertia01;
