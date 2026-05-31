import type { AnchorOverlay } from "../types";
import { applyAnchorOverlay } from "./applyVisualPatch";

/** Lesson-chamber persistent anchors — independent of map mount lifecycle. */
const anchors = {
  bowlingBall: null as HTMLElement | null,
  hockeyPuck: null as HTMLElement | null,
};

let currentOverlay: AnchorOverlay = {
  glow: 0.4,
  shaderClass: "anchor--learning",
  pulseSpeed: 1,
};

export function registerLessonAnchorElement(
  kind: "bowling_ball" | "hockey_puck",
  element: HTMLElement
): () => void {
  if (kind === "bowling_ball") anchors.bowlingBall = element;
  else anchors.hockeyPuck = element;
  applyAnchorOverlay(element, currentOverlay);

  return () => {
    if (kind === "bowling_ball" && anchors.bowlingBall === element) anchors.bowlingBall = null;
    if (kind === "hockey_puck" && anchors.hockeyPuck === element) anchors.hockeyPuck = null;
  };
}

export function applyLessonAnchorOverlay(overlay: Partial<AnchorOverlay>): void {
  currentOverlay = { ...currentOverlay, ...overlay };
  if (anchors.bowlingBall) applyAnchorOverlay(anchors.bowlingBall, currentOverlay);
  if (anchors.hockeyPuck) applyAnchorOverlay(anchors.hockeyPuck, currentOverlay);
}
