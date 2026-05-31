import type { EducationalTier } from "./types";

/** Map tier from frame/landmark progress only — no legacy lesson memory. */
export function resolveEducationalTier(completedCount: number): EducationalTier {
  if (completedCount >= 4) return "advanced";
  if (completedCount >= 2) return "intermediate";
  return "beginner";
}

export function tierClassName(tier: EducationalTier): string {
  return `edu-tier--${tier}`;
}
