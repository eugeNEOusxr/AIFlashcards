import { memo } from "react";
import {
  LessonVisualScene,
  type VisualReaction,
  type LessonVisualCoreTheme,
} from "./LessonVisualScene";
import type { SceneLayerPhase } from "./sceneLayers";

type Props = {
  coreTheme: LessonVisualCoreTheme;
  lessonId: string;
  anchorId: string | null;
  layerPhase: SceneLayerPhase;
  teachVisualEvents: string[];
  teachOverlayClasses: string[];
  questionDynamicMotifs: string[];
  questionOverlayClasses: string[];
  questionVisualEvents: string[];
  collisionOverlay?: boolean;
  reaction: VisualReaction;
  conceptTags: string[];
  tierClass: string;
  moodClass?: string;
};

/**
 * Persistent concept chamber — mounted for entire lesson session.
 * UI cards (teach / ask / feedback) are siblings; they do not replace this tree.
 */
export const ConceptVisualChamber = memo(function ConceptVisualChamber({
  coreTheme,
  lessonId,
  anchorId,
  layerPhase,
  teachVisualEvents,
  teachOverlayClasses,
  questionDynamicMotifs,
  questionOverlayClasses,
  questionVisualEvents,
  collisionOverlay = false,
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
        `concept-visual-chamber--layer-${layerPhase}`,
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
          layerPhase={layerPhase}
          teachVisualEvents={teachVisualEvents}
          teachOverlayClasses={teachOverlayClasses}
          questionDynamicMotifs={questionDynamicMotifs}
          questionOverlayClasses={questionOverlayClasses}
          questionVisualEvents={questionVisualEvents}
          collisionOverlay={collisionOverlay}
          reaction={reaction}
        />
      </div>
    </section>
  );
});
