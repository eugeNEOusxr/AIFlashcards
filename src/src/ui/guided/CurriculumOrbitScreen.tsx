import type { CurriculumTopic, LearningIntent } from "../../core/learningTypes";
import { difficultyLabel } from "../../core/curriculumEngine";
import { DOMAIN_LABELS } from "../../core/curriculumData";
import { intentResponseMessage } from "../../core/intentEngine";

type Props = {
  intent: LearningIntent;
  paths: CurriculumTopic[];
  onSelect: (topic: CurriculumTopic) => void;
  onBack: () => void;
};

export function CurriculumOrbitScreen({ intent, paths, onSelect, onBack }: Props) {
  return (
    <div className="gl-curriculum">
      <button type="button" className="gl-btn gl-btn--ghost" onClick={onBack}>
        ← Refine intent
      </button>

      <p className="gl-curriculum__message">{intentResponseMessage(intent)}</p>

      <div className="gl-orbit-grid">
        {paths.map((topic, i) => (
          <button
            key={topic.id}
            type="button"
            className="gl-path-node"
            style={{ ["--node-i" as string]: String(i) }}
            onClick={() => onSelect(topic)}
          >
            <span className="gl-path-node__domain">{DOMAIN_LABELS[topic.domain]}</span>
            <span className="gl-path-node__title">{topic.title}</span>
            <span className="gl-path-node__desc">{topic.description}</span>
            <div className="gl-path-node__meta">
              <span>{difficultyLabel(topic.difficulty)}</span>
              <span>~{topic.estimatedWeeks} wk</span>
              <span className="gl-path-node__fit">{Math.round(topic.fitScore * 100)}% fit</span>
            </div>
            {topic.prerequisites.length > 0 ? (
              <span className="gl-path-node__pre">Prereq chain</span>
            ) : null}
          </button>
        ))}
      </div>

      <p className="gl-hint">Choose your trajectory — questions begin after you commit to a path.</p>
    </div>
  );
}
