import { useEffect, useRef, useState } from "react";
import type { NavNode } from "../../types/navigation";
import { backgroundLayout } from "../../lib/focusGraph";

type Props = {
  nodes: NavNode[];
  focusId: string;
  onFocus: (id: string) => void;
};

export function GraphBackground({ nodes, focusId, onFocus }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 600 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = backgroundLayout(nodes, focusId, size.w, size.h);

  return (
    <div ref={ref} className="focal-bg" aria-hidden>
      <svg className="focal-bg__svg" viewBox={`0 0 ${size.w} ${size.h}`}>
        {nodes.map((a) =>
          a.links.map((linkId) => {
            const b = nodes.find((n) => n.id === linkId);
            if (!b || a.id >= b.id) return null;
            const pa = layout.get(a.id);
            const pb = layout.get(b.id);
            if (!pa || !pb) return null;
            const nearFocus = a.id === focusId || b.id === focusId;
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className={`focal-bg__edge${nearFocus ? " focal-bg__edge--near" : ""}`}
              />
            );
          })
        )}
        {nodes.map((node) => {
          const p = layout.get(node.id);
          if (!p) return null;
          const isFocus = node.id === focusId;
          return (
            <g
              key={node.id}
              className="focal-bg__node"
              style={{ opacity: p.opacity, cursor: isFocus ? "default" : "pointer" }}
              onClick={() => !isFocus && onFocus(node.id)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={8 * p.scale}
                className={`focal-bg__dot${isFocus ? " focal-bg__dot--focus" : ""}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
