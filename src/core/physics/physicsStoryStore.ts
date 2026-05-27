/**
 * Minimal local store for physics story nodes (parallel to graph).
 */

import type { PhysicsStoryNode } from "./PhysicsStoryNode";

const STORAGE_KEY = "cls:physics-stories:v1";

function load(): PhysicsStoryNode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PhysicsStoryNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: PhysicsStoryNode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota */
  }
}

let stories = load();
const listeners = new Set<() => void>();

function emit(): void {
  persist(stories);
  listeners.forEach((fn) => fn());
}

export function getPhysicsStories(): PhysicsStoryNode[] {
  return [...stories];
}

export function subscribePhysicsStore(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addPhysicsStory(story: PhysicsStoryNode): void {
  stories = [...stories, story];
  emit();
}
