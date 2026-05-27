export type InteractionEventType = "select" | "action" | "mode_change" | "reflect";

export interface InteractionEvent {
  type: InteractionEventType;
  source: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export type InteractionPayload = InteractionEvent["payload"];
