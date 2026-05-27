import type { LearningEdge, LearningNode, NodeQuestion } from "./types";

const Q = (id: string, prompt: string): NodeQuestion => ({ id, prompt });

/** Phased world: higher phase = deeper ring. Questions belong only to nodes. */
export const SEED_NODES: LearningNode[] = [
  {
    id: "phys-p0-map",
    title: "Physics world map",
    description: "How this curriculum is organized — phases and skills.",
    domain: "physics",
    phase: 0,
    difficulty: 1,
    prerequisites: [],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p1-units",
    title: "Units & measurement",
    description: "SI base units, significant figures, dimensional sanity.",
    domain: "physics",
    phase: 1,
    difficulty: 1,
    prerequisites: ["phys-p0-map"],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p1-vectors",
    title: "Vectors & components",
    description: "Adding vectors, resolving into x/y, magnitude and direction.",
    domain: "physics",
    phase: 1,
    difficulty: 2,
    prerequisites: ["phys-p0-map"],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p2-newton",
    title: "Newton's laws",
    description: "F=ma, free-body diagrams, action–reaction pairs.",
    domain: "physics",
    phase: 2,
    difficulty: 2,
    prerequisites: ["phys-p1-units", "phys-p1-vectors"],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p2-energy",
    title: "Work & energy",
    description: "Work, kinetic and potential energy, conservation along a path.",
    domain: "physics",
    phase: 2,
    difficulty: 3,
    prerequisites: ["phys-p1-units"],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p3-circuits",
    title: "DC circuits intuition",
    description: "Series/parallel, voltage drops, power in resistors.",
    domain: "physics",
    phase: 3,
    difficulty: 3,
    prerequisites: ["phys-p2-newton", "phys-p2-energy"],
    unlocked: false,
    completed: false,
  },
  {
    id: "phys-p4-synthesis",
    title: "Mechanics synthesis",
    description: "Multi-step problems mixing forces, energy, and constraints.",
    domain: "physics",
    phase: 4,
    difficulty: 4,
    prerequisites: ["phys-p3-circuits"],
    unlocked: false,
    completed: false,
  },
];

export const NODE_QUESTIONS: Record<string, NodeQuestion[]> = {
  "phys-p0-map": [
    Q("phys-p0-map-q1", "In one sentence: what does Phase 2 (Application) mean in this map?"),
    Q("phys-p0-map-q2", "Name one skill you expect to gain before reaching Mastery (Phase 4)."),
  ],
  "phys-p1-units": [
    Q("phys-p1-units-q1", "What is the SI unit of force?"),
    Q("phys-p1-units-q2", "Why check dimensions before trusting a formula?"),
  ],
  "phys-p1-vectors": [
    Q("phys-p1-vectors-q1", "How do you add two perpendicular vectors?"),
    Q("phys-p1-vectors-q2", "What does the magnitude of a velocity vector represent?"),
  ],
  "phys-p2-newton": [
    Q("phys-p2-newton-q1", "State Newton's second law in words."),
    Q("phys-p2-newton-q2", "What object do you draw forces on in a free-body diagram?"),
  ],
  "phys-p2-energy": [
    Q("phys-p2-energy-q1", "When is mechanical energy approximately conserved?"),
    Q("phys-p2-energy-q2", "What is the work–energy theorem in one line?"),
  ],
  "phys-p3-circuits": [
    Q("phys-p3-circuits-q1", "In series, what is the same across each resistor: V or I?"),
    Q("phys-p3-circuits-q2", "Why can parallel branches have different currents?"),
  ],
  "phys-p4-synthesis": [
    Q("phys-p4-synthesis-q1", "Outline steps for a block on a ramp with friction (no numbers)."),
    Q("phys-p4-synthesis-q2", "When would you switch from forces to energy for the same problem?"),
  ],
};

export const SEED_EDGES: LearningEdge[] = [
  { id: "e1", from: "phys-p0-map", to: "phys-p1-units", kind: "prerequisite" },
  { id: "e2", from: "phys-p0-map", to: "phys-p1-vectors", kind: "prerequisite" },
  { id: "e3", from: "phys-p1-units", to: "phys-p2-newton", kind: "prerequisite" },
  { id: "e4", from: "phys-p1-vectors", to: "phys-p2-newton", kind: "prerequisite" },
  { id: "e5", from: "phys-p1-units", to: "phys-p2-energy", kind: "prerequisite" },
  { id: "e6", from: "phys-p2-newton", to: "phys-p3-circuits", kind: "prerequisite" },
  { id: "e7", from: "phys-p2-energy", to: "phys-p3-circuits", kind: "prerequisite" },
  { id: "e8", from: "phys-p3-circuits", to: "phys-p4-synthesis", kind: "prerequisite" },
];
