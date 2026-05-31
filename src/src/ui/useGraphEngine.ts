import { useSyncExternalStore } from "react";
import { getSnapshot, subscribeGraph } from "../core/graphEngine";

export function useGraphEngine() {
  return useSyncExternalStore(subscribeGraph, getSnapshot, getSnapshot);
}
