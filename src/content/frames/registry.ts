import type { LearningModule } from "./types";
import { FORCE_MODULE } from "./modules/forceModule";
import { FORCES_MODULE } from "./modules/forcesModule";
import { validateModule } from "./validateFrame";

const MODULES: Record<string, LearningModule> = {
  [FORCE_MODULE.id]: FORCE_MODULE,
  [FORCES_MODULE.id]: FORCES_MODULE,
};

if (import.meta.env.DEV) {
  for (const mod of Object.values(MODULES)) {
    const errors = validateModule(mod);
    if (errors.length) console.warn("[frames] validation:", errors);
  }
}

/** Physics module map landmarks → frame modules */
export const LANDMARK_MODULE_MAP: Record<string, string> = {
  motion: FORCE_MODULE.id,
  forces: FORCES_MODULE.id,
};

export function getModule(moduleId: string): LearningModule | null {
  return MODULES[moduleId] ?? null;
}

export function getModuleForLandmark(landmarkId: string): LearningModule | null {
  const moduleId = LANDMARK_MODULE_MAP[landmarkId];
  return moduleId ? getModule(moduleId) : null;
}

export function listModules(): LearningModule[] {
  return Object.values(MODULES);
}
