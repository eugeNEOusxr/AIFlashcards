import type { UnderstandingSignal } from "../cognitive/types";
import type { ConceptMemoryRecord, LearningMemory, MasteryTier } from "./types";

export function normalizeConceptId(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function scoreToTier(score: number, record?: ConceptMemoryRecord): MasteryTier {
  const attempts = (record?.correctCount ?? 0) + (record?.incorrectCount ?? 0);
  if (attempts === 0 && score <= 25) return "unknown";
  if (record && record.confusionCount >= 2 && score < 50) return "weak";
  if (score >= 85 && (record?.correctCount ?? 0) >= 2) return "mastered";
  if (score >= 65) return "strong";
  if (score >= 35) return "learning";
  return "weak";
}

function signalDelta(signal: UnderstandingSignal): number {
  switch (signal) {
    case "understand":
      return 12;
    case "partial":
      return 4;
    case "confusing":
      return -10;
    case "need_visual":
      return -2;
    case "repeat":
      return -4;
    default:
      return 0;
  }
}

export function applyAnswerToConcepts(
  mem: LearningMemory,
  params: {
    lessonId: string;
    conceptTags: string[];
    correct: boolean;
  }
): void {
  const delta = params.correct ? 10 : -8;
  for (const tag of params.conceptTags) {
    const conceptId = normalizeConceptId(tag);
    if (!conceptId) continue;
    const prev = mem.concept.concepts[conceptId];
    const masteryScore = Math.max(0, Math.min(100, (prev?.masteryScore ?? 40) + delta));
    const record: ConceptMemoryRecord = {
      conceptId,
      masteryScore,
      confusionCount: prev?.confusionCount ?? 0,
      correctCount: (prev?.correctCount ?? 0) + (params.correct ? 1 : 0),
      incorrectCount: (prev?.incorrectCount ?? 0) + (params.correct ? 0 : 1),
      positiveSignals: prev?.positiveSignals ?? 0,
      lastSignal: prev?.lastSignal,
      needsReinforcement: !params.correct || (prev?.needsReinforcement ?? false),
      lessonIds: prev?.lessonIds.includes(params.lessonId)
        ? prev.lessonIds
        : [...(prev?.lessonIds ?? []), params.lessonId],
      lastSeenAt: Date.now(),
      tier: "learning",
    };
    record.tier = scoreToTier(masteryScore, record);
    if (params.correct && masteryScore >= 65) record.needsReinforcement = false;
    mem.concept.concepts[conceptId] = record;
  }
}

export function applySignalToConcepts(
  mem: LearningMemory,
  params: {
    lessonId: string;
    conceptTags: string[];
    signal: UnderstandingSignal;
  }
): void {
  const delta = signalDelta(params.signal);
  for (const tag of params.conceptTags) {
    const conceptId = normalizeConceptId(tag);
    if (!conceptId) continue;
    const prev = mem.concept.concepts[conceptId];
    const masteryScore = Math.max(0, Math.min(100, (prev?.masteryScore ?? 40) + delta));
    const record: ConceptMemoryRecord = {
      conceptId,
      masteryScore,
      confusionCount: (prev?.confusionCount ?? 0) + (params.signal === "confusing" ? 1 : 0),
      correctCount: prev?.correctCount ?? 0,
      incorrectCount: prev?.incorrectCount ?? 0,
      positiveSignals: (prev?.positiveSignals ?? 0) + (params.signal === "understand" ? 1 : 0),
      lastSignal: params.signal,
      needsReinforcement:
        params.signal === "confusing" ||
        params.signal === "repeat" ||
        masteryScore < 35 ||
        (prev?.needsReinforcement ?? false),
      lessonIds: prev?.lessonIds.includes(params.lessonId)
        ? prev.lessonIds
        : [...(prev?.lessonIds ?? []), params.lessonId],
      lastSeenAt: Date.now(),
      tier: "learning",
    };
    record.tier = scoreToTier(masteryScore, record);
    mem.concept.concepts[conceptId] = record;
  }
}

export function getWeakConceptIds(mem: LearningMemory): Set<string> {
  const weak = new Set<string>();
  for (const c of Object.values(mem.concept.concepts)) {
    if (c.tier === "weak" || c.tier === "unknown" || c.needsReinforcement) {
      weak.add(c.conceptId);
    }
  }
  return weak;
}

export function averageMasteryScore(mem: LearningMemory): number {
  const concepts = Object.values(mem.concept.concepts);
  if (concepts.length === 0) return 40;
  return concepts.reduce((s, c) => s + c.masteryScore, 0) / concepts.length;
}
