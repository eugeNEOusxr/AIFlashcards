export type Domain = "math" | "physics" | "chemistry";

export type AppStage = "intent" | "curriculum" | "learning";

export type LearningIntent = {
  goalText: string;
  whyText: string;
  domain: Domain | "explore";
  capturedAt: number;
};

export type CurriculumTopic = {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  difficulty: number;
  prerequisites: string[];
  estimatedWeeks: number;
  fitScore: number;
};

export type LessonQuestion = {
  id: string;
  topicId: string;
  prompt: string;
  phase: "diagnostic" | "lesson" | "challenge";
  difficulty: number;
  expectedConcept?: string;
};

export type MasteryEntry = {
  topicId: string;
  score: number;
  attempts: number;
};

export type AnswerRecord = {
  questionId: string;
  topicId: string;
  prompt: string;
  answer: string;
  evaluation: "good" | "ok" | "unknown";
  timestamp: number;
};

export type AdaptiveSession = {
  topicId: string;
  topicTitle: string;
  phase: "diagnostic" | "adaptive";
  diagnosticCount: number;
  currentDifficulty: number;
  questionCursor: number;
  mastery: Record<string, MasteryEntry>;
  streakGood: number;
  lastReason: string;
};

export type DebugSnapshot = {
  stage: AppStage;
  intent: LearningIntent | null;
  selectedTopic: CurriculumTopic | null;
  session: AdaptiveSession | null;
  masteryList: MasteryEntry[];
  lastReason: string;
  pathChain: string[];
};
