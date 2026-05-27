import { BowlingBallMotif } from "./BowlingBallMotif";

/** Dual-ball impact scene for contact-force questions. */
export function CollisionBowlingMotif() {
  return (
    <div className="collision-bowling-motif" aria-hidden>
      <div className="collision-bowling-motif__ball collision-bowling-motif__ball--a">
        <BowlingBallMotif focus />
      </div>
      <div className="collision-bowling-motif__shockwave" />
      <div className="collision-bowling-motif__ball collision-bowling-motif__ball--b">
        <BowlingBallMotif focus />
      </div>
    </div>
  );
}
