import type { MeaningEvent } from "../meaning/meaningEngine";
import {
  addCognitiveEvent,
  connectNodes,
  ensureActiveConcept,
  loadCognitiveGraph,
  saveCognitiveGraph,
  type CognitiveGraph,
  type GraphDebugEntry,
} from "./cognitiveGraph";

export interface GraphBridgeContext {
  activeConceptId: string;
  activeConceptTitle: string;
  /** Module id for engagement edges (e.g. content.selectable). */
  moduleId?: string;
}

function pushDebug(
  log: GraphDebugEntry[],
  meaning: MeaningEvent,
  action: GraphDebugEntry["action"],
  detail: string
): void {
  log.push({
    timestamp: Date.now(),
    meaningSourceEventId: meaning.sourceEventId,
    action,
    detail,
  });
}

/**
 * Map MeaningEvent → graph updates (deterministic, explainable).
 */
export function applyMeaningToGraph(
  meaning: MeaningEvent,
  ctx: GraphBridgeContext
): { graph: CognitiveGraph; debug: GraphDebugEntry[] } {
  const graph = loadCognitiveGraph();
  const debug: GraphDebugEntry[] = [];

  const { concept, created } = ensureActiveConcept(
    graph,
    ctx.activeConceptId,
    ctx.activeConceptTitle
  );
  if (created) {
    pushDebug(debug, meaning, "concept_added", `concept:${concept.id} "${concept.title}"`);
  }

  const moduleAnchor = ctx.moduleId
    ? `module:${ctx.moduleId}`
    : `module:${String(meaning.context.source ?? "unknown")}`;

  switch (meaning.type) {
    case "confusion": {
      const evt = addCognitiveEvent(graph, {
        meaningType: "confusion",
        sourceEventId: meaning.sourceEventId,
        intensity: meaning.intensity,
        label: String(meaning.context.label ?? "confusion"),
      });
      pushDebug(debug, meaning, "event_added", `event:${evt.id} confusion`);

      const link = connectNodes(graph, evt.id, concept.id, "confuses", { initialWeight: 1 });
      pushDebug(
        debug,
        meaning,
        link.created ? "edge_created" : "edge_weight_changed",
        `${evt.id} --confuses--> ${concept.id} (w=${link.edge.weight})`
      );
      break;
    }

    case "clarity": {
      const evt = addCognitiveEvent(graph, {
        meaningType: "clarity",
        sourceEventId: meaning.sourceEventId,
        intensity: meaning.intensity,
        label: String(meaning.context.label ?? "clarity"),
      });
      pushDebug(debug, meaning, "event_added", `event:${evt.id} clarity`);

      const link = connectNodes(graph, evt.id, concept.id, "clarifies", { initialWeight: 1 });
      pushDebug(
        debug,
        meaning,
        link.created ? "edge_created" : "edge_weight_changed",
        `${evt.id} --clarifies--> ${concept.id} (w=${link.edge.weight})`
      );
      break;
    }

    case "reflection": {
      const evt = addCognitiveEvent(graph, {
        meaningType: "reflection",
        sourceEventId: meaning.sourceEventId,
        intensity: meaning.intensity,
        label: String(meaning.context.label ?? "reflection"),
      });
      pushDebug(debug, meaning, "event_added", `event:${evt.id} reflection`);

      const attached = connectNodes(graph, evt.id, concept.id, "attached_to", {
        initialWeight: 1,
      });
      pushDebug(
        debug,
        meaning,
        attached.created ? "edge_created" : "edge_weight_changed",
        `${evt.id} --attached_to--> ${concept.id} (w=${attached.edge.weight})`
      );

      const reflects = connectNodes(graph, evt.id, concept.id, "reflects", {
        initialWeight: 0.8,
      });
      pushDebug(
        debug,
        meaning,
        reflects.created ? "edge_created" : "edge_weight_changed",
        `${evt.id} --reflects--> ${concept.id} (w=${reflects.edge.weight})`
      );
      break;
    }

    case "engagement": {
      // Repeated selection / module focus → strengthen engages edge.
      const link = connectNodes(graph, concept.id, moduleAnchor, "engages", {
        initialWeight: 1,
        increment: 0.2,
      });
      pushDebug(
        debug,
        meaning,
        link.created ? "edge_created" : "edge_weight_changed",
        `${concept.id} --engages--> ${moduleAnchor} (w=${link.edge.weight}${
          link.weightChanged ? `, was ${link.previousWeight}` : ""
        })`
      );
      break;
    }

    case "exploration": {
      const evt = addCognitiveEvent(graph, {
        meaningType: "exploration",
        sourceEventId: meaning.sourceEventId,
        intensity: meaning.intensity,
        label: String(meaning.context.mode ?? meaning.context.source ?? "exploration"),
      });
      pushDebug(debug, meaning, "event_added", `event:${evt.id} exploration`);

      const link = connectNodes(graph, evt.id, concept.id, "explores", { initialWeight: 0.6 });
      pushDebug(
        debug,
        meaning,
        link.created ? "edge_created" : "edge_weight_changed",
        `${evt.id} --explores--> ${concept.id} (w=${link.edge.weight})`
      );

      const modeLink = connectNodes(graph, concept.id, moduleAnchor, "explores", {
        initialWeight: 0.5,
        increment: 0.1,
      });
      pushDebug(
        debug,
        meaning,
        modeLink.created ? "edge_created" : "edge_weight_changed",
        `${concept.id} --explores--> ${moduleAnchor} (w=${modeLink.edge.weight})`
      );
      break;
    }

    default:
      break;
  }

  saveCognitiveGraph(graph);
  return { graph, debug };
}
