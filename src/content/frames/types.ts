/** Single micro-concept tag — one frame teaches exactly one */
export type FrameConceptTag =
  | "force-definition"
  | "force-detection"
  | "force-invisible"
  | "force-push-example"
  | "forces-contact"
  | "forces-at-distance"
  | "forces-net"
  | "forces-balanced"
  | "forces-unbalanced"
  | "matter-definition"
  | "matter-states-nature"
  | "matter-particles-nature"
  | "matter-conservation-nature"
  | "change-physical-nature"
  | "change-chemical-nature"
  | "change-signs-nature"
  | "change-photosynthesis-nature"
  | "change-atoms-rearrange"
  | "cells-unit-of-life"
  | "cells-in-nature"
  | "cells-plant-animal"
  | "cells-microscopic"
  | "organisms-living-traits"
  | "organisms-needs"
  | "organisms-habitat"
  | "organisms-food-chain"
  | "organisms-biodiversity";

export type FrameAnswers = [string, string, string, string];

export type FrameFeedback = {
  /** Shown only after a correct selection */
  correct: string;
  /** Shown only after an incorrect selection — must not duplicate visualAid */
  incorrect: string;
};

export type FrameClarification = {
  text: string;
  /** Separate scenario text — only shown in clarification phase */
  visualAid: string;
};

export type LearningFrame = {
  id: string;
  /** Enforces one micro-concept per frame */
  conceptTag: FrameConceptTag;
  title: string;
  fact: string;
  visualAid: string;
  question: string;
  answers: FrameAnswers;
  correctIndex: number;
  feedback: FrameFeedback;
  clarification: FrameClarification;
};

export type LearningModule = {
  id: string;
  title: string;
  subtitle: string;
  pathwayId: string;
  frames: LearningFrame[];
};

export type FramePhase =
  | "answering"
  | "feedback"
  | "reflection"
  | "clarification"
  | "done";
