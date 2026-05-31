import { memo } from "react";
import { getQuestionBankStats } from "../../content/curriculum/questionBank";
import type { SubjectId } from "../../world/types";
import { SubjectTileVisual } from "../../components/subject-tiles/SubjectTileVisual";
import { useSubjectTileParallax } from "../../components/subject-tiles/useSubjectTileParallax";
import { CognitiveMindBadge } from "./CognitiveMindBadge";

export type SubjectEntitySlot = {
  left: string;
  top: string;
  /** Stacking order on canvas */
  z: number;
  /** Perspective depth in px (negative = farther, positive = nearer) */
  depthZ: number;
  scale: number;
  driftClass: string;
};

type Props = {
  subjectId: SubjectId;
  label: string;
  tagline: string;
  slot: SubjectEntitySlot;
  available: boolean;
  onEnter: () => void;
};

function SubjectWorldEntityInner({
  subjectId,
  label,
  tagline,
  slot,
  available,
  onEnter,
}: Props) {
  const { ref, setVisualRef, onPointerMove, onPointerLeave } = useSubjectTileParallax(available);
  const questionBank =
    available && (subjectId === "physics" || subjectId === "chemistry")
      ? getQuestionBankStats(subjectId)
      : null;

  return (
    <div
      className={[
        "world-entity",
        "world-entity--mounted",
        `world-entity--${subjectId}`,
        slot.driftClass,
        available ? "world-entity--live" : "world-entity--dormant",
      ].join(" ")}
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.z,
        ["--entity-scale" as string]: String(slot.scale),
        ["--entity-depth-z" as string]: `${slot.depthZ}px`,
      }}
    >
      <button
        ref={ref}
        type="button"
        className="world-entity__hit"
        disabled={!available}
        onClick={onEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-label={available ? `Enter ${label}` : `${label} — coming soon`}
      >
        <span className="world-entity__shadow" aria-hidden />
        <span className="world-entity__glow" aria-hidden />
        <span className="world-entity__motion" aria-hidden />

        <span ref={setVisualRef} className="world-entity__visual">
          <SubjectTileVisual subjectId={subjectId} />
        </span>

        {questionBank ? (
          <span className="world-entity__mind-badge">
            <CognitiveMindBadge stats={questionBank} size="sm" />
          </span>
        ) : null}

        <span className="world-entity__label-wrap">
          <span className="world-entity__label">{label}</span>
          <span className="world-entity__tagline">{available ? tagline : "Coming soon"}</span>
        </span>
      </button>
    </div>
  );
}

export const SubjectWorldEntity = memo(SubjectWorldEntityInner);
