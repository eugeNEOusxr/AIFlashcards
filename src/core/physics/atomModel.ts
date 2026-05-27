/**
 * Atom model for field-based 2D visualization (intuition, not simulation).
 */

export type Nucleus = {
  protons: number;
  neutrons: number;
  position: { x: number; y: number };
};

export type Electron = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  /** Shell index 0..energyShells.length-1 */
  energyLevel: number;
};

export type Atom = {
  nucleus: Nucleus;
  electrons: Electron[];
  /** Discrete soft-shell radii (px from nucleus center) */
  energyShells: number[];
};

/** Net charge = protons − electrons.length (positive ion if > 0). */
export function netCharge(atom: Atom): number {
  return atom.nucleus.protons - atom.electrons.length;
}

export const DEFAULT_ENERGY_SHELLS = [40, 80, 130, 200];
