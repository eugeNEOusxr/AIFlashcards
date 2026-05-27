export type Domain = "physics" | "math" | "chemistry";

/** 0 = center (orientation) … 4 = outer ring (mastery) */
export type LearningPhase = 0 | 1 | 2 | 3 | 4;

export type LearningNode = {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  phase: LearningPhase;
  difficulty: number;
  prerequisites: string[];
  /** Derived from graph + progress; stored for convenience in UI */
  unlocked: boolean;
  completed: boolean;
};

export type LearningEdge = {
  id: string;
  from: string;
  to: string;
  kind: "prerequisite";
};

export type NodeQuestion = {
  id: string;
  prompt: string;
};

export type WorldProgress = {
  completedNodeIds: string[];
  activeNodeId: string | null;
  /** Per node: index of next question to show (sequential, no random) */
  questionIndexByNode: Record<string, number>;
};

export const PHASE_LABELS: Record<LearningPhase, string> = {
  0: "Orientation",
  1: "Foundations",
  2: "Application",
  3: "Integration",
  4: "Mastery",
};
