import type { CurriculumModuleNode } from "../../graphTypes";
import { lessonContact02 } from "./lesson_contact_02";
import { lessonForce01 } from "./lesson_force_01";
import { lessonInertia01 } from "./lesson_inertia_01";

/** module.motion_module */
export const motionModule: CurriculumModuleNode = {
  id: "module.motion_module",
  legacyModuleId: "mod-force",
  title: "Motion & Forces",
  pathway: "motion-forces",
  tier: "beginner",
  lessonIds: ["lesson.lesson_force_01", "lesson.lesson_inertia_01"],
  lessons: {
    "lesson.lesson_force_01": lessonForce01,
    "lesson.lesson_inertia_01": lessonInertia01,
    "lesson.lesson_contact_02": lessonContact02,
  },
};
