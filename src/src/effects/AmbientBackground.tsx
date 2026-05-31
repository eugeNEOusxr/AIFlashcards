export function AmbientBackground() {
  return (
    <div className="fx-ambient" aria-hidden>
      <div className="fx-gradient fx-gradient--a" />
      <div className="fx-gradient fx-gradient--b" />
      <div className="fx-fog" />
      <div className="fx-neural-lines" />
      <div className="fx-grid" />
      <div className="fx-particles">
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="fx-particle" style={{ ["--i" as string]: String(i) }} />
        ))}
      </div>
    </div>
  );
}

