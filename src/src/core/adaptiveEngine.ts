import { getQuestionsForTopic, getTopicById } from "./curriculumData";
import type {
  AdaptiveSession,
  AnswerRecord,
  CurriculumTopic,
  DebugSnapshot,
  LearningIntent,
  LessonQuestion,
} from "./learningTypes";
import { getPrerequisiteChain } from "./curriculumEngine";

export function evaluateAnswer(answer: string): "good" | "ok" | "unknown" {
  const t = answer.trim();
  if (t.length > 15) return "good";
  if (t.length > 5) return "ok";
  return "unknown";
}

export function startSession(topic: CurriculumTopic): AdaptiveSession {
  return {
    topicId: topic.id,
    topicTitle: topic.title,
    phase: "diagnostic",
    diagnosticCount: 0,
    currentDifficulty: 1,
    questionCursor: 0,
    mastery: {
      [topic.id]: { topicId: topic.id, score: 0.2, attempts: 0 },
    },
    streakGood: 0,
    lastReason: `Starting diagnostic for "${topic.title}" — measuring baseline before adaptive lessons.`,
  };
}

function questionsForPhase(
  topicId: string,
  phase: "diagnostic" | "lesson" | "challenge",
  maxDifficulty: number
): LessonQuestion[] {
  return getQuestionsForTopic(topicId).filter(
    (q) => q.phase === phase && q.difficulty <= maxDifficulty
  );
}

export function getNextLessonQuestion(session: AdaptiveSession): {
  question: LessonQuestion | null;
  session: AdaptiveSession;
  reason: string;
} {
  const topic = getTopicById(session.topicId);
  if (!topic) {
    return {
      question: null,
      session,
      reason: "Topic not found in curriculum.",
    };
  }

  let phase = session.phase;
  let difficulty = session.currentDifficulty;
  let reason = "";

  if (phase === "diagnostic") {
    const pool = questionsForPhase(session.topicId, "diagnostic", 2);
    if (pool.length === 0) {
      phase = "adaptive";
      reason = "No diagnostic items — entering adaptive lessons.";
    } else {
      const idx = session.diagnosticCount % pool.length;
      const question = pool[idx];
      reason = `Diagnostic ${session.diagnosticCount + 1}/${Math.min(pool.length, 2)} — gauging fit for "${topic.title}".`;
      return {
        question,
        session: { ...session, lastReason: reason },
        reason,
      };
    }
  }

  const lessonPool = questionsForPhase(session.topicId, "lesson", difficulty);
  const challengePool = questionsForPhase(session.topicId, "challenge", difficulty + 1);

  let pool = session.streakGood >= 2 && challengePool.length > 0 ? challengePool : lessonPool;
  if (pool.length === 0) pool = lessonPool.length > 0 ? lessonPool : questionsForPhase(session.topicId, "diagnostic", 3);

  if (pool.length === 0) {
    return {
      question: null,
      session,
      reason: "Curriculum path complete for this topic.",
    };
  }

  const idx = session.questionCursor % pool.length;
  const question = pool[idx];

  reason =
    session.streakGood >= 2
      ? `Challenge mode (difficulty ${difficulty + 1}) — strong streak on "${topic.title}".`
      : `Adaptive lesson at difficulty ${difficulty} — building mastery on "${topic.title}".`;

  return {
    question,
    session: { ...session, phase, currentDifficulty: difficulty, lastReason: reason },
    reason,
  };
}

export function processAnswer(
  session: AdaptiveSession,
  _question: LessonQuestion,
  _answer: string,
  evaluation: "good" | "ok" | "unknown"
): { session: AdaptiveSession; reason: string } {
  const mastery = { ...session.mastery };
  const entry = mastery[session.topicId] ?? {
    topicId: session.topicId,
    score: 0.2,
    attempts: 0,
  };

  entry.attempts += 1;
  if (evaluation === "good") entry.score = Math.min(1, entry.score + 0.15);
  else if (evaluation === "ok") entry.score = Math.min(1, entry.score + 0.08);
  else entry.score = Math.max(0, entry.score - 0.05);
  mastery[session.topicId] = entry;

  let phase = session.phase;
  let diagnosticCount = session.diagnosticCount;
  let currentDifficulty = session.currentDifficulty;
  let streakGood = evaluation === "good" ? session.streakGood + 1 : 0;
  let questionCursor = session.questionCursor + 1;
  let reason = "";

  if (phase === "diagnostic") {
    diagnosticCount += 1;
    if (diagnosticCount >= 2) {
      phase = "adaptive";
      if (evaluation === "good") {
        currentDifficulty = 2;
        reason = "Diagnostic complete — strong baseline. Increasing to intermediate lessons.";
      } else if (evaluation === "unknown") {
        currentDifficulty = 1;
        reason = "Diagnostic complete — reinforcing foundations before advancing.";
      } else {
        currentDifficulty = 2;
        reason = "Diagnostic complete — entering structured adaptive path.";
      }
    } else {
      reason = `Continuing diagnostic (${diagnosticCount}/2) before branching.`;
    }
  } else {
    if (evaluation === "good" && streakGood >= 2) {
      currentDifficulty = Math.min(4, currentDifficulty + 1);
      reason = `Mastery rising (${Math.round(entry.score * 100)}%) — difficulty increased to ${currentDifficulty}.`;
    } else if (evaluation === "unknown") {
      currentDifficulty = Math.max(1, currentDifficulty - 1);
      streakGood = 0;
      reason = `Gap detected — easing difficulty to ${currentDifficulty} and revisiting prerequisites.`;
    } else {
      reason = `Steady progress — next lesson at difficulty ${currentDifficulty}.`;
    }
  }

  return {
    session: {
      ...session,
      phase,
      diagnosticCount,
      currentDifficulty,
      streakGood,
      questionCursor,
      mastery,
      lastReason: reason,
    },
    reason,
  };
}

export function buildDebugSnapshot(
  stage: DebugSnapshot["stage"],
  intent: LearningIntent | null,
  topic: CurriculumTopic | null,
  session: AdaptiveSession | null,
  _currentQuestion: LessonQuestion | null
): DebugSnapshot {
  const pathChain = topic ? [topic.title, ...getPrerequisiteChain(topic.id)] : [];

  return {
    stage,
    intent,
    selectedTopic: topic,
    session,
    masteryList: session ? Object.values(session.mastery) : [],
    lastReason: session?.lastReason ?? "Awaiting session start.",
    pathChain,
  };
}

export type { AnswerRecord, LessonQuestion };
