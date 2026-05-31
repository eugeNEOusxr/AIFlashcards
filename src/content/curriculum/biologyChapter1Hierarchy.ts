import type { CurriculumChapter } from "./questionHierarchy";

/** Chapter 1 — life in nature (cells + organisms modules live) */
export const BIOLOGY_CHAPTER_1: CurriculumChapter = {
  id: "biology.ch1",
  chapterNumber: 1,
  title: "Life in Nature",
  subtitle: "Cells and living organisms outdoors",
  subjectId: "biology",
  pathwayId: "living-biology",
  modules: [
    {
      landmarkId: "cells",
      moduleId: "biology.cells",
      orderInChapter: 1,
      frames: [
        { frameId: "cells.01", level: 1, contentLayer: "concept", sequenceInChapter: 1 },
        { frameId: "cells.02", level: 1, contentLayer: "context", sequenceInChapter: 2 },
        { frameId: "cells.03", level: 2, contentLayer: "concept", sequenceInChapter: 3 },
        { frameId: "cells.04", level: 2, contentLayer: "assessment", sequenceInChapter: 4 },
      ],
    },
    {
      landmarkId: "organisms",
      moduleId: "biology.organisms",
      orderInChapter: 2,
      frames: [
        { frameId: "organisms.01", level: 1, contentLayer: "concept", sequenceInChapter: 5 },
        { frameId: "organisms.02", level: 1, contentLayer: "context", sequenceInChapter: 6 },
        { frameId: "organisms.03", level: 2, contentLayer: "concept", sequenceInChapter: 7 },
        { frameId: "organisms.04", level: 2, contentLayer: "assessment", sequenceInChapter: 8 },
        { frameId: "organisms.05", level: 3, contentLayer: "assessment", sequenceInChapter: 9 },
      ],
    },
  ],
};
