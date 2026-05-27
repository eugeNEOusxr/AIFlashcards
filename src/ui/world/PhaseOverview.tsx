import type { Domain, LearningNode } from "../../core/worldGraph/types";
import { PHASE_LABELS } from "../../core/worldGraph/types";

const DOMAIN_LABEL: Record<Domain, string> = {
  physics: "Physics",
  math: "Math",
  chemistry: "Chemistry",
};

type Props = {
  nodes: LearningNode[];
};

export function PhaseOverview({ nodes }: Props) {
  const domains = Array.from(new Set(nodes.map((n) => n.domain)));
  const byPhase = [0, 1, 2, 3, 4].map((phase) => ({
    phase: phase as 0 | 1 | 2 | 3 | 4,
    items: nodes.filter((n) => n.phase === phase),
  }));

  return (
    <aside className="lw-left">
      <h2 className="lw-left__title">Domains</h2>
      <ul className="lw-left__domains">
        {domains.map((d) => (
          <li key={d} className="lw-left__domain">
            {DOMAIN_LABEL[d]}
          </li>
        ))}
      </ul>

      <h2 className="lw-left__title">Phase progression</h2>
      <ol className="lw-left__phases">
        {byPhase.map(({ phase, items }) => (
          <li key={phase} className="lw-left__phase">
            <span className="lw-left__phase-label">
              P{phase} · {PHASE_LABELS[phase]}
            </span>
            <ul className="lw-left__nodes">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`lw-left__node${n.completed ? " lw-left__node--done" : ""}${n.unlocked && !n.completed ? " lw-left__node--open" : ""}${!n.unlocked ? " lw-left__node--locked" : ""}`}
                >
                  {n.title}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </aside>
  );
}
