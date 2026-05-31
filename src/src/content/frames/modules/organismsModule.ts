import type { LearningModule } from "../types";

/** Living organisms in nature — one idea per frame. */
export const ORGANISMS_MODULE: LearningModule = {
  id: "biology.organisms",
  title: "Living Organisms",
  subtitle: "What makes life alive outdoors",
  pathwayId: "living-biology",
  frames: [
    {
      id: "organisms.01",
      conceptTag: "organisms-living-traits",
      title: "Signs of life",
      fact: "Living things grow, respond, reproduce, and use energy.",
      visualAid:
        "A seedling bends toward light from a crack in the sidewalk. It grows, responds, and uses energy from the sun.",
      question: "Which is a sign that something is alive?",
      answers: [
        "It grows and responds to its environment",
        "It stays exactly the same forever",
        "It never uses energy",
        "It cannot reproduce in any way",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — growth and response are classic signs of life.",
        incorrect: "Living things change, use energy, and can reproduce. A static, energy-free object is not alive.",
      },
      clarification: {
        text: "Rocks, clouds, and fire may change, but they are not alive the way a plant or animal is.",
        visualAid:
          "A Venus flytrap snaps shut on an insect. That quick response is a strong clue of life.",
      },
    },
    {
      id: "organisms.02",
      conceptTag: "organisms-needs",
      title: "What life needs",
      fact: "Organisms need water, energy, and suitable conditions to survive.",
      visualAid:
        "Desert cacti store water in thick stems. Polar bears have insulation. Each organism meets needs in its own habitat.",
      question: "What do all organisms need to stay alive?",
      answers: [
        "Water and a source of energy",
        "Only television signals",
        "Zero interaction with the environment",
        "To avoid all other species forever",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Right — water and energy are core needs across habitats.",
        incorrect: "Organisms interact with the world and need water and energy, not isolation from everything.",
      },
      clarification: {
        text: "Energy may come from food or sunlight depending on the organism, but energy is always required.",
        visualAid:
          "A hummingbird sips nectar for energy. A fern uses sunlight. Different sources, same need.",
      },
    },
    {
      id: "organisms.03",
      conceptTag: "organisms-habitat",
      title: "Habitats",
      fact: "A habitat is where an organism lives and finds what it needs.",
      visualAid:
        "A heron stands in a marsh. The shallow water, plants, and fish together form the heron's habitat.",
      question: "What is a habitat?",
      answers: [
        "The place where an organism lives and gets resources",
        "Only the inside of a single cell",
        "A type of microscope",
        "The name of one species only",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — habitat is the living place plus what the organism needs there.",
        incorrect: "Habitat is about environment and resources, not cells alone, tools, or one species label.",
      },
      clarification: {
        text: "Change the habitat — too dry, too cold, or no food — and many organisms cannot survive there.",
        visualAid:
          "Coral reef, alpine meadow, and city park are all habitats for different communities of life.",
      },
    },
    {
      id: "organisms.04",
      conceptTag: "organisms-food-chain",
      title: "Food chains",
      fact: "Energy moves through ecosystems in food chains.",
      visualAid:
        "Grass captures sunlight. A rabbit eats grass. A fox may eat the rabbit. Energy passed step by step.",
      question: "In a simple meadow food chain, grass is usually —",
      answers: [
        "a producer that makes food from sunlight",
        "a top predator with no predators",
        "not part of the chain at all",
        "only dead matter with no cells",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Correct — plants are producers at the base of many chains.",
        incorrect: "Grass is living plant tissue and typically starts the chain by capturing sun energy.",
      },
      clarification: {
        text: "Consumers eat other organisms. Decomposers recycle nutrients when life ends.",
        visualAid:
          "Algae in a stream feed small animals, which feed larger fish — another chain in water.",
      },
    },
    {
      id: "organisms.05",
      conceptTag: "organisms-biodiversity",
      title: "Many kinds of life",
      fact: "Biodiversity means many different species living in an area.",
      visualAid:
        "A rainforest dawn chorus mixes insect, bird, and frog sounds. Hundreds of species share one complex habitat.",
      question: "Why is biodiversity important in nature?",
      answers: [
        "Many species make ecosystems more stable and resilient",
        "Only one species should exist everywhere",
        "Biodiversity means no organisms need water",
        "Different species always destroy each other completely",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — variety helps ecosystems handle change and loss.",
        incorrect: "Nature relies on many species, water, and interactions — not a single species or total destruction.",
      },
      clarification: {
        text: "Protecting habitats protects biodiversity — the web of life people depend on too.",
        visualAid:
          "A tide pool holds seaweed, snails, crabs, and fish — a small showcase of biodiversity.",
      },
    },
  ],
};
