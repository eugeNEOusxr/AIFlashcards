import type { ReactNode, MouseEvent, CSSProperties } from "react";
import { useLearning } from "./useLearning";
import { emitAction } from "../core/events/interactionBus";

type Props = {
  moduleId: string;
  children: ReactNode;
  className?: string;
  /** Module receives focus on click/tap (emits action). */
  focusable?: boolean;
  /** Desktop hover emits action signal. */
  trackHover?: boolean;
  role?: string;
};

export function InteractiveModule({
  moduleId,
  children,
  className = "",
  focusable = true,
  trackHover = true,
  role,
}: Props) {
  const snap = useLearning();
  const isActive = snap.activeModuleId === moduleId;
  const glow = snap.cognitiveFeedback.glowIntensity;
  const confusion = snap.cognitiveFeedback.confusionScore;

  const onPointer = (interaction: "click" | "tap") => {
    if (!focusable) return;
    emitAction(moduleId, { interaction });
  };

  const onClick = (e: MouseEvent) => {
    if (e.detail === 0) return;
    onPointer("click");
  };

  const onMouseEnter = () => {
    if (!trackHover) return;
    if (window.matchMedia("(hover: hover)").matches) {
      emitAction(moduleId, { interaction: "hover" });
    }
  };

  const glowStyle: CSSProperties = {
    ["--cls-glow" as string]: String(glow),
    ["--cls-confusion" as string]: String(confusion),
  };

  return (
    <div
      className={`cls-module ${isActive ? "cls-module--active" : ""} cls-module--feedback ${className}`.trim()}
      data-module-id={moduleId}
      role={role}
      style={glowStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
}
