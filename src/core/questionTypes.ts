export type Domain = "math" | "physics" | "chemistry";

export type Question = {
  id: string;
  domain: Domain;
  prompt: string;
  expectedConcept?: string;
};

export type AnswerLog = {
  questionId: string;
  questionPrompt: string;
  domain: Domain;
  answer: string;
  timestamp: number;
  confidence?: number;
  evaluation: "good" | "ok" | "unknown";
};

export type AppState = {
  activeDomain: Domain;
  currentQuestion: Question;
  history: AnswerLog[];
};
