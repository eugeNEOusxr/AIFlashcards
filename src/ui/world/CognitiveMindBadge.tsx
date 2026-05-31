import type { QuestionBankStats } from "../../content/curriculum/questionBank";
import { formatQuestionBankLabel, formatVisionHint } from "../../content/curriculum/questionBank";

type Props = {
  stats: QuestionBankStats;
  /** Show 10k path hint under the fraction */
  showVision?: boolean;
  size?: "sm" | "md";
};

/** Question-mark badge — live frames vs book target, optional 10k vision. */
export function CognitiveMindBadge({ stats, showVision = true, size = "md" }: Props) {
  return (
    <span
      className={`cognitive-mind-badge cognitive-mind-badge--${size}`}
      title={`${stats.live} questions live now · ${stats.bookTarget} planned for this book · ${stats.visionTarget.toLocaleString()} long-range cognitive mind pool`}
      aria-label={`${stats.live} of ${stats.bookTarget} book questions ready; ${stats.visionTarget.toLocaleString()} question vision`}
    >
      <span className="cognitive-mind-badge__mark" aria-hidden>
        ?
      </span>
      <span className="cognitive-mind-badge__counts">
        <span className="cognitive-mind-badge__fraction">{formatQuestionBankLabel(stats)}</span>
        {showVision ? (
          <span className="cognitive-mind-badge__vision">{formatVisionHint(stats)}</span>
        ) : null}
      </span>
    </span>
  );
}
