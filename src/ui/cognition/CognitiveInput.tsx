import { useState, type FormEvent } from "react";
import { addLearningEvent } from "../../core/cognition/cognitiveStore";
import type { LearningEventType } from "../../core/cognition/learningTypes";

const TYPES: LearningEventType[] = ["question", "confusion", "insight", "reflection"];

function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `ce_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function CognitiveInput() {
  const [concept, setConcept] = useState("");
  const [type, setType] = useState<LearningEventType>("reflection");
  const [text, setText] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const c = concept.trim();
    const t = text.trim();
    if (!c || !t) return;

    addLearningEvent({
      id: newEventId(),
      concept: c,
      type,
      text: t,
      timestamp: Date.now(),
    });

    setText("");
  };

  return (
    <form className="cls-cog-input" onSubmit={onSubmit}>
      <label className="cls-cog-input__label">
        Concept
        <input
          className="cls-cog-input__field"
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g. neural elasticity"
        />
      </label>
      <label className="cls-cog-input__label">
        Type
        <select className="cls-cog-input__field" value={type} onChange={(e) => setType(e.target.value as LearningEventType)}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="cls-cog-input__label">
        Thought
        <textarea
          className="cls-cog-input__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="What are you thinking?"
        />
      </label>
      <button type="submit" className="cls-cog-input__btn">
        Store Thought
      </button>
    </form>
  );
}
