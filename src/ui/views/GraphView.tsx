import type { NavNode } from "../../types/navigation";

type Props = {
  nodes: NavNode[];
  selectedId: string | null;
  onPickNode: (id: string) => void;
  onBack: () => void;
};

/** Simple ring layout for clickable dots */
function dotPosition(index: number, total: number, cx: number, cy: number, r: number) {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function GraphView({ nodes, selectedId, onPickNode, onBack }: Props) {
  const w = 320;
  const h = 280;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.32;

  return (
    <div className="nav-view">
      <header className="nav-view__header">
        <button type="button" className="nav-btn nav-btn--ghost" onClick={onBack}>
          ← Back
        </button>
        <h2>Graph</h2>
      </header>

      <p className="nav-hint nav-hint--center">Tap a dot — jumps to Detail for that thought.</p>

      <div className="nav-graph-wrap">
        <svg className="nav-graph" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Thought graph">
          {nodes.map((a, i) =>
            a.links.map((linkId) => {
              const j = nodes.findIndex((n) => n.id === linkId);
              if (j < 0 || j <= i) return null;
              const b = nodes[j];
              const pa = dotPosition(i, nodes.length, cx, cy, radius);
              const pb = dotPosition(j, nodes.length, cx, cy, radius);
              return (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  className="nav-graph__line"
                />
              );
            })
          )}
          {nodes.map((node, i) => {
            const { x, y } = dotPosition(i, nodes.length, cx, cy, radius);
            const selected = selectedId === node.id;
            return (
              <g key={node.id} className="nav-graph__node" onClick={() => onPickNode(node.id)}>
                <circle
                  cx={x}
                  cy={y}
                  r={selected ? 16 : 12}
                  className={`nav-graph__dot${selected ? " nav-graph__dot--selected" : ""}`}
                />
                <text x={x} y={y + 26} className="nav-graph__label" textAnchor="middle">
                  {node.title.length > 12 ? `${node.title.slice(0, 10)}…` : node.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
