import type { AnchorOverlay, GraphAmbience, NodeStatePatch } from "../types";

const TRANSITION_MS = 550;

export function applyNodePatch(el: HTMLElement, patch: NodeStatePatch): void {
  const v = patch.visual;
  el.dataset.state = patch.visualState;
  el.style.setProperty("--cmap-glow", String(v.glow));
  el.style.setProperty("--cmap-pulse", `${v.pulseSpeed}s`);
  el.style.setProperty("--cmap-opacity", String(v.opacity));
  el.style.left = `${v.position[0]}%`;
  el.style.top = `${v.position[1]}%`;
  el.className = [
    "cmap-node",
    `cmap-node--${patch.visualState}`,
    `cmap-node--${v.colorToken}`,
    el.classList.contains("cmap-node--compact") ? "cmap-node--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");
  el.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease, left ${TRANSITION_MS}ms ease, top ${TRANSITION_MS}ms ease`;
  el.style.opacity = String(v.opacity);
  el.style.transform = `translate(-50%, -50%) scale(${patch.visualState === "mastered" ? 1.06 : patch.visualState === "locked" ? 0.92 : 1})`;

  const orbit = el.querySelector(".cmap-node__orbit");
  if (orbit) {
    (orbit as HTMLElement).style.display = v.motion === "orbit" ? "block" : "none";
  }
  const noise = el.querySelector(".cmap-node__noise");
  if (noise) {
    (noise as HTMLElement).style.display = v.motion === "shake" ? "block" : "none";
  }
}

export function applyEdgePatch(line: SVGLineElement, energy: number, weight: number): void {
  line.style.transition = `opacity ${TRANSITION_MS}ms ease, stroke-width ${TRANSITION_MS}ms ease`;
  line.setAttribute("opacity", String(0.12 + energy * 0.75));
  line.setAttribute("stroke-width", String(0.3 + energy * 0.7 + weight * 0.2));
}

export function applyAmbience(root: HTMLElement, ambience: GraphAmbience): void {
  root.style.setProperty("--cmap-calm", String(ambience.calmFactor));
  root.style.setProperty("--cmap-noise", String(ambience.noiseFactor));
  root.style.setProperty("--cmap-particle-speed", `${ambience.particleSpeed}s`);
  root.classList.toggle("cmap--noisy", ambience.noiseFactor > 0.45);
  root.classList.toggle("cmap--calm", ambience.noiseFactor <= 0.45);
}

export function applyAnchorOverlay(el: HTMLElement, overlay: AnchorOverlay): void {
  el.style.setProperty("--anchor-glow", String(overlay.glow));
  el.style.setProperty("--anchor-pulse", `${overlay.pulseSpeed}s`);
  el.dataset.anchorShader = overlay.shaderClass;
  for (const cls of Array.from(el.classList)) {
    if (cls.startsWith("anchor--")) el.classList.remove(cls);
  }
  el.classList.add(overlay.shaderClass);
}
