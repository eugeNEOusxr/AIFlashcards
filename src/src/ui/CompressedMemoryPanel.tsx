import { useLearning } from "./useLearning";
import { getFlashcards } from "../core/memory/flashcards";

export function CompressedMemoryPanel() {
  const snap = useLearning();
  const { memorySummary } = snap;
  const recentCards = getFlashcards().slice(-3).reverse();

  if (memorySummary.flashcardCount === 0 && memorySummary.conceptCount === 0) {
    return (
      <div className="cls-memory-panel">
        <p className="cls-hint">
          Use context actions on selected text — reflections compress into concepts and flashcards.
        </p>
      </div>
    );
  }

  return (
    <div className="cls-memory-panel">
      <p className="cls-memory-panel__stats">
        {memorySummary.conceptCount} concepts · {memorySummary.flashcardCount} cards
        {memorySummary.confusionCount > 0 ? ` · ${memorySummary.confusionCount} confusion` : ""}
      </p>
      {memorySummary.lastConceptTitle ? (
        <p className="cls-hint">
          Latest concept: <strong>{memorySummary.lastConceptTitle}</strong>
        </p>
      ) : null}
      <ul className="cls-memory-cards">
        {recentCards.map((c) => (
          <li key={c.id} className="cls-memory-card">
            <span className="cls-memory-card__front">{c.front}</span>
            <span className="cls-memory-card__back">{c.back}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
