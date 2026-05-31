import type { ReinforcementCard } from "../cognitive/types";

type Props = {
  cards: ReinforcementCard[];
};

export function ReinforcementPanel({ cards }: Props) {
  const due = cards.slice(-6).reverse();

  return (
    <div className="reinforcement-panel">
      <h3>Reinforcement queue</h3>
      <p className="reinforcement-panel__meta">{cards.length} concept{cards.length === 1 ? "" : "s"} saved for review</p>
      {due.length === 0 ? (
        <p className="reinforcement-panel__empty">Signals will populate flashcards when you miss questions or mark confusion.</p>
      ) : (
        <ul className="reinforcement-panel__list">
          {due.map((c) => (
            <li key={c.id} className={`reinforcement-panel__card reinforcement-panel__card--${c.source}`}>
              <span className="reinforcement-panel__source">{c.source.replace("_", " ")}</span>
              <p className="reinforcement-panel__front">{c.front}</p>
              <p className="reinforcement-panel__back">{c.back}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
