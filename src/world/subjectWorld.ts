import { getSubjectProfile } from "./subjectProfiles";
import type { ModuleWorld, PathwayWorld, SubjectId, SubjectWorld } from "./types";

/** Central subject + pathway lookup — Physics and Chemistry are separate paths. */

export const physicsSubject: SubjectWorld = {
  id: "physics",
  label: "Physics",
  tagline: getSubjectProfile("physics").homeTagline,
  available: true,
  pathwayIds: ["motion-forces", "energy", "electricity", "waves", "thermodynamics"],
};

export const chemistrySubject: SubjectWorld = {
  id: "chemistry",
  label: "Chemistry",
  tagline: getSubjectProfile("chemistry").homeTagline,
  available: true,
  pathwayIds: ["nature-chemistry", "chemistry-mixtures", "chemistry-bonds", "chemistry-cycles"],
};

export const biologySubject: SubjectWorld = {
  id: "biology",
  label: "Biology",
  tagline: getSubjectProfile("biology").homeTagline,
  available: true,
  pathwayIds: ["living-biology", "biology-habitats", "biology-energy", "biology-diversity"],
};

export const subjects: SubjectWorld[] = [physicsSubject, chemistrySubject, biologySubject];

const physicsPathways: PathwayWorld[] = [
  {
    id: "motion-forces",
    subjectId: "physics",
    title: "Motion & Forces",
    description: "Push, pull, and how motion changes",
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

const chemistryPathways: PathwayWorld[] = [
  {
    id: "nature-chemistry",
    subjectId: "chemistry",
    title: "Matter & Change in Nature",
    description: "What things are made of and how they transform outdoors",
    available: true,
    moduleIds: [],
  },
  {
    id: "chemistry-mixtures",
    subjectId: "chemistry",
    title: "Mixtures in Nature",
    description: "Air, soil, and seawater blends",
    available: true,
    moduleIds: [],
  },
  {
    id: "chemistry-bonds",
    subjectId: "chemistry",
    title: "Bonds & Particles",
    description: "Coming soon",
    available: true,
    moduleIds: [],
  },
  {
    id: "chemistry-cycles",
    subjectId: "chemistry",
    title: "Earth Cycles",
    description: "Water and matter moving through nature",
    available: true,
    moduleIds: [],
  },
];

export function getSubject(id: SubjectId) {
  return subjects.find((s) => s.id === id);
}

const biologyPathways: PathwayWorld[] = [
  {
    id: "living-biology",
    subjectId: "biology",
    title: "Life in Nature",
    description: "Cells and organisms in the living world",
    available: true,
    moduleIds: [],
  },
  {
    id: "biology-habitats",
    subjectId: "biology",
    title: "Habitats",
    description: "Where species live and survive",
    available: true,
    moduleIds: [],
  },
  {
    id: "biology-energy",
    subjectId: "biology",
    title: "Energy in Life",
    description: "Food chains and energy flow",
    available: true,
    moduleIds: [],
  },
  {
    id: "biology-diversity",
    subjectId: "biology",
    title: "Biodiversity",
    description: "Many species, one planet",
    available: true,
    moduleIds: [],
  },
];

export function getPathwaysForSubject(subjectId: SubjectId) {
  if (subjectId === "chemistry") return chemistryPathways;
  if (subjectId === "biology") return biologyPathways;
  if (subjectId === "physics") return physicsPathways;
  return [];
}

export function getPathway(id: PathwayWorld["id"]) {
  return [...physicsPathways, ...chemistryPathways, ...biologyPathways].find((p) => p.id === id);
}

/** Legacy API stub — frame map uses landmarks, not pathway modules. */
export function getModulesForPathway(_pathwayId: PathwayWorld["id"]): ModuleWorld[] {
  return [];
}

export function getLegacyModule(_id: ModuleWorld["id"]) {
  return undefined;
}
