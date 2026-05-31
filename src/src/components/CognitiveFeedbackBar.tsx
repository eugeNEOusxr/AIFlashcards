import { motion } from "framer-motion";
import type { UnderstandingSignal } from "../cognitive/types";

const SIGNALS: { id: UnderstandingSignal; icon: string; label: string }[] = [
  { id: "understand", icon: "✓", label: "I understand" },
  { id: "partial", icon: "~", label: "Kinda understand" },
  { id: "confusing", icon: "?", label: "Confusing" },
  { id: "need_visual", icon: "👁", label: "Need visual" },
  { id: "repeat", icon: "↻", label: "Explain differently" },
];

type Props = {
  activeSignal: UnderstandingSignal | null;
  onSignal: (signal: UnderstandingSignal) => void;
};

export function CognitiveFeedbackBar({ activeSignal, onSignal }: Props) {
  return (
    <div className="cognitive-feedback" role="toolbar" aria-label="Understanding state">
      <span className="cognitive-feedback__label">Cognitive feedback</span>
      <div className="cognitive-feedback__controls">
        {SIGNALS.map((s) => {
          const active = activeSignal === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              className={`cognitive-feedback__btn cognitive-feedback__btn--${s.id}${active ? " cognitive-feedback__btn--active" : ""}`}
              onClick={() => onSignal(s.id)}
              whileTap={{ scale: 0.96 }}
              aria-pressed={active}
              title={s.label}
            >
              <span className="cognitive-feedback__icon" aria-hidden>
                {s.icon}
              </span>
              <span className="cognitive-feedback__text">{s.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
