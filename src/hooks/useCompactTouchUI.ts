import { useEffect, useState } from "react";

const COMPACT_QUERY = "(max-width: 900px), (pointer: coarse)";

/** Phone / tablet touch UI — lighter motion, no landmark parallax. */
export function useCompactTouchUI(): boolean {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(COMPACT_QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return compact;
}

export function isCompactTouchUI(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COMPACT_QUERY).matches;
}
