import type { LearningNode, NodeQuestion } from "../../core/worldGraph/types";
import { PHASE_LABELS } from "../../core/worldGraph/types";
import { AnswerInput } from "../question/AnswerInput";

type Props = {
  node: LearningNode | null;
  question: NodeQuestion | null;
  questionIndex: number;
  questionTotal: number;
  onSubmit: (answer: string) => void;
};

export function NodeDetailPanel({ node, question, questionIndex, questionTotal, onSubmit }: Props) {
  if (!node) {
    return (
      <aside className="lw-right">
        <p className="lw-right__empty">Select an unlocked node on the map.</p>
      </aside>
    );
  }

  return (
    <aside className="lw-right">
      <span className="lw-right__badge">
        Phase {node.phase} · {PHASE_LABELS[node.phase]}
      </span>
      <h2 className="lw-right__title">{node.title}</h2>
      <p className="lw-right__desc">{node.description}</p>
      <p className="lw-right__meta">
        Difficulty {node.difficulty}/4 · {node.completed ? "Completed" : node.unlocked ? "In progress" : "Locked"}
      </p>

      {!node.completed && question ? (
        <>
          <div className="lw-right__qblock">
            <span className="lw-right__qstep">
              Question {questionIndex + 1} / {questionTotal}
            </span>
            <p className="lw-right__prompt">{question.prompt}</p>
          </div>
          <AnswerInput onSubmit={onSubmit} />
        </>
      ) : node.completed ? (
        <p className="lw-right__done">All questions for this node are complete. Deeper nodes may now unlock.</p>
      ) : (
        <p className="lw-right__empty">No questions configured for this node.</p>
      )}
    </aside>
  );
}
