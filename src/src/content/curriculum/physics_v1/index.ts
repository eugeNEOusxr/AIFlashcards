import type { CurriculumGraph } from "../graphTypes";
import { motionModule } from "./motion_module";

/** curriculum.physics_v1 */
export const physicsV1: CurriculumGraph = {
  id: "curriculum.physics_v1",
  version: "1.0.0",
  subject: "physics",
  modules: {
    "module.motion_module": motionModule,
  },
};
