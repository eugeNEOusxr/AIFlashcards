import type { CurriculumModule } from "./curriculumTypes";
import { physicsMotion02Module } from "./modules/physicsMotion02";

/** World module metadata — content pipeline registry (no engine coupling). */
export const curriculumModulesByWorldId: Record<string, CurriculumModule> = {
  "mod-contact": physicsMotion02Module,
};

export function getCurriculumModule(worldModuleId: string): CurriculumModule | undefined {
  return curriculumModulesByWorldId[worldModuleId];
}
