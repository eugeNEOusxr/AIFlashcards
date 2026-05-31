import type { CurriculumChapter } from "./questionHierarchy";

/** Chapter 1 — chemistry in nature (matter + change modules live) */
export const CHEMISTRY_CHAPTER_1: CurriculumChapter = {
  id: "chemistry.ch1",
  chapterNumber: 1,
  title: "Chemistry in Nature",
  subtitle: "Matter and change outdoors",
  subjectId: "chemistry",
  pathwayId: "nature-chemistry",
  modules: [
    {
      landmarkId: "matter",
      moduleId: "chemistry.matter",
      orderInChapter: 1,
      frames: [
        { frameId: "matter.01", level: 1, contentLayer: "concept", sequenceInChapter: 1 },
        { frameId: "matter.02", level: 1, contentLayer: "context", sequenceInChapter: 2 },
        { frameId: "matter.03", level: 2, contentLayer: "concept", sequenceInChapter: 3 },
        { frameId: "matter.04", level: 2, contentLayer: "assessment", sequenceInChapter: 4 },
      ],
    },
    {
      landmarkId: "change",
      moduleId: "chemistry.change",
      orderInChapter: 2,
      frames: [
        { frameId: "change.01", level: 1, contentLayer: "concept", sequenceInChapter: 5 },
        { frameId: "change.02", level: 1, contentLayer: "context", sequenceInChapter: 6 },
        { frameId: "change.03", level: 2, contentLayer: "concept", sequenceInChapter: 7 },
        { frameId: "change.04", level: 2, contentLayer: "assessment", sequenceInChapter: 8 },
        { frameId: "change.05", level: 3, contentLayer: "assessment", sequenceInChapter: 9 },
      ],
    },
  ],
};
