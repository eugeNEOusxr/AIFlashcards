import { averageMasteryScore, getProgressionSnapshot } from "./progressionStore";
import type { EducationalTier } from "./types";

export function resolveEducationalTier(completedLessonCount: number): EducationalTier {
  const avg = averageMasteryScore();
  if (completedLessonCount >= 4 || avg >= 72) return "advanced";
  if (completedLessonCount >= 2 || avg >= 48) return "intermediate";
  return "beginner";
}

export function tierClassName(tier: EducationalTier): string {
  return `edu-tier--${tier}`;
}

export function getCompletedLessonCount(): number {
  return getProgressionSnapshot().completedLessonIds.length;
}
