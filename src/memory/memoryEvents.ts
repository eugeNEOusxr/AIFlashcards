export const MEMORY_UPDATED_EVENT = "cls-memory-updated";

export function dispatchMemoryUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(MEMORY_UPDATED_EVENT));
  }
}
