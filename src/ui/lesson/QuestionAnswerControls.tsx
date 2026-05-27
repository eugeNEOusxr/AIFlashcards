import type { LessonQuestion } from "../../content/curriculumTypes";
import { phaseLabel } from "../../engine/questionTypes";

const LETTERS = ["A", "B", "C", "D"] as const;

type Props = {
  question: LessonQuestion;
  mode: "ASK" | "FEEDBACK";
  selectedAnswerIndex: number | null;
  submittedNumeric: string;
  lastAnswerCorrect: boolean | null;
  onPickChoice: (index: number) => void;
  onNumericChange: (value: string) => void;
  onSubmitNumeric: () => void;
};

export function QuestionAnswerControls({
  question,
  mode,
  selectedAnswerIndex,
  submittedNumeric,
  lastAnswerCorrect,
  onPickChoice,
  onNumericChange,
  onSubmitNumeric,
}: Props) {
  const feedbackMode = mode === "FEEDBACK";
  const phaseChip = phaseLabel(question.phase);

  if (question.questionType === "NUMERIC_INPUT") {
    const correctDisplay = question.unit
      ? `${question.correctValue} ${question.unit}`
      : String(question.correctValue);

    return (
      <div className="la-answer-stack la-answer-stack--numeric" role="group" aria-label="Numeric answer">
        <p className="la-phase-hint">
          <span className="la-phase-hint__phase">{phaseChip}</span>
          <span className="la-phase-hint__type">Calculate</span>
        </p>
        <div className="la-numeric-row">
          <input
            type="number"
            inputMode="decimal"
            className="la-numeric-input"
            value={submittedNumeric}
            onChange={(e) => onNumericChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !feedbackMode) {
                e.preventDefault();
                onSubmitNumeric();
              }
            }}
            disabled={feedbackMode}
            placeholder={question.unit ? `Value (${question.unit})` : "Your answer"}
            aria-label="Numeric answer"
          />
          {question.unit ? <span className="la-numeric-unit">{question.unit}</span> : null}
          {!feedbackMode ? (
            <button type="button" className="la-primary la-primary--compact" onClick={onSubmitNumeric}>
              Check
            </button>
          ) : null}
        </div>
        {feedbackMode ? (
          <p
            className={`la-numeric-result ${lastAnswerCorrect ? "la-numeric-result--ok" : "la-numeric-result--no"}`}
          >
            {lastAnswerCorrect ? "Correct." : `Correct answer: ${correctDisplay}`}
          </p>
        ) : null}
      </div>
    );
  }

  if (question.questionType === "TRUE_FALSE") {
    const choices = ["True", "False"] as const;
    const correctIndex = question.correctAnswer ? 0 : 1;

    return (
      <div className="la-answer-stack la-answer-stack--tf" role="list" aria-label="True or false">
        <p className="la-phase-hint">
          <span className="la-phase-hint__phase">{phaseChip}</span>
          <span className="la-phase-hint__type">True / False</span>
        </p>
        {choices.map((label, i) => {
          const isCorrect = correctIndex === i;
          const isPicked = selectedAnswerIndex === i;
          const cls = [
            "la-choice",
            "la-choice--tf",
            feedbackMode ? "la-choice--static" : "",
            feedbackMode && isCorrect ? "la-choice--correct" : "",
            feedbackMode && isPicked && !isCorrect ? "la-choice--wrong" : "",
            feedbackMode && isPicked ? "la-choice--picked" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={label}
              type="button"
              className={cls}
              role="listitem"
              onClick={(e) => {
                e.stopPropagation();
                onPickChoice(i);
              }}
              disabled={feedbackMode}
            >
              <span className="la-choice__text">{label}</span>
              {feedbackMode && isCorrect ? <span className="la-choice__tag">Correct</span> : null}
              {feedbackMode && isPicked && !isCorrect ? (
                <span className="la-choice__tag la-choice__tag--wrong">Your pick</span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="la-answer-stack" role="list" aria-label="Answer choices">
      <p className="la-phase-hint">
        <span className="la-phase-hint__phase">{phaseChip}</span>
        <span className="la-phase-hint__type">Multiple choice</span>
      </p>
      {question.options.map((opt, i) => {
        const isCorrect = question.correctIndex === i;
        const isPicked = selectedAnswerIndex === i;
        const cls = [
          "la-choice",
          "la-choice--mcq",
          feedbackMode ? "la-choice--static" : "",
          feedbackMode && isCorrect ? "la-choice--correct" : "",
          feedbackMode && isPicked && !isCorrect ? "la-choice--wrong" : "",
          feedbackMode && isPicked ? "la-choice--picked" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={i}
            type="button"
            className={cls}
            role="listitem"
            onClick={(e) => {
              e.stopPropagation();
              onPickChoice(i);
            }}
            disabled={feedbackMode}
          >
            <span className="la-choice__key">{LETTERS[i]}</span>
            <span className="la-choice__text">{opt}</span>
            {feedbackMode && isCorrect ? <span className="la-choice__tag">Correct</span> : null}
            {feedbackMode && isPicked && !isCorrect ? (
              <span className="la-choice__tag la-choice__tag--wrong">Your pick</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
