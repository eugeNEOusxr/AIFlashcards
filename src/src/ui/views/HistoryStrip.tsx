import type { HistoryEntry } from "../../types/navigation";

type Props = {
  history: HistoryEntry[];
};

export function HistoryStrip({ history }: Props) {
  const recent = history.slice(-8).reverse();

  return (
    <div className="nav-history">
      <span className="nav-history__label">History</span>
      <div className="nav-history__strip">
        {recent.length === 0 ? (
          <span className="nav-hint">No navigation yet</span>
        ) : (
          recent.map((entry, i) => (
            <span key={`${entry.timestamp}-${i}`} className="nav-history__chip">
              {entry.label}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
