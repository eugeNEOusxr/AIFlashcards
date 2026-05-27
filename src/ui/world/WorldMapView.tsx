import { useEffect, useRef, useState } from "react";
import type { LearningNode } from "../../core/worldGraph/types";
import { layoutWorldNodes } from "../../core/worldGraph/worldEngine";

type Props = {
  nodes: LearningNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function WorldMapView({ nodes, activeId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 400 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 40 && height > 40) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const layout = layoutWorldNodes(nodes, cx, cy);

  const maxPhase = 4;
  const inner = 48;
  const ring = (Math.min(cx, cy) - inner - 20) / maxPhase;

  return (
    <div ref={wrapRef} className="lw-map">
      <svg className="lw-map__svg" viewBox={`0 0 ${size.w} ${size.h}`} role="img" aria-label="Learning world map">
        {[0, 1, 2, 3, 4].map((p) => (
          <circle
            key={p}
            cx={cx}
            cy={cy}
            r={inner + p * ring}
            className="lw-map__ring"
            fill="none"
          />
        ))}
        {nodes.map((a) =>
          a.prerequisites.map((pid) => {
            const pa = layout.get(a.id);
            const pb = layout.get(pid);
            if (!pa || !pb) return null;
            return (
              <line
                key={`${pid}-${a.id}`}
                x1={pb.x}
                y1={pb.y}
                x2={pa.x}
                y2={pa.y}
                className="lw-map__edge"
              />
            );
          })
        )}
        {nodes.map((node) => {
          const p = layout.get(node.id);
          if (!p) return null;
          const active = node.id === activeId;
          const dim = !node.unlocked;
          const done = node.completed;
          return (
            <g
              key={node.id}
              className={`lw-map__node${active ? " lw-map__node--active" : ""}${dim ? " lw-map__node--locked" : ""}${done ? " lw-map__node--done" : ""}`}
              style={{ cursor: node.unlocked ? "pointer" : "not-allowed" }}
              onClick={() => node.unlocked && onSelect(node.id)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? 22 : 16}
                className="lw-map__dot"
              />
              <text x={p.x} y={p.y + 34} className="lw-map__label" textAnchor="middle">
                {node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="lw-map__legend">
        <span>Inner = Phase 0</span>
        <span>Outer = Phase 4</span>
      </div>
    </div>
  );
}
