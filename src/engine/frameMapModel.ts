import { getModuleForLandmark } from "../content/frames/registry";
import { landmarkFlowForSubject } from "../content/frames/subjectLandmarks";
import { completedFrameCount, isModuleComplete } from "../memory/frameProgress";
import type { SubjectId } from "../world/types";
import type { ModuleProgressState } from "../world/types";

/** Map UI only — zero legacy lesson/question arrays */
export type FrameMapModel = {
  subjectId: SubjectId;
  landmarkProgress: (landmarkId: string) => ModuleProgressState;
  landmarkVisualState: (landmarkId: string) => LandmarkVisualState;
  activeLandmarkId: () => string | null;
  canEnterLandmark: (landmarkId: string) => boolean;
  frameCountForLandmark: (landmarkId: string) => number;
  landmarkFlow: () => string[];
};

export type LandmarkVisualState = "active" | "next" | "mastered" | "unlocked" | "locked";

function flowIndex(flow: string[], landmarkId: string): number {
  return flow.indexOf(landmarkId);
}

function priorLandmarkComplete(
  flow: string[],
  landmarkId: string,
  subjectId: SubjectId
): boolean {
  const idx = flowIndex(flow, landmarkId);
  if (idx <= 0) return true;
  return landmarkModuleComplete(flow[idx - 1]!, subjectId);
}

function landmarkModuleComplete(landmarkId: string, subjectId: SubjectId): boolean {
  const mod = getModuleForLandmark(landmarkId, subjectId);
  if (!mod) return false;
  return isModuleComplete(mod.id);
}

export function createFrameMapModel(subjectId: SubjectId): FrameMapModel {
  const flow = landmarkFlowForSubject(subjectId);
  const defaultActive = flow[0] ?? null;

  function progress(landmarkId: string): ModuleProgressState {
    const mod = getModuleForLandmark(landmarkId, subjectId);
    const idx = flowIndex(flow, landmarkId);

    if (!mod) {
      if (idx > 0 && priorLandmarkComplete(flow, landmarkId, subjectId)) return "unlocked";
      return "locked";
    }

    if (isModuleComplete(mod.id)) return "done";

    const done = completedFrameCount(mod.id);
    if (done > 0 && done < mod.frames.length) return "active";

    if (done === 0) {
      if (idx === 0) return "active";
      if (priorLandmarkComplete(flow, landmarkId, subjectId)) return "unlocked";
      return "locked";
    }

    return "active";
  }

  function nextLandmarkInFlow(): string | null {
    for (const id of flow) {
      if (progress(id) !== "done") return id;
    }
    return null;
  }

  function visual(landmarkId: string): LandmarkVisualState {
    const p = progress(landmarkId);
    if (p === "locked") return "locked";
    if (p === "done") return "mastered";
    if (p === "active") return "active";
    if (landmarkId === nextLandmarkInFlow()) return "next";
    return "unlocked";
  }

  function activeLandmarkId(): string | null {
    for (const id of flow) {
      if (progress(id) === "active") return id;
    }
    return nextLandmarkInFlow() ?? defaultActive;
  }

  function canEnterLandmark(landmarkId: string): boolean {
    return getModuleForLandmark(landmarkId, subjectId) !== null && progress(landmarkId) !== "locked";
  }

  function frameCountForLandmark(landmarkId: string): number {
    return getModuleForLandmark(landmarkId, subjectId)?.frames.length ?? 0;
  }

  return {
    subjectId,
    landmarkProgress: progress,
    landmarkVisualState: visual,
    activeLandmarkId,
    canEnterLandmark,
    frameCountForLandmark,
    landmarkFlow: () => flow,
  };
}
