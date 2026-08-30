import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  className?: string;
  duration?: number;
};

export function AnimatedNumber({ value, className = "", duration = 700 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const start = display;
    const diff = value - start;
    if (diff === 0) return;

    const startTime = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from last rendered value to new target
  }, [value, duration]);

  return (
    <span className={`animated-number ${className}`.trim()} aria-live="off">
      {display}
    </span>
  );
}
