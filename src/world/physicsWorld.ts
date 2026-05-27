import { electricityChapter1 } from "../content/electricityChapter1";
import { energyChapter1 } from "../content/energyChapter1";
import { physicsChapter1 } from "../content/physicsChapter1";
import type { ModuleWorld, PathwayWorld, SubjectWorld } from "./types";

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

const motionLesson = (index: number) => physicsChapter1[index];
const energyLesson = (index: number) => energyChapter1[index];
const electricityLesson = (index: number) => electricityChapter1[index];

export const motionForcesModules: ModuleWorld[] = [
  {
    id: "mod-force",
    pathwayId: "motion-forces",
    title: "What is Force?",
    subtitle: motionLesson(0).title,
    lessonIndex: 0,
    concepts: motionLesson(0).conceptTags,
    depth: 0,
  },
  {
    id: "mod-contact",
    pathwayId: "motion-forces",
    title: "Contact vs Non-contact Forces",
    subtitle: motionLesson(1).title,
    lessonIndex: 1,
    concepts: motionLesson(1).conceptTags,
    depth: 1,
  },
  {
    id: "mod-n1",
    pathwayId: "motion-forces",
    title: "Newton's First Law",
    subtitle: motionLesson(2).title,
    lessonIndex: 2,
    concepts: motionLesson(2).conceptTags,
    depth: 2,
  },
  {
    id: "mod-n2",
    pathwayId: "motion-forces",
    title: "Newton's Second Law",
    subtitle: motionLesson(3).title,
    lessonIndex: 3,
    concepts: motionLesson(3).conceptTags,
    depth: 3,
  },
  {
    id: "mod-applications",
    pathwayId: "motion-forces",
    title: "Applications of Force",
    subtitle: motionLesson(4).title,
    lessonIndex: 4,
    concepts: motionLesson(4).conceptTags,
    depth: 4,
  },
];

export const energyModules: ModuleWorld[] = [
  {
    id: "mod-energy-intro",
    pathwayId: "energy",
    title: "Work & Energy Transfer",
    subtitle: energyLesson(0).title,
    lessonIndex: 0,
    concepts: energyLesson(0).conceptTags,
    depth: 0,
  },
];

export const electricityModules: ModuleWorld[] = [
  {
    id: "mod-electricity-intro",
    pathwayId: "electricity",
    title: "Charge & Current",
    subtitle: electricityLesson(0).title,
    lessonIndex: 0,
    concepts: electricityLesson(0).conceptTags,
    depth: 0,
  },
];

export const physicsPathways: PathwayWorld[] = [
  {
    id: "motion-forces",
    subjectId: "physics",
    title: "Motion & Forces",
    description: "Build intuition for push, pull, inertia, and acceleration",
    available: true,
    moduleIds: motionForcesModules.map((m) => m.id),
  },
  {
    id: "energy",
    subjectId: "physics",
    title: "Energy",
    description: "Lesson 1 live — work, transfer, and conservation (more lessons soon)",
    available: true,
    moduleIds: energyModules.map((m) => m.id),
  },
  {
    id: "electricity",
    subjectId: "physics",
    title: "Electricity",
    description: "Lesson 1 live — charge, fields, and current (more lessons soon)",
    available: true,
    moduleIds: electricityModules.map((m) => m.id),
  },
  {
    id: "waves",
    subjectId: "physics",
    title: "Waves",
    description: "Oscillation, sound, and light behavior",
    available: false,
    moduleIds: [],
  },
  {
    id: "thermodynamics",
    subjectId: "physics",
    title: "Thermodynamics",
    description: "Heat flow, entropy, and engine limits",
    available: false,
    moduleIds: [],
  },
];

export const allModules: ModuleWorld[] = [...motionForcesModules];

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

export function getModulesForPathway(pathwayId: PathwayWorld["id"]) {
  switch (pathwayId) {
    case "motion-forces":
      return motionForcesModules;
    case "energy":
      return energyModules;
    case "electricity":
      return electricityModules;
    default:
      return [];
  }
}

export function getModule(id: ModuleWorld["id"]) {
  return allModules.find((m) => m.id === id);
}
