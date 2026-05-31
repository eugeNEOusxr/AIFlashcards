/**
 * Knowledge City — cluster nodes by shared tags (MVP union-find).
 */

import type { KnowledgeNode } from "../graph/KnowledgeNode";
import type { KnowledgeCluster } from "./KnowledgeCluster";

function find(parent: Map<string, string>, id: string): string {
  let p = parent.get(id) ?? id;
  if (p !== id) {
    p = find(parent, p);
    parent.set(id, p);
  }
  return p;
}

function union(parent: Map<string, string>, a: string, b: string): void {
  const ra = find(parent, a);
  const rb = find(parent, b);
  if (ra !== rb) parent.set(ra, rb);
}

function sharedTags(a: KnowledgeNode, b: KnowledgeNode): boolean {
  const setA = new Set(a.tags);
  return b.tags.some((t) => setA.has(t));
}

/** Group nodes that share at least one tag into clusters. */
export function clusterGraph(nodes: KnowledgeNode[]): KnowledgeCluster[] {
  if (nodes.length === 0) return [];

  const parent = new Map<string, string>();
  for (const n of nodes) parent.set(n.id, n.id);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (sharedTags(nodes[i], nodes[j])) {
        union(parent, nodes[i].id, nodes[j].id);
      }
    }
  }

  const groups = new Map<string, string[]>();
  for (const n of nodes) {
    const root = find(parent, n.id);
    const arr = groups.get(root) ?? [];
    arr.push(n.id);
    groups.set(root, arr);
  }

  let cid = 0;
  const clusters: KnowledgeCluster[] = [];

  for (const [, nodeIds] of groups) {
    cid += 1;
    const clusterNodes = nodes.filter((n) => nodeIds.includes(n.id));
    const tagSet = new Set<string>();
    clusterNodes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
    const name = [...tagSet].sort().slice(0, 3).join(", ") || `cluster-${cid}`;
    const pairs = (nodeIds.length * (nodeIds.length - 1)) / 2;
    const sharedPairs =
      pairs === 0
        ? 1
        : clusterNodes.reduce((acc, a, i) => {
            let c = 0;
            for (let j = i + 1; j < clusterNodes.length; j++) {
              if (sharedTags(a, clusterNodes[j])) c += 1;
            }
            return acc + c;
          }, 0);
    const coherence = pairs === 0 ? 1 : Math.min(1, sharedPairs / pairs);

    clusters.push({
      id: `cluster_${cid}_${name.slice(0, 16).replace(/\W+/g, "_")}`,
      name: name.slice(0, 48),
      nodeIds,
      coherence: Math.round(coherence * 100) / 100,
    });
  }

  return clusters;
}
