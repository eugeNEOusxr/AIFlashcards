import { motion } from "framer-motion";

type Props = {
  title: string;
  state: "locked" | "active" | "done" | "unlocked";
  onClick: () => void;
};

export function CourseNode({ title, state, onClick }: Props) {
  return (
    <motion.button
      type="button"
      className={`course-node neural-glass course-node--${state}`}
      whileHover={state === "locked" ? undefined : { scale: 1.02, y: -2 }}
      whileTap={state === "locked" ? undefined : { scale: 0.99 }}
      animate={
        state === "locked"
          ? undefined
          : {
              y: [0, -1.5, 0],
            }
      }
      transition={{
        y: { duration: 10 + (title.length % 5), repeat: Infinity, ease: "easeInOut" },
      }}
      onClick={onClick}
      disabled={state === "locked"}
    >
      <span className="course-node__sweep" aria-hidden />
      <span className="course-node__bloom" aria-hidden />
      <span className="course-node__content">
        <span className="course-node__title">{title}</span>
        <span className="course-node__state">{state}</span>
      </span>
    </motion.button>
  );
}
