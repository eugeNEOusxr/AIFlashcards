import type { SubjectId, PathwayId } from "./types";

export type SubjectProfile = {
  id: SubjectId;
  label: string;
  /** Home screen zone tagline */
  homeTagline: string;
  /** Map header */
  mapRegionKicker: string;
  mapRegionTitle: string;
  /** Map header brand — "Cognitive mind" */
  cognitiveMindKicker: string;
  defaultPathwayId: PathwayId;
  /** Backbone start orb copy */
  startOrb: {
    kicker: string;
    title: string;
    subtitle: string;
    ariaLabel: string;
  };
  /** Review sidebar — separate category from the other subject */
  studyDeck: {
    kicker: string;
    title: string;
    emptyHint: string;
  };
  mapClassPrefix: string;
  reviewClassPrefix: string;
  envClassPrefix: string;
};

const PHYSICS_PROFILE: SubjectProfile = {
  id: "physics",
  label: "Physics",
  homeTagline: "Motion · forces · energy flow",
  mapRegionKicker: "Cognitive mind",
  mapRegionTitle: "Physics",
  cognitiveMindKicker: "Cognitive mind",
  defaultPathwayId: "motion-forces",
  startOrb: {
    kicker: "Entrance",
    title: "Physics",
    subtitle: "Motion & forces path",
    ariaLabel: "Physics journey begins here",
  },
  studyDeck: {
    kicker: "Forces study deck",
    title: "Motion & forces review",
    emptyHint: "Finish a frame in Motion or Forces — cards appear here.",
  },
  mapClassPrefix: "physics-module-world",
  reviewClassPrefix: "physics-review",
  envClassPrefix: "physics-module-env",
};

const CHEMISTRY_PROFILE: SubjectProfile = {
  id: "chemistry",
  label: "Chemistry",
  homeTagline: "Matter · change · nature outdoors",
  mapRegionKicker: "Cognitive mind",
  mapRegionTitle: "Chemistry · Matter",
  cognitiveMindKicker: "Cognitive mind",
  defaultPathwayId: "nature-chemistry",
  startOrb: {
    kicker: "Entrance",
    title: "Chemistry",
    subtitle: "Matter & change in nature",
    ariaLabel: "Chemistry journey begins here",
  },
  studyDeck: {
    kicker: "Nature study deck",
    title: "Chemistry in nature review",
    emptyHint: "Finish a frame in Matter or Change — your nature cards appear here.",
  },
  mapClassPrefix: "chemistry-module-world",
  reviewClassPrefix: "chemistry-review",
  envClassPrefix: "chemistry-module-env",
};

const BIOLOGY_PROFILE: SubjectProfile = {
  id: "biology",
  label: "Biology",
  homeTagline: "Cells · organisms · life outdoors",
  mapRegionKicker: "Cognitive mind",
  mapRegionTitle: "Biology",
  cognitiveMindKicker: "Cognitive mind",
  defaultPathwayId: "living-biology",
  startOrb: {
    kicker: "Entrance",
    title: "Biology",
    subtitle: "Cells & organisms in nature",
    ariaLabel: "Biology journey begins here",
  },
  studyDeck: {
    kicker: "Living study deck",
    title: "Life in nature review",
    emptyHint: "Finish a frame in Cells or Organisms — your living-world cards appear here.",
  },
  mapClassPrefix: "biology-module-world",
  reviewClassPrefix: "biology-review",
  envClassPrefix: "biology-module-env",
};

const PROFILES: Record<SubjectId, SubjectProfile | undefined> = {
  physics: PHYSICS_PROFILE,
  chemistry: CHEMISTRY_PROFILE,
  biology: BIOLOGY_PROFILE,
};

export function getSubjectProfile(subjectId: SubjectId): SubjectProfile {
  const profile = PROFILES[subjectId];
  if (!profile) {
    return {
      ...PHYSICS_PROFILE,
      id: subjectId,
      label: subjectId,
      homeTagline: "Coming soon",
      mapRegionKicker: "Cognitive mind",
      mapRegionTitle: subjectId,
      cognitiveMindKicker: "Cognitive mind",
      startOrb: {
        kicker: "Entrance",
        title: subjectId,
        subtitle: "Path opening soon",
        ariaLabel: `${subjectId} journey`,
      },
      studyDeck: {
        kicker: "Study deck",
        title: "Review",
        emptyHint: "Complete a lesson frame to add cards.",
      },
    };
  }
  return profile;
}
