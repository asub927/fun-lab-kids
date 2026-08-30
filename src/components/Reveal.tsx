import type { CSSProperties, ComponentPropsWithoutRef } from "react";
import { useReveal } from "../hooks/useReveal";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0, style, ...rest }: RevealProps) {
  const { ref, visible } = useReveal();
  const mergedStyle = { ...style, "--motion-delay": `${delay}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`motion-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

type RevealGroupProps = ComponentPropsWithoutRef<"div">;

export function RevealGroup({ children, className = "", ...rest }: RevealGroupProps) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`motion-stagger ${visible ? "is-visible" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
