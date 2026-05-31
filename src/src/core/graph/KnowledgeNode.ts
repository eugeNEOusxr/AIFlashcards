export type KnowledgeNodeType =
  | "concept"
  | "question"
  | "explanation"
  | "reflection"
  | "flashcard";

export type KnowledgeSourceType = "chat" | "book" | "highlight" | "manual";

export type KnowledgeNode = {
  id: string;
  title: string;
  content: string;
  type: KnowledgeNodeType;
  confidence?: number;
  confusionLevel?: number;
  importance?: number;
  source: {
    type: KnowledgeSourceType;
    referenceId?: string;
  };
  tags: string[];
  lastReviewed?: number;
  revisitCount?: number;
};
