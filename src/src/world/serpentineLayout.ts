/** Vertical world-map coordinates — serpentine down the page. */

export type MapLayoutPreset = "pathway" | "subject" | "curriculum";

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
  /** Extra vertical space below last node anchor (card + label) */
  nodeExtent: number;
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
    nodeExtent: 180,
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
    nodeExtent: 180,
  },
  /** Five-chapter physics map — wide canvas, parallel columns per chapter */
  curriculum: {
    mapWidth: 960,
    nodeCardWidth: 200,
    moduleTravelY: 128,
    startNodeY: 24,
    firstModuleGap: 72,
    depthScaleStep: 0.006,
    bottomPad: 320,
    tunnelStrokeScale: 0.5,
    nodeBaseScale: 0.9,
    maxFog: 0.22,
    nodeCyOffset: 52,
    nodeExtent: 200,
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
  if (moduleCount <= 0) {
    if (preset === "curriculum") return 1400;
    return preset === "subject" ? 720 : 1100;
  }
  const lastY = moduleSlotY(moduleCount - 1, cfg);
  return lastY + cfg.nodeCyOffset + cfg.nodeExtent + cfg.bottomPad;
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

export type SpineSlotInput = {
  chapterId: number;
  indexInChapter: number;
  mapLane: number;
  mapRow: number;
};

const CURRICULUM_ROW_GAP = 96;

/** Lesson counts per chapter row — used to stack row 1 below the tallest row-0 column. */
export function rowLessonCounts(
  nodes: SpineSlotInput[]
): { row0Max: number; row1Max: number } {
  const perChapter = new Map<number, { row: number; count: number }>();
  for (const n of nodes) {
    const cur = perChapter.get(n.chapterId) ?? { row: n.mapRow, count: 0 };
    perChapter.set(n.chapterId, { row: n.mapRow, count: cur.count + 1 });
  }
  let row0Max = 0;
  let row1Max = 0;
  for (const { row, count } of perChapter.values()) {
    if (row === 0) row0Max = Math.max(row0Max, count);
    else row1Max = Math.max(row1Max, count);
  }
  return { row0Max, row1Max };
}

export function spineCurriculumSlots(
  nodes: SpineSlotInput[],
  preset: MapLayoutPreset = "curriculum"
): SerpentineSlot[] {
  const cfg = LAYOUTS[preset];
  const { row0Max } = rowLessonCounts(nodes);
  const row0Base = cfg.startNodeY + cfg.firstModuleGap;
  const row1Base =
    row0Base + row0Max * cfg.moduleTravelY + CURRICULUM_ROW_GAP + (row0Max > 0 ? 0 : cfg.firstModuleGap);
  const totalLessons = nodes.length;
  const fogStep = totalLessons > 1 ? cfg.maxFog / (totalLessons - 1) : 0;

  return nodes.map((node, index) => {
    const rowBase = node.mapRow === 0 ? row0Base : row1Base;
    const y = rowBase + node.indexInChapter * cfg.moduleTravelY;
    const wiggle = node.indexInChapter % 2 === 0 ? -32 : 32;
    const cx = cfg.mapWidth * node.mapLane + wiggle;
    const cy = y + cfg.nodeCyOffset;
    const side: "left" | "right" = node.mapLane < 0.5 ? "left" : "right";

    return {
      index,
      y,
      cx,
      cy,
      scale: Math.max(cfg.nodeBaseScale, 1.04 - node.indexInChapter * cfg.depthScaleStep),
      zIndex: 20 + index,
      side,
      fog: Math.min(cfg.maxFog, index * fogStep),
    };
  });
}

export function multiLaneCurriculumHeight(
  nodes: SpineSlotInput[],
  preset: MapLayoutPreset = "curriculum"
): number {
  const cfg = LAYOUTS[preset];
  if (nodes.length === 0) return 1400;
  const slots = spineCurriculumSlots(nodes, preset);
  const last = slots[slots.length - 1];
  if (!last) return 1400;
  const { row1Max } = rowLessonCounts(nodes);
  const row1Base =
    cfg.startNodeY +
    cfg.firstModuleGap +
    rowLessonCounts(nodes).row0Max * cfg.moduleTravelY +
    CURRICULUM_ROW_GAP;
  const row1End = row1Base + row1Max * cfg.moduleTravelY;
  const bottom = Math.max(last.y + cfg.nodeCyOffset, row1End);
  return bottom + cfg.nodeExtent + cfg.bottomPad;
}

/** Curved energy tunnel between anchors */
export function tunnelPathD(
  from: { x: number; y: number },
  to: { x: number; y: number },
  preset: MapLayoutPreset = "pathway"
): string {
  const dy = to.y - from.y;
  const dx = to.x - from.x;
  const bulge = Math.max(
    Math.abs(dx) * 0.55,
    preset === "subject" || preset === "curriculum" ? 56 : 88
  );
  const c1x = from.x + dx * 0.25 + (dx > 0 ? bulge : -bulge) * 0.32;
  const c2x = to.x - dx * 0.25 + (dx > 0 ? -bulge : bulge) * 0.32;
  const c1y = from.y + dy * 0.3;
  const c2y = from.y + dy * 0.7;
  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

/** @deprecated use worldMapWidth(preset) */
export const WORLD_MAP_WIDTH = LAYOUTS.pathway.mapWidth;
