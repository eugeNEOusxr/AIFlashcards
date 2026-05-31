import { memo, useEffect, useId, useRef } from "react";
import { learningWorld } from "../LearningWorld";

type Props = {
  graphId?: string;
  compact?: boolean;
  title?: string;
};

/**
 * UI shell only — scene DOM owned by RenderEngine (mount once per host, diff updates).
 */
export const CurriculumWorldHost = memo(function CurriculumWorldHost({
  graphId = "motion-forces",
  compact = false,
  title = "Knowledge map",
}: Props) {
  const hostId = useId();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    learningWorld.mountMapHost(hostId, el, graphId, compact);
    learningWorld.tick(graphId);

    return () => learningWorld.unmountMapHost(hostId);
  }, [hostId, graphId, compact]);

  return (
    <section className={["cmap", compact ? "cmap--compact" : ""].filter(Boolean).join(" ")} aria-label={title}>
      <header className="cmap__head">
        <span className="cmap__kicker">Living world</span>
        <h3 className="cmap__title">{title}</h3>
        <p className="cmap__hint">Memory → graph → scene diff · anchor persists</p>
      </header>
      <div ref={stageRef} className="cmap__host" />
    </section>
  );
});
