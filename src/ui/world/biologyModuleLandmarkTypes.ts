import type { PathwayBiome } from "../../world/pathwayBiomes";
import type {
  BiologyLandmarkSlot,
  BiologyModuleLandmarkId,
} from "../../world/biologyModuleLandmarks";

export type BiologyLandmarkVisualState = "active" | "next" | "mastered" | "unlocked" | "locked";

export type BiologyLandmarkNodeData = {
  id: BiologyModuleLandmarkId;
  title: string;
  tagline: string;
  slot: BiologyLandmarkSlot;
  visual: BiologyLandmarkVisualState;
  biome: PathwayBiome;
  frameBadge: string;
  canEnter: boolean;
  isIgniting: boolean;
};
