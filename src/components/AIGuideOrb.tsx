import { motion } from "framer-motion";

type Props = {
  mode: "TEACH" | "ASK" | "FEEDBACK" | "ADVANCE";
  feedback: "correct" | "incorrect" | null;
  /** Cognitive layer — orb brightens on confusion / visual request */
  cognitiveActive?: boolean;
};

export function AIGuideOrb({ mode, feedback, cognitiveActive }: Props) {
  const tone =
    feedback === "correct"
      ? "#4ade80"
      : feedback === "incorrect"
        ? "#f43f5e"
        : mode === "TEACH"
          ? "#22d3ee"
          : "#8b5cf6";

  return (
    <motion.div
      className={`ai-orb${cognitiveActive ? " ai-orb--cognitive-active" : ""}`}
      animate={{
        boxShadow: cognitiveActive
          ? `0 0 40px ${tone}, 0 0 100px ${tone}88`
          : `0 0 28px ${tone}, 0 0 64px ${tone}55`,
        scale: cognitiveActive ? 1.18 : mode === "FEEDBACK" ? 1.06 : 1,
      }}
      transition={{ duration: 0.35 }}
      aria-hidden
    />
  );
}

