export type CognitiveState = "understood" | "partial" | "unknown";

export type LearningEventType = "question" | "insight" | "confusion" | "reflection";

export interface LearningEvent {
  id: string;
  concept: string;
  type: LearningEventType;
  text: string;
  stateAfter?: CognitiveState;
  confidenceDelta?: number;
  timestamp: number;
}

export interface CognitiveNode {
  concept: string;
  state: CognitiveState;
  confidence: number;
  events: LearningEvent[];
}
