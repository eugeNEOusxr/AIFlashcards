import type { Lesson } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

/** Energy pathway — Lesson 1 (more lessons connect in next curriculum pass). */
export const energyChapter1: Lesson[] = [
  {
    id: "energy-lesson-1-work",
    title: "Lesson 1: Work & Energy Transfer",
    explanation:
      "Work happens when a force moves an object through a distance. Energy is the capacity to do work. When you lift a book, you transfer energy into gravitational potential energy stored in the Earth-book system.",
    visualKeywords: ["lifting book", "work", "energy transfer", "potential energy"],
    conceptTags: ["work", "energy", "transfer"],
    visualTheme: {
      backgroundScene: "f_equals_ma",
      accentColors: ["purple", "violet"],
      motifs: ["formula-glow", "light-cart", "acceleration-streaks"],
    },
    reinforcementFeedback: {
      correct: "Good — you linked force, distance, and energy transfer.",
      incorrect: "Re-focus: work requires force and displacement in the force direction.",
    },
    questions: phasedMcqQuestions([
      {
        id: "eq1",
        prompt: "Work is done when:",
        options: ["Force acts with displacement", "Object is at rest", "Temperature changes", "Mass increases"],
        correctIndex: 0,
      },
      {
        id: "eq2",
        prompt: "Energy is best described as:",
        options: ["Only heat", "Capacity to do work", "A type of force", "The same as power"],
        correctIndex: 1,
      },
    ]),
  },
];
