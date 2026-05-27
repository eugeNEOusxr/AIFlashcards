/**
 * Deterministic conversation → graph stub (not AI).
 */

import type { KnowledgeNode, KnowledgeNodeType } from "../graph/KnowledgeNode";
import type { KnowledgeEdge } from "../graph/KnowledgeEdge";

export type ChatTurn = { role: string; text: string };

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24) || "item";
}

function tagsFromText(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && w.length < 20)
    .slice(0, 4);
  return [...new Set(words)];
}

function classifySentence(text: string, role: string): KnowledgeNodeType {
  const t = text.trim();
  if (!t) return "concept";
  if (/\?\s*$/.test(t) || t.includes("?")) return "question";
  if (role === "assistant" || role === "model") return "explanation";
  if (t.length > 140) return "explanation";
  return "concept";
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

let nodeSeq = 0;

function makeNode(
  title: string,
  content: string,
  type: KnowledgeNodeType,
  role: string,
  refIdx: number,
  tags: string[]
): KnowledgeNode {
  nodeSeq += 1;
  const id = `kn_${nodeSeq}_${slug(title).slice(0, 12)}`;
  return {
    id,
    title: title.slice(0, 120),
    content: content.slice(0, 2000),
    type,
    source: { type: "chat", referenceId: `turn_${refIdx}_${role}` },
    tags: tags.length ? tags : ["general"],
  };
}

/**
 * Placeholder parser: sentences → nodes; consecutive + cross-turn → edges.
 */
export function extractGraphFromConversation(conversation: ChatTurn[]): {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
} {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];
  let edgeSeq = 0;

  const pushEdge = (from: string, to: string) => {
    edgeSeq += 1;
    edges.push({
      id: `edge_${edgeSeq}_${from}_${to}`,
      from,
      to,
      relationship: "related_to",
      strength: 0.5,
      createdFrom: "inference",
      timestamp: Date.now(),
    });
  };

  let lastNodeId: string | null = null;

  conversation.forEach((turn, refIdx) => {
    const chunks = splitIntoChunks(turn.text);
    const pieces = chunks.length ? chunks : [turn.text.trim()].filter(Boolean);
    let prevInTurn: string | null = null;

    pieces.forEach((piece) => {
      const type = classifySentence(piece, turn.role);
      const tags = tagsFromText(piece);
      const title =
        type === "question"
          ? piece.slice(0, 80)
          : piece.split(/[.:\n]/)[0]?.trim().slice(0, 80) || piece.slice(0, 80);
      const node = makeNode(title, piece, type, turn.role, refIdx, tags);
      nodes.push(node);
      if (prevInTurn) pushEdge(prevInTurn, node.id);
      if (lastNodeId) pushEdge(lastNodeId, node.id);
      prevInTurn = node.id;
      lastNodeId = node.id;
    });
  });

  return { nodes, edges };
}

export const SAMPLE_CONVERSATION: ChatTurn[] = [
  { role: "user", text: "What is voltage? I am confused about potential difference." },
  {
    role: "assistant",
    text:
      "Voltage is electric potential energy per unit charge. It drives current through a conductor. Think of it as electrical pressure.",
  },
  { role: "user", text: "How does that relate to resistance?" },
];
