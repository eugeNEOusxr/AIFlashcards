import type { EducationalTier } from "../cognitive/types";

export type ProgressionFlowPalette = {
  particle: string;
  particleCore: string;
  tubePrimary: string;
  tubeSecondary: string;
  pulse: string;
  coreStroke: string;
};

/** Mastery-based flow colors — atmospheric, not arcade rainbow. */
export function progressionFlowPalette(
  tier: EducationalTier,
  masteredLandmarks: number,
  totalLandmarks: number
): ProgressionFlowPalette {
  const progress = totalLandmarks > 0 ? masteredLandmarks / totalLandmarks : 0;

  if (progress >= 0.85 || (tier === "advanced" && progress >= 0.6)) {
    return {
      particle: "rgba(254, 243, 199, 0.72)",
      particleCore: "rgba(255, 251, 235, 0.95)",
      tubePrimary: "#c4b5fd",
      tubeSecondary: "#fde68a",
      pulse: "rgba(253, 230, 138, 0.9)",
      coreStroke: "rgba(255, 251, 235, 0.88)",
    };
  }

  if (tier === "advanced" || progress >= 0.55) {
    return {
      particle: "rgba(196, 181, 253, 0.68)",
      particleCore: "rgba(221, 214, 254, 0.92)",
      tubePrimary: "#a78bfa",
      tubeSecondary: "#67e8f9",
      pulse: "rgba(167, 139, 250, 0.85)",
      coreStroke: "rgba(233, 213, 255, 0.82)",
    };
  }

  if (tier === "intermediate" || progress >= 0.25) {
    return {
      particle: "rgba(125, 211, 252, 0.65)",
      particleCore: "rgba(186, 230, 253, 0.9)",
      tubePrimary: "#38bdf8",
      tubeSecondary: "#22d3ee",
      pulse: "rgba(56, 189, 248, 0.82)",
      coreStroke: "rgba(224, 242, 254, 0.8)",
    };
  }

  return {
    particle: "rgba(226, 232, 240, 0.55)",
    particleCore: "rgba(248, 250, 252, 0.88)",
    tubePrimary: "#cbd5e1",
    tubeSecondary: "#a5f3fc",
    pulse: "rgba(212, 232, 240, 0.85)",
    coreStroke: "rgba(241, 245, 249, 0.75)",
  };
}

/** CSS variables for gradual environment tint from mastery */
export function progressionPaletteStyle(
  palette: ProgressionFlowPalette
): Record<string, string> {
  return {
    "--flow-particle": palette.particle,
    "--flow-particle-core": palette.particleCore,
    "--flow-tube-a": palette.tubePrimary,
    "--flow-tube-b": palette.tubeSecondary,
    "--flow-pulse": palette.pulse,
  };
}
