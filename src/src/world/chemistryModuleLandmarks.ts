import type { PathwayId } from "./types";

export type ChemistryModuleLandmarkId = "matter" | "mixtures" | "change" | "bonds" | "cycles";

export type ChemistryModuleLandmark = {
  id: ChemistryModuleLandmarkId;
  title: string;
  tagline: string;
  pathwayId: PathwayId;
  biomeId: PathwayId;
};

export const CHEMISTRY_MODULE_LANDMARKS: ChemistryModuleLandmark[] = [
  {
    id: "matter",
    title: "Matter in Nature",
    tagline: "What the natural world is made of",
    pathwayId: "nature-chemistry",
    biomeId: "nature-chemistry",
  },
  {
    id: "mixtures",
    title: "Mixtures",
    tagline: "Air, soil, and seawater blends",
    pathwayId: "chemistry-mixtures",
    biomeId: "chemistry-mixtures",
  },
  {
    id: "change",
    title: "Change in Nature",
    tagline: "Ice, rust, growth, and new substances",
    pathwayId: "nature-chemistry",
    biomeId: "nature-chemistry",
  },
  {
    id: "bonds",
    title: "Bonds",
    tagline: "Why droplets cling and crystals form",
    pathwayId: "chemistry-bonds",
    biomeId: "chemistry-bonds",
  },
  {
    id: "cycles",
    title: "Cycles",
    tagline: "Water and matter moving through Earth",
    pathwayId: "chemistry-cycles",
    biomeId: "chemistry-cycles",
  },
];

export const CHEMISTRY_LANDMARK_FLOW_ORDER: ChemistryModuleLandmarkId[] = [
  "matter",
  "mixtures",
  "change",
  "bonds",
  "cycles",
];

export type LandmarkAlign = "left" | "center" | "right";

export type ChemistryLandmarkSlot = {
  id: ChemistryModuleLandmarkId;
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

export const CHEMISTRY_START_ORB_ATTACH_R = 100;
export const CHEMISTRY_LANDMARK_ATTACH_HALF_H = 90;

function tightenCx(cx: number): number {
  return 0.5 + (cx - 0.5) * HORIZONTAL_WEAVE;
}

function tightenCy(cy: number): number {
  return VERTICAL_PIVOT + (cy - VERTICAL_PIVOT) * VERTICAL_COMPRESS;
}

const RAW_START = { cx: 0.5, cy: 0.06 } as const;

const RAW_LANDMARK_SLOTS: ChemistryLandmarkSlot[] = [
  { id: "matter", align: "left", cx: 0.3, cy: 0.18, fog: 0, depth: 0 },
  { id: "mixtures", align: "right", cx: 0.72, cy: 0.32, fog: 0.03, depth: 1 },
  { id: "change", align: "center", cx: 0.48, cy: 0.46, fog: 0.06, depth: 2 },
  { id: "bonds", align: "left", cx: 0.27, cy: 0.61, fog: 0.1, depth: 3 },
  { id: "cycles", align: "right", cx: 0.75, cy: 0.74, fog: 0.14, depth: 4 },
];

export const CHEMISTRY_START_SLOT = {
  cx: tightenCx(RAW_START.cx),
  cy: tightenCy(RAW_START.cy),
} as const;

export const CHEMISTRY_LANDMARK_SLOTS: ChemistryLandmarkSlot[] = RAW_LANDMARK_SLOTS.map((slot) => ({
  ...slot,
  cx: tightenCx(slot.cx),
  cy: tightenCy(slot.cy),
}));

export function chemistryModuleMapWidth(): number {
  return MAP_W;
}

export function chemistryModuleMapHeight(): number {
  return MAP_H;
}

export function chemistryStartPixelPosition(): { cx: number; cy: number } {
  return { cx: CHEMISTRY_START_SLOT.cx * MAP_W, cy: CHEMISTRY_START_SLOT.cy * MAP_H };
}

export function chemistryStartTunnelExit(): { cx: number; cy: number } {
  const c = chemistryStartPixelPosition();
  return { cx: c.cx, cy: c.cy + CHEMISTRY_START_ORB_ATTACH_R };
}

export function chemistryLandmarkTunnelCenter(slot: ChemistryLandmarkSlot): { cx: number; cy: number } {
  const p = chemistryLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy };
}

export function chemistryLandmarkTunnelEntry(slot: ChemistryLandmarkSlot): { cx: number; cy: number } {
  const p = chemistryLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy - CHEMISTRY_LANDMARK_ATTACH_HALF_H };
}

export function chemistryLandmarkTunnelExit(slot: ChemistryLandmarkSlot): { cx: number; cy: number } {
  const p = chemistryLandmarkPixelPosition(slot);
  return { cx: p.cx, cy: p.cy + CHEMISTRY_LANDMARK_ATTACH_HALF_H };
}

export function matterToChangeTunnelEndpoints(
  matterSlot: ChemistryLandmarkSlot,
  changeSlot: ChemistryLandmarkSlot
): { from: { cx: number; cy: number }; to: { cx: number; cy: number } } {
  return {
    from: chemistryLandmarkTunnelCenter(matterSlot),
    to: chemistryLandmarkTunnelCenter(changeSlot),
  };
}

export function startToMatterTunnelD(matterSlot: ChemistryLandmarkSlot): string {
  const from = chemistryStartTunnelExit();
  const to = chemistryLandmarkTunnelEntry(matterSlot);
  const dropY = from.cy + Math.max(56, (to.cy - from.cy) * 0.32);
  const c1x = from.cx;
  const c1y = dropY;
  const c2x = to.cx + (from.cx - to.cx) * 0.28;
  const c2y = dropY + (to.cy - dropY) * 0.55;
  return `M ${from.cx} ${from.cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.cx} ${to.cy}`;
}

export function chemistryLandmarkPixelPosition(slot: ChemistryLandmarkSlot): {
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

export function chemistryLandmarkById(id: ChemistryModuleLandmarkId): ChemistryModuleLandmark {
  return CHEMISTRY_MODULE_LANDMARKS.find((l) => l.id === id)!;
}
