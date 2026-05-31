import { useEffect, useRef } from "react";
import { registerLessonAnchorElement } from "../render/AnchorRegistry";
import { learningWorld } from "../LearningWorld";

/**
 * Registers lesson-chamber anchor with persistent registry — survives UI mode changes.
 */
export function useLessonAnchor(anchorId: string | null) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !anchorId) return;

    const kind =
      anchorId === "bowling-ball"
        ? ("bowling_ball" as const)
        : anchorId === "hockey-puck"
          ? ("hockey_puck" as const)
          : null;

    if (!kind) return;

    const unregister = registerLessonAnchorElement(kind, el);
    learningWorld.tick();

    return unregister;
  }, [anchorId]);

  return ref;
}
