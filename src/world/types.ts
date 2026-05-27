/** Permanent curriculum hierarchy — do not flatten into quizzes. */

export type SubjectId = "physics" | "chemistry" | "biology";

export type PathwayId =
  | "motion-forces"
  | "energy"
  | "electricity"
  | "waves"
  | "thermodynamics";

export type ModuleId =
  | "mod-force"
  | "mod-contact"
  | "mod-n1"
  | "mod-n2"
  | "mod-applications"
  | "mod-energy-intro"
  | "mod-electricity-intro";

export type SubjectWorld = {
  id: SubjectId;
  label: string;
  tagline: string;
  available: boolean;
  pathwayIds: PathwayId[];
};

export type PathwayWorld = {
  id: PathwayId;
  subjectId: SubjectId;
  title: string;
  description: string;
  available: boolean;
  /** Index into ordered module list for this pathway */
  moduleIds: ModuleId[];
};

export type ModuleWorld = {
  id: ModuleId;
  pathwayId: PathwayId;
  title: string;
  subtitle: string;
  /** Links into physicsChapter1 lesson array */
  lessonIndex: number;
  concepts: string[];
  depth: number;
};

export type ModuleProgressState = "locked" | "unlocked" | "active" | "done";

export type NavScreen =
  | { kind: "HOME" }
  | { kind: "SUBJECT"; subjectId: SubjectId }
  | { kind: "PATHWAY"; subjectId: SubjectId; pathwayId: PathwayId }
  | { kind: "LESSON"; subjectId: SubjectId; pathwayId: PathwayId };
