/**
 * Cognitive Compression Engine — deterministic, no AI.
 * Raw reflection text is processed once; only artifacts are persisted.
 */

import { addConcept, type ConceptNode } from "./concepts";
import { addConfusionSignal, type ConfusionSignal } from "./confusionSignals";
import { addFlashcard, type Flashcard } from "./flashcards";

export interface RawReflection {
  /** Freeform user text (selection or note). Not stored after compression. */
  text: string;
  hint?: "explain" | "save" | "confusing" | "clicked" | "other";
}

export interface CompressionResult {
  concept: ConceptNode;
  confusion?: ConfusionSignal;
  flashcards: Flashcard[];
}

const CONFUSION_RE =
  /\b(confus|unclear|don't understand|do not understand|stuck|lost|what does|why does)\b/i;

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function clampTitle(s: string, max = 72): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t || "Core idea";
  return `${t.slice(0, max - 1)}…`;
}

/** Extract 1–3 short idea strings from freeform text. */
function extractCoreIdeas(text: string): string[] {
  const cleaned = text.trim();
  if (!cleaned) return ["Learning moment"];

  const sentences = cleaned
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4);

  if (sentences.length === 0) {
    const chunk = cleaned.length > 120 ? `${cleaned.slice(0, 119)}…` : cleaned;
    return [chunk];
  }

  return sentences.slice(0, 3);
}

function isConfusion(text: string, hint?: RawReflection["hint"]): boolean {
  if (hint === "confusing") return true;
  if (hint === "clicked") return false;
  return CONFUSION_RE.test(text);
}

function buildFlashcard(idea: string, confused: boolean, conceptId: string): Flashcard {
  const core = clampTitle(idea, 56);
  const front = confused
    ? `What would resolve the confusion about "${core}"?`
    : `What is the key idea in "${core}"?`;

  const back = confused
    ? `Focus on one sentence that states ${core} clearly.`
    : clampTitle(idea, 140);

  return {
    id: uid("fc"),
    conceptId,
    front,
    back,
    createdAt: Date.now(),
  };
}

/**
 * Compress raw reflection → concept + optional confusion + ≥1 flashcard.
 * Persists artifacts only; raw text is discarded.
 */
export function compressReflection(raw: RawReflection): CompressionResult {
  const ideas = extractCoreIdeas(raw.text);
  const primary = ideas[0] ?? "Learning moment";
  const batchId = uid("batch");
  const confused = isConfusion(raw.text, raw.hint);

  const concept: ConceptNode = {
    id: uid("concept"),
    title: clampTitle(primary),
    createdAt: Date.now(),
    sourceBatchId: batchId,
  };
  addConcept(concept);

  let confusion: ConfusionSignal | undefined;
  if (confused) {
    confusion = {
      id: uid("conf"),
      conceptId: concept.id,
      intensity: raw.hint === "confusing" ? 0.85 : 0.65,
      trigger: clampTitle(primary, 48),
      createdAt: Date.now(),
    };
    addConfusionSignal(confusion);
  }

  const flashcards: Flashcard[] = ideas.map((idea, i) =>
    buildFlashcard(idea, confused && i === 0, concept.id)
  );

  if (flashcards.length === 0) {
    flashcards.push(buildFlashcard(primary, confused, concept.id));
  }

  for (const card of flashcards) {
    addFlashcard(card);
  }

  return { concept, confusion, flashcards };
}
