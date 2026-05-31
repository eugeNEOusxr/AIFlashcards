/** Canonical node states — derived only, never persisted. */
export type NodeState = "locked" | "learning" | "mastered" | "confused";

export type Vector3 = [number, number, number];

export type NodeVisualParams = {
  glow: number;
  jitter: number;
  pulseSpeed: number;
  opacity: number;
  motion: "static" | "pulse" | "orbit" | "shake";
  colorToken: "blue" | "yellow" | "white" | "red" | "dim";
  position: [number, number];
};

export type GraphNodeState = {
  id: string;
  label: string;
  memoryKey: string;
  state: NodeState;
  intensity: number;
  visual: NodeVisualParams;
};

export type GraphEdgeState = {
  id: string;
  from: string;
  to: string;
  weight: number;
  energy: number;
};

export type GraphAmbience = {
  calmFactor: number;
  noiseFactor: number;
  particleSpeed: number;
};

/** Layer 2 output — renderer must only consume this (+ diffs). */
export type GraphState = {
  graphId: string;
  revision: number;
  nodes: GraphNodeState[];
  edges: GraphEdgeState[];
  ambience: GraphAmbience;
};

export type SceneNode = {
  id: string;
  position: Vector3;
  visualState: NodeState;
  label: string;
  visual: NodeVisualParams;
};

export type SceneEdge = {
  id: string;
  from: string;
  to: string;
  weight: number;
  energy: number;
};

export type AnchorOverlay = {
  glow: number;
  shaderClass: string;
  pulseSpeed: number;
};

export type PersistentAnchorObject = {
  id: string;
  kind: "bowling_ball" | "hockey_puck";
  /** DOM mount target — set once by lesson/map host. */
  element: HTMLElement | null;
  overlay: AnchorOverlay;
};

/** Layer 3 scene graph — mounts once, mutates via diffs. */
export type CurriculumScene = {
  sceneId: string;
  nodes: SceneNode[];
  edges: SceneEdge[];
  anchorObjects: {
    bowlingBall: PersistentAnchorObject;
    hockeyPuck: PersistentAnchorObject;
  };
  ambience: GraphAmbience;
};

export type NodeStatePatch = {
  id: string;
  visualState: NodeState;
  visual: NodeVisualParams;
  intensity: number;
};

export type EdgeEnergyPatch = {
  id: string;
  energy: number;
};

/** Diff emitted by graph engine — NOT a full scene rebuild. */
export type GraphStateDiff = {
  revision: number;
  nodePatches: NodeStatePatch[];
  edgePatches: EdgeEnergyPatch[];
  ambience?: GraphAmbience;
  anchorOverlay?: Partial<AnchorOverlay>;
};
