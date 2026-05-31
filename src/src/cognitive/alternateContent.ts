/** Alternate explanations — shown on "confusing" / "repeat differently" (no AI API yet). */

export type AlternatePack = {
  simpler: string;
  analogy: string;
  visualHint: string;
};

const PACKS: Record<string, AlternatePack> = {
  "lesson-1-force": {
    simpler:
      "Force is what we conclude when something starts moving, stops, or changes direction. You do not see force directly — you see the change it causes.",
    analogy:
      "Think of force like an invisible hand: when the hand pushes, the object moves. No push, no change (unless something else is pushing).",
    visualHint: "Watch the glowing ball in the chamber — motion streaks appear only when interaction happens.",
  },
  "lesson-2-contact-noncontact": {
    simpler:
      "If objects must touch, it is a contact force. If it works at a distance (gravity, magnets), it is non-contact.",
    analogy:
      "Contact force is a handshake. Non-contact force is two magnets pulling through air.",
    visualHint: "The field lines in the scene separate touch forces from distance forces.",
  },
  "lesson-3-first-law": {
    simpler:
      "Objects keep doing what they are already doing unless a net force changes them. Rest stays rest; motion stays motion.",
    analogy:
      "A puck on ice keeps gliding until friction or a hit changes it — not because motion 'runs out'.",
    visualHint: "Follow the motion trail — it stays straight until an external push appears.",
  },
  "lesson-4-second-law": {
    simpler:
      "Same push on a lighter object produces more acceleration. Heavier objects need more force for the same change.",
    analogy:
      "Pushing an empty cart vs a loaded cart with the same effort — the empty one jumps forward faster.",
    visualHint: "Compare the light and heavy carts in the scene — streak length differs.",
  },
  "lesson-5-applications": {
    simpler:
      "Real life uses the same rules: braking applies opposite force, throwing applies force through contact, carts need more force when loaded.",
    analogy:
      "Everyday motion is the chapter's equations wearing different costumes.",
    visualHint: "Trace force arrows on the cart and ball motifs in the chamber.",
  },
};

export function getAlternatePack(lessonId: string): AlternatePack {
  return (
    PACKS[lessonId] ?? {
      simpler: "Break the idea into cause and effect: what changed, and what interaction could explain it?",
      analogy: "Imagine the concept as a story with a before and after.",
      visualHint: "Use the chamber motifs as anchors while you re-read the key idea.",
    }
  );
}
