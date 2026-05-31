import { clearFrameProgress } from "./frameProgress";
import { clearFrameNav, clearFrameSession } from "./frameSession";

const MEMORY_KEY = "cls:learning-memory:v1";
const LEGACY_PROGRESSION_KEY = "cls:progression:v1";
const LEGACY_PATHWAY_KEY = "cls:pathway-complete:v1";

/** Clear all local progress without loading legacy curriculum modules. */
export function resetAllProgress(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(MEMORY_KEY);
  localStorage.removeItem(LEGACY_PROGRESSION_KEY);
  localStorage.removeItem(LEGACY_PATHWAY_KEY);
  clearFrameSession();
  clearFrameNav();
  clearFrameProgress();
}
