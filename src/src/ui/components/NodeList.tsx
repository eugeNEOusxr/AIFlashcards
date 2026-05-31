import { useMemo, useState } from "react";
import { createNode, searchNodes, selectNode } from "../../core/graphEngine";
import type { NodeType } from "../../core/types";
import { useGraphEngine } from "../useGraphEngine";

type Props = {
  onNodeSelected?: (id: string) => void;
};

export function NodeList({ onNodeSelected }: Props) {
  const snap = useGraphEngine();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nodeType, setNodeType] = useState<NodeType>("concept");

  const selectedId = snap.selectedNodeId;
  const nodes = useMemo(
    () => (query.trim() ? searchNodes(query) : [...snap.nodes].sort((a, b) => b.updatedAt - a.updatedAt)),
    [query, snap.nodes]
  );

  const handleAdd = () => {
    if (!title.trim()) return;
    const node = createNode(title, content, nodeType);
    setTitle("");
    setContent("");
    setShowAdd(false);
    onNodeSelected?.(node.id);
  };

  return (
    <aside className="cg-panel cg-panel--left">
      <header className="cg-panel__header">
        <h2 className="cg-panel__title">Library</h2>
        <span className="cg-panel__count">{nodes.length}</span>
      </header>

      <input
        className="cg-input"
        type="search"
        placeholder="Search concepts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button type="button" className="cg-btn cg-btn--primary cg-btn--block" onClick={() => setShowAdd((v) => !v)}>
        {showAdd ? "Cancel" : "+ Add node"}
      </button>

      {showAdd ? (
        <div className="cg-add-form">
          <input
            className="cg-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="cg-input cg-textarea"
            placeholder="Content / notes"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <select className="cg-input" value={nodeType} onChange={(e) => setNodeType(e.target.value as NodeType)}>
            <option value="concept">Concept</option>
            <option value="fact">Fact</option>
            <option value="skill">Skill</option>
          </select>
          <button type="button" className="cg-btn cg-btn--accent cg-btn--block" onClick={handleAdd}>
            Create
          </button>
        </div>
      ) : null}

      <ul className="cg-node-list">
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              className={`cg-node-list__item${selectedId === node.id ? " cg-node-list__item--active" : ""}`}
              onClick={() => {
                selectNode(node.id);
                onNodeSelected?.(node.id);
              }}
            >
              <span className="cg-node-list__title">{node.title}</span>
              <span className="cg-node-list__meta">
                {node.type} · {Math.round(node.strength * 100)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
