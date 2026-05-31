import { getModule } from "../content/frames/registry";
import type { FrameAnswers, FramePhase } from "../content/frames/types";
import type { NavScreen } from "../world/types";

const NAV_KEY = "cls:frame-nav:v1";
const SESSION_KEY = "cls:frame-session:v1";

export type PersistedFrameSession = {
  moduleId: string;
  frameIndex: number;
  phase: FramePhase;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  shuffledAnswers?: FrameAnswers;
  shuffledCorrectIndex?: number;
};

export function saveFrameNav(nav: NavScreen): void {
  localStorage.setItem(NAV_KEY, JSON.stringify(nav));
}

/** Always open at Study Worlds — subjects are choices; map/lesson progress is stored separately. */
export function loadFrameNav(): NavScreen {
  return { kind: "HOME" };
}

export function saveFrameSession(session: PersistedFrameSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadFrameSession(): PersistedFrameSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as PersistedFrameSession;
    if (!getModule(session.moduleId)) return null;
    if (session.phase === "feedback") {
      return { ...session, phase: "reflection" };
    }
    return session;
  } catch {
    return null;
  }
}

export function clearFrameSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function clearFrameNav(): void {
  localStorage.removeItem(NAV_KEY);
}
