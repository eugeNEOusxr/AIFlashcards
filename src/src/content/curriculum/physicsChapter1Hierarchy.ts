import type { CurriculumChapter } from "./questionHierarchy";

/** Chapter 1 — frame modules only (Motion landmark + Forces landmark) */
export const PHYSICS_CHAPTER_1: CurriculumChapter = {
  id: "physics.ch1",
  chapterNumber: 1,
  title: "Forces & Motion",
  subtitle: "Push, pull, and how things move",
  subjectId: "physics",
  pathwayId: "motion-forces",
  modules: [
    {
      landmarkId: "motion",
      moduleId: "physics.force",
      orderInChapter: 1,
      frames: [
        { frameId: "force.01", level: 1, contentLayer: "concept", sequenceInChapter: 1 },
        { frameId: "force.02", level: 1, contentLayer: "context", sequenceInChapter: 2 },
        { frameId: "force.03", level: 2, contentLayer: "concept", sequenceInChapter: 3 },
        { frameId: "force.04", level: 2, contentLayer: "assessment", sequenceInChapter: 4 },
      ],
    },
    {
      landmarkId: "forces",
      moduleId: "physics.forces",
      orderInChapter: 2,
      frames: [
        { frameId: "forces.01", level: 1, contentLayer: "concept", sequenceInChapter: 5 },
        { frameId: "forces.02", level: 1, contentLayer: "context", sequenceInChapter: 6 },
        { frameId: "forces.03", level: 2, contentLayer: "concept", sequenceInChapter: 7 },
        { frameId: "forces.04", level: 2, contentLayer: "assessment", sequenceInChapter: 8 },
        { frameId: "forces.05", level: 3, contentLayer: "assessment", sequenceInChapter: 9 },
      ],
    },
  ],
};
