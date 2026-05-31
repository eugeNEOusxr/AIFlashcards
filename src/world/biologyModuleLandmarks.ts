import type { PathwayId } from "./types";

export type BiologyModuleLandmarkId = "cells" | "organisms" | "habitats" | "energy-life" | "diversity";

export type BiologyModuleLandmark = {
  id: BiologyModuleLandmarkId;
  title: string;
  tagline: string;
  pathwayId: PathwayId;
  biomeId: PathwayId;
};

export const BIOLOGY_MODULE_LANDMARKS: BiologyModuleLandmark[] = [
  {
    id: "cells",
    title: "Cells & Life",
    tagline: "The tiny units inside every living thing",
    pathwayId: "living-biology",
    biomeId: "living-biology",
  },
  {
    id: "organisms",
    title: "Living Organisms",
    tagline: "What makes something alive in nature",
    pathwayId: "living-biology",
    biomeId: "living-biology",
  },
  {
    id: "habitats",
    title: "Habitats",
    tagline: "Where life survives and thrives",
    pathwayId: "biology-habitats",
    biomeId: "biology-habitats",
  },
  {
    id: "energy-life",
    title: "Energy in Life",
    tagline: "Food, sunlight, and survival",
    pathwayId: "biology-energy",
    biomeId: "biology-energy",
  },
  {
    id: "diversity",
    title: "Biodiversity",
    tagline: "Many species, one living planet",
    pathwayId: "biology-diversity",
    biomeId: "biology-diversity",
  },
];

export const BIOLOGY_LANDMARK_FLOW_ORDER: BiologyModuleLandmarkId[] = [
  "cells",
  "organisms",
  "habitats",
  "energy-life",
  "diversity",
];

export type LandmarkAlign = "left" | "center" | "right";

export type BiologyLandmarkSlot = {
  id: BiologyModuleLandmarkId;
  align: LandmarkAlign;
  cx: number;
  cy: number;
  fog: number;
  depth: number;
};

const MAP_W = 900;
const MAP_H = 2050;
const HORIZONTAL_WEAVE = 0.78;
const VERTICAL_COMPRESS = 0.74;
const VERTICAL_PIVOT = 0.46;

export const BIOLOGY_START_ORB_ATTACH_R = 100;
export const BIOLOGY_LANDMARK_ATTACH_HALF_H = 90;

function tightenCx(cx: number): number {
  return 0.5 + (cx - 0.5) * HORIZONTAL_WEAVE;
}

function tightenCy(cy: number): number {
  return VERTICAL_PIVOT + (cy - VERTICAL_PIVOT) * VERTICAL_COMPRESS;
}

const RAW_START = { cx: 0.5, cy: 0.06 } as const;

const RAW_LANDMARK_SLOTS: BiologyLandmarkSlot[] = [
  { id: "cells", align: "left", cx: 0.29, cy: 0.17, fog: 0, depth: 0 },
  { id: "organisms", align: "right", cx: 0.73, cy: 0.33, fog: 0.03, depth: 1 },
  { id: "habitats", align: "center", cx: 0.51, cy: 0.48, fog: 0.06, depth: 2 },
  { id: "energy-life", align: "left", cx: 0.25, cy: 0.62, fog: 0.1, depth: 3 },
  { id: "diversity", align: "right", cx: 0.77, cy: 0.75, fog: 0.14, depth: 4 },
];

export const BIOLOGY_START_SLOT = {
  cx: tightenCx(RAW_START.cx),
  cy: tightenCy(RAW_START.cy),
} as const;

export const BIOLOGY_LANDMARK_SLOTS: BiologyLandmarkSlot[] = RAW_LANDMARK_SLOTS.map((slot) => ({
  ...slot,
  cx: tightenCx(slot.cx),
  cy: tightenCy(slot.cy),
}));

export function biologyModuleMapWidth(): number {
  return MAP_W;
}

export function biologyModuleMapHeight(): number {
  return MAP_H;
}

export function biologyStartPixelPosition(): { cx: number; cy: number } {
  return { cx: BIOLOGY_START_SLOT.cx * MAP_W, cy: BIOLOGY_START_SLOT.cy * MAP_H };
}

export function biologyStartTunnelExit(): { cx: number; cy: number } {
  const c = biologyStartPixelPosition();
  return { cx: c.cx, cy: c.cy + BIOLOGY_START_ORB_ATTACH_R };
}

export function biologyLandmarkTunnelCenter(slot: BiologyLandmarkSlot): { cx: number; cy: number } {
  const p = biologyLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy };
}

export function biologyLandmarkTunnelEntry(slot: BiologyLandmarkSlot): { cx: number; cy: number } {
  const p = biologyLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy - BIOLOGY_LANDMARK_ATTACH_HALF_H };
}

export function biologyLandmarkTunnelExit(slot: BiologyLandmarkSlot): { cx: number; cy: number } {
  const p = biologyLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy + BIOLOGY_LANDMARK_ATTACH_HALF_H };
}

export function cellsToOrganismsTunnelEndpoints(
  cellsSlot: BiologyLandmarkSlot,
  organismsSlot: BiologyLandmarkSlot
): { from: { cx: number; cy: number }; to: { cx: number; cy: number } } {
  return {
    from: biologyLandmarkTunnelCenter(cellsSlot),
    to: biologyLandmarkTunnelCenter(organismsSlot),
  };
}

export function startToCellsTunnelD(cellsSlot: BiologyLandmarkSlot): string {
  const from = biologyStartTunnelExit();
  const to = biologyLandmarkTunnelEntry(cellsSlot);
  const dropY = from.cy + Math.max(56, (to.cy - from.cy) * 0.32);
  const c1x = from.cx;
  const c1y = dropY;
  const c2x = to.cx + (from.cx - to.cx) * 0.28;
  const c2y = dropY + (to.cy - dropY) * 0.55;
  return `M ${from.cx} ${from.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.cx} ${to.cy}`;
}

export function biologyLandmarkPixelPosition(slot: BiologyLandmarkSlot): {
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

export function biologyLandmarkById(id: BiologyModuleLandmarkId): BiologyModuleLandmark {
  return BIOLOGY_MODULE_LANDMARKS.find((l) => l.id === id)!;
}
