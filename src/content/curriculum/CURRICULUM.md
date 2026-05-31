# Curriculum JSON — when vs how questions run

The app separates **when** a question appears from **how** it is worded and shown.

## 1. App flow (always starts at home)

1. **Study Worlds (HOME)** — pick Physics, Chemistry, or Biology.
2. **Subject map** — landmarks and tunnels.
3. **Frame module** — one MCQ card at a time.

Progress (completed frames, map unlock) is saved in localStorage. The **screen** always reopens on Study Worlds so subjects stay optional entry points.

## 2. Three JSON roles per subject

| File | Commits to |
|------|------------|
| `curriculum.manifest.json` | Chapters, pathways, `landmarkFlow`, which landmarks are **active** |
| `*.frames.manifest.json` | **Order and pacing**: `sequenceInChapter`, `level`, `contentLayer`, `frameId` → module |
| `*_v1.graph.json` | Concept graph for review / future routing |

Authoritative copy for each question still lives in `content/frames/modules/*Module.ts` today. Each `frameId` in the manifest must match a frame `id` in that module.

Shared rules for all subjects: [`question-pacing.contract.json`](./question-pacing.contract.json).

## 3. Writing a new frame (checklist)

1. Add a slot in `biology.frames.manifest.json` (or subject equivalent):

```json
{
  "frameId": "cells.05",
  "conceptTag": "cells-new-idea",
  "level": 2,
  "contentLayer": "assessment",
  "sequenceInChapter": 9
}
```

2. Add the frame body in the TS module with the same `id` and `conceptTag`.
3. Register the module in `registry.ts` and chapter hierarchy TS (or generate hierarchy from manifest later).
4. Run `npm run build` — `validateFrame` enforces one concept per frame, 4 unique answers, no forbidden jargon per module, and shuffle-safe Q/A pairing.

## 4. Pacing patterns that match the UI

- **Level 1 + concept** — first idea at a landmark.
- **Level 1 + context** — same idea in a nature scene (`visualAid` does the work).
- **Level 2 + concept** — connect or compare.
- **Level 2/3 + assessment** — check without teaching new terms.

Phases (`answering` → `reflection` → optional `clarification`) are fixed in code (`frameEngine.ts`, `frameDisplay.ts`); JSON does not skip phases.

## 5. Biology example paths

- Manifest: `biology_v1/curriculum.manifest.json`
- Pacing: `biology_v1/biology.frames.manifest.json`
- Copy: `frames/modules/cellsModule.ts`, `organismsModule.ts`
