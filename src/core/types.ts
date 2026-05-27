export type NodeType = "concept" | "fact" | "skill";

export type Node = {
  id: string;
  title: string;
  content: string;
  type: NodeType;
  strength: number;
  createdAt: number;
  updatedAt: number;
};

export type EdgeType = "relates" | "depends";

export type Edge = {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  weight: number;
};

export type ThoughtTrace = {
  id: string;
  path: string[];
  timestamp: number;
};

export type GraphSnapshot = {
  nodes: Node[];
  edges: Edge[];
  traces: ThoughtTrace[];
  activeTraceId: string | null;
  selectedNodeId: string | null;
};
