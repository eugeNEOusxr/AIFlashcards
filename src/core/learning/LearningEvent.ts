export type LearningEventSource =
  | "graph_node"
  | "physics_atom"
  | "reflection"
  | "extraction";

export type LearningEvent = {
  id: string;
  source: LearningEventSource;
  nodeId?: string;
  timestamp: number;
  payload: {
    text?: string;
    tags?: string[];
    concept?: string;
    intensity?: number;
    /** Physics / graph bridge metadata */
    electronCount?: number;
    netCharge?: number;
    action?: string;
  };
};
