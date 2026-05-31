import { getPathwayBiome } from "./pathwayBiomes";
import type { CurriculumSpineNode } from "./physicsCurriculumSpine";
import type { SerpentineSlot } from "./serpentineLayout";

export type EmotionZone = {
  topPct: number;
  heightPct: number;
  accent: string;
  accentSecondary: string;
  label: string;
  className: string;
};

export function buildEmotionZones(
  spine: CurriculumSpineNode[],
  slots: SerpentineSlot[],
  mapHeight: number
): EmotionZone[] {
  if (spine.length === 0 || mapHeight <= 0) return [];

  const zones: EmotionZone[] = [];
  let i = 0;

  while (i < spine.length) {
    const node = spine[i]!;
    const chapterId = "chapterId" in node ? node.chapterId : undefined;
    const pathwayId = node.pathwayId;
    let j = i;
    while (j < spine.length) {
      const next = spine[j]!;
      if (chapterId !== undefined && "chapterId" in next && next.chapterId !== chapterId) break;
      if (next.pathwayId !== pathwayId) break;
      j++;
    }

    const slotStart = slots[i];
    const slotEnd = slots[j - 1];
    if (!slotStart || !slotEnd) {
      i = j;
      continue;
    }

    const y0 = Math.max(0, slotStart.y - 40);
    const y1 = Math.min(mapHeight, slotEnd.y + 220);
    const biome = getPathwayBiome(pathwayId);

    zones.push({
      topPct: (y0 / mapHeight) * 100,
      heightPct: Math.max(8, ((y1 - y0) / mapHeight) * 100),
      accent: biome.accent,
      accentSecondary: biome.accentSecondary,
      label: biome.label,
      className: biome.className,
    });

    i = j;
  }

  return zones;
}
