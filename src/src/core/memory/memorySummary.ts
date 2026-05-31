import type { MemoryArtifactSummary } from "../state/learningState";
import { getConcepts } from "./concepts";
import { getConfusionSignals } from "./confusionSignals";
import { getFlashcards } from "./flashcards";

export function buildMemorySummary(): MemoryArtifactSummary {
  const concepts = getConcepts();
  const flashcards = getFlashcards();
  const confusion = getConfusionSignals();
  const lastConcept = concepts[concepts.length - 1];
  const lastCard = flashcards[flashcards.length - 1];

  return {
    conceptCount: concepts.length,
    flashcardCount: flashcards.length,
    confusionCount: confusion.length,
    lastConceptTitle: lastConcept?.title ?? null,
    lastFlashcardFront: lastCard?.front ?? null,
  };
}
