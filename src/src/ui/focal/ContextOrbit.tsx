import type { NavNode } from "../../types/navigation";

type Props = {
  related: NavNode[];
  onFocus: (id: string) => void;
};

export function ContextOrbit({ related, onFocus }: Props) {
  if (related.length === 0) {
    return (
      <aside className="focal-context">
        <span className="focal-context__label">Context</span>
        <p className="focal-context__empty">No orbiting ideas — link nodes to build a constellation.</p>
      </aside>
    );
  }

  return (
    <aside className="focal-context">
      <span className="focal-context__label">Context</span>
      <div className="focal-context__orbit">
        {related.map((node, i) => {
          const angle = 140 + (i / Math.max(related.length - 1, 1)) * 80;
          const dist = 42 + (i % 3) * 14;
          return (
            <button
              key={node.id}
              type="button"
              className="focal-satellite"
              style={{
                ["--sat-angle" as string]: `${angle}deg`,
                ["--sat-dist" as string]: `${dist}%`,
                ["--sat-delay" as string]: `${i * 0.4}s`,
              }}
              onClick={() => onFocus(node.id)}
              title={node.title}
            >
              <span className="focal-satellite__dot" />
              <span className="focal-satellite__label">{node.title}</span>
            </button>
          );
        })}
      </div>
      <p className="focal-context__hint">Peripheral — tap to shift focus</p>
    </aside>
  );
}
