import type { Lesson } from "./curriculumTypes";
import { getGraphLessonsForMotionModule } from "./curriculum/curriculumGraphLoader";
import { phasedMcqQuestions } from "./legacyMcq";

export type {
  PhaseMode,
  OptionId,
  MCQQuestion,
  Lesson,
  LessonVisualScene,
  QuestionVisualBehavior,
  QuestionReinforcement,
} from "./curriculumTypes";

const [lessonForce01, lessonContact02] = getGraphLessonsForMotionModule();

export const physicsChapter1: Lesson[] = [
  lessonForce01,
  lessonContact02,
  {
    id: "lesson-3-first-law",
    title: "Lesson 3: Newton's First Law",
    explanation:
      "Objects resist changes to their state of motion (inertia). A hockey puck on ice keeps sliding unless an external force interferes. Motion does not stop by itself; only external force changes it.",
    visualKeywords: ["hockey puck", "ice", "inertia", "constant motion"],
    conceptTags: ["newton first law", "inertia", "net force"],
    visualTheme: {
      backgroundScene: "inertia_ice",
      accentColors: ["cyan", "teal"],
      motifs: ["hockey-puck", "motion-trail", "ice-sheen", "inertia-glow"],
    },
    reinforcementFeedback: {
      correct: "Excellent. You identified inertia: motion state persists without net external force.",
      incorrect: "Remember: objects do not naturally stop; changes in motion require external force.",
    },
    questions: phasedMcqQuestions([
      {
        id: "q9",
        prompt: "An object in motion will:",
        options: ["Stop automatically", "Keep moving unless acted on", "Speed up constantly", "Change direction randomly"],
        correctIndex: 1,
      },
      {
        id: "q10",
        prompt: "What is needed to change motion?",
        options: ["Temperature", "Force", "Color", "Volume"],
        correctIndex: 1,
      },
      {
        id: "q11",
        prompt: "Newton's First Law is about:",
        options: ["Energy", "Inertia", "Heat", "Gravity"],
        correctIndex: 1,
      },
      {
        id: "q12",
        prompt: "Inertia means:",
        options: ["Resistance to change in motion", "Speed increase", "Energy loss", "Force creation"],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "lesson-4-second-law",
    title: "Lesson 4: Newton's Second Law",
    explanation:
      "Force creates acceleration according to F = ma. With the same push, a lighter cart accelerates more than a heavier cart. Mass resists acceleration, so force is spread through mass.",
    visualKeywords: ["F=ma", "light cart", "heavy cart", "acceleration"],
    conceptTags: ["newton second law", "mass", "acceleration"],
    visualTheme: {
      backgroundScene: "f_equals_ma",
      accentColors: ["purple", "magenta"],
      motifs: ["formula-glow", "light-cart", "heavy-cart", "acceleration-streaks"],
    },
    reinforcementFeedback: {
      correct: "Strong. You linked acceleration to both applied force and object mass.",
      incorrect: "Ground in equation form: \(a = F/m\). More mass means less acceleration for same force.",
    },
    questions: phasedMcqQuestions([
      {
        id: "q13",
        prompt: "F = ma means:",
        options: [
          "Force equals mass times acceleration",
          "Force equals motion speed",
          "Force equals time",
          "Force equals energy",
        ],
        correctIndex: 0,
      },
      {
        id: "q14",
        prompt: "If mass increases and force stays constant:",
        options: ["Acceleration increases", "Acceleration decreases", "No change", "Stops instantly"],
        correctIndex: 1,
      },
      {
        id: "q15",
        prompt: "Acceleration depends on:",
        options: ["Mass and force", "Color and shape", "Time and space", "Temperature only"],
        correctIndex: 0,
      },
      {
        id: "q16",
        prompt: "Heavier objects require:",
        options: ["Less force", "More force", "No force", "Negative force"],
        correctIndex: 1,
      },
    ]),
  },
  {
    id: "lesson-5-applications",
    title: "Lesson 5: Applications of Force",
    explanation:
      "Everyday motion is force interacting with mass: pushing a cart, throwing a ball, braking a car. Real-world behavior follows the same laws from this chapter.",
    visualKeywords: ["shopping cart", "braking car", "throwing ball", "opposite force"],
    conceptTags: ["application", "everyday physics", "force in systems"],
    visualTheme: {
      backgroundScene: "force_applications",
      accentColors: ["cyan", "violet"],
      motifs: ["shopping-cart", "brake-force", "ball-arc", "opposite-force"],
    },
    reinforcementFeedback: {
      correct: "Great transfer. You applied abstract laws to real-world motion.",
      incorrect: "Translate scenario to model: identify mass, direction of force, and resulting acceleration change.",
    },
    questions: phasedMcqQuestions([
      {
        id: "q17",
        prompt: "Why does a heavy cart require more effort?",
        options: ["More color", "More mass resists motion", "Less gravity", "Less friction"],
        correctIndex: 1,
      },
      {
        id: "q18",
        prompt: "Braking a car is an example of:",
        options: ["Removing force", "Applying opposite force", "Increasing speed", "Adding mass"],
        correctIndex: 1,
      },
    ]),
  },
];
