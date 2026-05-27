import { memo } from "react";
import { LessonVisualScene, type VisualReaction, type LessonVisualCoreTheme } from "./LessonVisualScene";

type Props = {
  coreTheme: LessonVisualCoreTheme;
  lessonId: string;
  anchorId: string | null;
  dynamicMotifs: string[];
  collisionOverlay?: boolean;
  overlayClasses?: string[];
  reaction: VisualReaction;
  conceptTags: string[];
  tierClass: string;
  moodClass?: string;
};

/**
 * Persistent concept chamber — mounted for entire lesson session.
 * UI modes (teach / ask / feedback / cognitive) must not replace this tree.
 */
export const ConceptVisualChamber = memo(function ConceptVisualChamber({
  coreTheme,
  lessonId,
  anchorId,
  dynamicMotifs,
  collisionOverlay = false,
  overlayClasses = [],
  reaction,
  conceptTags,
  tierClass,
  moodClass = "",
}: Props) {
  const label = conceptTags.slice(0, 3).join(" · ") || "Physics concept";

  return (
    <section
      className={[
        "concept-visual-chamber",
        tierClass,
        moodClass,
        `concept-visual-chamber--${reaction}`,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Concept visual focus zone"
    >
      <div className="concept-visual-chamber__frame neural-glass">
        <div className="concept-visual-chamber__spotlight" aria-hidden />
        <header className="concept-visual-chamber__head">
          <span className="concept-visual-chamber__kicker">Concept focus</span>
          <span className="concept-visual-chamber__tags">{label}</span>
        </header>
        <LessonVisualScene
          coreTheme={coreTheme}
          lessonId={lessonId}
          anchorId={anchorId}
          dynamicMotifs={dynamicMotifs}
          collisionOverlay={collisionOverlay}
          overlayClasses={overlayClasses}
          reaction={reaction}
          focusMode
        />
      </div>
    </section>
  );
});
