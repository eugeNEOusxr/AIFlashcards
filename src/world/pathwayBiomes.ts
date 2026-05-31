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
  "nature-chemistry": {
    id: "nature-chemistry",
    className: "biome-chemistry",
    accent: "#4ade80",
    accentSecondary: "#2dd4bf",
    fog: "rgba(74, 222, 128, 0.12)",
    particle: "rgba(45, 212, 191, 0.55)",
    label: "Living chemistry field",
  },
  "chemistry-mixtures": {
    id: "chemistry-mixtures",
    className: "biome-chemistry",
    accent: "#86efac",
    accentSecondary: "#34d399",
    fog: "rgba(134, 239, 172, 0.1)",
    particle: "rgba(52, 211, 153, 0.45)",
    label: "Mixture basin",
  },
  "chemistry-bonds": {
    id: "chemistry-bonds",
    className: "biome-chemistry",
    accent: "#6ee7b7",
    accentSecondary: "#14b8a6",
    fog: "rgba(110, 231, 183, 0.1)",
    particle: "rgba(20, 184, 166, 0.5)",
    label: "Bond lattice",
  },
  "chemistry-cycles": {
    id: "chemistry-cycles",
    className: "biome-chemistry",
    accent: "#a3e635",
    accentSecondary: "#22c55e",
    fog: "rgba(163, 230, 53, 0.1)",
    particle: "rgba(34, 197, 94, 0.45)",
    label: "Nature cycles",
  },
  "living-biology": {
    id: "living-biology",
    className: "biome-biology",
    accent: "#a78bfa",
    accentSecondary: "#34d399",
    fog: "rgba(167, 139, 250, 0.12)",
    particle: "rgba(52, 211, 153, 0.5)",
    label: "Living world field",
  },
  "biology-habitats": {
    id: "biology-habitats",
    className: "biome-biology",
    accent: "#86efac",
    accentSecondary: "#4ade80",
    fog: "rgba(134, 239, 172, 0.1)",
    particle: "rgba(74, 222, 128, 0.45)",
    label: "Habitat zone",
  },
  "biology-energy": {
    id: "biology-energy",
    className: "biome-biology",
    accent: "#fbbf24",
    accentSecondary: "#22c55e",
    fog: "rgba(251, 191, 36, 0.1)",
    particle: "rgba(34, 197, 94, 0.45)",
    label: "Life energy flow",
  },
  "biology-diversity": {
    id: "biology-diversity",
    className: "biome-biology",
    accent: "#c084fc",
    accentSecondary: "#2dd4bf",
    fog: "rgba(192, 132, 252, 0.1)",
    particle: "rgba(45, 212, 191, 0.45)",
    label: "Biodiversity weave",
  },
};

export function getPathwayBiome(pathwayId: PathwayId): PathwayBiome {
  return pathwayBiomes[pathwayId];
}
