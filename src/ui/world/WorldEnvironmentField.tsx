/** Precomputed positions — avoids CSS mod() and keeps particle density low. */
const PARTICLE_SEEDS: { left: number; top: number; size: number; delay: number; duration: number }[] = [
  { left: 8, top: 12, size: 2, delay: 0, duration: 42 },
  { left: 22, top: 68, size: 3, delay: -6, duration: 48 },
  { left: 41, top: 28, size: 2, delay: -12, duration: 52 },
  { left: 55, top: 82, size: 2, delay: -3, duration: 46 },
  { left: 67, top: 15, size: 3, delay: -18, duration: 55 },
  { left: 78, top: 44, size: 2, delay: -9, duration: 44 },
  { left: 91, top: 72, size: 2, delay: -15, duration: 50 },
  { left: 15, top: 38, size: 2, delay: -21, duration: 58 },
  { left: 33, top: 55, size: 3, delay: -7, duration: 47 },
  { left: 48, top: 8, size: 2, delay: -11, duration: 53 },
  { left: 62, top: 61, size: 2, delay: -4, duration: 45 },
  { left: 84, top: 22, size: 2, delay: -16, duration: 51 },
  { left: 6, top: 88, size: 3, delay: -8, duration: 49 },
  { left: 95, top: 52, size: 2, delay: -14, duration: 54 },
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
      <div className="world-env__diffusion world-env__diffusion--a" />
      <div className="world-env__diffusion world-env__diffusion--b" />
      <div className="world-env__diffusion world-env__diffusion--c" />
      <div className="world-env__mesh" />
      <div className="world-env__veins" />
      <div className="world-env__horizon-fog" />
      <div className="world-env__particles">
        {PARTICLE_SEEDS.map((p, i) => (
          <span
            key={i}
            className="world-env__particle"
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