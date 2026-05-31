import type { SubjectId } from "../../world/types";
import {
  BIOLOGY_LANDMARK_FLOW_ORDER,
  type BiologyModuleLandmarkId,
} from "../../world/biologyModuleLandmarks";
import {
  CHEMISTRY_LANDMARK_FLOW_ORDER,
  type ChemistryModuleLandmarkId,
} from "../../world/chemistryModuleLandmarks";
import {
  LANDMARK_FLOW_ORDER,
  type PhysicsModuleLandmarkId,
} from "../../world/physicsModuleLandmarks";

export type SubjectLandmarkId =
  | PhysicsModuleLandmarkId
  | ChemistryModuleLandmarkId
  | BiologyModuleLandmarkId;

const PHYSICS_LANDMARK_MODULES: Partial<Record<PhysicsModuleLandmarkId, string>> = {
  motion: "physics.force",
  forces: "physics.forces",
};

const CHEMISTRY_LANDMARK_MODULES: Partial<Record<ChemistryModuleLandmarkId, string>> = {
  matter: "chemistry.matter",
  change: "chemistry.change",
};

const BIOLOGY_LANDMARK_MODULES: Partial<Record<BiologyModuleLandmarkId, string>> = {
  cells: "biology.cells",
  organisms: "biology.organisms",
};

export function landmarkFlowForSubject(subjectId: SubjectId): string[] {
  if (subjectId === "chemistry") return [...CHEMISTRY_LANDMARK_FLOW_ORDER];
  if (subjectId === "biology") return [...BIOLOGY_LANDMARK_FLOW_ORDER];
  return [...LANDMARK_FLOW_ORDER];
}

export function moduleIdForLandmark(
  subjectId: SubjectId,
  landmarkId: string
): string | undefined {
  if (subjectId === "chemistry") {
    return CHEMISTRY_LANDMARK_MODULES[landmarkId as ChemistryModuleLandmarkId];
  }
  if (subjectId === "biology") {
    return BIOLOGY_LANDMARK_MODULES[landmarkId as BiologyModuleLandmarkId];
  }
  return PHYSICS_LANDMARK_MODULES[landmarkId as PhysicsModuleLandmarkId];
}

export function landmarkLabelsForSubject(subjectId: SubjectId): Record<string, string> {
  if (subjectId === "chemistry") {
    return {
      matter: "Matter in Nature",
      mixtures: "Mixtures",
      change: "Change in Nature",
      bonds: "Bonds",
      cycles: "Cycles",
    };
  }
  if (subjectId === "biology") {
    return {
      cells: "Cells & Life",
      organisms: "Living Organisms",
      habitats: "Habitats",
      "energy-life": "Energy in Life",
      diversity: "Biodiversity",
    };
  }
  return {
    motion: "Motion & Forces",
    forces: "Forces",
    energy: "Energy",
    waves: "Waves",
    electricity: "Electricity",
  };
}
