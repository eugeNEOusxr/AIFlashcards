import { useCallback, useEffect, useRef, useState } from "react";

export const PRESENCE_TRAIL_EVENT = "cls-presence-trail";

export type PresenceTrailPulse = "correct" | "incorrect" | "mastery" | "idle";

export type PresenceTrailVisual = {
  pulse: PresenceTrailPulse;
  intensity: number;
};

const IDLE_FADE_MS = 50_000;
const PULSE_DECAY_MS = 2_400;

export function emitPresenceTrail(pulse: PresenceTrailPulse): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<PresenceTrailPulse>(PRESENCE_TRAIL_EVENT, { detail: pulse })
  );
}

export function usePresenceTrail(): PresenceTrailVisual {
  const [pulse, setPulse] = useState<PresenceTrailPulse>("idle");
  const [intensity, setIntensity] = useState(0.42);
  const lastActivityRef = useRef(Date.now());
  const decayTimerRef = useRef<number | null>(null);

  const bumpActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const onPulse = (event: Event) => {
      const detail = (event as CustomEvent<PresenceTrailPulse>).detail ?? "idle";
      bumpActivity();
      if (detail === "correct") {
        setPulse("correct");
        setIntensity((v) => Math.min(1, v + 0.22));
      } else if (detail === "incorrect") {
        setPulse("incorrect");
        setIntensity((v) => Math.max(0.18, v - 0.12));
      } else if (detail === "mastery") {
        setPulse("mastery");
        setIntensity(0.95);
      } else {
        setPulse("idle");
      }

      if (decayTimerRef.current) window.clearTimeout(decayTimerRef.current);
      decayTimerRef.current = window.setTimeout(() => setPulse("idle"), PULSE_DECAY_MS);
    };

    window.addEventListener(PRESENCE_TRAIL_EVENT, onPulse);
    return () => {
      window.removeEventListener(PRESENCE_TRAIL_EVENT, onPulse);
      if (decayTimerRef.current) window.clearTimeout(decayTimerRef.current);
    };
  }, [bumpActivity]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_FADE_MS) {
        setIntensity((v) => Math.max(0.15, v - 0.04));
      }
    }, 8_000);
    return () => window.clearInterval(id);
  }, []);

  return { pulse, intensity };
}
