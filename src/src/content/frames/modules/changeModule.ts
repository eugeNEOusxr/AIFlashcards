import type { LearningModule } from "../types";

/** Physical and chemical change in nature — one idea per frame. */
export const CHANGE_MODULE: LearningModule = {
  id: "chemistry.change",
  title: "Change in Nature",
  subtitle: "How substances transform outdoors",
  pathwayId: "nature-chemistry",
  frames: [
    {
      id: "change.01",
      conceptTag: "change-physical-nature",
      title: "Physical change",
      fact: "A physical change alters form or state but not what substance it is.",
      visualAid:
        "A glacier calves into the ocean. Chunks of ice float away — still water, just broken and melted into new shapes.",
      question: "Ice melting into a mountain stream is mainly a —",
      answers: [
        "physical change",
        "chemical change that makes a new element",
        "change where matter is destroyed",
        "change that only happens in factories",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Correct — it is still water, only liquid instead of solid.",
        incorrect:
          "Melting is not destroying matter, making new elements, or factory-only. The substance is still H₂O.",
      },
      clarification: {
        text: "Crushing, folding, freezing, and boiling in nature are usually physical when the same substance remains.",
        visualAid:
          "Sea spray freezes on a pier railing into delicate ice feathers — same water substance, new shape and state.",
      },
    },
    {
      id: "change.02",
      conceptTag: "change-chemical-nature",
      title: "Chemical change",
      fact: "A chemical change forms at least one new substance.",
      visualAid:
        "An iron gate by the coast turns orange-red. The metal reacts with damp air to make rust — a new substance on the surface.",
      question: "Rust forming on a seaside fence is a sign of —",
      answers: [
        "chemical change",
        "only physical scratching",
        "matter leaving the universe",
        "change with no new substances",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — rust is a new substance compared with the original iron metal.",
        incorrect:
          "Rust is not mere scratching, vanishing matter, or staying the same substance. A new material formed.",
      },
      clarification: {
        text: "Burning wood to ash, baking limestone caves from acid rain effects, and digestion in animals are chemical stories in nature.",
        visualAid:
          "Strike flint for a campfire. Wood becomes ash and gases — new substances you can smell and see.",
      },
    },
    {
      id: "change.03",
      conceptTag: "change-signs-nature",
      title: "Clues outdoors",
      fact: "Nature often hints at chemical change with color change, gas bubbles, or temperature shifts.",
      visualAid:
        "In a tidal pool, limestone fizzes when a bit of acidic runoff drips in — bubbles of gas rise quickly.",
      question: "Bubbles rising when acid meets limestone suggest —",
      answers: [
        "a chemical change is producing a new gas",
        "only physical stirring of water",
        "that matter stopped existing",
        "that color always stays the same in chemistry",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Right — gas formation is a common clue that a new substance appeared.",
        incorrect:
          "Bubbles here come from reaction, not just stirring. Matter still exists, and color can change in chemical change.",
      },
      clarification: {
        text: "Not every bubble is chemical (boiling water is physical), but fizz with acid and rock is a strong chemical clue.",
        visualAid:
          "Cut an apple and leave it brown. Color change in the flesh is a familiar sign of chemical change in air.",
      },
    },
    {
      id: "change.04",
      conceptTag: "change-photosynthesis-nature",
      title: "Life doing chemistry",
      fact: "Plants use sunlight to rearrange matter into food — a chemical change powered by nature.",
      visualAid:
        "Sunlight hits a meadow of grass. Inside each blade, carbon dioxide and water are rebuilt into sugars the plant uses.",
      question: "Grass making sugar from sunlight, water, and air is —",
      answers: [
        "chemical change inside the plant",
        "only physical bending toward the sun",
        "not a change at all",
        "destruction of all matter in the leaf",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — photosynthesis builds new substances (sugars) from simpler ones.",
        incorrect:
          "Turning toward light is physical, but food-making is chemical. Matter is rearranged, not destroyed.",
      },
      clarification: {
        text: "Animals later eat those sugars — chemistry connects plants, food webs, and the air we breathe.",
        visualAid:
          "A caterpillar chewing a leaf converts plant matter into body growth — chemistry moving through the ecosystem.",
      },
    },
    {
      id: "change.05",
      conceptTag: "change-atoms-rearrange",
      title: "Atoms rearrange",
      fact: "In chemical change, atoms link differently — the same atoms, new arrangements.",
      visualAid:
        "Lightning heats forest air. Nitrogen and oxygen in the air briefly combine into new molecules before spreading apart again.",
      question: "What stays the same during a chemical change in nature?",
      answers: [
        "The same atoms — only how they are grouped changes",
        "Every atom is destroyed and replaced",
        "Only the color of the sky, not the atoms",
        "Nothing stays the same; matter ends",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Exactly — atoms rearrange; they are not erased in everyday natural chemistry.",
        incorrect:
          "Atoms are not destroyed. Color can change, but the deeper truth is rearrangement of the same atomic building blocks.",
      },
      clarification: {
        text: "This is why matter conservation and chemical change work together in forests, oceans, and skies.",
        visualAid:
          "A compost heap steams on a cool morning. Old leaves become new molecules in soil — atoms regrouped, not vanished.",
      },
    },
  ],
};
