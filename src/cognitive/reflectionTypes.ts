/** Reflection checkpoint — post-explanation cognitive pulse (not a persistent toolbar). */

export type ReflectionChoice = "understand" | "confused";

export type ReflectionCheckpointEvent = {
  lessonId: string;
  conceptTags: string[];
  choice: ReflectionChoice;
  timestamp: number;
};
