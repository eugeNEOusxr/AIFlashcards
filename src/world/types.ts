/** Permanent curriculum hierarchy — do not flatten into quizzes. */

export type SubjectId = "physics" | "chemistry" | "biology";

export type PathwayId =
  | "motion-forces"
  | "energy"
  | "electricity"
  | "waves"
  | "thermodynamics"
  | "nature-chemistry"
  | "chemistry-mixtures"
  | "chemistry-bonds"
  | "chemistry-cycles"
  | "living-biology"
  | "biology-habitats"
  | "biology-energy"
  | "biology-diversity";

export type ModuleId =
  | "mod-force"
  | "mod-contact"
  | "mod-n1"
  | "mod-n2"
  | "mod-applications"
  | "mod-energy-intro"
  | "mod-energy-stores"
  | "mod-energy-conservation"
  | "mod-electricity-intro"
  | "mod-electricity-resistance"
  | "mod-electricity-circuits"
  | "mod-waves-intro"
  | "mod-waves-properties"
  | "mod-waves-em"
  | "mod-thermo-temp"
  | "mod-thermo-conduction"
  | "mod-thermo-engines";

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
  /** @deprecated Legacy — frame app uses FRAME_MODULE only */
  | { kind: "LESSON"; subjectId: SubjectId; pathwayId: PathwayId }
  | { kind: "FRAME_MODULE"; subjectId: SubjectId; moduleId: string };
