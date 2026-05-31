import { useLearning } from "./useLearning";

function bar(value: number, label: string) {
  return (
    <span className="cls-status-ind" title={label}>
      <span className="cls-status-ind__track">
        <span className="cls-status-ind__fill" style={{ width: `${Math.round(value * 100)}%` }} />
      </span>
    </span>
  );
}

export function CognitiveStatusIndicators() {
  const fb = useLearning().cognitiveFeedback;

  return (
    <div className="cls-status-row" aria-label="Cognitive feedback indicators">
      {bar(fb.clarityScore, "clarity")}
      {bar(fb.confusionScore, "confusion")}
      {bar(fb.attentionStickiness, "engagement")}
      {bar(fb.conceptStability, "stability")}
    </div>
  );
}
