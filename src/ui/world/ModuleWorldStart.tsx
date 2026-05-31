import { memo, type CSSProperties } from "react";

type Props = {
  accent: string;
  accentSecondary: string;
  kicker: string;
  title: string;
  subtitle: string;
  ariaLabel: string;
};

/** Backbone entrance orb — copy comes from subject profile (Physics vs Chemistry). */
function ModuleWorldStartInner({ accent, accentSecondary, kicker, title, subtitle, ariaLabel }: Props) {
  return (
    <div
      className="module-world-start"
      style={
        {
          ["--start-accent" as string]: accent,
          ["--start-accent-2" as string]: accentSecondary,
        } as CSSProperties
      }
      aria-label={ariaLabel}
    >
      <span className="module-world-start__ring module-world-start__ring--outer" aria-hidden />
      <span className="module-world-start__ring module-world-start__ring--inner" aria-hidden />
      <span className="module-world-start__core">
        <span className="module-world-start__kicker">{kicker}</span>
        <span className="module-world-start__title">{title}</span>
        <span className="module-world-start__sub">{subtitle}</span>
      </span>
      <span className="module-world-start__beacon" aria-hidden />
    </div>
  );
}

export const ModuleWorldStart = memo(ModuleWorldStartInner);
