export type KnowledgeRelationship =
  | "depends_on"
  | "causes"
  | "explains"
  | "contradicts"
  | "example_of"
  | "simplifies"
  | "related_to";

export type KnowledgeEdge = {
  id: string;
  from: string;
  to: string;
  relationship: KnowledgeRelationship;
  strength: number;
  createdFrom: "ai" | "user" | "inference";
  timestamp: number;
};
