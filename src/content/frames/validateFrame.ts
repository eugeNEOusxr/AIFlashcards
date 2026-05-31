import type { LearningFrame, LearningModule } from "./types";

const FORBIDDEN_IN_FORCE = /\b(inertia|newton|first law|second law|third law|gravity)\b/i;
const FORBIDDEN_IN_FORCES = /\b(inertia|newton|first law|second law|third law)\b/i;
const ARROW_NOTATION = /->|=>|→/;

export function validateFrame(frame: LearningFrame, moduleId: string): string[] {
  const errors: string[] = [];

  if (ARROW_NOTATION.test(frame.visualAid)) {
    errors.push(`${frame.id}: visualAid must not use arrow notation`);
  }
  if (ARROW_NOTATION.test(frame.fact)) {
    errors.push(`${frame.id}: fact must not use arrow notation`);
  }

  if (moduleId === "physics.force") {
    const combined = [frame.fact, frame.visualAid, frame.question, ...frame.answers].join(" ");
    if (FORBIDDEN_IN_FORCE.test(combined)) {
      errors.push(`${frame.id}: force module must not reference inertia/Newton/gravity`);
    }
    if (FORBIDDEN_IN_FORCE.test(frame.clarification.text + frame.clarification.visualAid)) {
      errors.push(`${frame.id}: clarification must stay on force micro-concept`);
    }
  }

  if (moduleId === "physics.forces") {
    const combined = [frame.fact, frame.visualAid, frame.question, ...frame.answers].join(" ");
    if (FORBIDDEN_IN_FORCES.test(combined)) {
      errors.push(`${frame.id}: forces module must not reference inertia/Newton's laws`);
    }
    if (FORBIDDEN_IN_FORCES.test(frame.clarification.text + frame.clarification.visualAid)) {
      errors.push(`${frame.id}: clarification must stay on forces micro-concept`);
    }
  }

  if (frame.feedback.correct.includes(frame.visualAid.slice(0, 20))) {
    errors.push(`${frame.id}: feedback.correct must not repeat visualAid`);
  }

  return errors;
}

export function validateModule(module: LearningModule): string[] {
  const tags = new Set<string>();
  const errors: string[] = [];
  for (const frame of module.frames) {
    errors.push(...validateFrame(frame, module.id));
    if (tags.has(frame.conceptTag)) {
      errors.push(`${frame.id}: duplicate conceptTag ${frame.conceptTag}`);
    }
    tags.add(frame.conceptTag);
  }
  return errors;
}
