/**
 * Simulation / intuition layer — linked to cognitive graph via IDs only.
 */

export type PhysicsSceneType =
  | "atom"
  | "field"
  | "circuit"
  | "interaction"
  | "energy_transfer";

export type PhysicsStoryNode = {
  id: string;
  title: string;
  sceneType: PhysicsSceneType;
  narration: string;
  linkedConceptNodes: string[];
};

export type FieldLine = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  intensity: number;
  direction: "inward" | "outward";
  sourceCharge: "positive" | "negative";
};

export type Particle = {
  type: "electron" | "proton" | "neutron";
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  charge: number;
};
