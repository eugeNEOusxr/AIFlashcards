import type { Lesson } from "./curriculumTypes";
import { phasedMcqQuestions } from "./legacyMcq";

export const thermodynamicsChapter1: Lesson[] = [
  {
    id: "thermo-lesson-1-temp",
    title: "Lesson 1: Temperature & Heat",
    explanation:
      "Temperature measures average kinetic energy of particles. Heat is energy transferred due to a temperature difference. Thermal equilibrium occurs when no net heat flows between objects.",
    visualKeywords: ["temperature", "heat", "thermal equilibrium", "particles"],
    conceptTags: ["temperature", "heat", "kinetic theory"],
    visualTheme: {
      backgroundScene: "force_applications",
      accentColors: ["violet", "magenta"],
      motifs: ["heat-wisp", "energy-glow"],
    },
    reinforcementFeedback: {
      correct: "You separated temperature from heat transfer.",
      incorrect: "Temperature is not the same as heat — heat is energy in transfer.",
    },
    questions: phasedMcqQuestions("physics.thermal.temp", [
      {
        prompt: "Heat is:",
        options: ["The same as temperature", "Energy due to ΔT", "A force", "A wave"],
        correctIndex: 1,
      },
      {
        id: "th2",
        prompt: "Temperature depends on:",
        options: ["Particle average kinetic energy", "Object colour only", "Mass only", "Voltage"],
        correctIndex: 0,
      },
      {
        id: "th3",
        prompt: "Thermal equilibrium means:",
        options: ["No net heat transfer", "Maximum heat flow", "Zero temperature", "Frozen solid"],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "thermo-lesson-2-conduction",
    title: "Lesson 2: Conduction & Insulation",
    explanation:
      "Conduction transfers heat through solids mainly by particle collisions. Metals have free electrons and conduct well. Insulators trap air or use poor conductors to reduce heat loss.",
    visualKeywords: ["conduction", "insulation", "metals", "particles"],
    conceptTags: ["conduction", "insulation", "particles"],
    reinforcementFeedback: {
      correct: "Good — metals vs insulators linked to particle model.",
      incorrect: "Conduction needs particle interaction; insulators limit it.",
    },
    questions: phasedMcqQuestions("physics.thermal.conduction", [
      {
        prompt: "Metals are good conductors because:",
        options: ["They contain free electrons", "They are always cold", "They block heat", "They create energy"],
        correctIndex: 0,
      },
      {
        id: "th5",
        prompt: "Insulation works by:",
        options: ["Increasing heat flow", "Reducing unwanted transfer", "Creating temperature", "Stopping all motion"],
        correctIndex: 1,
      },
      {
        id: "th6",
        prompt: "Conduction is strongest in:",
        options: ["Solids (typically)", "Vacuum", "Perfect insulators", "Empty space"],
        correctIndex: 0,
      },
    ]),
  },
  {
    id: "thermo-lesson-3-engines",
    title: "Lesson 3: Efficiency & Heat Engines",
    explanation:
      "No heat engine can be 100% efficient — some energy always becomes waste heat. Efficiency is useful energy out divided by total energy in. This limit is described by thermodynamic principles.",
    visualKeywords: ["efficiency", "heat engine", "waste heat", "Carnot"],
    conceptTags: ["efficiency", "heat engine", "waste heat"],
    reinforcementFeedback: {
      correct: "Efficiency limits are central to thermal physics.",
      incorrect: "Some energy always spreads as waste heat — efficiency cannot reach 100%.",
    },
    questions: phasedMcqQuestions("physics.thermal.engines", [
      {
        prompt: "Efficiency is:",
        options: ["Useful output ÷ total input", "Input ÷ output", "Always 100%", "Heat × mass"],
        correctIndex: 0,
      },
      {
        id: "th8",
        prompt: "Waste heat in engines:",
        options: ["Can be eliminated completely", "Is unavoidable", "Is the useful output", "Stops conduction"],
        correctIndex: 1,
      },
      {
        id: "th9",
        prompt: "Improving insulation in a home mainly:",
        options: ["Reduces heat loss", "Creates electricity", "Removes mass", "Stops waves"],
        correctIndex: 0,
      },
    ]),
  },
];
