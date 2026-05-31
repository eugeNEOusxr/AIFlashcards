import { bindModuleToChapter, type BoundLearningModule } from "../curriculum/bindChapterHierarchy";
import { BIOLOGY_CHAPTER_1 } from "../curriculum/biologyChapter1Hierarchy";
import { CHEMISTRY_CHAPTER_1 } from "../curriculum/chemistryChapter1Hierarchy";
import { PHYSICS_CHAPTER_1 } from "../curriculum/physicsChapter1Hierarchy";
import { moduleIdForLandmark } from "./subjectLandmarks";
import type { SubjectId } from "../../world/types";
import { CELLS_MODULE } from "./modules/cellsModule";
import { CHANGE_MODULE } from "./modules/changeModule";
import { FORCE_MODULE } from "./modules/forceModule";
import { FORCES_MODULE } from "./modules/forcesModule";
import { MATTER_MODULE } from "./modules/matterModule";
import { ORGANISMS_MODULE } from "./modules/organismsModule";
import { validateModule } from "./validateFrame";

const MODULES: Record<string, BoundLearningModule> = {
  [FORCE_MODULE.id]: bindModuleToChapter(FORCE_MODULE, PHYSICS_CHAPTER_1, "motion"),
  [FORCES_MODULE.id]: bindModuleToChapter(FORCES_MODULE, PHYSICS_CHAPTER_1, "forces"),
  [MATTER_MODULE.id]: bindModuleToChapter(MATTER_MODULE, CHEMISTRY_CHAPTER_1, "matter"),
  [CHANGE_MODULE.id]: bindModuleToChapter(CHANGE_MODULE, CHEMISTRY_CHAPTER_1, "change"),
  [CELLS_MODULE.id]: bindModuleToChapter(CELLS_MODULE, BIOLOGY_CHAPTER_1, "cells"),
  [ORGANISMS_MODULE.id]: bindModuleToChapter(ORGANISMS_MODULE, BIOLOGY_CHAPTER_1, "organisms"),
};

if (import.meta.env.DEV) {
  for (const mod of Object.values(MODULES)) {
    const errors = validateModule(mod);
    if (errors.length) console.warn("[frames] validation:", errors);
  }
}

export function getModule(moduleId: string): BoundLearningModule | null {
  return MODULES[moduleId] ?? null;
}

export function getModuleForLandmark(
  landmarkId: string,
  subjectId: SubjectId = "physics"
): BoundLearningModule | null {
  const moduleId = moduleIdForLandmark(subjectId, landmarkId);
  return moduleId ? getModule(moduleId) : null;
}

export function listModules(): BoundLearningModule[] {
  return Object.values(MODULES);
}

export function listModulesForSubject(subjectId: SubjectId): BoundLearningModule[] {
  return listModules().filter((m) => m.id.startsWith(`${subjectId}.`));
}
