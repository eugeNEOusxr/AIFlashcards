import { useCallback, useRef } from "react";

/** Pointer tilt via direct DOM transform — no React state on move. */
export function useSubjectTileParallax(enabled: boolean) {
  const ref = useRef<HTMLButtonElement>(null);
  const visualRef = useRef<HTMLSpanElement | null>(null);

  const setVisualRef = useCallback((el: HTMLSpanElement | null) => {
    visualRef.current = el;
  }, []);

  const applyTilt = useCallback(
    (rx: number, ry: number) => {
      const el = visualRef.current;
      if (!el) return;
      if (!enabled || (rx === 0 && ry === 0)) {
        el.style.transform = "";
        return;
      }
      el.style.transform = `translate3d(0, 0, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    },
    [enabled]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      applyTilt(-y * 5.5, x * 7);
    },
    [enabled, applyTilt]
  );

  const onPointerLeave = useCallback(() => {
    applyTilt(0, 0);
  }, [applyTilt]);

  return { ref, setVisualRef, onPointerMove, onPointerLeave };
};
