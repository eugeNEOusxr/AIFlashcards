import type { Lesson, LessonQuestion } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

function energyQuestions(
  namespace: string,
  questions: Parameters<typeof phasedMcqQuestions>[1]
): LessonQuestion[] {
  return phasedMcqQuestions(namespace, questions);
}

/** Energy pathway — Chapter 1 study sequence (3 lessons). */
export const energyChapter1: Lesson[] = [
  {
    id: "energy-lesson-1-work",
    title: "Lesson 1: Work & Energy Transfer",
    explanation:
      "Work happens when a force moves an object through a distance in the direction of the force. Energy is the capacity to do work. Lifting a book stores gravitational potential energy; pushing a cart transfers kinetic energy.",
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
    questions: energyQuestions("physics.energy.work", [
      {
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
      {
        id: "eq3",
        prompt: "Lifting a book upward transfers energy into:",
        options: ["Sound energy only", "Gravitational potential energy", "Magnetic energy", "No energy store"],
        correctIndex: 1,
      },
      {
        id: "eq4",
        prompt: "The unit of work in SI is:",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctIndex: 1,
      },
      {
        id: "eq5",
        prompt: "If you push a box but it does not move:",
        options: ["Maximum work is done", "No work is done on the box", "Energy is destroyed", "Mass becomes zero"],
        correctIndex: 1,
      },
      {
        id: "eq6",
        prompt: "Power measures:",
        options: ["Energy stored forever", "Rate of energy transfer", "Object color", "Friction only"],
        correctIndex: 1,
      },
    ]),
  },
  {
    id: "energy-lesson-2-stores",
    title: "Lesson 2: Kinetic & Gravitational Energy",
    explanation:
      "Kinetic energy depends on mass and speed: faster, heavier objects carry more kinetic energy. Gravitational potential energy depends on height and mass in a gravitational field. Energy can shift between stores without disappearing.",
    visualKeywords: ["falling object", "height", "speed", "energy stores"],
    conceptTags: ["kinetic energy", "gravitational potential", "energy stores"],
    visualTheme: {
      backgroundScene: "inertia_ice",
      accentColors: ["violet", "cyan"],
      motifs: ["motion-trail", "height-marker", "energy-glow"],
    },
    reinforcementFeedback: {
      correct: "Strong — you connected motion and height to energy stores.",
      incorrect: "Remember: KE grows with speed; GPE grows with height in a field.",
    },
    questions: energyQuestions("physics.energy.stores", [
      {
        prompt: "Kinetic energy increases when:",
        options: ["Speed increases", "Object cools down", "Height decreases only", "Mass becomes zero"],
        correctIndex: 0,
      },
      {
        id: "eq8",
        prompt: "Gravitational potential energy increases when:",
        options: ["Object is lowered", "Object is raised", "Speed is constant at ground", "Charge flows"],
        correctIndex: 1,
      },
      {
        id: "eq9",
        prompt: "A stationary object at ground level has:",
        options: ["Maximum kinetic energy", "Zero kinetic energy (if not moving)", "Infinite power", "No mass"],
        correctIndex: 1,
      },
      {
        id: "eq10",
        prompt: "Doubling speed (same mass) multiplies kinetic energy by:",
        options: ["2", "4", "8", "1"],
        correctIndex: 1,
      },
      {
        id: "eq11",
        prompt: "A falling ball converts GPE mainly into:",
        options: ["Kinetic energy", "Electric charge", "Magnetic poles", "Chemical bonds only"],
        correctIndex: 0,
      },
      {
        id: "eq12",
        prompt: "Energy stores describe:",
        options: ["Where energy is held in a system", "Only temperature", "Wire thickness", "Sound pitch"],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "energy-lesson-3-conservation",
    title: "Lesson 3: Conservation of Energy",
    explanation:
      "In a closed system, total energy remains constant when accounting for all transfers. Some energy often dissipates as thermal energy due to friction or air resistance, but it is not destroyed — it spreads into the surroundings.",
    visualKeywords: ["roller coaster", "friction", "thermal", "closed system"],
    conceptTags: ["conservation", "dissipation", "efficiency"],
    visualTheme: {
      backgroundScene: "force_applications",
      accentColors: ["purple", "magenta"],
      motifs: ["roller-track", "heat-wisp", "energy-flow"],
    },
    reinforcementFeedback: {
      correct: "Excellent — conservation holds when all energy transfers are tracked.",
      incorrect: "Energy is not destroyed; friction transfers it to thermal stores.",
    },
    questions: energyQuestions("physics.energy.conservation", [
      {
        prompt: "Law of conservation of energy states:",
        options: [
          "Energy can be created from nothing",
          "Total energy is constant in a closed system",
          "Only kinetic energy exists",
          "Heat cannot move",
        ],
        correctIndex: 1,
      },
      {
        id: "eq14",
        prompt: "Friction on a slope often converts mechanical energy into:",
        options: ["Thermal energy", "New mass", "Electric charge", "Gravity reversal"],
        correctIndex: 0,
      },
      {
        id: "eq15",
        prompt: "A roller coaster (ideal, no friction) trades:",
        options: ["GPE and KE", "Mass and color", "Current and voltage", "Only sound"],
        correctIndex: 0,
      },
      {
        id: "eq16",
        prompt: "Efficiency compares:",
        options: [
          "Useful energy output to total input",
          "Mass to volume only",
          "Speed to time only",
          "Charge to resistance only",
        ],
        correctIndex: 0,
      },
      {
        id: "eq17",
        prompt: "Inefficient machines waste energy mainly as:",
        options: ["Heat", "New atoms", "Permanent magnetism", "Zero motion"],
        correctIndex: 0,
      },
      {
        id: "eq18",
        prompt: "When a battery powers a lamp, energy transfers through:",
        options: [
          "Electrical → light + thermal pathways",
          "Only gravitational stores",
          "Destruction of charge",
          "Mass creation",
        ],
        correctIndex: 0,
      },
    ]),
  },
];
