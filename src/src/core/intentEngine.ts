import type { Domain, LearningIntent } from "./learningTypes";
import { DOMAIN_LABELS } from "./curriculumData";

const DOMAIN_KEYWORDS: Record<Domain, string[]> = {
  math: ["math", "calculus", "algebra", "geometry", "equation", "derivative"],
  physics: ["physics", "force", "motion", "newton", "electricity", "wave", "thermo"],
  chemistry: ["chemistry", "chem", "atom", "molecule", "reaction", "periodic"],
};

export function inferDomainFromText(text: string): Domain | "explore" {
  const lower = text.toLowerCase();
  for (const domain of ["physics", "chemistry", "math"] as Domain[]) {
    if (DOMAIN_KEYWORDS[domain].some((kw) => lower.includes(kw))) return domain;
  }
  return "explore";
}

export function buildIntent(
  goalText: string,
  whyText: string,
  domainOverride?: Domain | "explore"
): LearningIntent {
  const domain = domainOverride ?? inferDomainFromText(goalText);
  return {
    goalText: goalText.trim() || "Explore learning",
    whyText: whyText.trim() || "Personal growth",
    domain,
    capturedAt: Date.now(),
  };
}

export function intentResponseMessage(intent: LearningIntent): string {
  const domainLabel =
    intent.domain === "explore"
      ? "several domains"
      : DOMAIN_LABELS[intent.domain];

  return `Got it — you want to learn about "${intent.goalText}". Here are structured paths in ${domainLabel} based on that goal. Pick a trajectory below.`;
}

export const INTENT_CHIPS: { label: string; goal: string; domain?: Domain | "explore" }[] = [
  { label: "I want to understand physics", goal: "Understand physics fundamentals", domain: "physics" },
  { label: "I want to get good at calculus", goal: "Master calculus", domain: "math" },
  { label: "Chemistry basics", goal: "Learn chemistry from the ground up", domain: "chemistry" },
  { label: "Math foundations", goal: "Build strong math foundations", domain: "math" },
  { label: "I don't know yet", goal: "Explore what fits me", domain: "explore" },
];
