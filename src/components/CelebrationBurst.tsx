import type { CSSProperties } from "react";

const PARTICLES = [
  { color: "var(--color-magenta)", tx: "-48px", ty: "-72px", rot: "12deg", delay: "0ms" },
  { color: "var(--color-teal)", tx: "52px", ty: "-64px", rot: "-18deg", delay: "40ms" },
  { color: "var(--color-mustard)", tx: "-32px", ty: "-88px", rot: "24deg", delay: "80ms" },
  { color: "var(--color-orange)", tx: "36px", ty: "-80px", rot: "-8deg", delay: "20ms" },
  { color: "var(--color-blue)", tx: "-64px", ty: "-48px", rot: "6deg", delay: "60ms" },
  { color: "var(--color-magenta)", tx: "64px", ty: "-52px", rot: "-14deg", delay: "100ms" },
  { color: "var(--color-teal)", tx: "0px", ty: "-96px", rot: "0deg", delay: "30ms" },
  { color: "var(--color-mustard)", tx: "-20px", ty: "-60px", rot: "16deg", delay: "70ms" },
  { color: "var(--color-orange)", tx: "24px", ty: "-68px", rot: "-22deg", delay: "110ms" },
  { color: "var(--color-olive)", tx: "-56px", ty: "-36px", rot: "10deg", delay: "50ms" },
  { color: "var(--color-blue)", tx: "48px", ty: "-40px", rot: "-6deg", delay: "90ms" },
  { color: "var(--color-magenta)", tx: "8px", ty: "-76px", rot: "20deg", delay: "120ms" },
] as const;

const BALLOONS = [
  { color: "var(--color-magenta)", left: "14%", delay: "0ms", drift: "-18px" },
  { color: "var(--color-teal)", left: "38%", delay: "120ms", drift: "16px" },
  { color: "var(--color-mustard)", left: "62%", delay: "60ms", drift: "-12px" },
  { color: "var(--color-orange)", left: "82%", delay: "180ms", drift: "20px" },
] as const;

type CelebrationBurstProps = {
  active?: boolean;
  withBalloons?: boolean;
};

export function CelebrationBurst({ active = true, withBalloons = false }: CelebrationBurstProps) {
  if (!active) return null;

  return (
    <div className="celebration-burst" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={`particle-${index}`}
          className="celebration-particle"
          style={
            {
              "--particle-color": particle.color,
              "--tx": particle.tx,
              "--ty": particle.ty,
              "--rot": particle.rot,
              "--delay": particle.delay,
            } as CSSProperties
          }
        />
      ))}
      {withBalloons &&
        BALLOONS.map((balloon, index) => (
          <span
            key={`balloon-${index}`}
            className="celebration-balloon"
            style={
              {
                "--balloon-color": balloon.color,
                "--balloon-left": balloon.left,
                "--balloon-delay": balloon.delay,
                "--balloon-drift": balloon.drift,
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
