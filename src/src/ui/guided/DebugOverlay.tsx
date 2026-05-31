import type { DebugSnapshot } from "../../core/learningTypes";

type Props = {
  open: boolean;
  onToggle: () => void;
  debug: DebugSnapshot;
};

export function DebugOverlay({ open, onToggle, debug }: Props) {
  return (
    <>
      <button type="button" className="gl-debug-toggle" onClick={onToggle} aria-expanded={open}>
        {open ? "Hide" : "Cognition"} console
      </button>

      {open ? (
        <aside className="gl-debug" aria-label="System debug layer">
          <h3 className="gl-debug__title">Cognition console</h3>

          <section className="gl-debug__section">
            <h4>Stage</h4>
            <code>{debug.stage}</code>
          </section>

          {debug.intent ? (
            <section className="gl-debug__section">
              <h4>Intent</h4>
              <p>Goal: {debug.intent.goalText}</p>
              <p>Why: {debug.intent.whyText}</p>
              <p>Domain: {debug.intent.domain}</p>
            </section>
          ) : null}

          {debug.selectedTopic ? (
            <section className="gl-debug__section">
              <h4>Curriculum path</h4>
              <p>{debug.selectedTopic.title}</p>
              <p>Difficulty: {debug.selectedTopic.difficulty}</p>
              <p>Fit: {Math.round(debug.selectedTopic.fitScore * 100)}%</p>
            </section>
          ) : null}

          {debug.pathChain.length > 0 ? (
            <section className="gl-debug__section">
              <h4>Prerequisite chain</h4>
              <p>{debug.pathChain.join(" → ")}</p>
            </section>
          ) : null}

          {debug.session ? (
            <section className="gl-debug__section">
              <h4>Session</h4>
              <p>Phase: {debug.session.phase}</p>
              <p>Diagnostic count: {debug.session.diagnosticCount}</p>
              <p>Difficulty: {debug.session.currentDifficulty}</p>
              <p>Streak (good): {debug.session.streakGood}</p>
            </section>
          ) : null}

          <section className="gl-debug__section">
            <h4>Why this question?</h4>
            <p className="gl-debug__reason">{debug.lastReason}</p>
          </section>

          {debug.masteryList.length > 0 ? (
            <section className="gl-debug__section">
              <h4>Mastery graph</h4>
              <ul className="gl-debug__mastery">
                {debug.masteryList.map((m) => (
                  <li key={m.topicId}>
                    <span>{m.topicId}</span>
                    <span>{Math.round(m.score * 100)}%</span>
                    <span>({m.attempts} attempts)</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      ) : null}
    </>
  );
}
