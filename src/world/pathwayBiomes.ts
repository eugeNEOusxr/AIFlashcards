import type { PathwayId } from "./types";

export type PathwayBiome = {
  id: PathwayId;
  /** CSS modifier on pathway viewport */
  className: string;
  accent: string;
  accentSecondary: string;
  fog: string;
  particle: string;
  label: string;
};

export const pathwayBiomes: Record<PathwayId, PathwayBiome> = {
  "motion-forces": {
    id: "motion-forces",
    className: "biome-motion",
    accent: "#22d3ee",
    accentSecondary: "#ec4899",
    fog: "rgba(34, 211, 238, 0.12)",
    particle: "rgba(139, 92, 246, 0.6)",
    label: "Neural force field",
  },
  energy: {
    id: "energy",
    className: "biome-energy",
    accent: "#a78bfa",
    accentSecondary: "#fbbf24",
    fog: "rgba(167, 139, 250, 0.1)",
    particle: "rgba(251, 191, 36, 0.5)",
    label: "Energy lattice",
  },
  electricity: {
    id: "electricity",
    className: "biome-electricity",
    accent: "#38bdf8",
    accentSecondary: "#818cf8",
    fog: "rgba(56, 189, 248, 0.14)",
    particle: "rgba(34, 211, 238, 0.7)",
    label: "Current tunnels",
  },
  waves: {
    id: "waves",
    className: "biome-waves",
    accent: "#67e8f9",
    accentSecondary: "#8b5cf6",
    fog: "rgba(103, 232, 249, 0.1)",
    particle: "rgba(139, 92, 246, 0.45)",
    label: "Oscillation field",
  },
  thermodynamics: {
    id: "thermodynamics",
    className: "biome-thermo",
    accent: "#fb923c",
    accentSecondary: "#f43f5e",
    fog: "rgba(251, 146, 60, 0.12)",
    particle: "rgba(244, 63, 94, 0.5)",
    label: "Heat distortion",
  },
};

export function getPathwayBiome(pathwayId: PathwayId): PathwayBiome {
  return pathwayBiomes[pathwayId];
}
