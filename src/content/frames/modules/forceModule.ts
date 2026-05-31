import type { LearningModule } from "../types";

/**
 * Force basics only — no inertia, no Newton's laws in this module.
 * One micro-concept per frame.
 */
export const FORCE_MODULE: LearningModule = {
  id: "physics.force",
  title: "What Is Force?",
  subtitle: "Push and pull",
  pathwayId: "motion-forces",
  frames: [
    {
      id: "force.01",
      conceptTag: "force-definition",
      title: "What is force?",
      fact: "A force is a push or pull.",
      visualAid:
        "Imagine a soccer ball resting on a field. A player kicks the ball, and it rolls forward across the grass.",
      question: "What best describes a force?",
      answers: ["A type of energy", "A push or pull", "A measurement of time", "A form of matter"],
      correctIndex: 1,
      feedback: {
        correct: "Right — force is described as a push or pull between objects.",
        incorrect:
          "Not quite. A force is a push or pull. Energy, time, and matter are different ideas in physics.",
      },
      clarification: {
        text: "Force is the interaction (the push or pull), not the object itself. The moving ball shows the result of force.",
        visualAid:
          "Picture a book on a desk. It stays put until you slide it with your hand. Your hand supplies the push; the book moving is what you observe.",
      },
    },
    {
      id: "force.02",
      conceptTag: "force-detection",
      title: "How we notice force",
      fact: "We notice a force when something's motion changes.",
      visualAid:
        "Picture a shopping cart in a parking lot. It sits still until someone pushes it, and then it rolls toward the curb.",
      question: "What tells you that a force might be acting?",
      answers: [
        "The object changes color",
        "The object's motion changes",
        "The object gets warmer",
        "The object makes a sound",
      ],
      correctIndex: 1,
      feedback: {
        correct: "Yes — a change in motion is the clue that a force acted.",
        incorrect:
          "The key sign is a change in motion — starting, stopping, or turning. Color, heat, and sound are not the usual evidence for force.",
      },
      clarification: {
        text: "You often cannot see force itself. You conclude it was there because motion changed after a push, pull, or contact.",
        visualAid:
          "Imagine a door that is closed. You push the handle and the door swings open. The swing tells you a force was applied.",
      },
    },
    {
      id: "force.03",
      conceptTag: "force-invisible",
      title: "Force is not visible",
      fact: "Force is not something you see directly like color or shape.",
      visualAid:
        "Hold a paper clip near a magnet. The clip jumps toward the magnet even though you cannot see anything push it.",
      question: "Which statement is true about force?",
      answers: [
        "Force is always visible as a colored glow",
        "Force is inferred from what happens to motion",
        "Force only exists on moving planets",
        "Force is the same thing as speed",
      ],
      correctIndex: 1,
      feedback: {
        correct: "Correct — we infer force from motion changes and interactions, not from seeing force directly.",
        incorrect:
          "Force is inferred from outcomes (like motion changing), not seen the way we see color or size.",
      },
      clarification: {
        text: "Scientists use force as a useful model for pushes and pulls. The model explains motion even though force is not a visible property.",
        visualAid:
          "When you catch a falling ball, your hands slow it down. You feel the push and see the ball stop — that is evidence of force.",
      },
    },
    {
      id: "force.04",
      conceptTag: "force-push-example",
      title: "A push in everyday life",
      fact: "A push is one common type of force.",
      visualAid:
        "Imagine pressing a crosswalk button with your finger. Your finger applies a small push, and the button moves inward.",
      question: "Which is the clearest example of a push?",
      answers: [
        "A leaf sitting still on calm ground",
        "Opening a door by pressing it forward",
        "A shadow growing longer in the evening",
        "Water freezing in a freezer",
      ],
      correctIndex: 1,
      feedback: {
        correct: "Opening a door by pressing it is a clear push — force applied through contact.",
        incorrect:
          "A push is a force through contact. A still leaf, a shadow, and freezing water are not good examples of a push.",
      },
      clarification: {
        text: "A push transfers motion through contact. Pulling a drawer handle is similar — it is still a force, just in the opposite direction.",
        visualAid:
          "Think of tapping a keyboard key. Your finger pushes the key down; the key moves. That small everyday motion is force at work.",
      },
    },
  ],
};
