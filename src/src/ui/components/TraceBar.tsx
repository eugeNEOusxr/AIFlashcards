import { clearCurrentTrace, getCurrentTrace, selectNode } from "../../core/graphEngine";
import { useGraphEngine } from "../useGraphEngine";

export function TraceBar() {
  const snap = useGraphEngine();
  const trace = getCurrentTrace();
  const path = trace?.path ?? [];

  return (
    <footer className="cg-trace">
      <div className="cg-trace__header">
        <span className="cg-trace__label">Thought trace</span>
        {path.length > 0 ? (
          <button type="button" className="cg-btn cg-btn--ghost cg-btn--sm" onClick={() => clearCurrentTrace()}>
            Clear
          </button>
        ) : null}
      </div>
      <div className="cg-trace__strip" role="list">
        {path.length === 0 ? (
          <span className="cg-hint">Click nodes to build your navigation trail.</span>
        ) : (
          path.map((nodeId, i) => {
            const node = snap.nodes.find((n) => n.id === nodeId);
            const title = node?.title ?? nodeId.slice(0, 8);
            return (
              <span key={`${nodeId}-${i}`} className="cg-trace__item-wrap" role="listitem">
                {i > 0 ? <span className="cg-trace__sep" aria-hidden>›</span> : null}
                <button type="button" className="cg-trace__chip" onClick={() => selectNode(nodeId)}>
                  {title}
                </button>
              </span>
            );
          })
        )}
      </div>
    </footer>
  );
}
