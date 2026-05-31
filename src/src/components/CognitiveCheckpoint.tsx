import { AnimatePresence, motion } from "framer-motion";
import type { ReflectionChoice } from "../cognitive/reflectionTypes";

type Props = {
  visible: boolean;
  showGuidance: boolean;
  onDismissGuidance: () => void;
  onChoice: (choice: ReflectionChoice) => void;
};

export function CognitiveCheckpoint({ visible, showGuidance, onDismissGuidance, onChoice }: Props) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="cognitive-checkpoint"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cognitive-checkpoint-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <motion.div
            className="cognitive-checkpoint__panel neural-glass"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {showGuidance ? (
              <p className="cognitive-checkpoint__guidance" role="note">
                This helps the system understand which concepts need more repetition and explanation.
                <button
                  type="button"
                  className="cognitive-checkpoint__guidance-dismiss"
                  onClick={onDismissGuidance}
                >
                  Got it
                </button>
              </p>
            ) : null}

            <p id="cognitive-checkpoint-title" className="cognitive-checkpoint__prompt">
              Did this concept click?
            </p>

            <div className="cognitive-checkpoint__choices">
              <motion.button
                type="button"
                className="cognitive-checkpoint__choice cognitive-checkpoint__choice--understand"
                whileTap={{ scale: 0.97 }}
                onClick={() => onChoice("understand")}
              >
                <span className="cognitive-checkpoint__icon" aria-hidden>
                  ✔
                </span>
                I understand
              </motion.button>
              <motion.button
                type="button"
                className="cognitive-checkpoint__choice cognitive-checkpoint__choice--confused"
                whileTap={{ scale: 0.97 }}
                onClick={() => onChoice("confused")}
              >
                <span className="cognitive-checkpoint__icon" aria-hidden>
                  ?
                </span>
                Still confused
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
