import type { LearningModule } from "../types";

/** Matter in nature — basics only; one micro-concept per frame. */
export const MATTER_MODULE: LearningModule = {
  id: "chemistry.matter",
  title: "Matter in Nature",
  subtitle: "What the world is made of",
  pathwayId: "nature-chemistry",
  frames: [
    {
      id: "matter.01",
      conceptTag: "matter-definition",
      title: "What is matter?",
      fact: "Matter is anything that has mass and takes up space.",
      visualAid:
        "Walk along a forest trail. The soil under your boots, the bark on a tree, and the air you breathe are all examples of matter around you.",
      question: "Which best describes matter in nature?",
      answers: [
        "Anything with mass that takes up space",
        "Only things you can see with your eyes",
        "Only living plants and animals",
        "Only liquids like rivers and rain",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — mass and space are the two clues that something is matter.",
        incorrect:
          "Matter is broader than visibility, life, or liquids alone. The key is mass and taking up space.",
      },
      clarification: {
        text: "Light and sound are not matter — they carry energy but do not have mass in the same way a rock does.",
        visualAid:
          "Hold a pine cone in your hand. You feel its weight and size. That everyday heft is evidence of matter.",
      },
    },
    {
      id: "matter.02",
      conceptTag: "matter-states-nature",
      title: "States in the wild",
      fact: "Matter in nature is often solid, liquid, or gas.",
      visualAid:
        "On a mountain morning you see frost on stones (solid), a stream flowing (liquid), and mist rising (gas). Same landscape, different states.",
      question: "A cloud of mist rising from a warm lake is mainly matter as a —",
      answers: ["gas", "solid crystal only", "pure empty space", "type of light"],
      correctIndex: 0,
      feedback: {
        correct: "Right — water vapor in mist is matter in the gas state.",
        incorrect:
          "Mist is water in the air as gas. It is not empty space, light, or a solid crystal.",
      },
      clarification: {
        text: "The same water substance can change state when temperature changes — ice, liquid water, and vapor.",
        visualAid:
          "Picture a puddle shrinking on a sunny afternoon. Liquid water becomes invisible vapor — still matter, different state.",
      },
    },
    {
      id: "matter.03",
      conceptTag: "matter-particles-nature",
      title: "Tiny pieces",
      fact: "All matter is made of tiny particles too small to see.",
      visualAid:
        "Grind a leaf between your fingers. Even the finest green dust is still made of countless tiny particles.",
      question: "Why do we say a grain of sand is still made of particles?",
      answers: [
        "Because matter is built from tiny pieces at a scale we cannot see",
        "Because sand is a single unbreakable dot",
        "Because only gases have particles",
        "Because particles are only in laboratory glassware",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Exactly — the particle model explains all matter, including sand, air, and sap.",
        incorrect:
          "Sand is not one dot, and particles are not limited to gases or labs. Nature is full of particle-built matter.",
      },
      clarification: {
        text: "You do not need a microscope to accept the idea — melting, dissolving, and spreading smells all hint at tiny pieces.",
        visualAid:
          "Smell wildflowers downwind. Scent particles traveled through the air from the petals to your nose.",
      },
    },
    {
      id: "matter.04",
      conceptTag: "matter-conservation-nature",
      title: "Matter stays in the world",
      fact: "In everyday nature, matter is not created or destroyed — it moves or changes form.",
      visualAid:
        "A fallen log slowly softens into soil. The material is still on the forest floor, rearranged by fungi and weather.",
      question: "What does the rotting log best show about matter?",
      answers: [
        "Matter can change form but is still present in the ecosystem",
        "All matter in the log disappears forever",
        "Only energy exists after the log rots",
        "New matter appears from nothing in the soil",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — the log's material is transformed and spread, not erased from nature.",
        incorrect:
          "Matter does not vanish or spawn from nothing in everyday forest processes. It rearranges and moves.",
      },
      clarification: {
        text: "Later you will separate physical and chemical change — here the point is matter stays in the story of the forest.",
        visualAid:
          "Watch autumn leaves fall. They become part of the ground layer — matter relocated and reworked, not gone.",
      },
    },
  ],
};
