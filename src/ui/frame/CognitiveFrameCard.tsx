import { motion } from "framer-motion";
import { composeFrameDisplay } from "../../content/frames/frameDisplay";
import type { FramePhase, LearningFrame } from "../../content/frames/types";

type Props = {
  frame: LearningFrame;
  frameIndex: number;
  frameTotal: number;
  moduleTitle: string;
  phase: FramePhase;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  onSelectAnswer: (index: number) => void;
  onReflectionYes: () => void;
  onReflectionConfused: () => void;
  onContinueAfterClarification: () => void;
};

export function CognitiveFrameCard({
  frame,
  frameIndex,
  frameTotal,
  moduleTitle,
  phase,
  selectedIndex,
  isCorrect,
  onSelectAnswer,
  onReflectionYes,
  onReflectionConfused,
  onContinueAfterClarification,
}: Props) {
  const display = composeFrameDisplay(frame, phase, selectedIndex, isCorrect);

  return (
    <motion.article
      className="cognitive-frame"
      data-frame-id={frame.id}
      data-phase={phase}
      key={frame.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <header className="cognitive-frame__head">
        <span className="cognitive-frame__module">{moduleTitle}</span>
        <span className="cognitive-frame__progress">
          Frame {frameIndex + 1} of {frameTotal}
        </span>
        <h2 className="cognitive-frame__title">{frame.title}</h2>
      </header>

      {display.showFact ? (
        <section className="cognitive-frame__fact" aria-labelledby={`fact-${frame.id}`}>
          <span className="cognitive-frame__label" id={`fact-${frame.id}`}>
            Fact
          </span>
          <p className="cognitive-frame__fact-text">{frame.fact}</p>
        </section>
      ) : null}

      {display.showVisualAid ? (
        <section className="cognitive-frame__visual" aria-labelledby={`visual-${frame.id}`}>
          <span className="cognitive-frame__label" id={`visual-${frame.id}`}>
            Picture it
          </span>
          <p className="cognitive-frame__visual-text">{frame.visualAid}</p>
        </section>
      ) : null}

      {display.showQuestion ? (
        <section className="cognitive-frame__question" aria-labelledby={`question-${frame.id}`}>
          <span className="cognitive-frame__label" id={`question-${frame.id}`}>
            Question
          </span>
          <p className="cognitive-frame__prompt">{frame.question}</p>

          {display.showAnswers ? (
            <div className="cognitive-frame__choices" role="listbox" aria-label="Answer choices">
              {frame.answers.map((option, index) => {
                const picked = selectedIndex === index;
                const isRight = index === frame.correctIndex;
                let choiceClass = "cognitive-frame__choice";

                if (display.revealAnswerStyles) {
                  if (isRight) choiceClass += " cognitive-frame__choice--correct";
                  else if (picked) choiceClass += " cognitive-frame__choice--wrong";
                  else choiceClass += " cognitive-frame__choice--dim";
                } else if (picked && display.answersInteractive) {
                  choiceClass += " cognitive-frame__choice--picked";
                }

                return (
                  <button
                    key={`${frame.id}-choice-${index}`}
                    type="button"
                    className={choiceClass}
                    disabled={!display.answersInteractive}
                    onClick={() => onSelectAnswer(index)}
                    role="option"
                    aria-selected={picked}
                  >
                    <span className="cognitive-frame__choice-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>
      ) : null}

      {display.showFeedback && display.feedbackText ? (
        <section
          className={`cognitive-frame__feedback${
            isCorrect ? " cognitive-frame__feedback--ok" : " cognitive-frame__feedback--no"
          }`}
          aria-live="polite"
        >
          <span className="cognitive-frame__label">Feedback</span>
          <p className="cognitive-frame__feedback-text">{display.feedbackText}</p>

          {display.showReflection ? (
            <motion.div
              className="cognitive-frame__reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.08, ease: "easeOut" }}
            >
              <p className="cognitive-frame__reflection-prompt">Did this click?</p>
              <div className="cognitive-frame__reflection-actions">
                <button
                  type="button"
                  className="la-primary cognitive-frame__reflection-btn cognitive-frame__reflection-btn--yes"
                  onClick={onReflectionYes}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="la-ghost cognitive-frame__reflection-btn cognitive-frame__reflection-btn--confused"
                  onClick={onReflectionConfused}
                >
                  Still confused
                </button>
              </div>
            </motion.div>
          ) : null}
        </section>
      ) : null}

      {display.showClarification ? (
        <motion.section
          className="cognitive-frame__clarification"
          aria-labelledby={`clarify-${frame.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <span className="cognitive-frame__label" id={`clarify-${frame.id}`}>
            Clarification
          </span>
          <p className="cognitive-frame__clarification-text">{frame.clarification.text}</p>
          <p className="cognitive-frame__clarification-visual">{frame.clarification.visualAid}</p>
          <div className="cognitive-frame__clarification-actions">
            <button
              type="button"
              className="la-primary cognitive-frame__clarification-continue"
              onClick={onContinueAfterClarification}
            >
              Continue
            </button>
          </div>
        </motion.section>
      ) : null}
    </motion.article>
  );
}
