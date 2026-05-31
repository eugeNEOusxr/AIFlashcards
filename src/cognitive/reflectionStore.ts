const GUIDANCE_KEY = "cls:reflection-guidance-seen:v1";

export function hasSeenReflectionGuidance(): boolean {
  try {
    return localStorage.getItem(GUIDANCE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markReflectionGuidanceSeen(): void {
  try {
    localStorage.setItem(GUIDANCE_KEY, "1");
  } catch {
    /* quota */
  }
}

export function resetReflectionGuidance(): void {
  try {
    localStorage.removeItem(GUIDANCE_KEY);
  } catch {
    /* */
  }
}
