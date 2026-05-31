import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { getModule } from "../content/frames/registry";
import { logActiveFrame } from "../content/frames/logActiveFrame";
import { markFrameComplete } from "../memory/frameProgress";
import { loadFrameSession, saveFrameSession } from "../memory/frameSession";
import {
  currentFrame,
  frameReducer,
  moduleFinished,
  type FrameSessionState,
} from "./frameEngine";
import { createFrameMapModel } from "./frameMapModel";

export function useFrameLearning() {
  const [progressTick, setProgressTick] = useState(0);
  const [session, dispatch] = useReducer(
    (s: FrameSessionState | null, a: Parameters<typeof frameReducer>[1]) => {
      const module = s ? getModule(s.moduleId) : null;
      return frameReducer(s, a, module);
    },
    null as FrameSessionState | null,
    () => {
      const saved = loadFrameSession();
      if (!saved) return null;
      const mod = getModule(saved.moduleId);
      if (!mod) return null;
      return {
        moduleId: saved.moduleId,
        frameIndex: saved.frameIndex,
        phase: saved.phase,
        selectedIndex: saved.selectedIndex,
        isCorrect: saved.isCorrect,
      };
    }
  );

  const module = session ? getModule(session.moduleId) : null;
  const frame = currentFrame(module, session);
  const finished = moduleFinished(module, session);

  useEffect(() => {
    logActiveFrame(frame, "active");
  }, [frame?.id, session?.frameIndex, session?.phase]);

  useEffect(() => {
    if (!session) return;
    saveFrameSession({
      moduleId: session.moduleId,
      frameIndex: session.frameIndex,
      phase: session.phase,
      selectedIndex: session.selectedIndex,
      isCorrect: session.isCorrect,
    });
  }, [session]);

  const refreshMapProgress = useCallback(() => {
    setProgressTick((t) => t + 1);
  }, []);

  const mapModel = useMemo(() => createFrameMapModel(), [progressTick]);

  const enterModule = useCallback((moduleId: string) => {
    dispatch({ type: "ENTER_MODULE", moduleId });
  }, []);

  const selectAnswer = useCallback((index: number) => {
    dispatch({ type: "SELECT_ANSWER", index });
  }, []);

  const reflectionYes = useCallback(() => {
    if (!module || !session || !frame) return;
    markFrameComplete(module.id, frame.id, module.frames.length);
    setProgressTick((t) => t + 1);
    dispatch({ type: "REFLECTION_YES" });
  }, [module, session, frame]);

  const reflectionConfused = useCallback(() => {
    dispatch({ type: "REFLECTION_CONFUSED" });
  }, []);

  const continueAfterClarification = useCallback(() => {
    if (!module || !session || !frame) return;
    markFrameComplete(module.id, frame.id, module.frames.length);
    setProgressTick((t) => t + 1);
    dispatch({ type: "CONTINUE_AFTER_CLARIFICATION" });
  }, [module, session, frame]);

  const nextFrame = useCallback(() => {
    if (!module || !session || !frame) return;
    if (session.phase === "done") {
      markFrameComplete(module.id, frame.id, module.frames.length);
      setProgressTick((t) => t + 1);
    }
    dispatch({ type: "NEXT_FRAME" });
  }, [module, session, frame]);

  const completeModule = useCallback(() => {
    if (!module) return;
    for (const f of module.frames) {
      markFrameComplete(module.id, f.id, module.frames.length);
    }
    setProgressTick((t) => t + 1);
  }, [module]);

  return {
    session,
    module,
    frame,
    finished,
    frameIndex: session?.frameIndex ?? 0,
    frameTotal: module?.frames.length ?? 0,
    phase: session?.phase ?? "answering",
    selectedIndex: session?.selectedIndex ?? null,
    isCorrect: session?.isCorrect ?? null,
    enterModule,
    selectAnswer,
    reflectionYes,
    reflectionConfused,
    continueAfterClarification,
    nextFrame,
    completeModule,
    refreshMapProgress,
    mapModel,
  };
}

export type FrameLearningModel = ReturnType<typeof useFrameLearning>;
