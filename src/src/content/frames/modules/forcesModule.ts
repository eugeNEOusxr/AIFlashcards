import type { LearningModule } from "../types";

/**
 * Forces zone — one idea per frame; each question tests only that frame's fact + scene.
 */
export const FORCES_MODULE: LearningModule = {
  id: "physics.forces",
  title: "Forces",
  subtitle: "Contact, fields, and net force",
  pathwayId: "motion-forces",
  frames: [
    {
      id: "forces.01",
      conceptTag: "forces-contact",
      title: "Contact forces",
      fact: "A contact force happens when objects touch.",
      visualAid:
        "Picture a book resting on a table. The book presses down on the table, and the table pushes up on the book. The two surfaces stay in contact.",
      question: "Why is the table pushing up on the book a contact force?",
      answers: [
        "Because the book and table surfaces are touching",
        "Because the book is heavy",
        "Because the book is not moving",
        "Because light shines on the table",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — touching surfaces is what makes it a contact force.",
        incorrect:
          "Weight, staying still, and light on the table are not the definition. Contact force means the objects touch.",
      },
      clarification: {
        text: "If you lift the book off the table, the table stops pushing up. No touch, no contact force from the table.",
        visualAid:
          "Imagine sliding the book across the table with your hand. Your hand, the book, and the table all touch — those pushes are contact forces too.",
      },
    },
    {
      id: "forces.02",
      conceptTag: "forces-at-distance",
      title: "Forces without contact",
      fact: "Some forces act through space without objects touching.",
      visualAid:
        "Hold a magnet under a wooden table. A paper clip on top moves toward the magnet even though the magnet never touches the clip.",
      question: "What does the moving paper clip show in this setup?",
      answers: [
        "A force can act without the magnet touching the clip",
        "The clip must be glued to the table",
        "The table pushes the clip sideways by contact",
        "The clip moves only when someone blows on it",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Right — the clip moves from a pull through space, not from touching the magnet.",
        incorrect:
          "Glue, the table pushing by contact, or blowing are not what the magnet demo shows. The clip moves without contact with the magnet.",
      },
      clarification: {
        text: "Magnetic pull is one example. Earth pulling a falling object is another — the object does not have to touch the ground mid-fall.",
        visualAid:
          "Drop a pencil from above the desk. It falls before it hits anything — a pull through space is acting on it.",
      },
    },
    {
      id: "forces.03",
      conceptTag: "forces-net",
      title: "Net force",
      fact: "Net force is the combined effect of all forces on one object.",
      visualAid:
        "Two friends push the same box from opposite sides. One pushes toward the door, one pushes toward the window. The box sits still until one push becomes stronger.",
      question: "In this box example, what does net force tell you?",
      answers: [
        "Which direction the pushes add up to overall",
        "The color painted on the box",
        "How many stickers are on the box",
        "The name of the room the box is in",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Exactly — net force is the overall push after both friends are counted together.",
        incorrect:
          "Net force is about combined pushes on the box, not color, stickers, or the room name.",
      },
      clarification: {
        text: "Equal opposite pushes can cancel to zero net force — the box stays put. A stronger push on one side gives a net force that way.",
        visualAid:
          "Picture tug-of-war: two teams pull opposite ways. The rope moves toward whichever side pulls harder overall — that winning direction is the net force.",
      },
    },
    {
      id: "forces.04",
      conceptTag: "forces-balanced",
      title: "Balanced forces",
      fact: "Balanced forces have a net force of zero.",
      visualAid:
        "A picture frame hangs on a wall. A hook pulls upward on the frame with the same strength as the downward pull on the frame, so the frame does not rise or fall.",
      question: "Why does the hanging frame stay in one place?",
      answers: [
        "The upward pull and downward pull cancel to zero net force",
        "The frame has no mass",
        "No forces act on the frame",
        "The wall stops all motion forever by itself",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Yes — matched upward and downward pulls mean balanced forces and zero net force.",
        incorrect:
          "The frame has mass and forces do act on it. It stays put because those forces balance, not because the wall magically blocks motion.",
      },
      clarification: {
        text: "Balanced forces do not have to mean stillness in every case, but here equal opposite pulls explain why the frame hangs without moving.",
        visualAid:
          "A book on a shelf stays put for a similar reason: support upward and pull downward balance so the book does not fall or float.",
      },
    },
    {
      id: "forces.05",
      conceptTag: "forces-unbalanced",
      title: "Unbalanced forces",
      fact: "Unbalanced forces change how an object moves.",
      visualAid:
        "A soccer ball rests on grass. The goalie kicks it. The kick is stronger than the grass friction for a moment, and the ball rolls faster across the field.",
      question: "Why does the ball start rolling faster right after the kick?",
      answers: [
        "The kick is stronger than friction, so net force is not zero",
        "Forces on the ball are perfectly balanced",
        "Friction and the kick cancel to zero",
        "The ball has no forces on it during the kick",
      ],
      correctIndex: 0,
      feedback: {
        correct: "Right — a stronger kick than friction means unbalanced forces, so motion changes.",
        incorrect:
          "Balanced or zero net force would not speed the ball up. The ball has forces on it; the kick winning over friction changes its motion.",
      },
      clarification: {
        text: "Slowing down, stopping, and turning are also signs of unbalanced forces — whenever motion changes, net force was not zero.",
        visualAid:
          "A cyclist squeezes the brakes: friction and brake force beat the forward push, so the bike slows — another unbalanced-force change in motion.",
      },
    },
  ],
};
