import type { Lesson, LessonQuestion } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

function electricityQuestions(
  namespace: string,
  questions: Parameters<typeof phasedMcqQuestions>[1]
): LessonQuestion[] {
  return phasedMcqQuestions(namespace, questions);
}

/** Electricity pathway — Chapter 1 study sequence (3 lessons). */
export const electricityChapter1: Lesson[] = [
  {
    id: "electricity-lesson-1-charge",
    title: "Lesson 1: Charge & Current",
    explanation:
      "Electric charge creates electric fields. Like charges repel; opposite charges attract. Current is the rate of flow of charge through a conductor when there is a potential difference across it.",
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
    questions: electricityQuestions("physics.electricity.charge", [
      {
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
      {
        id: "elq3",
        prompt: "Current is measured in:",
        options: ["Volts", "Amperes", "Joules", "Newtons"],
        correctIndex: 1,
      },
      {
        id: "elq4",
        prompt: "A conductor allows:",
        options: ["Easy charge flow", "No fields ever", "Only static charge forever", "Mass to vanish"],
        correctIndex: 0,
      },
      {
        id: "elq5",
        prompt: "Potential difference drives:",
        options: ["Charge flow through a circuit", "Only magnetism in vacuum", "Object color", "Inertia"],
        correctIndex: 0,
      },
      {
        id: "elq6",
        prompt: "Electrons in a metal wire move when:",
        options: ["A potential difference is applied", "Mass doubles", "Light is green", "Object is at rest only"],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "electricity-lesson-2-resistance",
    title: "Lesson 2: Resistance & Ohm's Law",
    explanation:
      "Resistance limits current for a given voltage. Ohm's law links potential difference, current, and resistance: V = I × R. Longer, thinner wires typically have higher resistance.",
    visualKeywords: ["resistor", "V=IR", "wire length", "voltage"],
    conceptTags: ["resistance", "ohm law", "voltage"],
    visualTheme: {
      backgroundScene: "contact_fields",
      accentColors: ["purple", "cyan"],
      motifs: ["circuit-glow", "resistor-band", "field-lines"],
    },
    reinforcementFeedback: {
      correct: "You applied V = I R correctly.",
      incorrect: "Higher resistance reduces current for the same voltage.",
    },
    questions: electricityQuestions("physics.electricity.resistance", [
      {
        prompt: "Ohm's law states:",
        options: ["V = I × R", "F = ma", "E = mc²", "P = mgh only"],
        correctIndex: 0,
      },
      {
        id: "elq8",
        prompt: "If resistance increases (voltage constant):",
        options: ["Current decreases", "Current doubles", "Charge disappears", "Mass increases"],
        correctIndex: 0,
      },
      {
        id: "elq9",
        prompt: "Resistance is measured in:",
        options: ["Ohms", "Amperes", "Coulombs", "Meters per second"],
        correctIndex: 0,
      },
      {
        id: "elq10",
        prompt: "A longer thin wire usually has:",
        options: ["Higher resistance", "Zero resistance", "No effect", "Negative mass"],
        correctIndex: 0,
      },
      {
        id: "elq11",
        prompt: "At 12 V, a 4 Ω resistor carries current:",
        options: ["3 A", "48 A", "0.25 A", "12 A"],
        correctIndex: 0,
      },
      {
        id: "elq12",
        prompt: "A fuse protects a circuit by:",
        options: [
          "Breaking when current is too high",
          "Increasing voltage forever",
          "Removing all resistance",
          "Storing charge permanently",
        ],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "electricity-lesson-3-circuits",
    title: "Lesson 3: Series & Parallel Circuits",
    explanation:
      "In series, the same current flows through each component and potential differences add. In parallel, potential difference is shared across branches while branch currents add. Household wiring uses parallel so devices get full mains voltage.",
    visualKeywords: ["series circuit", "parallel branches", "bulbs", "current split"],
    conceptTags: ["series", "parallel", "circuit layout"],
    visualTheme: {
      backgroundScene: "force_applications",
      accentColors: ["cyan", "violet"],
      motifs: ["branch-lines", "bulb-glow", "current-arrow"],
    },
    reinforcementFeedback: {
      correct: "Great — you distinguished series and parallel behavior.",
      incorrect: "Series: same current; parallel: same voltage across branches.",
    },
    questions: electricityQuestions("physics.electricity.circuits", [
      {
        prompt: "In a series circuit:",
        options: [
          "Current is the same through each component",
          "Voltage is always zero",
          "Each branch has different voltage always",
          "Charge is destroyed",
        ],
        correctIndex: 0,
      },
      {
        id: "elq14",
        prompt: "In a parallel circuit:",
        options: [
          "Voltage across branches is the same",
          "Current must be identical in all branches",
          "Only one path exists",
          "Resistance is always zero",
        ],
        correctIndex: 0,
      },
      {
        id: "elq15",
        prompt: "Adding bulbs in series generally:",
        options: [
          "Increases total resistance and dims bulbs",
          "Removes all resistance",
          "Doubles mains voltage",
          "Stops all current forever",
        ],
        correctIndex: 0,
      },
      {
        id: "elq16",
        prompt: "Household sockets are wired in parallel so:",
        options: [
          "Each appliance gets full mains voltage",
          "Only one device can ever work",
          "Current is forced to zero",
          "Resistance becomes infinite",
        ],
        correctIndex: 0,
      },
      {
        id: "elq17",
        prompt: "If one bulb breaks in series:",
        options: ["The whole circuit may stop", "Others get brighter always", "Voltage doubles", "Charge is created"],
        correctIndex: 0,
      },
      {
        id: "elq18",
        prompt: "Total current from the cell in parallel:",
        options: [
          "Equals the sum of branch currents",
          "Is always zero",
          "Equals only the smallest branch",
          "Destroys resistance",
        ],
        correctIndex: 0,
      },
    ]),
  },
];
