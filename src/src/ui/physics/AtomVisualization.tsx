import { useCallback, useEffect, useRef, useState } from "react";
import type { Atom } from "../../core/physics/atomModel";
import { netCharge } from "../../core/physics/atomModel";
import {
  createDefaultAtom,
  stepAtomSimulation,
  addElectron,
  removeElectron,
  applyEnergyPulse,
  ionCloudScale,
} from "../../core/physics/atomFieldSim";
import {
  recordPhysicsAtomDisplayed,
  recordPhysicsAddElectron,
  recordPhysicsRemoveElectron,
  recordPhysicsEnergyPulse,
} from "../../core/learning/learningBridge";

type Props = {
  width?: number;
  height?: number;
};

export function AtomVisualization({ width = 360, height = 280 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atomRef = useRef<Atom | null>(null);
  const rafRef = useRef<number>(0);
  const displayedLogged = useRef(false);
  const [counts, setCounts] = useState({ e: 6, q: 0 });

  const syncCounts = useCallback((atom: Atom) => {
    setCounts({ e: atom.electrons.length, q: netCharge(atom) });
  }, []);

  useEffect(() => {
    const cx = width / 2;
    const cy = height / 2;
    const atom = createDefaultAtom(cx, cy);
    atomRef.current = atom;
    syncCounts(atom);
    if (!displayedLogged.current) {
      recordPhysicsAtomDisplayed(atom);
      displayedLogged.current = true;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const atom = atomRef.current;
      if (!atom) return;
      stepAtomSimulation(atom, { w: width, h: height }, 1);

      ctx.clearRect(0, 0, width, height);

      const { nucleus, electrons, energyShells } = atom;
      const { x: cx, y: cy } = nucleus.position;
      const ionScale = ionCloudScale(atom);

      // Optional faint radial field
      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, Math.max(width, height) * 0.55 * ionScale);
      grad.addColorStop(0, "rgba(94, 234, 212, 0.12)");
      grad.addColorStop(0.35, "rgba(94, 234, 212, 0.03)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft shell rings (teaching hint)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      for (const r of energyShells) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * ionScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nucleus glow
      const nGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 22);
      nGlow.addColorStop(0, "rgba(252, 211, 77, 0.95)");
      nGlow.addColorStop(0.5, "rgba(251, 191, 36, 0.45)");
      nGlow.addColorStop(1, "rgba(251, 191, 36, 0)");
      ctx.fillStyle = nGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fcd34d";
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      // Electrons
      for (const e of electrons) {
        const g = ctx.createRadialGradient(e.position.x, e.position.y, 0, e.position.x, e.position.y, 6);
        g.addColorStop(0, "rgba(147, 197, 253, 0.95)");
        g.addColorStop(1, "rgba(59, 130, 246, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.position.x, e.position.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(191, 219, 254, 0.9)";
        ctx.beginPath();
        ctx.arc(e.position.x, e.position.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  const onAdd = () => {
    const atom = atomRef.current;
    if (!atom) return;
    addElectron(atom);
    syncCounts(atom);
    recordPhysicsAddElectron(atom);
  };

  const onRemove = () => {
    const atom = atomRef.current;
    if (!atom) return;
    removeElectron(atom);
    syncCounts(atom);
    recordPhysicsRemoveElectron(atom);
  };

  const onPulse = () => {
    const atom = atomRef.current;
    if (!atom) return;
    applyEnergyPulse(atom);
    recordPhysicsEnergyPulse(atom);
  };

  const ionLabel =
    counts.q === 0 ? "neutral" : counts.q > 0 ? `+${counts.q} cation` : `${counts.q} anion`;

  return (
    <div className="cls-atom-viz">
      <canvas ref={canvasRef} width={width} height={height} className="cls-atom-viz__canvas" />
      <div className="cls-atom-viz__controls">
        <button type="button" className="cls-atom-viz__btn" onClick={onAdd}>
          Add electron
        </button>
        <button type="button" className="cls-atom-viz__btn" onClick={onRemove}>
          Remove electron
        </button>
        <button type="button" className="cls-atom-viz__btn" onClick={onPulse}>
          Energy pulse
        </button>
      </div>
      <p className="cls-hint">
        Electrons: {counts.e} · {ionLabel} · field + shells (intuition only)
      </p>
    </div>
  );
}
