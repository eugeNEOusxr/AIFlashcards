import type { AnswerLog } from "../../core/questionTypes";
import { DOMAIN_LABELS } from "../../core/questionEngine";

type Props = {
  history: AnswerLog[];
};

const EVAL_LABEL = {
  good: "Strong",
  ok: "Partial",
  unknown: "Thin",
} as const;

export function HistoryFeed({ history }: Props) {
  const recent = [...history].reverse().slice(0, 12);

  return (
    <footer className="ql-history">
      <span className="ql-history__label">Answer feed</span>
      {recent.length === 0 ? (
        <p className="ql-history__empty">Your answers will appear here as you respond.</p>
      ) : (
        <ul className="ql-history__list">
          {recent.map((entry) => (
            <li key={`${entry.questionId}-${entry.timestamp}`} className="ql-history__item">
              <div className="ql-history__head">
                <span className="ql-history__domain">{DOMAIN_LABELS[entry.domain]}</span>
                <span className={`ql-history__eval ql-history__eval--${entry.evaluation}`}>
                  {EVAL_LABEL[entry.evaluation]}
                </span>
              </div>
              <p className="ql-history__q">{entry.questionPrompt}</p>
              <p className="ql-history__a">{entry.answer}</p>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
}
