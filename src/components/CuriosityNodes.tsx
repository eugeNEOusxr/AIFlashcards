import { useState } from "react";
import type { CuriosityNode } from "../content/curriculum/graphTypes";

type Props = {
  nodes: CuriosityNode[];
  /** Apply overlay class to chamber via callback — does not unmount scene */
  onActivate?: (overlayEffect?: string) => void;
};

const TRIGGER_LABEL: Record<CuriosityNode["trigger"], string> = {
  why: "Why?",
  what_if: "What if?",
  how_change: "How does this change?",
};

/**
 * Curiosity expansions — UI layer only.
 * Scene anchor stays mounted; optional overlay effect on activate.
 */
export function CuriosityNodes({ nodes, onActivate }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (nodes.length === 0) return null;

  return (
    <div className="curiosity-nodes" role="group" aria-label="Curiosity expansions">
      <span className="curiosity-nodes__kicker">Curiosity</span>
      <div className="curiosity-nodes__chips">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            className={`curiosity-nodes__chip${openId === node.id ? " curiosity-nodes__chip--active" : ""}`}
            onClick={() => {
              const next = openId === node.id ? null : node.id;
              setOpenId(next);
              onActivate?.(next ? node.overlayEffect : undefined);
            }}
          >
            {TRIGGER_LABEL[node.trigger]}
          </button>
        ))}
      </div>
      {openId ? (
        <div className="curiosity-nodes__expansion neural-glass">
          <p className="curiosity-nodes__prompt">
            {nodes.find((n) => n.id === openId)?.prompt}
          </p>
          <p className="curiosity-nodes__text">{nodes.find((n) => n.id === openId)?.expansion}</p>
        </div>
      ) : null}
    </div>
  );
}
