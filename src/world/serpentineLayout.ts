/** Vertical world-map coordinates — serpentine down the page. */

export type MapLayoutPreset = "pathway" | "subject";

type LayoutConfig = {
  mapWidth: number;
  nodeCardWidth: number;
  moduleTravelY: number;
  startNodeY: number;
  firstModuleGap: number;
  depthScaleStep: number;
  bottomPad: number;
  /** Scales tunnel halo/body stroke widths for readability at zoom level */
  tunnelStrokeScale: number;
  nodeBaseScale: number;
  maxFog: number;
  nodeCyOffset: number;
};

const LAYOUTS: Record<MapLayoutPreset, LayoutConfig> = {
  /** Inside a pathway — galaxy view: most modules visible while scrolling */
  pathway: {
    mapWidth: 760,
    nodeCardWidth: 220,
    moduleTravelY: 252,
    startNodeY: 48,
    firstModuleGap: 112,
    depthScaleStep: 0.01,
    bottomPad: 280,
    tunnelStrokeScale: 0.62,
    nodeBaseScale: 0.9,
    maxFog: 0.26,
    nodeCyOffset: 64,
  },
  /** Physics subject map — full curriculum spine in one scrollable vista */
  subject: {
    mapWidth: 540,
    nodeCardWidth: 176,
    moduleTravelY: 136,
    startNodeY: 28,
    firstModuleGap: 76,
    depthScaleStep: 0.008,
    bottomPad: 180,
    tunnelStrokeScale: 0.52,
    nodeBaseScale: 0.88,
    maxFog: 0.2,
    nodeCyOffset: 52,
  },
};

export function layoutConfig(preset: MapLayoutPreset = "pathway"): LayoutConfig {
  return LAYOUTS[preset];
}

export function worldMapWidth(preset: MapLayoutPreset = "pathway"): number {
  return LAYOUTS[preset].mapWidth;
}

export type SerpentineSlot = {
  index: number;
  y: number;
  cx: number;
  cy: number;
  scale: number;
  zIndex: number;
  side: "left" | "right";
  fog: number;
};

function moduleCenterX(side: "left" | "right", mapWidth: number): number {
  return side === "left" ? mapWidth * 0.2 : mapWidth * 0.8;
}

function moduleSlotY(index: number, cfg: LayoutConfig): number {
  return cfg.startNodeY + cfg.firstModuleGap + index * cfg.moduleTravelY;
}

export function worldMapHeight(moduleCount: number, preset: MapLayoutPreset = "pathway"): number {
  const cfg = LAYOUTS[preset];
  if (moduleCount <= 0) return preset === "subject" ? 720 : 1100;
  return moduleSlotY(moduleCount - 1, cfg) + cfg.bottomPad;
}

export function serpentineSlots(count: number, preset: MapLayoutPreset = "pathway"): SerpentineSlot[] {
  const cfg = LAYOUTS[preset];
  const fogStep = count > 1 ? cfg.maxFog / (count - 1) : 0;

  return Array.from({ length: count }, (_, index) => {
    const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
    const y = moduleSlotY(index, cfg);
    const cx = moduleCenterX(side, cfg.mapWidth);
    const cy = y + cfg.nodeCyOffset;
    const depthFromStart = index;

    return {
      index,
      y,
      cx,
      cy,
      scale: Math.max(cfg.nodeBaseScale, 1.04 - depthFromStart * cfg.depthScaleStep),
      zIndex: 20 + index,
      side,
      fog: Math.min(cfg.maxFog, depthFromStart * fogStep),
    };
  });
}

export function startNodeCenter(preset: MapLayoutPreset = "pathway"): { x: number; y: number } {
  const cfg = LAYOUTS[preset];
  return { x: cfg.mapWidth / 2, y: cfg.startNodeY + (preset === "subject" ? 22 : 32) };
}

export function serpentinePoints(count: number, preset: MapLayoutPreset = "pathway"): { x: number; y: number }[] {
  const start = startNodeCenter(preset);
  const modules = serpentineSlots(count, preset).map((s) => ({ x: s.cx, y: s.cy }));
  return [start, ...modules];
}

/** Curved energy tunnel between anchors */
export function tunnelPathD(
  from: { x: number; y: number },
  to: { x: number; y: number },
  preset: MapLayoutPreset = "pathway"
): string {
  const dy = to.y - from.y;
  const dx = to.x - from.x;
  const bulge = Math.max(Math.abs(dx) * 0.55, preset === "subject" ? 56 : 88);
  const c1x = from.x + dx * 0.25 + (dx > 0 ? bulge : -bulge) * 0.32;
  const c2x = to.x - dx * 0.25 + (dx > 0 ? -bulge : bulge) * 0.32;
  const c1y = from.y + dy * 0.3;
  const c2y = from.y + dy * 0.7;
  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

/** @deprecated use worldMapWidth(preset) */
export const WORLD_MAP_WIDTH = LAYOUTS.pathway.mapWidth;
