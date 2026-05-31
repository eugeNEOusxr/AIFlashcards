export type GraphNodeDef = {
  id: string;
  label: string;
  memoryKey: string;
  position: [number, number, number];
  connections: Record<string, number>;
  prerequisites?: Record<string, number>;
};

export type GraphDefinition = {
  id: string;
  label: string;
  nodes: GraphNodeDef[];
};

export const motionForcesGraph: GraphDefinition = {
  id: "motion-forces",
  label: "Motion & Forces",
  nodes: [
    {
      id: "force",
      label: "Force",
      memoryKey: "force",
      position: [18, 42, 0],
      connections: { motion: 0.9, friction: 0.7 },
    },
    {
      id: "friction",
      label: "Friction",
      memoryKey: "friction",
      position: [18, 72, -0.15],
      connections: { force: 0.7, motion: 0.4 },
      prerequisites: { force: 0.12 },
    },
    {
      id: "motion",
      label: "Motion",
      memoryKey: "motion",
      position: [48, 38, 0.1],
      connections: { force: 0.9, inertia: 0.85, energy: 0.8 },
      prerequisites: { force: 0.18 },
    },
    {
      id: "inertia",
      label: "Inertia",
      memoryKey: "inertia",
      position: [72, 36, 0.2],
      connections: { motion: 0.85, force: 0.5 },
      prerequisites: { motion: 0.22 },
    },
    {
      id: "energy",
      label: "Energy",
      memoryKey: "energy",
      position: [82, 58, 0.05],
      connections: { motion: 0.8 },
      prerequisites: { motion: 0.4 },
    },
  ],
};

const GRAPHS: Record<string, GraphDefinition> = {
  "motion-forces": motionForcesGraph,
};

export function getGraphDefinition(graphId: string): GraphDefinition | undefined {
  return GRAPHS[graphId];
}
