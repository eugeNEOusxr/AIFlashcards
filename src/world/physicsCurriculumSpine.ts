/**
 * Physics curriculum spine — five chapters on a multi-lane map.
 * Implementation: multiChapterSpine.ts + physicsChapterPlan.ts
 */
import type { PhysicsChapterId } from "../content/physicsChapterPlan";
import type { PathwayId } from "./types";

export type CurriculumSpineNode =
  | {
      kind: "lesson";
      id: string;
      chapterId: PhysicsChapterId;
      pathwayId: PathwayId;
      lessonIndex: number;
      title: string;
      subtitle: string;
      concepts: string[];
    };

export {
  getPhysicsCurriculumSpine,
  getSpineSuccessor,
  spineLessonNodes,
} from "./multiChapterSpine";
