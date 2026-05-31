import type { LearningModule } from "../types";

/** Cells in living nature — basics only; one micro-concept per frame. */
export const CELLS_MODULE: LearningModule = {
  id: "biology.cells",
  title: "Cells & Life",
  subtitle: "Tiny units of living things",
  pathwayId: "living-biology",
  frames: [
    {
      id: "cells.01",
      conceptTag: "cells-unit-of-life",
      title: "Unit of life",
      fact: "The cell is the basic unit of all living things.",
      visualAid:
        "Zoom in on a drop of pond water. Tiny oval creatures swim — each one is made of one or many cells.",
      question: "What is the basic unit of life?",
      answers: ["The cell", "A single atom", "A rock layer", "Sunlight alone"],
      correctIndex: 0,
      feedback: {
        correct: "Yes — every living organism is built from cells.",
        incorrect: "Life is organized in cells, not single atoms, rocks, or sunlight by itself.",
      },
      clarification: {
        text: "Some organisms are one cell; others like trees and you are made of trillions of cells working together.",
        visualAid:
          "Moss on a damp log looks like a soft green carpet. Under a microscope, each patch is made of many plant cells.",
      },
    },
    {
      id: "cells.02",
      conceptTag: "cells-in-nature",
      title: "Cells everywhere in nature",
      fact: "From mushrooms to maple leaves, living things are made of cells.",
      visualAid:
        "A forest has birds in the canopy, fungi on the ground, and fish in a stream — all are built from cells.",
      question: "Which statement is true about cells in nature?",
      answers: [
        "All living things are made of cells",
        "Only animals have cells",
        "Only visible creatures have cells",
        "Cells exist only in laboratories",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Right — plants, fungi, animals, and many microbes are all cellular.",
        incorrect: "Cells are not limited to animals, big creatures, or labs. Life in nature is cellular.",
      },
      clarification: {
        text: "You cannot see most cells without tools, but they are still the foundation of life outdoors.",
        visualAid:
          "Lichen on a boulder looks like paint. It is a partnership of fungus and alga cells living together.",
      },
    },
    {
      id: "cells.03",
      conceptTag: "cells-plant-animal",
      title: "Plant and animal cells",
      fact: "Plant and animal cells share a core design but differ in some parts.",
      visualAid:
        "A sunflower turns toward the sun using plant cells with stiff walls. A squirrel nearby has animal cells without those walls.",
      question: "How do plant and animal cells mainly differ?",
      answers: [
        "Plant cells often have a rigid cell wall; animal cells do not",
        "Animal cells have cell walls; plant cells do not",
        "Only plant cells contain water",
        "Only animal cells use energy",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Correct — the cell wall is a key plant feature for support.",
        incorrect: "Both need water and energy. The wall is the classic difference, and it belongs to plants.",
      },
      clarification: {
        text: "Both cell types have membranes and many of the same inner parts — the wall is the familiar outdoor clue for plants.",
        visualAid:
          "Chew a crisp apple. The crunch comes partly from plant cell walls holding firm structure.",
      },
    },
    {
      id: "cells.04",
      conceptTag: "cells-microscopic",
      title: "Too small to see",
      fact: "Most cells are far too small to see without magnification.",
      visualAid:
        "A biologist scoops pond water and places a slide under a microscope. Suddenly moving cells appear that were invisible before.",
      question: "Why do we use microscopes to study many cells?",
      answers: [
        "Because most cells are microscopic",
        "Because cells are always the size of a fist",
        "Because cells glow only under microscopes",
        "Because cells do not exist until we invent tools",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Exactly — size is why tools reveal the hidden living world.",
        incorrect: "Cells are real in nature before we look. They are usually tiny, not fist-sized or tool-created.",
      },
      clarification: {
        text: "Your skin, leaf pores, and soil bacteria all involve cells you need help to see clearly.",
        visualAid:
          "Pollen grains on a flower are small but visible. Individual plant cells inside the pollen are still smaller.",
      },
    },
  ],
};
