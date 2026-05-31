import { useSyncExternalStore } from "react";
import {
  getLearningState,
  subscribeLearningState,
} from "../core/state/learningState";

export function useLearning() {
  return useSyncExternalStore(
    subscribeLearningState,
    getLearningState,
    getLearningState
  );
}
