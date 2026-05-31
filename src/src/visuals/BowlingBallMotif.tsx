type Props = {
  focus?: boolean;
};

/**
 * Physics truth object — near-black lacquer sphere with 3-hole grip layout.
 * Rendered as layered CSS (not a generic glowing orb).
 */
export function BowlingBallMotif({ focus = false }: Props) {
  return (
    <div
      className={["bowling-ball-motif", focus ? "bowling-ball-motif--focus" : ""].filter(Boolean).join(" ")}
      aria-hidden
    >
      <div className="bowling-ball-motif__contact-shadow" />
      <div className="bowling-ball-motif__ground-reflect" />
      <div className="bowling-ball-motif__sphere">
        <div className="bowling-ball-motif__lacquer" />
        <div className="bowling-ball-motif__specular" />
        <div className="bowling-ball-motif__specular-rim" />
        <div className="bowling-ball-motif__environment-roll" />
        <div className="bowling-ball-motif__holes" aria-hidden>
          <span className="bowling-ball-motif__hole bowling-ball-motif__hole--thumb" />
          <span className="bowling-ball-motif__hole bowling-ball-motif__hole--middle" />
          <span className="bowling-ball-motif__hole bowling-ball-motif__hole--ring" />
        </div>
        <div className="bowling-ball-motif__edge-rim" />
      </div>
    </div>
  );
}
