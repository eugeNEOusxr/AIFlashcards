import { useEffect, useRef, type RefObject } from "react";

type ScrollMotionOptions = {
  /** Elements whose transform is updated directly (GPU parallax layers). */
  parallaxTargets?: RefObject<Map<string, HTMLElement> | null>;
  /** Compute translate3d per target id from scrollTop (px). */
  parallaxTransform?: (id: string, scrollTop: number) => string | null;
  /** Optional pointer vars: --pointer-x / --pointer-y (percent). */
  trackPointer?: boolean;
  /** When false, only CSS scroll vars update (no landmark parallax / pointer). */
  enabled?: boolean;
};

/**
 * Updates CSS custom properties and optional transform targets on scroll/pointer
 * without React state — avoids map re-renders during scroll.
 */
export function useScrollMotionVars(
  scrollRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  options: ScrollMotionOptions = {}
): void {
  const rafRef = useRef(0);
  const scrollTopRef = useRef(0);
  const pointerRef = useRef({ x: 50, y: 30 });
  const optsRef = useRef(options);
  optsRef.current = options;

  useEffect(() => {
    const root = scrollRef.current;
    const target = targetRef.current;
    if (!root || !target) return;

    const apply = () => {
      rafRef.current = 0;
      const y = scrollTopRef.current;
      target.style.setProperty("--scroll-y", `${y}px`);
      target.style.setProperty("--scroll-parallax-slow", `${-y * 0.08}px`);
      target.style.setProperty("--scroll-parallax-mid", `${-y * 0.15}px`);
      target.style.setProperty("--scroll-parallax-fast", `${-y * 0.22}px`);
      target.style.setProperty("--scroll-parallax-region", `${-y * 0.12}px`);
      target.style.setProperty("--scroll-parallax-start", `${-y * 0.06}px`);

      if (optsRef.current.enabled !== false) {
        const { parallaxTargets, parallaxTransform } = optsRef.current;
        const map = parallaxTargets?.current;
        if (map && parallaxTransform) {
          for (const [id, el] of map) {
            const t = parallaxTransform(id, y);
            if (t != null) el.style.transform = t;
          }
        }
      }

      if (optsRef.current.enabled !== false && optsRef.current.trackPointer) {
        const { x, y: py } = pointerRef.current;
        target.style.setProperty("--pointer-x", `${x}%`);
        target.style.setProperty("--pointer-y", `${py}%`);
      }
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      scrollTopRef.current = root.scrollTop;
      schedule();
    };

    const onPointer = (e: PointerEvent) => {
      if (!optsRef.current.trackPointer) return;
      const rect = root.getBoundingClientRect();
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      schedule();
    };

    scrollTopRef.current = root.scrollTop;
    schedule();

    root.addEventListener("scroll", onScroll, { passive: true });
    if (options.enabled !== false && options.trackPointer) {
      root.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      root.removeEventListener("scroll", onScroll);
      if (options.enabled !== false && options.trackPointer) {
        root.removeEventListener("pointermove", onPointer);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const map = optsRef.current.parallaxTargets?.current;
      if (map) {
        for (const el of map.values()) {
          el.style.transform = "";
        }
      }
    };
  }, [scrollRef, targetRef, options.trackPointer, options.enabled]);
}
