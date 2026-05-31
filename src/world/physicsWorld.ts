import type { ModuleWorld, PathwayWorld, SubjectWorld } from "./types";

/** Subject tiles + pathway labels only — no legacy lesson chapter imports. */

export const physicsSubject: SubjectWorld = {
  id: "physics",
  label: "Physics",
  tagline: "Explore forces, energy, and the rules of motion",
  available: true,
  pathwayIds: ["motion-forces", "energy", "electricity", "waves", "thermodynamics"],
};

export const chemistrySubject: SubjectWorld = {
  id: "chemistry",
  label: "Chemistry",
  tagline: "Reactions, bonds, and matter transformations",
  available: false,
  pathwayIds: [],
};

export const biologySubject: SubjectWorld = {
  id: "biology",
  label: "Biology",
  tagline: "Living systems and cellular intelligence",
  available: false,
  pathwayIds: [],
};

export const subjects: SubjectWorld[] = [physicsSubject, chemistrySubject, biologySubject];

const physicsPathways: PathwayWorld[] = [
  {
    id: "motion-forces",
    subjectId: "physics",
    title: "Motion & Forces",
    description: "Frame-based force concepts",
    available: true,
    moduleIds: [],
  },
  {
    id: "energy",
    subjectId: "physics",
    title: "Energy",
    description: "Coming soon",
    available: true,
    moduleIds: [],
  },
  {
    id: "electricity",
    subjectId: "physics",
    title: "Electricity",
    description: "Coming soon",
    available: true,
    moduleIds: [],
  },
  {
    id: "waves",
    subjectId: "physics",
    title: "Waves",
    description: "Coming soon",
    available: true,
    moduleIds: [],
  },
  {
    id: "thermodynamics",
    subjectId: "physics",
    title: "Thermal Physics",
    description: "Coming soon",
    available: true,
    moduleIds: [],
  },
];

export function getSubject(id: SubjectWorld["id"]) {
  return subjects.find((s) => s.id === id);
}

export function getPathwaysForSubject(subjectId: SubjectWorld["id"]) {
  if (subjectId !== "physics") return [];
  return physicsPathways;
}

export function getPathway(id: PathwayWorld["id"]) {
  return physicsPathways.find((p) => p.id === id);
}

/** Legacy API stub — frame map uses landmarks, not pathway modules. */
export function getModulesForPathway(_pathwayId: PathwayWorld["id"]): ModuleWorld[] {
  return [];
}

export function getModule(_id: ModuleWorld["id"]) {
  return undefined;
}
