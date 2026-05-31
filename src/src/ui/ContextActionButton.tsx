import { useLearning } from "./useLearning";
import { emitReflect } from "../core/events/interactionBus";

type ReflectAction = "explain" | "save" | "confusing" | "clicked";

const LABELS: Record<ReflectAction, string> = {
  explain: "Explain",
  save: "Save",
  confusing: "Confusing",
  clicked: "It clicked",
};

type Props = {
  action: ReflectAction;
};

export function ContextActionButton({ action }: Props) {
  const snap = useLearning();
  const moduleId = `context.${action}`;
  const isSelected = snap.activeModuleId === moduleId;

  return (
    <button
      type="button"
      className={`cls-interactive-btn cls-context-btn${isSelected ? " cls-interactive-btn--selected" : ""}`}
      data-module-id={moduleId}
      onClick={() =>
        emitReflect(moduleId, {
          action,
          label: LABELS[action],
          text: snap.selectedItem || LABELS[action],
        })
      }
    >
      {LABELS[action]}
    </button>
  );
}
