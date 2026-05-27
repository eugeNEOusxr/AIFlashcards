import type { AnswerLog, Domain, Question } from "./questionTypes";

type BankEntry = { prompt: string; expectedConcept?: string };

const questionBank: Record<Domain, BankEntry[]> = {
  math: [
    { prompt: "What is the derivative of x²?", expectedConcept: "derivative" },
    { prompt: "What does slope represent geometrically?", expectedConcept: "slope" },
    { prompt: "Solve: 2x + 3 = 11", expectedConcept: "linear equation" },
    { prompt: "What is the Pythagorean theorem?", expectedConcept: "geometry" },
    { prompt: "What does ∫ represent?", expectedConcept: "integral" },
  ],
  physics: [
    { prompt: "What is Newton's 2nd law?", expectedConcept: "F = ma" },
    { prompt: "What is force measured in?", expectedConcept: "newtons" },
    { prompt: "What causes acceleration?", expectedConcept: "net force" },
    { prompt: "What is kinetic energy?", expectedConcept: "motion energy" },
    { prompt: "What does velocity describe?", expectedConcept: "rate of change of position" },
  ],
  chemistry: [
    { prompt: "What is an atom?", expectedConcept: "basic unit of matter" },
    { prompt: "What is a molecule?", expectedConcept: "bonded atoms" },
    { prompt: "What is the periodic table used for?", expectedConcept: "element properties" },
    { prompt: "What is a covalent bond?", expectedConcept: "shared electrons" },
    { prompt: "What is pH a measure of?", expectedConcept: "acidity" },
  ],
};

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function evaluateAnswer(answer: string): "good" | "ok" | "unknown" {
  const t = answer.trim();
  if (t.length > 15) return "good";
  if (t.length > 5) return "ok";
  return "unknown";
}

export function evaluateToConfidence(evaluation: "good" | "ok" | "unknown"): number {
  if (evaluation === "good") return 0.85;
  if (evaluation === "ok") return 0.55;
  return 0.25;
}

/** Pick next question; avoids repeating the same prompt immediately. */
export function getNextQuestion(domain: Domain, _lastQuestionId?: string, lastPrompt?: string): Question {
  const pool = questionBank[domain];
  const filtered = lastPrompt
    ? pool.filter((q) => q.prompt !== lastPrompt)
    : pool;
  const choices = filtered.length > 0 ? filtered : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];

  return {
    id: newId(),
    domain,
    prompt: pick.prompt,
    expectedConcept: pick.expectedConcept,
  };
}

export function createInitialQuestion(domain: Domain = "math"): Question {
  return getNextQuestion(domain);
}

export function buildAnswerLog(
  question: Question,
  answer: string,
  evaluation: "good" | "ok" | "unknown"
): AnswerLog {
  return {
    questionId: question.id,
    questionPrompt: question.prompt,
    domain: question.domain,
    answer: answer.trim(),
    timestamp: Date.now(),
    confidence: evaluateToConfidence(evaluation),
    evaluation,
  };
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  math: "Math",
  physics: "Physics",
  chemistry: "Chemistry",
};
