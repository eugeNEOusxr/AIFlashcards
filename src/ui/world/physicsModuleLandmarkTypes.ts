import type { PathwayBiome } from "../../world/pathwayBiomes";
import type { LandmarkSlot, PhysicsModuleLandmarkId } from "../../world/physicsModuleLandmarks";

export type LandmarkVisualState = "active" | "next" | "mastered" | "unlocked" | "locked";

export type LandmarkNodeData = {
  id: PhysicsModuleLandmarkId;
  title: string;
  tagline: string;
  slot: LandmarkSlot;
  visual: LandmarkVisualState;
  biome: PathwayBiome;
  frameBadge: string;
  canEnter: boolean;
  isIgniting: boolean;
};
