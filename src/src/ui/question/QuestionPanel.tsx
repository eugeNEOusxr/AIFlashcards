import { DOMAIN_LABELS } from "../../core/curriculumData";
import type { Domain } from "../../core/learningTypes";

type Question = {
  id: string;
  domain: Domain | string;
  prompt: string;
  expectedConcept?: string;
};

type Props = {
  question: Question;
  feedback: string | null;
};

export function QuestionPanel({ question, feedback }: Props) {
  return (
    <section className="ql-question" aria-live="polite">
      <span className="ql-question__domain">
        {question.domain in DOMAIN_LABELS
          ? DOMAIN_LABELS[question.domain as Domain]
          : String(question.domain)}
      </span>
      <h1 className="ql-question__prompt">{question.prompt}</h1>
      {feedback ? <p className={`ql-question__feedback ql-question__feedback--show`}>{feedback}</p> : null}
    </section>
  );
}
