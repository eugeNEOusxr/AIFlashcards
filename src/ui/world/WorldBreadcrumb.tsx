import { getPathway } from "../../world/physicsWorld";
import type { NavScreen, PathwayId } from "../../world/types";

type Props = {
  screen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
};

function pathwayLabel(pathwayId: PathwayId): string {
  return getPathway(pathwayId)?.title ?? pathwayId;
}

export function WorldBreadcrumb({ screen, onNavigate }: Props) {
  const crumbs: { label: string; target: NavScreen }[] = [{ label: "Worlds", target: { kind: "HOME" } }];

  if (
    screen.kind === "SUBJECT" ||
    screen.kind === "PATHWAY" ||
    screen.kind === "LESSON" ||
    screen.kind === "FRAME_MODULE"
  ) {
    crumbs.push({
      label: screen.subjectId === "physics" ? "Physics" : screen.subjectId,
      target: { kind: "SUBJECT", subjectId: screen.subjectId },
    });
  }

  // Only navigation layer that remains visible is the subject map (modules/lessons).
  // Do not navigate into a PATHWAY screen (no separate pathway map UI).
  if (screen.kind === "LESSON") {
    crumbs.push({
      label: pathwayLabel(screen.pathwayId),
      target: { kind: "SUBJECT", subjectId: screen.subjectId },
    });
  }

  if (screen.kind === "FRAME_MODULE") {
    crumbs.push({
      label: "What Is Force?",
      target: {
        kind: "FRAME_MODULE",
        subjectId: screen.subjectId,
        moduleId: screen.moduleId,
      },
    });
  }

  return (
    <nav className="world-crumb" aria-label="Curriculum location">
      {crumbs.map((c, i) => (
        <span key={`${c.label}-${i}`}>
          {i > 0 ? <span className="world-crumb__sep">›</span> : null}
          <button
            type="button"
            className={i === crumbs.length - 1 ? "world-crumb__current" : "world-crumb__link"}
            onClick={() => onNavigate(c.target)}
            disabled={i === crumbs.length - 1}
          >
            {c.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
