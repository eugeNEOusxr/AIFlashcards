import type { AdaptiveSession, AnswerRecord, LessonQuestion } from "../../core/learningTypes";
import { getTopicById } from "../../core/curriculumData";
import { AnswerInput } from "../question/AnswerInput";
import { QuestionPanel } from "../question/QuestionPanel";

type Props = {
  session: AdaptiveSession;
  question: LessonQuestion;
  feedback: string | null;
  history: AnswerRecord[];
  onSubmit: (answer: string) => void;
  onChangePath: () => void;
};

export function LearningLoopScreen({
  session,
  question,
  feedback,
  history,
  onSubmit,
  onChangePath,
}: Props) {
  const topic = getTopicById(question.topicId);
  const panelQuestion = {
    id: question.id,
    domain: topic?.domain ?? "math",
    prompt: question.prompt,
    expectedConcept: question.expectedConcept,
  };

  return (
    <div className="gl-learning">
      <header className="gl-learning__header">
        <div>
          <span className="gl-learning__path">{session.topicTitle}</span>
          <span className="gl-learning__phase">
            {session.phase === "diagnostic" ? "Diagnostic" : "Adaptive"} · diff {session.currentDifficulty}
          </span>
        </div>
        <button type="button" className="gl-btn gl-btn--ghost gl-btn--sm" onClick={onChangePath}>
          Change path
        </button>
      </header>

      <QuestionPanel question={panelQuestion} feedback={feedback} />

      <AnswerInput onSubmit={onSubmit} />

      {history.length > 0 ? (
        <ul className="gl-mini-feed">
          {history.slice(-3).reverse().map((h) => (
            <li key={`${h.questionId}-${h.timestamp}`}>
              <span className={`gl-mini-feed__eval gl-mini-feed__eval--${h.evaluation}`}>{h.evaluation}</span>
              {h.prompt.slice(0, 48)}…
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
