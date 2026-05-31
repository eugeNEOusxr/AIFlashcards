/**
 * Visual translation of meaning + graph signals into UI feedback scores.
 * Deterministic only — not intelligence.
 */

import type { MeaningEvent } from "../meaning/meaningEngine";
import { loadCognitiveGraph } from "../graph/cognitiveGraph";

export interface CognitiveFeedbackScores {
  clarityScore: number;
  confusionScore: number;
  attentionStickiness: number;
  conceptStability: number;
}

export interface CognitiveFeedbackSnapshot extends CognitiveFeedbackScores {
  /** Short phrase for overlay (null = hide). */
  message: string | null;
  /** 0–1 drives module glow intensity in UI. */
  glowIntensity: number;
  updatedAt: number;
}

const DECAY_PER_SECOND = 0.018;

let scores: CognitiveFeedbackScores = {
  clarityScore: 0,
  confusionScore: 0,
  attentionStickiness: 0,
  conceptStability: 0,
};

let lastTickAt = Date.now();
let clarityEventCount = 0;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function applyLinearDecay(now: number): void {
  const dtSec = Math.max(0, (now - lastTickAt) / 1000);
  if (dtSec <= 0) return;
  const drop = DECAY_PER_SECOND * dtSec;
  scores = {
    clarityScore: clamp01(scores.clarityScore - drop),
    confusionScore: clamp01(scores.confusionScore - drop),
    attentionStickiness: clamp01(scores.attentionStickiness - drop * 0.85),
    conceptStability: clamp01(scores.conceptStability - drop * 0.6),
  };
  lastTickAt = now;
}

function boostFromGraphEngagement(activeConceptId: string | null): number {
  if (!activeConceptId) return 0;
  const graph = loadCognitiveGraph();
  let maxWeight = 0;
  for (const edge of Object.values(graph.edges)) {
    if (edge.from === activeConceptId && edge.relation === "engages") {
      maxWeight = Math.max(maxWeight, edge.weight);
    }
  }
  return clamp01(maxWeight * 0.12);
}

function deriveMessage(s: CognitiveFeedbackScores): string | null {
  if (s.confusionScore >= 0.55) return "Confusion detected";
  if (s.conceptStability >= 0.45 && s.clarityScore >= 0.4) return "Concept stabilizing";
  if (s.clarityScore >= 0.5) return "Understanding increasing";
  if (s.attentionStickiness >= 0.55) return "High engagement detected";
  return null;
}

function buildSnapshot(activeConceptId: string | null): CognitiveFeedbackSnapshot {
  const graphBoost = boostFromGraphEngagement(activeConceptId);
  const stickiness = clamp01(scores.attentionStickiness + graphBoost);
  const glowIntensity = clamp01(
    stickiness * 0.55 + scores.clarityScore * 0.25 + scores.conceptStability * 0.2
  );

  return {
    clarityScore: scores.clarityScore,
    confusionScore: scores.confusionScore,
    attentionStickiness: stickiness,
    conceptStability: scores.conceptStability,
    message: deriveMessage({ ...scores, attentionStickiness: stickiness }),
    glowIntensity,
    updatedAt: Date.now(),
  };
}

/** Apply a new MeaningEvent and return updated feedback snapshot. */
export function updateCognitiveFeedback(
  meaning: MeaningEvent,
  activeConceptId: string | null
): CognitiveFeedbackSnapshot {
  applyLinearDecay(meaning.timestamp);

  switch (meaning.type) {
    case "confusion":
      scores.confusionScore = clamp01(scores.confusionScore + 0.32 * meaning.intensity);
      scores.clarityScore = clamp01(scores.clarityScore - 0.08);
      break;
    case "clarity":
      scores.clarityScore = clamp01(scores.clarityScore + 0.28 * meaning.intensity);
      scores.confusionScore = clamp01(scores.confusionScore - 0.12);
      clarityEventCount += 1;
      if (clarityEventCount >= 2) {
        scores.conceptStability = clamp01(
          scores.conceptStability + 0.18 * meaning.intensity
        );
      }
      break;
    case "engagement":
      scores.attentionStickiness = clamp01(
        scores.attentionStickiness + 0.22 * meaning.intensity
      );
      break;
    case "reflection":
      scores.conceptStability = clamp01(scores.conceptStability + 0.08);
      break;
    case "exploration":
      scores.attentionStickiness = clamp01(
        scores.attentionStickiness + 0.06 * meaning.intensity
      );
      break;
    default:
      break;
  }

  return buildSnapshot(activeConceptId);
}

/** Time-based decay tick (call from UI interval). */
export function tickCognitiveFeedbackDecay(
  activeConceptId: string | null
): CognitiveFeedbackSnapshot {
  applyLinearDecay(Date.now());
  return buildSnapshot(activeConceptId);
}

export function getCognitiveFeedbackSnapshot(
  activeConceptId: string | null
): CognitiveFeedbackSnapshot {
  return buildSnapshot(activeConceptId);
}
