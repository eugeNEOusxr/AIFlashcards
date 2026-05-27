import { useState } from "react";
import {
  adjustStrength,
  createEdge,
  getNeighbors,
  markLearned,
  selectNode,
} from "../../core/graphEngine";
import type { EdgeType } from "../../core/types";
import { useGraphEngine } from "../useGraphEngine";

export function NodeInspector() {
  const snap = useGraphEngine();
  const node = snap.selectedNodeId
    ? snap.nodes.find((n) => n.id === snap.selectedNodeId)
    : undefined;
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState("");
  const [connectType, setConnectType] = useState<EdgeType>("relates");

  if (!node) {
    return (
      <aside className="cg-panel cg-panel--right">
        <header className="cg-panel__header">
          <h2 className="cg-panel__title">Inspector</h2>
        </header>
        <p className="cg-hint">Select a node in the graph or library.</p>
      </aside>
    );
  }

  const neighbors = getNeighbors(node.id);
  const otherNodes = snap.nodes.filter((n) => n.id !== node.id);

  const handleConnect = () => {
    if (!connectTarget) return;
    createEdge(node.id, connectTarget, connectType);
    setConnectOpen(false);
    setConnectTarget("");
  };

  const handleFlashcardAnswer = (delta: number) => {
    adjustStrength(node.id, delta);
    setFlipped(false);
    setFlashcardOpen(false);
  };

  return (
    <aside className="cg-panel cg-panel--right">
      <header className="cg-panel__header">
        <h2 className="cg-panel__title">Inspector</h2>
        <span className={`cg-badge cg-badge--${node.type}`}>{node.type}</span>
      </header>

      {flashcardOpen ? (
        <div className="cg-flashcard">
          <button
            type="button"
            className={`cg-flashcard__face${flipped ? " cg-flashcard__face--back" : ""}`}
            onClick={() => setFlipped((f) => !f)}
          >
            <span className="cg-flashcard__label">{flipped ? "Back" : "Front"}</span>
            <p className="cg-flashcard__text">{flipped ? node.content || "(no content)" : node.title}</p>
            <span className="cg-hint">Tap to flip</span>
          </button>
          <div className="cg-flashcard__actions">
            <button type="button" className="cg-btn cg-btn--good" onClick={() => handleFlashcardAnswer(0.1)}>
              Got it (+0.1)
            </button>
            <button type="button" className="cg-btn cg-btn--bad" onClick={() => handleFlashcardAnswer(-0.1)}>
              Didn&apos;t know (−0.1)
            </button>
          </div>
          <button type="button" className="cg-btn cg-btn--ghost cg-btn--block" onClick={() => setFlashcardOpen(false)}>
            Close card
          </button>
        </div>
      ) : (
        <>
          <h3 className="cg-inspector__title">{node.title}</h3>
          <p className="cg-inspector__content">{node.content || <em className="cg-hint">No content yet.</em>}</p>

          <div className="cg-strength">
            <span className="cg-strength__label">Strength</span>
            <div className="cg-strength__bar">
              <div className="cg-strength__fill" style={{ width: `${Math.round(node.strength * 100)}%` }} />
            </div>
            <span className="cg-strength__pct">{Math.round(node.strength * 100)}%</span>
          </div>

          <div className="cg-inspector__actions">
            <button type="button" className="cg-btn cg-btn--accent" onClick={() => setFlashcardOpen(true)}>
              Study Card
            </button>
            <button type="button" className="cg-btn" onClick={() => markLearned(node.id)}>
              Mark as Learned
            </button>
            <button type="button" className="cg-btn" onClick={() => setConnectOpen((v) => !v)}>
              Connect to Node
            </button>
          </div>

          {connectOpen ? (
            <div className="cg-connect-form">
              <select
                className="cg-input"
                value={connectTarget}
                onChange={(e) => setConnectTarget(e.target.value)}
              >
                <option value="">Choose node…</option>
                {otherNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
              <select
                className="cg-input"
                value={connectType}
                onChange={(e) => setConnectType(e.target.value as EdgeType)}
              >
                <option value="relates">relates</option>
                <option value="depends">depends</option>
              </select>
              <button type="button" className="cg-btn cg-btn--primary cg-btn--block" onClick={handleConnect}>
                Create edge
              </button>
            </div>
          ) : null}

          <section className="cg-neighbors">
            <h4 className="cg-neighbors__heading">Connected ({neighbors.length})</h4>
            {neighbors.length === 0 ? (
              <p className="cg-hint">No connections yet.</p>
            ) : (
              <ul className="cg-neighbors__list">
                {neighbors.map(({ node: nb, edge, direction }) => (
                  <li key={edge.id}>
                    <button type="button" className="cg-neighbors__link" onClick={() => selectNode(nb.id)}>
                      <span>{direction === "out" ? "→" : "←"} {nb.title}</span>
                      <span className="cg-neighbors__edge">
                        {edge.type} · {Math.round(edge.weight * 100)}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </aside>
  );
}
