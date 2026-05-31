import { useCallback, useEffect, useState } from "react";
import {
  buildReviewDeckFromProgress,
  reshuffleReviewCard,
  sourceFrameForReviewCard,
  type ReviewFlashcard,
} from "../../content/frames/buildReviewDeck";

type Props = {
  /** Bump when map progress refreshes so the deck reloads */
  refreshKey: number;
};

export function PhysicsReviewSidebar({ refreshKey }: Props) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [cards, setCards] = useState<ReviewFlashcard[]>(() => buildReviewDeckFromProgress());

  useEffect(() => {
    setCards(buildReviewDeckFromProgress());
    setIndex(0);
    setPicked(null);
  }, [refreshKey]);

  const card = cards[index] ?? null;
  const total = cards.length;
  const revealed = picked !== null;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setIndex(wrapped);
      setPicked(null);
      setCards((prev) => {
        const current = prev[wrapped];
        if (!current) return prev;
        const source = sourceFrameForReviewCard(current.id);
        if (!source) return prev;
        const copy = [...prev];
        copy[wrapped] = reshuffleReviewCard(current, source);
        return copy;
      });
    },
    [total]
  );

  const reshuffleCurrent = useCallback(() => {
    if (!card) return;
    setPicked(null);
    const source = sourceFrameForReviewCard(card.id);
    if (!source) return;
    setCards((prev) => {
      const copy = [...prev];
      copy[index] = reshuffleReviewCard(card, source);
      return copy;
    });
  }, [card, index]);

  if (!open) {
    return (
      <aside className="physics-review-sidebar physics-review-sidebar--collapsed" aria-label="Review flashcards">
        <button
          type="button"
          className="physics-review-sidebar__reopen"
          onClick={() => setOpen(true)}
          aria-expanded={false}
        >
          <span className="physics-review-sidebar__reopen-label">Review</span>
          {total > 0 ? <span className="physics-review-sidebar__reopen-count">{total}</span> : null}
        </button>
      </aside>
    );
  }

  return (
    <aside className="physics-review-sidebar" aria-label="Review flashcards">
      <header className="physics-review-sidebar__head">
        <div>
          <p className="physics-review-sidebar__kicker">Study deck</p>
          <h3 className="physics-review-sidebar__title">Question review</h3>
        </div>
        <button
          type="button"
          className="physics-review-sidebar__collapse"
          onClick={() => setOpen(false)}
          aria-label="Collapse review panel"
        >
          Hide
        </button>
      </header>

      {total === 0 ? (
        <p className="physics-review-sidebar__empty">
          Finish at least one frame in a lesson — your completed questions will appear here for review.
        </p>
      ) : card ? (
        <>
          <p className="physics-review-sidebar__meta">
            <span>{card.landmarkLabel}</span>
            <span aria-hidden> · </span>
            <span>
              {index + 1} / {total}
            </span>
          </p>

          <article className="physics-review-card">
            <p className="physics-review-card__fact">{card.fact}</p>
            <p className="physics-review-card__question">{card.question}</p>

            <ul className="physics-review-card__choices" role="list">
              {card.answers.map((label, i) => {
                const isPicked = picked === i;
                const isCorrect = i === card.correctIndex;
                let stateClass = "";
                if (revealed && isPicked && isCorrect) stateClass = "physics-review-card__choice--correct";
                if (revealed && isPicked && !isCorrect) stateClass = "physics-review-card__choice--wrong";
                if (revealed && !isPicked && isCorrect) stateClass = "physics-review-card__choice--reveal";

                return (
                  <li key={`${card.id}-${i}`}>
                    <button
                      type="button"
                      className={["physics-review-card__choice", stateClass].filter(Boolean).join(" ")}
                      disabled={revealed}
                      onClick={() => setPicked(i)}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {revealed ? (
              <p className="physics-review-card__feedback">
                {picked === card.correctIndex ? card.feedbackCorrect : card.feedbackIncorrect}
              </p>
            ) : (
              <p className="physics-review-card__hint">Tap an answer — order is shuffled each card.</p>
            )}
          </article>

          <div className="physics-review-sidebar__actions">
            <button type="button" className="physics-review-sidebar__btn" onClick={() => goTo(index - 1)}>
              Previous
            </button>
            <button type="button" className="physics-review-sidebar__btn" onClick={reshuffleCurrent}>
              Shuffle
            </button>
            <button
              type="button"
              className="physics-review-sidebar__btn physics-review-sidebar__btn--primary"
              onClick={() => goTo(index + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </aside>
  );
}
