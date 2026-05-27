import type { SceneDefinition } from "./types";

/**
 * Static visual asset library (Option 1).
 * Add WebP/PNG under public/assets/physics/{sceneId}/ when available.
 */
export const sceneCatalog: Record<string, SceneDefinition> = {
  force_motion: {
    id: "force_motion",
    label: "Force & motion chamber",
    chamberClass: "scene-force-motion",
    assets: {
      background: "/assets/physics/force_motion/bg.webp",
      midground: "/assets/physics/force_motion/mid.webp",
    },
  },
  contact_fields: {
    id: "contact_fields",
    label: "Contact & field chamber",
    chamberClass: "scene-contact-fields",
    assets: {
      background: "/assets/physics/contact_fields/bg.webp",
    },
  },
  inertia_ice: {
    id: "inertia_ice",
    label: "Inertia chamber",
    chamberClass: "scene-inertia-ice",
    assets: {
      background: "/assets/physics/inertia_ice/bg.webp",
    },
  },
  f_equals_ma: {
    id: "f_equals_ma",
    label: "Acceleration chamber",
    chamberClass: "scene-f-equals-ma",
    assets: {
      background: "/assets/physics/f_equals_ma/bg.webp",
    },
  },
  force_applications: {
    id: "force_applications",
    label: "Applied forces chamber",
    chamberClass: "scene-force-applications",
    assets: {
      background: "/assets/physics/force_applications/bg.webp",
    },
  },
};

export function getSceneDefinition(sceneId: string): SceneDefinition {
  return (
    sceneCatalog[sceneId] ?? {
      id: "default",
      label: "Physics chamber",
      chamberClass: "scene-default",
    }
  );
}
