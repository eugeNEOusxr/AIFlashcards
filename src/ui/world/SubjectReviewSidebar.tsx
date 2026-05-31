import { useCallback, useEffect, useState } from "react";
import { isCompactTouchUI } from "../../hooks/useCompactTouchUI";
import {
  buildReviewDeckFromProgress,
  reshuffleReviewCard,
  sourceFrameForReviewCard,
  type ReviewFlashcard,
} from "../../content/frames/buildReviewDeck";
import { getSubjectProfile } from "../../world/subjectProfiles";
import type { SubjectId } from "../../world/types";

type Props = {
  subjectId: SubjectId;
  refreshKey: number;
};

export function SubjectReviewSidebar({ subjectId, refreshKey }: Props) {
  const profile = getSubjectProfile(subjectId);
  const p = profile.reviewClassPrefix;

  const [open, setOpen] = useState(() => !isCompactTouchUI());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [cards, setCards] = useState<ReviewFlashcard[]>(() =>
    buildReviewDeckFromProgress(subjectId)
  );

  useEffect(() => {
    setCards(buildReviewDeckFromProgress(subjectId));
    setIndex(0);
    setPicked(null);
  }, [refreshKey, subjectId]);

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
      <aside
        className={`${p}-sidebar ${p}-sidebar--collapsed`}
        aria-label={`${profile.label} review flashcards`}
      >
        <button
          type="button"
          className={`${p}-sidebar__reopen`}
          onClick={() => setOpen(true)}
          aria-expanded={false}
        >
          <span className={`${p}-sidebar__reopen-label`}>Review</span>
          {total > 0 ? <span className={`${p}-sidebar__reopen-count`}>{total}</span> : null}
        </button>
      </aside>
    );
  }

  return (
    <aside className={`${p}-sidebar`} aria-label={`${profile.label} review flashcards`}>
      <header className={`${p}-sidebar__head`}>
        <div>
          <p className={`${p}-sidebar__kicker`}>{profile.studyDeck.kicker}</p>
          <h3 className={`${p}-sidebar__title`}>{profile.studyDeck.title}</h3>
        </div>
        <button
          type="button"
          className={`${p}-sidebar__collapse`}
          onClick={() => setOpen(false)}
          aria-label="Collapse review panel"
        >
          Hide
        </button>
      </header>

      {total === 0 ? (
        <p className={`${p}-sidebar__empty`}>{profile.studyDeck.emptyHint}</p>
      ) : card ? (
        <>
          <p className={`${p}-sidebar__meta`}>
            <span>{card.landmarkLabel}</span>
            <span aria-hidden> · </span>
            <span>
              {index + 1} / {total}
            </span>
          </p>

          <article className={`${p}-card`}>
            <p className={`${p}-card__fact`}>{card.fact}</p>
            <p className={`${p}-card__question`}>{card.question}</p>

            <ul className={`${p}-card__choices`} role="list">
              {card.answers.map((label, i) => {
                const isPicked = picked === i;
                const isCorrect = i === card.correctIndex;
                let stateClass = "";
                if (revealed && isPicked && isCorrect) stateClass = `${p}-card__choice--correct`;
                if (revealed && isPicked && !isCorrect) stateClass = `${p}-card__choice--wrong`;
                if (revealed && !isPicked && isCorrect) stateClass = `${p}-card__choice--reveal`;

                return (
                  <li key={`${card.id}-${i}`}>
                    <button
                      type="button"
                      className={[`${p}-card__choice`, stateClass].filter(Boolean).join(" ")}
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
              <p className={`${p}-card__feedback`}>
                {picked === card.correctIndex ? card.feedbackCorrect : card.feedbackIncorrect}
              </p>
            ) : (
              <p className={`${p}-card__hint`}>Tap an answer — order is shuffled each card.</p>
            )}
          </article>

          <div className={`${p}-sidebar__actions`}>
            <button type="button" className={`${p}-sidebar__btn`} onClick={() => goTo(index - 1)}>
              Previous
            </button>
            <button type="button" className={`${p}-sidebar__btn`} onClick={reshuffleCurrent}>
              Shuffle
            </button>
            <button
              type="button"
              className={`${p}-sidebar__btn ${p}-sidebar__btn--primary`}
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
