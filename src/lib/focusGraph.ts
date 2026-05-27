import type { NavNode } from "../types/navigation";

/** Nodes linked to focus (1 hop). */
export function getRelatedNodes(focusId: string, nodes: NavNode[]): NavNode[] {
  const focus = nodes.find((n) => n.id === focusId);
  if (!focus) return [];

  const ids = new Set<string>();
  for (const lid of focus.links) ids.add(lid);
  for (const n of nodes) {
    if (n.links.includes(focusId)) ids.add(n.id);
  }
  ids.delete(focusId);

  return nodes.filter((n) => ids.has(n.id));
}

export function getNeighborhoodIds(focusId: string, nodes: NavNode[]): Set<string> {
  const related = getRelatedNodes(focusId, nodes);
  return new Set([focusId, ...related.map((n) => n.id)]);
}

/** Orbit positions on the left semicircle (constellation). */
export function orbitPositions(
  count: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number }[] {
  if (count === 0) return [];
  const start = Math.PI * 0.55;
  const end = Math.PI * 1.45;
  const step = count === 1 ? 0 : (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const a = start + step * i;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  });
}

/** Background graph layout — focus pulled to center, others spread with bias toward focus. */
export function backgroundLayout(
  nodes: NavNode[],
  focusId: string,
  w: number,
  h: number
): Map<string, { x: number; y: number; opacity: number; scale: number }> {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const neighborhood = getNeighborhoodIds(focusId, nodes);
  const map = new Map<string, { x: number; y: number; opacity: number; scale: number }>();

  const others = nodes.filter((n) => n.id !== focusId);
  const spread = Math.min(w, h) * 0.38;

  others.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / Math.max(others.length, 1) - Math.PI / 2;
    const inHood = neighborhood.has(node.id);
    const pull = inHood ? 0.55 : 1;
    const r = spread * pull;
    const fx = (cx - (cx + r * Math.cos(angle))) * (inHood ? 0.35 : 0);
    const fy = (cy - (cy + r * Math.sin(angle))) * (inHood ? 0.35 : 0);
    map.set(node.id, {
      x: cx + r * Math.cos(angle) + fx,
      y: cy + r * Math.sin(angle) + fy,
      opacity: inHood ? 0.55 : 0.12,
      scale: inHood ? 1 : 0.7,
    });
  });

  map.set(focusId, { x: cx, y: cy, opacity: 1, scale: 1.2 });
  return map;
}
