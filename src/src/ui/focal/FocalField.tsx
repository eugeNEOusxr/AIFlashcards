import { useMemo } from "react";
import type { HistoryEntry, NavNode } from "../../types/navigation";
import { getRelatedNodes } from "../../lib/focusGraph";
import { ContextOrbit } from "./ContextOrbit";
import { DepthPanel } from "./DepthPanel";
import { FocalNode } from "./FocalNode";
import { GraphBackground } from "./GraphBackground";
import { HistoryGhost } from "./HistoryGhost";

type Props = {
  nodes: NavNode[];
  focusId: string;
  history: HistoryEntry[];
  onFocus: (id: string) => void;
  onSpawn: () => void;
};

export function FocalField({ nodes, focusId, history, onFocus, onSpawn }: Props) {
  const focus = nodes.find((n) => n.id === focusId);
  const related = useMemo(() => getRelatedNodes(focusId, nodes), [focusId, nodes]);

  if (!focus) {
    return (
      <div className="focal-field focal-field--empty">
        <p>No focus node. Add a thought to begin.</p>
        <button type="button" className="focal-spawn" onClick={onSpawn}>
          + Spawn thought
        </button>
      </div>
    );
  }

  return (
    <div className="focal-field">
      <GraphBackground nodes={nodes} focusId={focusId} onFocus={onFocus} />

      <div className="focal-field__layer">
        <ContextOrbit related={related} onFocus={onFocus} />
        <FocalNode node={focus} />
        <DepthPanel node={focus} />
      </div>

      <HistoryGhost history={history} onJump={onFocus} />

      <button type="button" className="focal-spawn focal-spawn--corner" onClick={onSpawn} title="Add thought">
        +
      </button>
    </div>
  );
}
