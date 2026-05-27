import type { HistoryEntry } from "../../types/navigation";

type Props = {
  history: HistoryEntry[];
  onJump: (nodeId: string) => void;
};

export function HistoryGhost({ history, onJump }: Props) {
  const recent = history.slice(-6);

  if (recent.length === 0) return null;

  return (
    <div className="focal-history" aria-label="Thought trace">
      {recent.map((entry, i) => (
        <button
          key={`${entry.nodeId}-${entry.timestamp}-${i}`}
          type="button"
          className="focal-history__chip"
          onClick={() => onJump(entry.nodeId)}
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}
