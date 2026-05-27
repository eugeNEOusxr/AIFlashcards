import { MEMORY_UPDATED_EVENT } from "../memory/memoryEvents";
import { MemoryEngine } from "./memory/MemoryEngine";
import { graphEngine } from "./graph/GraphEngine";
import { computeGraphDiff, diffHasChanges } from "./graph/computeGraphDiff";
import { applyLessonAnchorOverlay } from "./render/AnchorRegistry";
import { RenderEngine } from "./render/RenderEngine";
import type { CurriculumScene, GraphState, GraphStateDiff } from "./types";

type MapHost = {
  render: RenderEngine;
  lastGraph: GraphState | null;
};

type DiffListener = (diff: GraphStateDiff, graph: GraphState) => void;

/**
 * Orchestrates Memory → Graph → Render diff pipeline.
 */
export class LearningWorld {
  private graphId = "motion-forces";
  private lastGraph: GraphState | null = null;
  private mapHosts = new Map<string, MapHost>();
  private listeners = new Set<DiffListener>();
  private boundOnMemory = () => this.onMemoryUpdated();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener(MEMORY_UPDATED_EVENT, this.boundOnMemory);
    }
  }

  getLastGraph(): GraphState | null {
    return this.lastGraph;
  }

  subscribe(listener: DiffListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  mountMapHost(hostId: string, container: HTMLElement, graphId = "motion-forces", compact = false): CurriculumScene | null {
    if (this.mapHosts.has(hostId)) return this.mapHosts.get(hostId)!.render.getScene();

    this.graphId = graphId;
    const truth = MemoryEngine.readTruth();
    const graph = graphEngine.derive(truth, graphId);
    if (!graph) return null;

    this.lastGraph = graph;
    const scene = graphEngine.buildScene(graph);
    const render = new RenderEngine();
    render.mount(container, scene, { compact, showAnchor: true });
    this.mapHosts.set(hostId, { render, lastGraph: graph });
    return scene;
  }

  unmountMapHost(hostId: string): void {
    const host = this.mapHosts.get(hostId);
    if (!host) return;
    host.render.unmount();
    this.mapHosts.delete(hostId);
  }

  tick(graphId = this.graphId): GraphStateDiff | null {
    this.graphId = graphId;
    const truth = MemoryEngine.readTruth();
    const graph = graphEngine.derive(truth, graphId);
    if (!graph) return null;

    const diff = computeGraphDiff(this.lastGraph, graph);
    this.lastGraph = graph;

    if (!diffHasChanges(diff)) return diff;

    for (const host of this.mapHosts.values()) {
      const hostDiff = computeGraphDiff(host.lastGraph, graph);
      host.lastGraph = graph;
      host.render.applyDiff(hostDiff);
    }

    if (diff.anchorOverlay) {
      applyLessonAnchorOverlay(diff.anchorOverlay);
    }

    for (const l of this.listeners) l(diff, graph);
    return diff;
  }

  private onMemoryUpdated(): void {
    this.tick(this.graphId);
  }

  destroy(): void {
    window.removeEventListener(MEMORY_UPDATED_EVENT, this.boundOnMemory);
    for (const id of [...this.mapHosts.keys()]) this.unmountMapHost(id);
    this.listeners.clear();
  }
}

export const learningWorld = new LearningWorld();
