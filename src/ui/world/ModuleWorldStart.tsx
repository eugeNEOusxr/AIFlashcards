import { memo, type CSSProperties } from "react";

type Props = {
  accent: string;
  accentSecondary: string;
};

/** Entrance anchor into the physics progression world */
function ModuleWorldStartInner({ accent, accentSecondary }: Props) {
  return (
    <div
      className="module-world-start"
      style={
        {
          ["--start-accent" as string]: accent,
          ["--start-accent-2" as string]: accentSecondary,
        } as CSSProperties
      }
      aria-label="Physics journey begins here"
    >
      <span className="module-world-start__ring module-world-start__ring--outer" aria-hidden />
      <span className="module-world-start__ring module-world-start__ring--inner" aria-hidden />
      <span className="module-world-start__core">
        <span className="module-world-start__kicker">Entrance</span>
        <span className="module-world-start__title">Physics</span>
        <span className="module-world-start__sub">Begin your path</span>
      </span>
      <span className="module-world-start__beacon" aria-hidden />
    </div>
  );
}

export const ModuleWorldStart = memo(ModuleWorldStartInner);
