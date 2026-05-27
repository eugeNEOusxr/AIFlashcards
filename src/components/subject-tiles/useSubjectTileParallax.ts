import { useCallback, useRef, useState } from "react";

type Tilt = { rx: number; ry: number };

export function useSubjectTileParallax(enabled: boolean) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState<Tilt>({ rx: 0, ry: 0 });

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ rx: -y * 5.5, ry: x * 7 });
    },
    [enabled]
  );

  const onPointerLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const visualStyle = enabled
    ? {
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(12px)`,
      }
    : undefined;

  return { ref, visualStyle, onPointerMove, onPointerLeave };
}
