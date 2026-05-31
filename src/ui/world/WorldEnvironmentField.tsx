/** Precomputed positions — avoids CSS mod() and keeps particle density readable. */
const PARTICLE_SEEDS: {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  square: boolean;
}[] = [
  { left: 8, top: 12, size: 2, delay: 0, duration: 42, square: true },
  { left: 22, top: 68, size: 3, delay: -6, duration: 48, square: false },
  { left: 41, top: 28, size: 2, delay: -12, duration: 52, square: true },
  { left: 55, top: 82, size: 2, delay: -3, duration: 46, square: true },
  { left: 67, top: 15, size: 3, delay: -18, duration: 55, square: false },
  { left: 78, top: 44, size: 2, delay: -9, duration: 44, square: true },
  { left: 91, top: 72, size: 2, delay: -15, duration: 50, square: true },
  { left: 15, top: 38, size: 2, delay: -21, duration: 58, square: true },
  { left: 33, top: 55, size: 3, delay: -7, duration: 47, square: false },
  { left: 48, top: 8, size: 2, delay: -11, duration: 53, square: true },
  { left: 62, top: 61, size: 2, delay: -4, duration: 45, square: true },
  { left: 84, top: 22, size: 2, delay: -16, duration: 51, square: true },
  { left: 6, top: 88, size: 3, delay: -8, duration: 49, square: false },
  { left: 95, top: 52, size: 2, delay: -14, duration: 54, square: true },
  { left: 12, top: 18, size: 2, delay: -5, duration: 40, square: true },
  { left: 36, top: 74, size: 2, delay: -19, duration: 56, square: true },
  { left: 52, top: 42, size: 3, delay: -10, duration: 44, square: false },
  { left: 71, top: 86, size: 2, delay: -13, duration: 50, square: true },
  { left: 88, top: 32, size: 2, delay: -2, duration: 43, square: true },
  { left: 4, top: 52, size: 2, delay: -17, duration: 52, square: true },
  { left: 28, top: 8, size: 3, delay: -8, duration: 47, square: false },
  { left: 58, top: 28, size: 2, delay: -20, duration: 55, square: true },
  { left: 76, top: 58, size: 2, delay: -6, duration: 41, square: true },
  { left: 92, top: 8, size: 2, delay: -11, duration: 48, square: true },
];

/** Full-screen layered depth field for the subject knowledge space. */
export function WorldEnvironmentField() {
  return (
    <div className="world-env" aria-hidden>
      <div className="world-env__depth">
        <div className="world-env__plane world-env__plane--far" />
        <div className="world-env__plane world-env__plane--mid" />
        <div className="world-env__plane world-env__plane--near" />
      </div>
      <div className="world-env__emotion-mist world-env__emotion-mist--cyan" />
      <div className="world-env__emotion-mist world-env__emotion-mist--violet" />
      <div className="world-env__emotion-mist world-env__emotion-mist--amber" />
      <div className="world-env__pixel-grid" />
      <div className="world-env__diffusion world-env__diffusion--a" />
      <div className="world-env__diffusion world-env__diffusion--b" />
      <div className="world-env__diffusion world-env__diffusion--c" />
      <div className="world-env__mesh" />
      <div className="world-env__veins" />
      <div className="world-env__scanlines" />
      <div className="world-env__particles">
        {PARTICLE_SEEDS.map((p, i) => (
          <span
            key={i}
            className={p.square ? "world-env__pixel" : "world-env__particle"}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
