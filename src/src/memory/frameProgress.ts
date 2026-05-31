const KEY = "cls:frame-progress:v1";

export type ModuleFrameProgress = {
  completedFrameIds: string[];
  moduleComplete: boolean;
};

export type FrameProgressStore = {
  modules: Record<string, ModuleFrameProgress>;
};

function empty(): FrameProgressStore {
  return { modules: {} };
}

export function loadFrameProgress(): FrameProgressStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return JSON.parse(raw) as FrameProgressStore;
  } catch {
    return empty();
  }
}

export function saveFrameProgress(store: FrameProgressStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function markFrameComplete(moduleId: string, frameId: string, totalFrames: number): void {
  const store = loadFrameProgress();
  const mod = store.modules[moduleId] ?? { completedFrameIds: [], moduleComplete: false };
  if (!mod.completedFrameIds.includes(frameId)) {
    mod.completedFrameIds = [...mod.completedFrameIds, frameId];
  }
  mod.moduleComplete = mod.completedFrameIds.length >= totalFrames;
  store.modules[moduleId] = mod;
  saveFrameProgress(store);
}

export function isFrameComplete(moduleId: string, frameId: string): boolean {
  return loadFrameProgress().modules[moduleId]?.completedFrameIds.includes(frameId) ?? false;
}

export function isModuleComplete(moduleId: string): boolean {
  return loadFrameProgress().modules[moduleId]?.moduleComplete ?? false;
}

export function completedFrameCount(moduleId: string): number {
  return loadFrameProgress().modules[moduleId]?.completedFrameIds.length ?? 0;
}

export function clearFrameProgress(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}
