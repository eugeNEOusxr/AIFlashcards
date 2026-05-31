import type { NavNode } from "../../types/navigation";

type Props = {
  node: NavNode;
};

/** Right column — depth expansion of the focal node only. */
export function DepthPanel({ node }: Props) {
  return (
    <aside className="focal-depth">
      <span className="focal-depth__label">Depth</span>
      <article className="focal-depth__body">
        <p className="focal-depth__content">{node.content || "No inner content yet."}</p>
        <div className="focal-depth__meta">
          <span>{node.links.length} connection{node.links.length === 1 ? "" : "s"}</span>
        </div>
      </article>
    </aside>
  );
}
