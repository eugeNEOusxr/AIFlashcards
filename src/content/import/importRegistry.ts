import type { PathwayId } from "../../world/types";
import type { Lesson } from "../curriculumTypes";
import { lessonFromImportRaw } from "./normalize";
import type { ExternalDataset, FlashcardDatasetV1, ImportCurriculumBundle, McqBankDatasetV1 } from "./types";
import { lessonsFromFlashcardDataset } from "./adapters/flashcardAdapter";
import { lessonFromMcqBank } from "./adapters/mcqBankAdapter";

type RegistryEntry = {
  pathwayId: PathwayId;
  lessons: Lesson[];
  sourceId: string;
};

const registry = new Map<string, RegistryEntry>();

function isFlashcard(ds: ExternalDataset): ds is FlashcardDatasetV1 {
  return "format" in ds && ds.format === "flashcard_v1";
}

function isMcqBank(ds: ExternalDataset): ds is McqBankDatasetV1 {
  return "format" in ds && ds.format === "mcq_bank_v1";
}

export function registerImportedDataset(
  pathwayId: PathwayId,
  dataset: ExternalDataset
): Lesson[] {
  let lessons: Lesson[] = [];
  let sourceId = "unknown";

  if (isFlashcard(dataset)) {
    sourceId = dataset.id;
    lessons = lessonsFromFlashcardDataset(dataset);
  } else if (isMcqBank(dataset)) {
    sourceId = dataset.id;
    lessons = [lessonFromMcqBank(dataset)];
  } else {
    const bundle = dataset as ImportCurriculumBundle;
    sourceId = bundle.id;
    lessons = bundle.modules.flatMap((mod) =>
      mod.lessons.map((raw) => lessonFromImportRaw(raw))
    );
  }

  registry.set(pathwayId, { pathwayId, lessons, sourceId });
  return lessons;
}

export function getImportedLessonsForPathway(pathwayId: PathwayId): Lesson[] | undefined {
  return registry.get(pathwayId)?.lessons;
}

export function importCurriculumBundle(bundle: ImportCurriculumBundle): void {
  for (const mod of bundle.modules) {
    const lessons = mod.lessons.map((raw) => lessonFromImportRaw(raw));
    registry.set(mod.pathwayId as PathwayId, {
      pathwayId: mod.pathwayId as PathwayId,
      lessons,
      sourceId: bundle.id,
    });
  }
}

export function clearImportRegistry(): void {
  registry.clear();
}
