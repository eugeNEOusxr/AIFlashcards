import { useLearning } from "./useLearning";

export function CognitiveFeedbackOverlay() {
  const snap = useLearning();
  const fb = snap.cognitiveFeedback;
  if (!fb.message) return null;

  const tone =
    fb.confusionScore > fb.clarityScore
      ? "confusion"
      : fb.clarityScore >= 0.5
        ? "clarity"
        : fb.attentionStickiness >= 0.5
          ? "engagement"
          : "neutral";

  return (
    <div
      className={`cls-feedback-overlay cls-feedback-overlay--${tone}`}
      role="status"
      aria-live="polite"
    >
      {fb.message}
    </div>
  );
}
