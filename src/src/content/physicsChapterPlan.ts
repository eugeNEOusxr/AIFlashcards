/**
 * Five-chapter physics map plan (GCSE-style units).
 * Visual: Ch2 starts in a column to the RIGHT of Ch1 (see multiChapterSpine + serpentineLayout).
 */
import type { PathwayId } from "../world/types";

export type PhysicsChapterId = 1 | 2 | 3 | 4 | 5;

export type PhysicsChapterPlan = {
  chapterId: PhysicsChapterId;
  title: string;
  subtitle: string;
  /** 0–1 horizontal position on the wide curriculum canvas */
  mapLane: number;
  /** 0 = top row (Ch1 left, Ch2 center-right); 1 = second row */
  mapRow: number;
  subjectCategory: string;
  pathwayIds: PathwayId[];
};

/** Canonical five chapters — aligns with curriculum.manifest.json */
export const PHYSICS_CHAPTER_PLAN: PhysicsChapterPlan[] = [
  {
    chapterId: 1,
    title: "Chapter 1 · Forces & Motion",
    subtitle: "Motion & forces",
    mapLane: 0.22,
    mapRow: 0,
    subjectCategory: "mechanics",
    pathwayIds: ["motion-forces"],
  },
  {
    chapterId: 2,
    title: "Chapter 2 · Energy",
    subtitle: "Work & energy stores",
    mapLane: 0.52,
    mapRow: 0,
    subjectCategory: "energy",
    pathwayIds: ["energy"],
  },
  {
    chapterId: 3,
    title: "Chapter 3 · Electricity",
    subtitle: "Charge & circuits",
    mapLane: 0.78,
    mapRow: 0,
    subjectCategory: "electricity",
    pathwayIds: ["electricity"],
  },
  {
    chapterId: 4,
    title: "Chapter 4 · Waves",
    subtitle: "Sound & light",
    mapLane: 0.38,
    mapRow: 1,
    subjectCategory: "waves",
    pathwayIds: ["waves"],
  },
  {
    chapterId: 5,
    title: "Chapter 5 · Thermal Physics",
    subtitle: "Heat & engines",
    mapLane: 0.62,
    mapRow: 1,
    subjectCategory: "thermal",
    pathwayIds: ["thermodynamics"],
  },
];

export function chapterPlanById(id: PhysicsChapterId): PhysicsChapterPlan | undefined {
  return PHYSICS_CHAPTER_PLAN.find((c) => c.chapterId === id);
}
