import { STABLE_QUESTION_ID_PATTERN } from "./validateQuestion";

/** Build physics.motion.force.q001 — content-time only, not at runtime random. */
export function stableQuestionId(namespace: string, index: number): string {
  const n = String(index + 1).padStart(3, "0");
  return `${namespace}.q${n}`;
}

export function isStableQuestionId(id: string): boolean {
  return STABLE_QUESTION_ID_PATTERN.test(id);
}

/** Use existing stable id or assign deterministic index-based id (import/content layer). */
export function ensureStableQuestionId(
  namespace: string,
  index: number,
  existingId?: string
): string {
  const trimmed = existingId?.trim() ?? "";
  if (trimmed && isStableQuestionId(trimmed)) return trimmed;
  return stableQuestionId(namespace, index);
}
