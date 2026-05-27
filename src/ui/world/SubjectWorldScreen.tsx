import { subjects } from "../../world/physicsWorld";
import type { SubjectId } from "../../world/types";
import { resetAllLearningProgress } from "../../memory/memoryStore";
import { WorldEnvironmentField } from "./WorldEnvironmentField";
import { SubjectWorldEntity, type SubjectEntitySlot } from "./SubjectWorldEntity";

const ENTITY_SLOTS: Record<SubjectId, SubjectEntitySlot> = {
  physics: {
    left: "14%",
    top: "38%",
    z: 30,
    depthZ: 72,
    scale: 1.08,
    driftClass: "world-entity--drift-a",
  },
  chemistry: {
    left: "50%",
    top: "22%",
    z: 18,
    depthZ: -48,
    scale: 0.92,
    driftClass: "world-entity--drift-b",
  },
  biology: {
    left: "78%",
    top: "44%",
    z: 24,
    depthZ: 28,
    scale: 1,
    driftClass: "world-entity--drift-c",
  },
};

const TAGLINES: Record<SubjectId, string> = {
  physics: "Motion · forces · energy flow",
  chemistry: "Transformation · structure · reaction",
  biology: "Growth · cells · living networks",
};

type Props = {
  onEnterSubject: (subjectId: SubjectId) => void;
};

export function SubjectWorldScreen({ onEnterSubject }: Props) {
  const handleResetProgress = () => {
    if (
      !window.confirm(
        "Reset all local progress? This clears lesson history and unlocks. Use only if something feels stuck."
      )
    ) {
      return;
    }
    resetAllLearningProgress();
    window.location.reload();
  };

  return (
    <section className="subject-world" aria-label="Knowledge worlds">
      <WorldEnvironmentField />

      <header className="subject-world__header">
        <p className="subject-world__kicker">Knowledge space</p>
        <h2 className="subject-world__title">Choose your atmospheric zone</h2>
        <p className="subject-world__lead">
          Hover a zone to feel its field — enter to open the progression map and lessons.
        </p>
      </header>

      <div className="subject-world__canvas">
        {subjects.map((s) => (
          <SubjectWorldEntity
            key={s.id}
            subjectId={s.id as SubjectId}
            label={s.label}
            tagline={TAGLINES[s.id as SubjectId]}
            slot={ENTITY_SLOTS[s.id as SubjectId]}
            available={s.available}
            onEnter={() => {
              if (s.available) onEnterSubject(s.id as SubjectId);
            }}
          />
        ))}
      </div>

      <footer className="subject-world__footer">
        <button
          type="button"
          className="subject-world__utility subject-world__utility--muted"
          onClick={handleResetProgress}
        >
          Reset progress
        </button>
      </footer>
    </section>
  );
}
