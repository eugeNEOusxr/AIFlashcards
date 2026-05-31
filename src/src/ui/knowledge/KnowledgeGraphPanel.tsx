import { useSyncExternalStore, useCallback, useMemo, useState } from "react";
import {
  getGraphStoreState,
  setViewLevel,
  subscribeGraphStore,
  type ViewLevel,
} from "../../core/graph/graphStore";
import {
  bridgeMergeGraphExtraction,
  recordGraphClustersRecomputed,
  recordGraphNodeFocus,
} from "../../core/learning/learningBridge";
import { getAllLearningEvents, subscribeLearningEvents } from "../../core/learning/learningEventStore";
import {
  extractGraphFromConversation,
  SAMPLE_CONVERSATION,
} from "../../core/extraction/extractGraphFromConversation";
import { clusterGraph } from "../../core/clustering/clusterGraph";
import { addPhysicsStory, getPhysicsStories, subscribePhysicsStore } from "../../core/physics/physicsStoryStore";
import type { PhysicsStoryNode } from "../../core/physics/PhysicsStoryNode";
import { AtomVisualization } from "../physics/AtomVisualization";

export function KnowledgeGraphPanel() {
  const graph = useSyncExternalStore(subscribeGraphStore, getGraphStoreState, getGraphStoreState);
  const physicsCount = useSyncExternalStore(
    subscribePhysicsStore,
    () => getPhysicsStories().length,
    () => 0
  );

  const eventCount = useSyncExternalStore(
    subscribeLearningEvents,
    () => getAllLearningEvents().length,
    () => 0
  );

  const clusters = useMemo(() => clusterGraph(graph.nodes), [graph.nodes]);
  const [lastAction, setLastAction] = useState<string>("");

  const runExtraction = useCallback(() => {
    const { nodes, edges } = extractGraphFromConversation(SAMPLE_CONVERSATION);
    bridgeMergeGraphExtraction(nodes, edges);
    setLastAction(`Extracted ${nodes.length} nodes · learning events recorded`);
  }, []);

  const recomputeClusters = useCallback(() => {
    const c = clusterGraph(graph.nodes);
    recordGraphClustersRecomputed();
    setLastAction(`${c.length} clusters · events logged per node`);
  }, [graph.nodes]);

  const cycleView = useCallback(() => {
    const order: ViewLevel[] = ["city", "district", "node"];
    const i = order.indexOf(graph.viewLevel);
    setViewLevel(order[(i + 1) % order.length]);
  }, [graph.viewLevel]);

  const linkSampleStory = useCallback(() => {
    const ids = graph.nodes.slice(0, 2).map((n) => n.id);
    const story: PhysicsStoryNode = {
      id: `ps_${Date.now()}`,
      title: "Sample field intuition",
      sceneType: "field",
      narration: "Placeholder narration linked to graph nodes.",
      linkedConceptNodes: ids,
    };
    addPhysicsStory(story);
    setLastAction(`Physics story linked to ${ids.length} node(s)`);
  }, [graph.nodes]);

  return (
    <div className="cls-kgraph">
      <p className="cls-hint">
        Cognitive layer: graph store · City = clusters · District = groups · Node = detail (no canvas
        yet).
      </p>
      <div className="cls-kgraph__row">
        <button type="button" className="cls-kgraph__btn" onClick={runExtraction}>
          Run stub extraction
        </button>
        <button type="button" className="cls-kgraph__btn" onClick={recomputeClusters}>
          Recompute clusters
        </button>
        <button type="button" className="cls-kgraph__btn" onClick={cycleView}>
          View: {graph.viewLevel}
        </button>
        <button type="button" className="cls-kgraph__btn" onClick={linkSampleStory}>
          Add sample physics story
        </button>
      </div>
      {lastAction ? <p className="cls-kgraph__status">{lastAction}</p> : null}
      <ul className="cls-kgraph__stats">
        <li>Nodes: {graph.nodes.length}</li>
        <li>Edges: {graph.edges.length}</li>
        <li>Clusters: {clusters.length}</li>
        <li>Physics stories: {physicsCount}</li>
        <li>Learning events: {eventCount}</li>
      </ul>
      {graph.nodes.length > 0 ? (
        <ul className="cls-kgraph__nodes">
          {graph.nodes.slice(0, 8).map((n) => (
            <li key={n.id}>
              <button type="button" className="cls-kgraph__node-btn" onClick={() => recordGraphNodeFocus(n)}>
                {n.title}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="cls-hint">
        Active zoom level: <strong>{graph.viewLevel}</strong>
      </p>

      <h3 className="cls-kgraph__section">Field atom (2D intuition)</h3>
      <AtomVisualization />
    </div>
  );
}
