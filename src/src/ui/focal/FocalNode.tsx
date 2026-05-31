import type { NavNode } from "../../types/navigation";

type Props = {
  node: NavNode;
};

export function FocalNode({ node }: Props) {
  return (
    <div className="focal-center">
      <div className="focal-center__halo" aria-hidden />
      <div className="focal-center__core">
        <span className="focal-center__type">focus</span>
        <h1 className="focal-center__title">{node.title}</h1>
        <p className="focal-center__pulse">active focus</p>
      </div>
    </div>
  );
}
