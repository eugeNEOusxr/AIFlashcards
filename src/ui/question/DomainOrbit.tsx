import type { Domain } from "../../core/questionTypes";
import { DOMAIN_LABELS } from "../../core/questionEngine";

const DOMAINS: Domain[] = ["math", "physics", "chemistry"];

type Props = {
  active: Domain;
  onSelect: (domain: Domain) => void;
};

export function DomainOrbit({ active, onSelect }: Props) {
  return (
    <aside className="ql-orbit" aria-label="Domain gravity">
      <span className="ql-orbit__label">Gravity</span>
      <div className="ql-orbit__field">
        {DOMAINS.map((domain, i) => {
          const isActive = domain === active;
          return (
            <button
              key={domain}
              type="button"
              className={`ql-orbit__node${isActive ? " ql-orbit__node--active" : ""}`}
              style={{ ["--orbit-i" as string]: String(i) }}
              onClick={() => onSelect(domain)}
              aria-pressed={isActive}
            >
              <span className="ql-orbit__glow" aria-hidden />
              <span className="ql-orbit__name">{DOMAIN_LABELS[domain]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
