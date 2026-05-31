import { useLearning } from "./useLearning";
import { emitAction } from "../core/events/interactionBus";

const MODULE_ID = "context.clear";

export function ClearSelectionButton() {
  const snap = useLearning();
  const isSelected = snap.activeModuleId === MODULE_ID;

  return (
    <button
      type="button"
      className={`cls-clear-btn cls-interactive-btn${isSelected ? " cls-interactive-btn--selected" : ""}`}
      data-module-id={MODULE_ID}
      onClick={() => emitAction(MODULE_ID, { action: "clear_selection" })}
    >
      Clear selection
    </button>
  );
}
