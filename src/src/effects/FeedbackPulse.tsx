import { AnimatePresence, motion } from "framer-motion";

export function FeedbackPulse({ kind }: { kind: "correct" | "incorrect" | null }) {
  return (
    <AnimatePresence>
      {kind ? (
        <motion.div
          key={kind}
          className={`fx-feedback fx-feedback--${kind}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      ) : null}
    </AnimatePresence>
  );
}

