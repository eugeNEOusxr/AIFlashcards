import { shuffleFrameAnswers } from "../content/frames/shuffleFrameAnswers";
import type { FrameAnswers, FramePhase, LearningFrame, LearningModule } from "../content/frames/types";

export type FrameSessionState = {
  moduleId: string;
  frameIndex: number;
  phase: FramePhase;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  /** Shuffled choices for the active frame — keeps question tied to the right answer */
  shuffledAnswers: FrameAnswers | null;
  shuffledCorrectIndex: number | null;
};

export type FrameAction =
  | { type: "ENTER_MODULE"; moduleId: string }
  | { type: "SELECT_ANSWER"; index: number }
  | { type: "REFLECTION_YES" }
  | { type: "REFLECTION_CONFUSED" }
  | { type: "CONTINUE_AFTER_CLARIFICATION" }
  | { type: "NEXT_FRAME" };

export function initialFrameSession(moduleId: string): FrameSessionState {
  return {
    moduleId,
    frameIndex: 0,
    phase: "answering",
    selectedIndex: null,
    isCorrect: null,
    shuffledAnswers: null,
    shuffledCorrectIndex: null,
  };
}

function resetFramePhase(): Pick<
  FrameSessionState,
  "phase" | "selectedIndex" | "isCorrect"
> {
  return { phase: "answering", selectedIndex: null, isCorrect: null };
}

/** Attach a fresh shuffle whenever the learner lands on a frame. */
export function withShuffledAnswers(
  state: FrameSessionState,
  module: LearningModule
): FrameSessionState {
  const frame = module.frames[state.frameIndex];
  if (!frame) return state;
  const { answers, correctIndex } = shuffleFrameAnswers(frame.answers, frame.correctIndex);
  return {
    ...state,
    ...resetFramePhase(),
    shuffledAnswers: answers,
    shuffledCorrectIndex: correctIndex,
  };
}

/** Yes or post-clarification Continue — advance frame or finish module. */
function advanceAfterReflection(
  state: FrameSessionState,
  module: LearningModule
): FrameSessionState {
  const isLast = state.frameIndex >= module.frames.length - 1;
  if (isLast) {
    return { ...state, phase: "done" };
  }
  return withShuffledAnswers(
    {
      ...state,
      frameIndex: state.frameIndex + 1,
      ...resetFramePhase(),
    },
    module
  );
}

export function frameReducer(
  state: FrameSessionState | null,
  action: FrameAction,
  module: LearningModule | null
): FrameSessionState | null {
  if (action.type === "ENTER_MODULE") {
    const mod = module;
    if (!mod || mod.id !== action.moduleId) {
      return initialFrameSession(action.moduleId);
    }
    return withShuffledAnswers(initialFrameSession(action.moduleId), mod);
  }

  if (!state || !module || state.moduleId !== module.id) return state;

  const frame = module.frames[state.frameIndex];
  if (!frame) return state;

  switch (action.type) {
    case "SELECT_ANSWER": {
      if (state.phase !== "answering") return state;
      const correctSlot = state.shuffledCorrectIndex ?? frame.correctIndex;
      const isCorrect = action.index === correctSlot;
      return {
        ...state,
        selectedIndex: action.index,
        isCorrect,
        phase: "reflection",
      };
    }

    case "REFLECTION_YES":
      if (state.phase !== "reflection") return state;
      return advanceAfterReflection(state, module);

    case "REFLECTION_CONFUSED":
      if (state.phase !== "reflection") return state;
      return { ...state, phase: "clarification" };

    case "CONTINUE_AFTER_CLARIFICATION":
      if (state.phase !== "clarification") return state;
      return advanceAfterReflection(state, module);

    case "NEXT_FRAME": {
      if (state.phase !== "done") return state;
      const nextIndex = state.frameIndex + 1;
      if (nextIndex >= module.frames.length) {
        return { ...state, phase: "done" };
      }
      return withShuffledAnswers(
        {
          ...state,
          frameIndex: nextIndex,
          ...resetFramePhase(),
        },
        module
      );
    }

    default:
      return state;
  }
}

export function currentFrame(
  module: LearningModule | null,
  state: FrameSessionState | null
): LearningFrame | null {
  if (!module || !state) return null;
  return module.frames[state.frameIndex] ?? null;
}

/** Frame shown in the UI — shuffled answers, same question and correct text. */
export function displayFrame(
  module: LearningModule | null,
  state: FrameSessionState | null
): LearningFrame | null {
  const frame = currentFrame(module, state);
  if (!frame || !state) return frame;
  if (!state.shuffledAnswers || state.shuffledCorrectIndex === null) return frame;
  return {
    ...frame,
    answers: state.shuffledAnswers,
    correctIndex: state.shuffledCorrectIndex,
  };
}

export function moduleFinished(
  module: LearningModule | null,
  state: FrameSessionState | null
): boolean {
  if (!module || !state) return false;
  return state.phase === "done" && state.frameIndex >= module.frames.length - 1;
}
