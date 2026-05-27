/**
 * Single active input / bottom-overlay owner.
 * Only one of: context actions, reflection, prompt — never multiple at once.
 */

export type InputOwner = "none" | "context_actions" | "reflection" | "prompt";

export type BottomOverlayKind = "feedback" | "context_actions" | "reflection" | "prompt";

/** Sync owner from selection state (selection wins over none). */
export function syncInputOwnerFromSelection(
  selectedItem: string,
  currentOwner: InputOwner
): InputOwner {
  if (selectedItem.trim()) return "context_actions";
  if (currentOwner === "context_actions") return "none";
  return currentOwner;
}

/** Request a specific owner; closes any other input surface. */
export function requestInputOwner(_current: InputOwner, requested: InputOwner): InputOwner {
  return requested;
}

export function canShowBottomOverlay(
  owner: InputOwner,
  kind: BottomOverlayKind
): boolean {
  if (kind === "context_actions") return owner === "context_actions";
  if (kind === "reflection") return owner === "reflection";
  if (kind === "prompt") return owner === "prompt";
  if (kind === "feedback") return owner === "none";
  return false;
}

export function closeAllInputs(): InputOwner {
  return "none";
}
