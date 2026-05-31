import { CURRICULUM_TOPICS, getTopicById } from "./curriculumData";
import type { CurriculumTopic, Domain, LearningIntent } from "./learningTypes";

function computeFitScore(topic: CurriculumTopic, intent: LearningIntent): number {
  let score = 0.5;
  const goal = intent.goalText.toLowerCase();

  if (intent.domain !== "explore" && topic.domain === intent.domain) score += 0.25;
  if (goal.includes(topic.title.toLowerCase().split(" ")[0])) score += 0.15;
  if (goal.includes(topic.domain)) score += 0.1;

  if (topic.title.toLowerCase().includes("calculus") && goal.includes("calculus")) score += 0.2;
  if (topic.title.toLowerCase().includes("mechanics") && goal.includes("physics")) score += 0.15;
  if (topic.title.toLowerCase().includes("atom") && goal.includes("chemistry")) score += 0.15;

  // Easier paths get a bump for "don't know yet"
  if (intent.domain === "explore" && topic.difficulty <= 2) score += 0.1;

  return Math.min(1, Math.round(score * 100) / 100);
}

export function getPathsForIntent(intent: LearningIntent): CurriculumTopic[] {
  let pool =
    intent.domain === "explore"
      ? [...CURRICULUM_TOPICS]
      : CURRICULUM_TOPICS.filter((t) => t.domain === intent.domain);

  return pool
    .map((t) => ({ ...t, fitScore: computeFitScore(t, intent) }))
    .sort((a, b) => b.fitScore - a.fitScore);
}

export function getPrerequisiteChain(topicId: string): string[] {
  const chain: string[] = [];
  let current = getTopicById(topicId);
  const seen = new Set<string>();

  while (current && current.prerequisites.length > 0) {
    const preId = current.prerequisites[0];
    if (seen.has(preId)) break;
    seen.add(preId);
    const pre = getTopicById(preId);
    if (pre) {
      chain.unshift(pre.title);
      current = pre;
    } else break;
  }
  return chain;
}

export function difficultyLabel(d: number): string {
  if (d <= 1) return "Beginner";
  if (d <= 2) return "Intro";
  if (d <= 3) return "Intermediate";
  if (d <= 4) return "Advanced";
  return "Expert";
}

export function domainsForExplore(): Domain[] {
  return ["math", "physics", "chemistry"];
}
