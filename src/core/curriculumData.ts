import type { CurriculumTopic, Domain, LessonQuestion } from "./learningTypes";

export const DOMAIN_LABELS: Record<Domain, string> = {
  math: "Math",
  physics: "Physics",
  chemistry: "Chemistry",
};

/** Structured curriculum topics — NOT random question pools. */
export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  // Math
  {
    id: "math-calculus",
    domain: "math",
    title: "Calculus foundations",
    description: "Limits, derivatives, and rates of change.",
    difficulty: 3,
    prerequisites: ["math-algebra"],
    estimatedWeeks: 6,
    fitScore: 0,
  },
  {
    id: "math-algebra",
    domain: "math",
    title: "Algebra & equations",
    description: "Variables, linear systems, symbolic reasoning.",
    difficulty: 2,
    prerequisites: [],
    estimatedWeeks: 4,
    fitScore: 0,
  },
  {
    id: "math-geometry",
    domain: "math",
    title: "Geometry & proofs",
    description: "Shapes, theorems, spatial reasoning.",
    difficulty: 2,
    prerequisites: [],
    estimatedWeeks: 5,
    fitScore: 0,
  },
  // Physics
  {
    id: "phys-mechanics",
    domain: "physics",
    title: "Mechanics",
    description: "Force, motion, Newton's laws.",
    difficulty: 2,
    prerequisites: [],
    estimatedWeeks: 5,
    fitScore: 0,
  },
  {
    id: "phys-electricity",
    domain: "physics",
    title: "Electricity",
    description: "Charge, circuits, voltage, current.",
    difficulty: 3,
    prerequisites: ["phys-mechanics"],
    estimatedWeeks: 6,
    fitScore: 0,
  },
  {
    id: "phys-waves",
    domain: "physics",
    title: "Waves & optics",
    description: "Frequency, interference, light behavior.",
    difficulty: 3,
    prerequisites: ["phys-mechanics"],
    estimatedWeeks: 4,
    fitScore: 0,
  },
  {
    id: "phys-thermo",
    domain: "physics",
    title: "Thermodynamics",
    description: "Heat, energy transfer, entropy basics.",
    difficulty: 4,
    prerequisites: ["phys-mechanics"],
    estimatedWeeks: 5,
    fitScore: 0,
  },
  // Chemistry
  {
    id: "chem-atoms",
    domain: "chemistry",
    title: "Atoms & structure",
    description: "Protons, electrons, periodic trends.",
    difficulty: 1,
    prerequisites: [],
    estimatedWeeks: 3,
    fitScore: 0,
  },
  {
    id: "chem-bonds",
    domain: "chemistry",
    title: "Bonding & molecules",
    description: "Ionic, covalent, molecular geometry.",
    difficulty: 2,
    prerequisites: ["chem-atoms"],
    estimatedWeeks: 4,
    fitScore: 0,
  },
  {
    id: "chem-reactions",
    domain: "chemistry",
    title: "Reactions & stoichiometry",
    description: "Balancing, moles, reaction types.",
    difficulty: 3,
    prerequisites: ["chem-bonds"],
    estimatedWeeks: 5,
    fitScore: 0,
  },
];

const q = (
  topicId: string,
  prompt: string,
  phase: LessonQuestion["phase"],
  difficulty: number,
  expectedConcept?: string
): Omit<LessonQuestion, "id"> => ({
  topicId,
  prompt,
  phase,
  difficulty,
  expectedConcept,
});

/** All questions originate from curriculum topics. */
export const LESSON_BANK: LessonQuestion[] = [
  // math-algebra
  { ...q("math-algebra", "What does solving for x mean?", "diagnostic", 1, "isolation"), id: "ma-d1" },
  { ...q("math-algebra", "Solve: 2x + 3 = 11", "diagnostic", 1, "x=4"), id: "ma-d2" },
  { ...q("math-algebra", "What is slope in y = mx + b?", "lesson", 2, "rate"), id: "ma-l1" },
  { ...q("math-algebra", "Factor: x² − 9", "lesson", 2, "difference of squares"), id: "ma-l2" },
  { ...q("math-algebra", "Solve a system: x+y=5, x−y=1", "challenge", 3, "elimination"), id: "ma-c1" },
  // math-calculus
  { ...q("math-calculus", "What is a limit (intuition)?", "diagnostic", 1, "approach"), id: "mc-d1" },
  { ...q("math-calculus", "Derivative of x²?", "diagnostic", 2, "2x"), id: "mc-d2" },
  { ...q("math-calculus", "What does derivative represent?", "lesson", 2, "instantaneous rate"), id: "mc-l1" },
  { ...q("math-calculus", "Power rule on x³", "challenge", 3, "3x²"), id: "mc-c1" },
  // math-geometry
  { ...q("math-geometry", "Sum of angles in a triangle?", "diagnostic", 1, "180"), id: "mg-d1" },
  { ...q("math-geometry", "Pythagorean theorem states?", "lesson", 2, "a²+b²=c²"), id: "mg-l1" },
  // phys-mechanics
  { ...q("phys-mechanics", "Newton's 2nd law in words?", "diagnostic", 1, "F=ma"), id: "pm-d1" },
  { ...q("phys-mechanics", "Unit of force?", "diagnostic", 1, "newton"), id: "pm-d2" },
  { ...q("phys-mechanics", "What causes acceleration?", "lesson", 2, "net force"), id: "pm-l1" },
  { ...q("phys-mechanics", "Kinetic energy formula?", "challenge", 3, "½mv²"), id: "pm-c1" },
  // phys-electricity
  { ...q("phys-electricity", "What is electric charge?", "diagnostic", 1, "property of matter"), id: "pe-d1" },
  { ...q("phys-electricity", "Relationship V = IR is called?", "lesson", 2, "Ohm's law"), id: "pe-l1" },
  // phys-waves
  { ...q("phys-waves", "What is frequency?", "diagnostic", 1, "cycles per second"), id: "pw-d1" },
  { ...q("phys-waves", "Speed of wave = wavelength × ?", "lesson", 2, "frequency"), id: "pw-l1" },
  // phys-thermo
  { ...q("phys-thermo", "Heat vs temperature?", "diagnostic", 1, "energy vs avg kinetic"), id: "pt-d1" },
  { ...q("phys-thermo", "First law of thermodynamics?", "lesson", 3, "energy conservation"), id: "pt-l1" },
  // chem-atoms
  { ...q("chem-atoms", "What is an atom?", "diagnostic", 1, "smallest unit"), id: "ca-d1" },
  { ...q("chem-atoms", "Periodic table organizes by?", "lesson", 2, "atomic number"), id: "ca-l1" },
  // chem-bonds
  { ...q("chem-bonds", "Covalent bond means?", "diagnostic", 1, "shared electrons"), id: "cb-d1" },
  { ...q("chem-bonds", "Ionic vs covalent difference?", "lesson", 2, "transfer vs share"), id: "cb-l1" },
  // chem-reactions
  { ...q("chem-reactions", "What is a mole?", "diagnostic", 2, "6.02e23 particles"), id: "cr-d1" },
  { ...q("chem-reactions", "Why balance equations?", "lesson", 2, "conservation of mass"), id: "cr-l1" },
];

export function getTopicById(id: string): CurriculumTopic | undefined {
  return CURRICULUM_TOPICS.find((t) => t.id === id);
}

export function getQuestionsForTopic(topicId: string): LessonQuestion[] {
  return LESSON_BANK.filter((q) => q.topicId === topicId);
}
