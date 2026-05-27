import { getChapterForPathway } from "../../content/chapterRegistry";
import { lessonLabel } from "../lessonLabels";
import type { PathwayId } from "../../world/types";

type Props = {
  pathwayId: PathwayId;
  maxUnlocked: number;
  onSelectLesson: (index: number) => void;
  onClose: () => void;
};

export function PathwayLessonReplay({ pathwayId, maxUnlocked, onSelectLesson, onClose }: Props) {
  const lessons = getChapterForPathway(pathwayId);
  if (lessons.length <= 1) return null;

  return (
    <div className="pathway-replay" role="dialog" aria-label="Choose a lesson to replay">
      <div className="pathway-replay__backdrop" onClick={onClose} aria-hidden />
      <div className="pathway-replay__panel">
        <p className="pathway-replay__title">Replay a lesson</p>
        <p className="pathway-replay__hint">Progress is saved — you can revisit any unlocked module.</p>
        <ul className="pathway-replay__list">
          {lessons.map((lesson, index) => {
            const unlocked = index <= maxUnlocked;
            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  className="pathway-replay__item"
                  disabled={!unlocked}
                  onClick={() => {
                    onSelectLesson(index);
                    onClose();
                  }}
                >
                  <span className="pathway-replay__item-title">{lessonLabel(lesson.title)}</span>
                  {!unlocked ? <span className="pathway-replay__lock">Locked</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="pathway-replay__close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
