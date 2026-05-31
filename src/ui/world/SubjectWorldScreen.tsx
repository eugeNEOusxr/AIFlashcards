import { getSubjectProfile } from "../../world/subjectProfiles";
import { subjects } from "../../world/subjectWorld";
import type { NavScreen, SubjectId } from "../../world/types";
import { resetAllProgress } from "../../memory/resetProgress";
import { WorldEnvironmentField } from "./WorldEnvironmentField";
import { SubjectWorldEntity, type SubjectEntitySlot } from "./SubjectWorldEntity";
import { MapLayerNav } from "./MapLayerNav";

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

function homeTagline(subjectId: SubjectId): string {
  if (subjectId === "biology") return "Growth · cells · living networks";
  return getSubjectProfile(subjectId).homeTagline;
}

type Props = {
  onEnterSubject: (subjectId: SubjectId) => void;
  onNavigate?: (screen: NavScreen) => void;
};

export function SubjectWorldScreen({ onEnterSubject, onNavigate }: Props) {
  const handleResetProgress = () => {
    if (
      !window.confirm(
        "Reset all local progress? This clears lesson history and unlocks. Use only if something feels stuck."
      )
    ) {
      return;
    }
    resetAllProgress();
    window.location.reload();
  };

  return (
    <section className="subject-world" aria-label="Knowledge worlds">
      <WorldEnvironmentField />

      {/* Foreground layer — scrolls independently over the living background */}
      <div className="subject-world__scroll" role="region" aria-label="Subject zones">
        {onNavigate ? (
          <div className="subject-world__nav">
            <MapLayerNav screen={{ kind: "HOME" }} onNavigate={onNavigate} moodLabel="Knowledge space" />
          </div>
        ) : null}

        <header className="subject-world__header">
          <p className="subject-world__kicker">Knowledge space</p>
          <h2 className="subject-world__title">Choose your atmospheric zone</h2>
          <p className="subject-world__lead">
            Hover a zone to feel its field — enter the cognitive mind map and lessons.
          </p>
        </header>

        <div className="subject-world__canvas">
          {subjects.map((s) => (
            <SubjectWorldEntity
              key={s.id}
              subjectId={s.id as SubjectId}
              label={s.label}
              tagline={homeTagline(s.id as SubjectId)}
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
      </div>
    </section>
  );
}
