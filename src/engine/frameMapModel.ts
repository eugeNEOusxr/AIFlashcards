import { getModuleForLandmark } from "../content/frames/registry";
import { completedFrameCount, isModuleComplete } from "../memory/frameProgress";
import type { PhysicsModuleLandmarkId } from "../world/physicsModuleLandmarks";
import type { ModuleProgressState } from "../world/types";

/** Map UI only — zero legacy lesson/question arrays */
export type FrameMapModel = {
  landmarkProgress: (landmarkId: PhysicsModuleLandmarkId) => ModuleProgressState;
  landmarkVisualState: (landmarkId: PhysicsModuleLandmarkId) => LandmarkVisualState;
  activeLandmarkId: () => PhysicsModuleLandmarkId | null;
  canEnterLandmark: (landmarkId: PhysicsModuleLandmarkId) => boolean;
  frameCountForLandmark: (landmarkId: PhysicsModuleLandmarkId) => number;
};

export type LandmarkVisualState = "active" | "next" | "mastered" | "unlocked" | "locked";

const FLOW: PhysicsModuleLandmarkId[] = ["motion", "forces", "energy", "waves", "electricity"];

function flowIndex(landmarkId: PhysicsModuleLandmarkId): number {
  return FLOW.indexOf(landmarkId);
}

function priorLandmarkComplete(landmarkId: PhysicsModuleLandmarkId): boolean {
  const idx = flowIndex(landmarkId);
  if (idx <= 0) return true;
  return landmarkModuleComplete(FLOW[idx - 1]!);
}

/** True when the landmark's frame module is fully complete */
function landmarkModuleComplete(landmarkId: PhysicsModuleLandmarkId): boolean {
  const mod = getModuleForLandmark(landmarkId);
  if (!mod) return false;
  return isModuleComplete(mod.id);
}

export function createFrameMapModel(): FrameMapModel {
  function progress(landmarkId: PhysicsModuleLandmarkId): ModuleProgressState {
    const mod = getModuleForLandmark(landmarkId);
    const idx = flowIndex(landmarkId);

    if (!mod) {
      if (idx > 0 && priorLandmarkComplete(landmarkId)) return "unlocked";
      return "locked";
    }

    if (isModuleComplete(mod.id)) return "done";

    const done = completedFrameCount(mod.id);
    if (done > 0 && done < mod.frames.length) return "active";

    if (done === 0) {
      if (idx === 0) return "active";
      if (priorLandmarkComplete(landmarkId)) return "unlocked";
      return "locked";
    }

    return "active";
  }

  function nextLandmarkInFlow(): PhysicsModuleLandmarkId | null {
    for (const id of FLOW) {
      if (progress(id) !== "done") return id;
    }
    return null;
  }

  function visual(landmarkId: PhysicsModuleLandmarkId): LandmarkVisualState {
    const p = progress(landmarkId);
    if (p === "locked") return "locked";
    if (p === "done") return "mastered";
    if (p === "active") return "active";
    if (landmarkId === nextLandmarkInFlow()) return "next";
    return "unlocked";
  }

  function activeLandmarkId(): PhysicsModuleLandmarkId | null {
    for (const id of FLOW) {
      if (progress(id) === "active") return id;
    }
    const next = nextLandmarkInFlow();
    return next ?? "motion";
  }

  function canEnterLandmark(landmarkId: PhysicsModuleLandmarkId): boolean {
    return getModuleForLandmark(landmarkId) !== null && progress(landmarkId) !== "locked";
  }

  function frameCountForLandmark(landmarkId: PhysicsModuleLandmarkId): number {
    return getModuleForLandmark(landmarkId)?.frames.length ?? 0;
  }

  return {
    landmarkProgress: progress,
    landmarkVisualState: visual,
    activeLandmarkId,
    canEnterLandmark,
    frameCountForLandmark,
  };
}
