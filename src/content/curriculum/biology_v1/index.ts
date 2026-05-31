import framesManifest from "./biology.frames.manifest.json";
import graph from "./biology_v1.graph.json";
import manifest from "./curriculum.manifest.json";

/** JSON-driven biology curriculum metadata (authoring + tooling). */
export const biologyV1 = {
  manifest,
  graph,
  framesManifest,
} as const;

export type BiologyFramesManifest = typeof framesManifest;
export type BiologyGraph = typeof graph;
