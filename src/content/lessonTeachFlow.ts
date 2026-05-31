import type { Lesson, LessonQuestion, TeachingBlock, TeachBlockKind } from "./curriculumTypes";
import { visualEventsFromTag } from "../visuals/sceneLayers";

export type SessionMode = "learn" | "practice";

export const TEACH_STEP_LABELS: Record<TeachBlockKind, string> = {
  concept: "Concept introduction",
  visual: "Visual demonstration",
  explain: "Guided explanation",
};

/** Per-question teach sequence for Learn Mode */
export function getTeachingBlocks(question: LessonQuestion, lesson: Lesson): TeachingBlock[] {
  if (question.teachingBlocks?.length) {
    return question.teachingBlocks;
  }
  return deriveDefaultTeachingBlocks(question, lesson);
}

export function getReinforcementPrompt(question: LessonQuestion, lesson: Lesson): string | null {
  const custom = question.reinforcementPrompt?.trim();
  if (custom) return custom;
  if (lesson.explanation.length < 20) return null;
  const hint = question.explanation?.trim();
  if (hint) {
    return `Connect what you just learned — then answer the checkpoint.`;
  }
  return "When you're ready, continue to the checkpoint question.";
}

export function hasReinforcementStep(question: LessonQuestion, lesson: Lesson, mode: SessionMode): boolean {
  if (mode === "practice") return false;
  return getReinforcementPrompt(question, lesson) !== null;
}

export function shouldRunTeachSequence(mode: SessionMode, question: LessonQuestion, lesson: Lesson): boolean {
  if (mode === "practice") return false;
  return getTeachingBlocks(question, lesson).length > 0;
}

function deriveDefaultTeachingBlocks(question: LessonQuestion, lesson: Lesson): TeachingBlock[] {
  const sentences = lesson.explanation.split(/(?<=[.!?])\s+/).filter(Boolean);
  const concept = sentences[0] ?? lesson.explanation;
  const explain =
    sentences.length > 1 ? sentences.slice(1).join(" ") : lesson.explanation;

  const visualTag =
    question.visualTag ??
    question.visualBehavior?.motionOverlay ??
    lesson.visualScene?.effectOverlay ??
    "force_arrows";

  const events = visualEventsFromTag(visualTag);

  return [
    {
      type: "TEACH",
      kind: "concept",
      text: concept.endsWith(".") ? concept : `${concept}.`,
    },
    {
      type: "TEACH",
      kind: "visual",
      text: "Force appears as a push or pull — arrows in the chamber mark where interaction is applied.",
      visualTag,
      visualEvents: events,
      paceHint: events.length ? "Arrows and glow mark the interaction." : undefined,
    },
    {
      type: "TEACH",
      kind: "explain",
      text: explain.endsWith(".") ? explain : `${explain}.`,
      visualTag,
      visualEvents:
        events.length > 0
          ? [...new Set([...events, "pathway_glow_forward"])]
          : ["pathway_glow_forward"],
    },
  ];
}

export function teachBlockHasVisibleEvents(block: TeachingBlock): boolean {
  if (block.visualEvents?.length) return true;
  if (block.kind === "visual" || block.kind === "explain") {
    return visualEventsFromTag(block.visualTag).length > 0;
  }
  return false;
}

export function teachBlockKind(block: TeachingBlock): TeachBlockKind {
  return block.kind ?? "explain";
}

export function teachBlockLabel(block: TeachingBlock): string {
  return block.title ?? TEACH_STEP_LABELS[teachBlockKind(block)];
}
