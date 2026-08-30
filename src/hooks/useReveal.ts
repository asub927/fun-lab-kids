import { useEffect, useRef, useState } from "react";

type UseRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useReveal({
  threshold = 0.12,
  rootMargin = "0px 0px -6% 0px",
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        if (once) observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
