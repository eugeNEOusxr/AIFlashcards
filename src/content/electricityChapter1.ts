import type { Lesson } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

/** Electricity pathway — Lesson 1 (more lessons connect in next curriculum pass). */
export const electricityChapter1: Lesson[] = [
  {
    id: "electricity-lesson-1-charge",
    title: "Lesson 1: Charge & Current",
    explanation:
      "Electric charge creates electric fields. Like charges repel; opposite charges attract. Current is the flow of charge through a conductor when there is a potential difference.",
    visualKeywords: ["charge", "current", "circuit", "field lines"],
    conceptTags: ["charge", "current", "field"],
    visualTheme: {
      backgroundScene: "contact_fields",
      accentColors: ["cyan", "purple"],
      motifs: ["gravity-field", "magnet-arcs", "field-lines"],
    },
    reinforcementFeedback: {
      correct: "Nice — charge, field, and current are connected.",
      incorrect: "Remember: current is charge flow driven by potential difference.",
    },
    questions: phasedMcqQuestions([
      {
        id: "elq1",
        prompt: "Electric current is:",
        options: ["Flow of charge", "Flow of heat", "A magnetic pole", "Stored mass"],
        correctIndex: 0,
      },
      {
        id: "elq2",
        prompt: "Like charges:",
        options: ["Attract", "Repel", "Cancel", "Create gravity"],
        correctIndex: 1,
      },
    ]),
  },
];
