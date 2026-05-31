import { useEffect } from "react";
import type { NavScreen } from "../world/types";

/** One scroll surface per screen; reset position when navigating on phone. */
export function useAppNavEffects(nav: NavScreen): void {
  useEffect(() => {
    const lockMap = nav.kind === "SUBJECT";
    document.documentElement.classList.toggle("la-scroll-lock", lockMap);
    document.body.classList.toggle("la-scroll-lock", lockMap);

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    return () => {
      document.documentElement.classList.remove("la-scroll-lock");
      document.body.classList.remove("la-scroll-lock");
    };
  }, [nav]);
}
