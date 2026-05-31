import type { PathwayId } from "./types";

/** Major landmarks on the Physics module map — metadata only (no legacy lessons). */
export type PhysicsModuleLandmarkId = "motion" | "forces" | "energy" | "waves" | "electricity";

export type PhysicsModuleLandmark = {
  id: PhysicsModuleLandmarkId;
  title: string;
  tagline: string;
  pathwayId: PathwayId;
  biomeId: PathwayId;
};

export const PHYSICS_MODULE_LANDMARKS: PhysicsModuleLandmark[] = [
  {
    id: "motion",
    title: "Motion & Forces",
    tagline: "Push, pull, and how motion changes",
    pathwayId: "motion-forces",
    biomeId: "motion-forces",
  },
  {
    id: "forces",
    title: "Forces",
    tagline: "Contact, fields, and net force",
    pathwayId: "motion-forces",
    biomeId: "motion-forces",
  },
  {
    id: "energy",
    title: "Energy",
    tagline: "Work, stores, and conservation",
    pathwayId: "energy",
    biomeId: "energy",
  },
  {
    id: "waves",
    title: "Waves",
    tagline: "Oscillation, sound, and light",
    pathwayId: "waves",
    biomeId: "waves",
  },
  {
    id: "electricity",
    title: "Electricity",
    tagline: "Charge, current, and circuits",
    pathwayId: "electricity",
    biomeId: "electricity",
  },
];

export const LANDMARK_FLOW_ORDER: PhysicsModuleLandmarkId[] = [
  "motion",
  "forces",
  "energy",
  "waves",
  "electricity",
];

export type LandmarkAlign = "left" | "center" | "right";

export type LandmarkSlot = {
  id: PhysicsModuleLandmarkId;
  align: LandmarkAlign;
  /** Normalized map center for node + tunnel attach (0–1) */
  cx: number;
  cy: number;
  fog: number;
  depth: number;
};

/**
 * Spatial density — tighter world without changing order, curvature, or hierarchy.
 * ~20% shorter canvas, ~12% narrower, compressed serpentine weave.
 */
const MAP_W = 900;
const MAP_H = 2050;

/** Visual half-height for tunnel attach (center anchor → edge) */
export const START_ORB_ATTACH_R = 100;
export const LANDMARK_ATTACH_HALF_H = 90;

/** Horizontal offset toward center (1 = legacy spread) */
const HORIZONTAL_WEAVE = 0.78;

/** Vertical compression around pivot (1 = legacy spacing) */
const VERTICAL_COMPRESS = 0.74;
const VERTICAL_PIVOT = 0.46;

function tightenCx(cx: number): number {
  return 0.5 + (cx - 0.5) * HORIZONTAL_WEAVE;
}

function tightenCy(cy: number): number {
  return VERTICAL_PIVOT + (cy - VERTICAL_PIVOT) * VERTICAL_COMPRESS;
}

/** Design anchors before density pass (legacy proportions) */
const RAW_START = { cx: 0.5, cy: 0.06 } as const;

const RAW_LANDMARK_SLOTS: LandmarkSlot[] = [
  { id: "motion", align: "left", cx: 0.28, cy: 0.19, fog: 0, depth: 0 },
  { id: "forces", align: "right", cx: 0.74, cy: 0.34, fog: 0.03, depth: 1 },
  { id: "energy", align: "center", cx: 0.5, cy: 0.47, fog: 0.06, depth: 2 },
  { id: "waves", align: "left", cx: 0.26, cy: 0.6, fog: 0.1, depth: 3 },
  { id: "electricity", align: "right", cx: 0.76, cy: 0.73, fog: 0.14, depth: 4 },
];

/** Visual entrance — connects into Motion & Forces */
export const START_SLOT = {
  cx: tightenCx(RAW_START.cx),
  cy: tightenCy(RAW_START.cy),
} as const;

/** Cinematic serpentine pathway — left / right / center rhythm */
export const LANDMARK_SLOTS: LandmarkSlot[] = RAW_LANDMARK_SLOTS.map((slot) => ({
  ...slot,
  cx: tightenCx(slot.cx),
  cy: tightenCy(slot.cy),
}));

export function physicsModuleMapWidth(): number {
  return MAP_W;
}

export function physicsModuleMapHeight(): number {
  return MAP_H;
}

export function startPixelPosition(): { cx: number; cy: number } {
  return { cx: START_SLOT.cx * MAP_W, cy: START_SLOT.cy * MAP_H };
}

/** Tunnel leaves the bottom of the Physics entrance orb */
export function startTunnelExit(): { cx: number; cy: number } {
  const c = startPixelPosition();
  return { cx: c.cx, cy: c.cy + START_ORB_ATTACH_R };
}

/** Tunnel attach at landmark map center (node anchor) */
export function landmarkTunnelCenter(slot: LandmarkSlot): { cx: number; cy: number } {
  const p = landmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy };
}

/** Tunnel enters the top edge of a landmark card */
export function landmarkTunnelEntry(slot: LandmarkSlot): { cx: number; cy: number } {
  const p = landmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy - LANDMARK_ATTACH_HALF_H };
}

/** Tunnel leaves the bottom edge of a landmark card */
export function landmarkTunnelExit(slot: LandmarkSlot): { cx: number; cy: number } {
  const p = landmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy + LANDMARK_ATTACH_HALF_H };
}

/** Motion → Forces uses center anchors on both landmarks */
export function motionToForcesTunnelEndpoints(
  motionSlot: LandmarkSlot,
  forcesSlot: LandmarkSlot
): { from: { cx: number; cy: number }; to: { cx: number; cy: number } } {
  return {
    from: landmarkTunnelCenter(motionSlot),
    to: landmarkTunnelCenter(forcesSlot),
  };
}

/**
 * Fixed entrance path: vertical drop from Physics orb, then sweep into Motion & Forces.
 * Keeps the start tunnel aligned with the orb beacon (not through the orb center).
 */
export function startToMotionTunnelD(
  motionSlot: LandmarkSlot
): string {
  const from = startTunnelExit();
  const to = landmarkTunnelEntry(motionSlot);
  const dropY = from.cy + Math.max(56, (to.cy - from.cy) * 0.32);
  const c1x = from.cx;
  const c1y = dropY;
  const c2x = to.cx + (from.cx - to.cx) * 0.28;
  const c2y = dropY + (to.cy - dropY) * 0.55;
  return `M ${from.cx} ${from.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.cx} ${to.cy}`;
}

export function landmarkPixelPosition(slot: LandmarkSlot): {
  y: number;
  cx: number;
  cy: number;
} {
  return {
    y: slot.cy * MAP_H,
    cx: slot.cx * MAP_W,
    cy: slot.cy * MAP_H,
  };
}

export function landmarkById(id: PhysicsModuleLandmarkId): PhysicsModuleLandmark {
  return PHYSICS_MODULE_LANDMARKS.find((l) => l.id === id)!;
}
