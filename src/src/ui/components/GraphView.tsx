import { useMemo, useRef, useState, useEffect } from "react";
import { selectNode } from "../../core/graphEngine";
import type { Edge, Node } from "../../core/types";
import { useGraphEngine } from "../useGraphEngine";

const W = 640;
const H = 420;
const PAD = 48;

type Pos = { x: number; y: number };

function layoutNodes(nodes: Node[], edges: Edge[]): Map<string, Pos> {
  const positions = new Map<string, Pos>();
  const n = nodes.length;
  if (n === 0) return positions;

  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) * 0.35;

  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions.set(node.id, {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  // Light force refinement (fixed iterations, no animation loop)
  for (let iter = 0; iter < 40; iter++) {
    const forces = new Map<string, { fx: number; fy: number }>();
    nodes.forEach((node) => forces.set(node.id, { fx: 0, fy: 0 }));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const pa = positions.get(a.id)!;
        const pb = positions.get(b.id)!;
        let dx = pb.x - pa.x;
        let dy = pb.y - pa.y;
        let dist = Math.hypot(dx, dy) || 1;
        const repulse = 4200 / (dist * dist);
        dx = (dx / dist) * repulse;
        dy = (dy / dist) * repulse;
        forces.get(a.id)!.fx -= dx;
        forces.get(a.id)!.fy -= dy;
        forces.get(b.id)!.fx += dx;
        forces.get(b.id)!.fy += dy;
      }
    }

    for (const edge of edges) {
      const pa = positions.get(edge.from);
      const pb = positions.get(edge.to);
      if (!pa || !pb) continue;
      let dx = pb.x - pa.x;
      let dy = pb.y - pa.y;
      let dist = Math.hypot(dx, dy) || 1;
      const attract = (dist - 90) * 0.04;
      dx = (dx / dist) * attract;
      dy = (dy / dist) * attract;
      forces.get(edge.from)!.fx += dx;
      forces.get(edge.from)!.fy += dy;
      forces.get(edge.to)!.fx -= dx;
      forces.get(edge.to)!.fy -= dy;
    }

    nodes.forEach((node) => {
      const p = positions.get(node.id)!;
      const f = forces.get(node.id)!;
      p.x = Math.max(PAD, Math.min(W - PAD, p.x + f.fx));
      p.y = Math.max(PAD, Math.min(H - PAD, p.y + f.fy));
    });
  }

  return positions;
}

function strengthColor(strength: number): string {
  const hue = 200 + strength * 80;
  return `hsl(${hue}, 70%, 58%)`;
}

export function GraphView() {
  const snap = useGraphEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: W, h: H });

  const nodes = snap.nodes;
  const edges = snap.edges;
  const selectedId = snap.selectedNodeId;

  const positions = useMemo(() => layoutNodes(nodes, edges), [nodes, edges]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaleX = size.w / W;
  const scaleY = size.h / H;

  const mapPos = (p: Pos) => ({ x: p.x * scaleX, y: p.y * scaleY });

  if (nodes.length === 0) {
    return (
      <section className="cg-panel cg-panel--center" ref={containerRef}>
        <div className="cg-graph-empty">
          <p>Add a node in the library to start your graph.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cg-panel cg-panel--center" ref={containerRef}>
      <header className="cg-panel__header cg-panel__header--overlay">
        <h2 className="cg-panel__title">Graph</h2>
        <span className="cg-panel__count">
          {nodes.length} nodes · {edges.length} edges
        </span>
      </header>
      <svg className="cg-graph-svg" viewBox={`0 0 ${size.w} ${size.h}`} role="img" aria-label="Knowledge graph">
        <defs>
          <filter id="cg-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((edge) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);
          if (!from || !to) return null;
          const a = mapPos(from);
          const b = mapPos(to);
          const isActive = selectedId === edge.from || selectedId === edge.to;
          return (
            <line
              key={edge.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={`cg-graph-edge${isActive ? " cg-graph-edge--active" : ""}`}
              strokeDasharray={edge.type === "depends" ? "6 4" : undefined}
            />
          );
        })}
        {nodes.map((node) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const { x, y } = mapPos(p);
          const r = 14 + node.strength * 10;
          const selected = selectedId === node.id;
          return (
            <g
              key={node.id}
              className="cg-graph-node"
              style={{ cursor: "pointer" }}
              onClick={() => selectNode(node.id)}
              filter={selected ? "url(#cg-glow)" : undefined}
            >
              <circle
                cx={x}
                cy={y}
                r={r}
                className={`cg-graph-node__circle${selected ? " cg-graph-node__circle--selected" : ""}`}
                fill={strengthColor(node.strength)}
              />
              <text x={x} y={y + r + 14} className="cg-graph-node__label" textAnchor="middle">
                {node.title.length > 18 ? `${node.title.slice(0, 16)}…` : node.title}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
