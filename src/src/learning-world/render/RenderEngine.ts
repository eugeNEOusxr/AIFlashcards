import type { CurriculumScene, GraphStateDiff, NodeState } from "../types";
import { applyAmbience, applyAnchorOverlay, applyEdgePatch, applyNodePatch } from "./applyVisualPatch";

type MountOptions = {
  compact?: boolean;
  showAnchor?: boolean;
};

/**
 * Layer 3 — persistent scene. Mutates DOM via diffs only.
 * Does NOT listen to memory or UI — only GraphStateDiff.
 */
export class RenderEngine {
  private root: HTMLElement | null = null;
  private stage: HTMLElement | null = null;
  private nodeEls = new Map<string, HTMLElement>();
  private edgeEls = new Map<string, SVGLineElement>();
  private scene: CurriculumScene | null = null;
  private compact = false;

  getScene(): CurriculumScene | null {
    return this.scene;
  }

  mount(container: HTMLElement, scene: CurriculumScene, options: MountOptions = {}): void {
    if (this.root) return;

    this.compact = options.compact ?? false;
    this.scene = scene;
    this.root = container;

    const wrap = document.createElement("div");
    wrap.className = ["cmap__stage", this.compact ? "cmap__stage--compact" : ""].filter(Boolean).join(" ");
    this.stage = wrap;

    const particles = document.createElement("div");
    particles.className = "cmap__particles";
    particles.setAttribute("aria-hidden", "true");
    const count = this.compact ? 6 : 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "cmap__particle";
      p.style.setProperty("--i", String(i));
      particles.appendChild(p);
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cmap-edges");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "cmap-edge-grad");
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "0%");
    ["0%", "50%", "100%"].forEach((offset, i) => {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", offset);
      stop.setAttribute(
        "stop-color",
        i === 1 ? "rgba(139, 92, 246, 0.55)" : "rgba(34, 211, 238, 0.2)"
      );
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    const nodeById = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));

    for (const edge of scene.edges) {
      const from = nodeById[edge.from];
      const to = nodeById[edge.to];
      if (!from || !to) continue;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "cmap-edges__line");
      line.setAttribute("stroke", "url(#cmap-edge-grad)");
      line.setAttribute("x1", String(from.visual.position[0]));
      line.setAttribute("y1", String(from.visual.position[1]));
      line.setAttribute("x2", String(to.visual.position[0]));
      line.setAttribute("y2", String(to.visual.position[1]));
      applyEdgePatch(line, edge.energy, edge.weight);
      svg.appendChild(line);
      this.edgeEls.set(edge.id, line);
    }

    const nodesWrap = document.createElement("div");
    nodesWrap.className = "cmap__nodes";
    nodesWrap.setAttribute("role", "list");

    for (const node of scene.nodes) {
      const el = this.createNodeElement(node.id, node.label, node.visualState, node.visual);
      nodesWrap.appendChild(el);
      this.nodeEls.set(node.id, el);
    }

    if (options.showAnchor !== false) {
      const anchorWrap = document.createElement("div");
      anchorWrap.className = "cmap__world-anchor";
      anchorWrap.dataset.anchor = "bowling_ball";
      const ball = document.createElement("div");
      ball.className = "cmap__world-anchor-ball";
      ball.setAttribute("aria-hidden", "true");
      anchorWrap.appendChild(ball);
      wrap.appendChild(anchorWrap);
      scene.anchorObjects.bowlingBall.element = anchorWrap;
      applyAnchorOverlay(anchorWrap, scene.anchorObjects.bowlingBall.overlay);
    }

    wrap.appendChild(particles);
    wrap.appendChild(svg);
    wrap.appendChild(nodesWrap);
    container.appendChild(wrap);

    applyAmbience(container, scene.ambience);
  }

  private createNodeElement(
    id: string,
    label: string,
    state: string,
    visual: CurriculumScene["nodes"][0]["visual"]
  ): HTMLElement {
    const el = document.createElement("div");
    el.className = `cmap-node cmap-node--${state} cmap-node--${visual.colorToken}${this.compact ? " cmap-node--compact" : ""}`;
    el.dataset.nodeId = id;
    el.setAttribute("role", "listitem");

    const orbit = document.createElement("span");
    orbit.className = "cmap-node__orbit";
    orbit.setAttribute("aria-hidden", "true");
    orbit.style.display = visual.motion === "orbit" ? "block" : "none";

    const halo = document.createElement("span");
    halo.className = "cmap-node__halo";
    halo.setAttribute("aria-hidden", "true");

    const core = document.createElement("span");
    core.className = "cmap-node__core";
    const labelEl = document.createElement("span");
    labelEl.className = "cmap-node__label";
    labelEl.textContent = label;
    core.appendChild(labelEl);
    if (!this.compact) {
      const stateEl = document.createElement("span");
      stateEl.className = "cmap-node__state";
      stateEl.textContent = state;
      core.appendChild(stateEl);
    }

    const noise = document.createElement("span");
    noise.className = "cmap-node__noise";
    noise.setAttribute("aria-hidden", "true");
    noise.style.display = visual.motion === "shake" ? "block" : "none";

    el.appendChild(orbit);
    el.appendChild(halo);
    el.appendChild(core);
    el.appendChild(noise);

    applyNodePatch(el, {
      id,
      visualState: state as NodeState,
      visual,
      intensity: 0,
    });
    return el;
  }

  applyDiff(diff: GraphStateDiff): void {
    if (!this.root || !this.scene) return;

    for (const patch of diff.nodePatches) {
      const el = this.nodeEls.get(patch.id);
      if (el) {
        applyNodePatch(el, patch);
        const stateLabel = el.querySelector(".cmap-node__state");
        if (stateLabel) stateLabel.textContent = patch.visualState;
      }
    }

    for (const patch of diff.edgePatches) {
      const line = this.edgeEls.get(patch.id);
      const edge = this.scene.edges.find((e) => e.id === patch.id);
      if (line && edge) applyEdgePatch(line, patch.energy, edge.weight);
    }

    if (diff.ambience) {
      applyAmbience(this.root, diff.ambience);
      this.scene.ambience = diff.ambience;
    }

    if (diff.anchorOverlay) {
      const anchor = this.scene.anchorObjects.bowlingBall;
      anchor.overlay = { ...anchor.overlay, ...diff.anchorOverlay };
      if (anchor.element) applyAnchorOverlay(anchor.element, anchor.overlay);
    }
  }

  unmount(): void {
    if (this.stage?.parentElement) {
      this.stage.parentElement.innerHTML = "";
    }
    this.root = null;
    this.stage = null;
    this.nodeEls.clear();
    this.edgeEls.clear();
    this.scene = null;
  }
}
