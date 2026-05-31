/**
 * Field-driven electron motion + soft shells + ionization scaling.
 * No orbital mechanics, no real physics engine.
 */

import type { Atom, Electron, Nucleus } from "./atomModel";
import { DEFAULT_ENERGY_SHELLS, netCharge } from "./atomModel";

const MIN_NUCLEUS_SEP = 28;
const DAMP = 0.88;
const FIELD_K = 420;
const SHELL_K = 0.06;
const JITTER = 18;

function clampShellIndex(level: number, max: number): number {
  return Math.max(0, Math.min(max, Math.floor(level)));
}

/** Target radius for electron's energy shell (px). */
function targetShellRadius(atom: Atom, e: Electron, ionScale: number): number {
  const shells = atom.energyShells.length ? atom.energyShells : DEFAULT_ENERGY_SHELLS;
  const idx = clampShellIndex(e.energyLevel, shells.length - 1);
  return shells[idx] * ionScale;
}

/**
 * Ion cloud visual: fewer electrons → tighter cloud; more → slightly expanded.
 */
export function ionCloudScale(atom: Atom): number {
  const q = netCharge(atom);
  if (q > 0) return Math.max(0.72, 1 - q * 0.04);
  if (q < 0) return Math.min(1.22, 1 - q * 0.05);
  return 1;
}

function radialUnit(
  nx: number,
  ny: number,
  ex: number,
  ey: number
): { x: number; y: number; r: number } {
  const dx = nx - ex;
  const dy = ny - ey;
  const r = Math.sqrt(dx * dx + dy * dy) + 1e-6;
  return { x: dx / r, y: dy / r, r };
}

/**
 * One integration step. Mutates electron positions/velocities.
 */
export function stepAtomSimulation(
  atom: Atom,
  bounds: { w: number; h: number },
  dt: number
): void {
  const { nucleus, electrons } = atom;
  const { x: cx, y: cy } = nucleus.position;
  const Z = Math.max(1, nucleus.protons);
  const ionScale = ionCloudScale(atom);
  const t = dt * 0.06;

  for (const e of electrons) {
    const { x: ex, y: ey } = e.position;
    const { x: ux, y: uy, r } = radialUnit(cx, cy, ex, ey);

    const fieldMag = (FIELD_K * Z) / (r * r + 120);
    let fx = ux * fieldMag;
    let fy = uy * fieldMag;

    if (r < MIN_NUCLEUS_SEP) {
      const push = (MIN_NUCLEUS_SEP - r + 4) * 2.5;
      fx -= ux * push;
      fy -= uy * push;
    }

    const targetR = targetShellRadius(atom, e, ionScale);
    const radialError = r - targetR;
    fx -= ux * radialError * SHELL_K * (r + 40);
    fy -= uy * radialError * SHELL_K * (r + 40);

    const tx = -uy;
    const ty = ux;
    const tang = e.velocity.x * tx + e.velocity.y * ty;
    fx -= tx * tang * 0.08;
    fy -= ty * tang * 0.08;

    fx += (Math.random() - 0.5) * JITTER;
    fy += (Math.random() - 0.5) * JITTER;

    e.velocity.x = (e.velocity.x + fx * t) * DAMP;
    e.velocity.y = (e.velocity.y + fy * t) * DAMP;

    const sp = Math.sqrt(e.velocity.x * e.velocity.x + e.velocity.y * e.velocity.y);
    const cap = 3.2;
    if (sp > cap) {
      e.velocity.x = (e.velocity.x / sp) * cap;
      e.velocity.y = (e.velocity.y / sp) * cap;
    }

    e.position.x += e.velocity.x * dt * 0.35;
    e.position.y += e.velocity.y * dt * 0.35;

    const pad = 16;
    if (e.position.x < pad) {
      e.position.x = pad;
      e.velocity.x *= -0.4;
    }
    if (e.position.x > bounds.w - pad) {
      e.position.x = bounds.w - pad;
      e.velocity.x *= -0.4;
    }
    if (e.position.y < pad) {
      e.position.y = pad;
      e.velocity.y *= -0.4;
    }
    if (e.position.y > bounds.h - pad) {
      e.position.y = bounds.h - pad;
      e.velocity.y *= -0.4;
    }
  }
}

export function createElectronNearShell(
  nucleus: Nucleus,
  shellIndex: number,
  shells: number[]
): Electron {
  const idx = clampShellIndex(shellIndex, shells.length - 1);
  const baseR = shells[idx];
  const angle = Math.random() * Math.PI * 2;
  const r = baseR * (0.85 + Math.random() * 0.25);
  return {
    position: {
      x: nucleus.position.x + Math.cos(angle) * r,
      y: nucleus.position.y + Math.sin(angle) * r,
    },
    velocity: { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 40 },
    energyLevel: idx,
  };
}

export function createDefaultAtom(centerX: number, centerY: number): Atom {
  const shells = [...DEFAULT_ENERGY_SHELLS];
  const protons = 6;
  const nucleus: Nucleus = {
    protons,
    neutrons: 6,
    position: { x: centerX, y: centerY },
  };
  const electrons: Electron[] = [];
  for (let i = 0; i < protons; i++) {
    electrons.push(createElectronNearShell(nucleus, i % shells.length, shells));
  }
  return { nucleus, electrons, energyShells: shells };
}

export function addElectron(atom: Atom): void {
  const shells = atom.energyShells.length ? atom.energyShells : DEFAULT_ENERGY_SHELLS;
  const level = Math.floor(Math.random() * shells.length);
  atom.electrons.push(createElectronNearShell(atom.nucleus, level, shells));
}

export function removeElectron(atom: Atom): void {
  if (atom.electrons.length === 0) return;
  atom.electrons.pop();
}

export function applyEnergyPulse(atom: Atom): void {
  const max = atom.energyShells.length - 1;
  for (const e of atom.electrons) {
    if (e.energyLevel < max) {
      e.energyLevel += 1;
    }
    const { x: cx, y: cy } = atom.nucleus.position;
    const { x: ux, y: uy } = radialUnit(cx, cy, e.position.x, e.position.y);
    const kick = 120 + Math.random() * 80;
    e.velocity.x += ux * kick * 0.02;
    e.velocity.y += uy * kick * 0.02;
  }
}
