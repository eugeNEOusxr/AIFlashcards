import type { PathwayBiome } from "../../world/pathwayBiomes";
import type {
  ChemistryLandmarkSlot,
  ChemistryModuleLandmarkId,
} from "../../world/chemistryModuleLandmarks";

export type ChemistryLandmarkVisualState = "active" | "next" | "mastered" | "unlocked" | "locked";

export type ChemistryLandmarkNodeData = {
  id: ChemistryModuleLandmarkId;
  title: string;
  tagline: string;
  slot: ChemistryLandmarkSlot;
  visual: ChemistryLandmarkVisualState;
  biome: PathwayBiome;
  frameBadge: string;
  canEnter: boolean;
  isIgniting: boolean;
};
