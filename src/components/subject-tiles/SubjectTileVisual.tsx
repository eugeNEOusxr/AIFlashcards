import type { SubjectId } from "../../world/types";

type Props = {
  subjectId: SubjectId;
};

/** Single dominant metaphor per subject — stylized SVG, no photo clutter. */
export function SubjectTileVisual({ subjectId }: Props) {
  switch (subjectId) {
    case "physics":
      return <PhysicsMetaphor />;
    case "chemistry":
      return <ChemistryMetaphor />;
    case "biology":
      return <BiologyMetaphor />;
    default:
      return null;
  }
}

function PhysicsMetaphor() {
  return (
    <svg className="subject-visual subject-visual--physics" viewBox="0 0 200 140" aria-hidden>
      <defs>
        <radialGradient id="physics-core-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.35)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="72" rx="72" ry="48" fill="url(#physics-core-glow)" />

      {/* Abstract profile / silhouette — iconographic, not portrait-realistic */}
      <path
        className="subject-visual__physics-profile"
        d="M 118 38 C 108 32, 88 34, 78 48 C 72 58, 74 72, 82 82 C 88 90, 96 94, 108 92 C 118 90, 128 82, 132 68 C 136 52, 130 42, 118 38 Z"
        fill="rgba(12, 28, 48, 0.75)"
        stroke="rgba(34, 211, 238, 0.45)"
        strokeWidth="1.2"
      />
      <path
        d="M 92 52 C 96 58, 100 64, 98 72"
        fill="none"
        stroke="rgba(120, 220, 255, 0.35)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Force-field vectors */}
      <g className="subject-visual__physics-vectors">
        <line x1="28" y1="95" x2="52" y2="78" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1.2" />
        <polygon points="52,78 44,80 48,86" fill="rgba(34, 211, 238, 0.55)" />
        <line x1="160" y1="100" x2="138" y2="82" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1" />
        <polygon points="138,82 146,84 142,90" fill="rgba(56, 189, 248, 0.5)" />
        <line x1="48" y1="118" x2="78" y2="108" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="1" />
        <line x1="130" y1="115" x2="158" y2="102" stroke="rgba(125, 211, 252, 0.4)" strokeWidth="1" />
      </g>

      {/* Motion ripple waves */}
      <g className="subject-visual__physics-waves" opacity="0.5">
        <ellipse cx="100" cy="108" rx="55" ry="8" fill="none" stroke="rgba(34, 211, 238, 0.35)" strokeWidth="0.8" />
        <ellipse cx="100" cy="108" rx="70" ry="11" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.6" />
      </g>
    </svg>
  );
}

function ChemistryMetaphor() {
  return (
    <svg className="subject-visual subject-visual--chemistry" viewBox="0 0 200 140" aria-hidden>
      <defs>
        <radialGradient id="chem-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="rgba(132, 204, 22, 0.28)" />
          <stop offset="100%" stopColor="rgba(132, 204, 22, 0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="78" rx="65" ry="42" fill="url(#chem-glow)" />

      {/* Lab glassware — stylized flask */}
      <g className="subject-visual__chem-flask">
        <path
          d="M 88 32 L 88 58 L 72 108 Q 70 118, 100 118 Q 130 118, 128 108 L 112 58 L 112 32 Z"
          fill="rgba(10, 24, 18, 0.55)"
          stroke="rgba(163, 230, 53, 0.55)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M 84 32 L 116 32"
          stroke="rgba(190, 242, 100, 0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="100" cy="95" rx="22" ry="8" fill="rgba(132, 204, 22, 0.12)" />
      </g>

      {/* Molecule lattice */}
      <g className="subject-visual__chem-lattice">
        <line x1="142" y1="42" x2="168" y2="58" stroke="rgba(163, 230, 53, 0.4)" strokeWidth="1" />
        <line x1="168" y1="58" x2="162" y2="88" stroke="rgba(163, 230, 53, 0.35)" strokeWidth="1" />
        <line x1="142" y1="42" x2="155" y2="72" stroke="rgba(132, 204, 22, 0.3)" strokeWidth="1" />
        <line x1="155" y1="72" x2="162" y2="88" stroke="rgba(190, 242, 100, 0.35)" strokeWidth="1" />
        <circle cx="142" cy="42" r="5" fill="rgba(163, 230, 53, 0.7)" />
        <circle cx="168" cy="58" r="4.5" fill="rgba(190, 242, 100, 0.65)" />
        <circle cx="155" cy="72" r="4" fill="rgba(132, 204, 22, 0.6)" />
        <circle cx="162" cy="88" r="5" fill="rgba(163, 230, 53, 0.55)" />
        <line x1="32" y1="68" x2="52" y2="52" stroke="rgba(132, 204, 22, 0.3)" strokeWidth="1" />
        <line x1="52" y1="52" x2="48" y2="78" stroke="rgba(163, 230, 53, 0.28)" strokeWidth="1" />
        <circle cx="32" cy="68" r="4" fill="rgba(132, 204, 22, 0.5)" />
        <circle cx="52" cy="52" r="3.5" fill="rgba(190, 242, 100, 0.55)" />
        <circle cx="48" cy="78" r="4" fill="rgba(163, 230, 53, 0.45)" />
      </g>

      {/* Bubbling particles */}
      <g className="subject-visual__chem-bubbles">
        <circle cx="94" cy="102" r="2.5" fill="rgba(190, 242, 100, 0.5)" />
        <circle cx="102" cy="108" r="2" fill="rgba(163, 230, 53, 0.45)" />
        <circle cx="106" cy="98" r="1.8" fill="rgba(132, 204, 22, 0.4)" />
        <circle cx="98" cy="112" r="1.5" fill="rgba(217, 249, 157, 0.35)" />
      </g>
    </svg>
  );
}

function BiologyMetaphor() {
  return (
    <svg className="subject-visual subject-visual--biology" viewBox="0 0 200 140" aria-hidden>
      <defs>
        <radialGradient id="bio-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.28)" />
          <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="72" rx="68" ry="46" fill="url(#bio-glow)" />

      {/* DNA helix */}
      <g className="subject-visual__bio-dna">
        <path
          d="M 88 28 Q 108 48, 88 68 Q 68 88, 88 108"
          fill="none"
          stroke="rgba(251, 191, 36, 0.55)"
          strokeWidth="1.6"
        />
        <path
          d="M 112 28 Q 92 48, 112 68 Q 132 88, 112 108"
          fill="none"
          stroke="rgba(252, 211, 77, 0.5)"
          strokeWidth="1.6"
        />
        <line x1="90" y1="38" x2="110" y2="38" stroke="rgba(253, 224, 71, 0.35)" strokeWidth="0.8" />
        <line x1="86" y1="58" x2="114" y2="58" stroke="rgba(253, 224, 71, 0.35)" strokeWidth="0.8" />
        <line x1="90" y1="78" x2="110" y2="78" stroke="rgba(253, 224, 71, 0.35)" strokeWidth="0.8" />
        <line x1="88" y1="98" x2="112" y2="98" stroke="rgba(253, 224, 71, 0.3)" strokeWidth="0.8" />
      </g>

      {/* Cellular / organism network */}
      <g className="subject-visual__bio-network">
        <line x1="148" y1="48" x2="172" y2="62" stroke="rgba(251, 191, 36, 0.35)" strokeWidth="1" />
        <line x1="172" y1="62" x2="165" y2="88" stroke="rgba(252, 211, 77, 0.3)" strokeWidth="1" />
        <line x1="148" y1="48" x2="158" y2="75" stroke="rgba(245, 158, 11, 0.28)" strokeWidth="1" />
        <line x1="38" y1="72" x2="58" y2="58" stroke="rgba(251, 191, 36, 0.3)" strokeWidth="1" />
        <line x1="58" y1="58" x2="72" y2="82" stroke="rgba(252, 211, 77, 0.28)" strokeWidth="1" />
        <circle cx="148" cy="48" r="5" fill="rgba(251, 191, 36, 0.55)" />
        <circle cx="172" cy="62" r="4" fill="rgba(252, 211, 77, 0.5)" />
        <circle cx="165" cy="88" r="4.5" fill="rgba(245, 158, 11, 0.45)" />
        <circle cx="38" cy="72" r="4" fill="rgba(251, 191, 36, 0.5)" />
        <circle cx="58" cy="58" r="3.5" fill="rgba(253, 224, 71, 0.48)" />
        <circle cx="72" cy="82" r="4" fill="rgba(252, 211, 77, 0.42)" />
        <circle className="subject-visual__bio-pulse-node" cx="100" cy="68" r="8" fill="rgba(251, 191, 36, 0.2)" stroke="rgba(253, 224, 71, 0.5)" strokeWidth="1" />
      </g>
    </svg>
  );
}
