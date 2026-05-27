import { useState } from "react";
import type { Domain } from "../../core/learningTypes";
import { INTENT_CHIPS } from "../../core/intentEngine";

type Props = {
  onComplete: (goal: string, why: string, domain?: Domain | "explore") => void;
};

export function IntentScreen({ onComplete }: Props) {
  const [goal, setGoal] = useState("");
  const [why, setWhy] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  const submit = (g: string, w: string, domain?: Domain | "explore") => {
    onComplete(g, w, domain);
  };

  const handleChip = (chip: (typeof INTENT_CHIPS)[0]) => {
    setGoal(chip.goal);
    setReply(`"${chip.goal}" — let's find your trajectory.`);
    setTimeout(() => submit(chip.goal, why || "Curiosity", chip.domain), 400);
  };

  const handleContinue = () => {
    if (!goal.trim()) return;
    submit(goal, why || "Personal growth");
  };

  return (
    <div className="gl-intent">
      <p className="gl-intent__greeting">What do you want to learn?</p>
      <p className="gl-intent__sub">Tell me your goal — I&apos;ll map structured paths, not random quizzes.</p>

      <textarea
        className="gl-input gl-input--large"
        placeholder="e.g. I want to understand physics…"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        rows={2}
      />

      <p className="gl-intent__why-label">Why does this matter to you?</p>
      <input
        className="gl-input"
        type="text"
        placeholder="Optional — motivation helps pacing"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
      />

      <div className="gl-chips">
        {INTENT_CHIPS.map((chip) => (
          <button key={chip.label} type="button" className="gl-chip" onClick={() => handleChip(chip)}>
            {chip.label}
          </button>
        ))}
      </div>

      {reply ? <p className="gl-intent__reply">{reply}</p> : null}

      <button type="button" className="gl-btn gl-btn--primary gl-btn--block" onClick={handleContinue} disabled={!goal.trim()}>
        See learning paths →
      </button>
    </div>
  );
}
