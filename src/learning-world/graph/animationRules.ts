import type { NodeState, NodeVisualParams } from "../types";

export const animationRules: Record<
  NodeState,
  Pick<NodeVisualParams, "opacity" | "glow" | "motion" | "jitter" | "pulseSpeed" | "colorToken">
> = {
  locked: {
    opacity: 0.2,
    glow: 0.1,
    motion: "static",
    jitter: 0,
    pulseSpeed: 0,
    colorToken: "dim",
  },
  learning: {
    opacity: 0.7,
    glow: 0.6,
    motion: "pulse",
    jitter: 0,
    pulseSpeed: 1.2,
    colorToken: "yellow",
  },
  mastered: {
    opacity: 1,
    glow: 1,
    motion: "orbit",
    jitter: 0,
    pulseSpeed: 0.35,
    colorToken: "white",
  },
  confused: {
    opacity: 0.6,
    glow: 0.3,
    motion: "shake",
    jitter: 1,
    pulseSpeed: 2.4,
    colorToken: "red",
  },
};

export function visualFromState(
  state: NodeState,
  basePosition: [number, number, number],
  intensity: number
): NodeVisualParams {
  const rule = animationRules[state];
  const [bx, by] = basePosition;
  const yShift = state === "mastered" ? -3 : state === "learning" ? -1.5 : state === "locked" ? 2 : 0;

  return {
    ...rule,
    glow: Math.min(1, rule.glow + intensity * 0.15),
    pulseSpeed: rule.pulseSpeed + intensity * 0.3,
    position: [bx + (state === "mastered" ? -1.5 : 0), by + yShift],
  };
}
