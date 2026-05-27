import type { NavNode } from "../../types/navigation";

type Props = {
  node: NavNode;
  connected: NavNode[];
  onOpenGraph: () => void;
  onGoToNode: (id: string) => void;
  onBack: () => void;
};

export function DetailView({ node, connected, onOpenGraph, onGoToNode, onBack }: Props) {
  return (
    <div className="nav-view">
      <header className="nav-view__header">
        <button type="button" className="nav-btn nav-btn--ghost" onClick={onBack}>
          ← Back
        </button>
        <h2>Detail</h2>
      </header>

      <article className="nav-detail">
        <h3 className="nav-detail__title">{node.title}</h3>
        <p className="nav-detail__content">{node.content || <em className="nav-hint">Empty content</em>}</p>

        <button type="button" className="nav-btn nav-btn--accent nav-btn--block" onClick={onOpenGraph}>
          Go to Graph View
        </button>

        <section className="nav-connected">
          <h4>Connected thoughts</h4>
          {connected.length === 0 ? (
            <p className="nav-hint">No links yet (placeholder).</p>
          ) : (
            <ul className="nav-connected__list">
              {connected.map((n) => (
                <li key={n.id}>
                  <button type="button" className="nav-connected__item" onClick={() => onGoToNode(n.id)}>
                    {n.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </div>
  );
}
