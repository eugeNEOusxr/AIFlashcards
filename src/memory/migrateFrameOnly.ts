import { resetAllProgress } from "./resetProgress";

const MIGRATION_KEY = "cls:frame-migration:v3";

/** One-time purge so stale lesson nav / SW cache cannot resurrect legacy flows. */
export function migrateToFrameOnlyStorage(): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(MIGRATION_KEY) === "1") return;

  resetAllProgress();
  localStorage.setItem(MIGRATION_KEY, "1");
}
