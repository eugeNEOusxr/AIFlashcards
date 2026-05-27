import type { ModeId } from "../core/state/learningState";
import { useLearning } from "./useLearning";
import { emitModeChange } from "../core/events/interactionBus";

type Props = {
  mode: ModeId;
  label: string;
  icon: string;
};

export function ModeButton({ mode, label, icon }: Props) {
  const snap = useLearning();
  const moduleId = `mode.${mode}`;
  const isOn = snap.activeMode === mode;
  const isActiveModule = snap.activeModuleId === moduleId;

  return (
    <button
      type="button"
      className={[
        "cls-mode-btn",
        "cls-interactive-btn",
        isOn ? "cls-mode-btn--on cls-mode-btn--confirmed" : "",
        isActiveModule ? "cls-interactive-btn--selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-module-id={moduleId}
      aria-pressed={isOn}
      onClick={() => emitModeChange(moduleId, mode)}
    >
      <span className="ico" aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  );
}
