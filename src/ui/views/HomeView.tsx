import type { NavNode } from "../../types/navigation";

type Props = {
  nodes: NavNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

export function HomeView({ nodes, selectedId, onSelect, onAdd }: Props) {
  return (
    <div className="nav-view">
      <header className="nav-view__header">
        <h2>Home</h2>
        <button type="button" className="nav-btn nav-btn--accent" onClick={onAdd}>
          + Add node
        </button>
      </header>

      {nodes.length === 0 ? (
        <p className="nav-hint">No thoughts yet — add your first node.</p>
      ) : (
        <ul className="nav-cards">
          {nodes.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                className={`nav-card${selectedId === node.id ? " nav-card--selected" : ""}`}
                onClick={() => onSelect(node.id)}
              >
                <span className="nav-card__title">{node.title}</span>
                <span className="nav-card__preview">
                  {node.content.slice(0, 80) || "No content"}
                  {node.content.length > 80 ? "…" : ""}
                </span>
                <span className="nav-card__meta">{node.links.length} links</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
