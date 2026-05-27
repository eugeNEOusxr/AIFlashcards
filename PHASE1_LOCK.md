# Phase 1 — Core Experience Lock

**Status:** ACTIVE — stabilize only; do not expand scope.

## In scope (must work reliably)

| Pillar | Surface | Success criteria |
|--------|---------|------------------|
| 1 | **Subject world** | Full-viewport ambient field; 3 floating subject zones; Physics enters map |
| 2 | **Progression map** | Tunnels, active/next/mastered states; tap pathway → lesson or replay picker; never hard-locked after completion |
| 3 | **Lesson flow** | TEACH → ASK → FEEDBACK → ADVANCE; breadcrumb back to map; finish pathway returns to map |
| 4 | **Questions** | MCQ / T/F / Numeric by phase; inline feedback; fixed Continue |

## Explicitly OUT of scope (Phase 2+)

- Advanced graph analytics UI
- Spaced repetition / SM-2 engine
- Social, leaderboards, rewards economy
- Avatar / character systems
- Reinforcement flashcard panel in main flow
- Duplicate pathway/highway maps
- Backend AI sync (PWA is local-first)

## Code switches

- `src/phase1.ts` — feature flags for in-lesson extras
- Progress repair on load: `repairSessionProgress()` in `memoryStore.ts`
- Replay: `PathwayLessonReplay` on multi-lesson pathways

## Navigation contract

```
HOME (subject world) → SUBJECT (pathway map) → LESSON (chamber + Q&A)
         ↑___________________breadcrumb___________________|
```

No `PATHWAY` screen. No sidebar maps in lesson.
