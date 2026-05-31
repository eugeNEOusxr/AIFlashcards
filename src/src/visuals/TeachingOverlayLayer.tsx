import { AnimatePresence, motion } from "framer-motion";

type Props = {
  visualEvents: string[];
  overlayClasses: string[];
  visible: boolean;
};

/**
 * Scripted teaching overlays — force arrows, glow, trails.
 * Sits above the persistent anchor; fades without remounting the chamber.
 */
export function TeachingOverlayLayer({ visualEvents, overlayClasses, visible }: Props) {
  const eventKey = visualEvents.join("|") || "none";

  return (
    <AnimatePresence initial={false}>
      {visible && visualEvents.length > 0 ? (
        <motion.div
          key={eventKey}
          className={["lesson-visual-scene__teach-overlay", ...overlayClasses].filter(Boolean).join(" ")}
          data-visual-events={visualEvents.join(" ")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          {visualEvents.includes("force_arrows_activate") || visualEvents.includes("motion_vectors") ? (
            <div className="lesson-visual-scene__force-overlays lesson-visual-scene__force-overlays--teach">
              <div className="lesson-force-overlay lesson-force-overlay--arrow" />
              <div className="lesson-force-overlay lesson-force-overlay--vector" />
              <div className="lesson-force-overlay lesson-force-overlay--ring" />
            </div>
          ) : null}
          {visualEvents.includes("pathway_glow_forward") ? (
            <div className="lesson-teach-fx lesson-teach-fx--pathway-glow" />
          ) : null}
          {visualEvents.includes("motion_trail") || visualEvents.includes("motion_lines") ? (
            <div className="lesson-teach-fx lesson-teach-fx--motion-trail" />
          ) : null}
          {visualEvents.includes("interaction_glow") ? (
            <div className="lesson-teach-fx lesson-teach-fx--interaction-glow" />
          ) : null}
          {visualEvents.includes("ball_rotation_subtle") ? (
            <div className="lesson-teach-fx lesson-teach-fx--ball-rotate" aria-hidden />
          ) : null}
          {visualEvents.includes("push_pulse") ? (
            <div className="lesson-teach-fx lesson-teach-fx--push-pulse" />
          ) : null}
          {visualEvents.includes("collision_ripple") ? (
            <div className="lesson-force-overlay lesson-force-overlay--shockwave" />
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
