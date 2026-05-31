import { useSyncExternalStore } from "react";
import { getCognitiveNodes, subscribeCognitiveStore } from "../../core/cognition/cognitiveStore";
import type { CognitiveState } from "../../core/cognition/learningTypes";

const STATE_CLASS: Record<CognitiveState, string> = {
  understood: "cls-cog-status__state--understood",
  partial: "cls-cog-status__state--partial",
  unknown: "cls-cog-status__state--unknown",
};

const EMPTY_NODES: never[] = [];

export function CognitiveStatusPanel() {
  const cognitiveNodes = useSyncExternalStore(
    subscribeCognitiveStore,
    getCognitiveNodes,
    () => EMPTY_NODES
  );

  if (cognitiveNodes.length === 0) {
    return <p className="cls-hint">No concepts yet — store a thought above.</p>;
  }

  return (
    <ul className="cls-cog-status">
      {cognitiveNodes.map((node) => (
        <li key={node.concept} className="cls-cog-status__item">
          <div className="cls-cog-status__head">
            <strong>{node.concept}</strong>
            <span className={`cls-cog-status__state ${STATE_CLASS[node.state]}`}>{node.state}</span>
          </div>
          <div className="cls-cog-status__bar" aria-hidden>
            <div
              className="cls-cog-status__bar-fill"
              style={{ width: `${Math.round(node.confidence * 100)}%` }}
            />
          </div>
          <span className="cls-hint">
            {Math.round(node.confidence * 100)}% confidence · {node.events.length} event
            {node.events.length === 1 ? "" : "s"}
          </span>
        </li>
      ))}
    </ul>
  );
}
