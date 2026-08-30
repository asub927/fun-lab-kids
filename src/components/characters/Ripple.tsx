type RippleProps = {
  className?: string;
};

export function Ripple({ className }: RippleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      width="80"
      height="80"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="72" height="72" rx="12" fill="var(--color-magenta)" stroke="var(--color-ink)" strokeWidth="3" />
      <ellipse cx="40" cy="44" rx="22" ry="18" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <circle cx="32" cy="40" r="3" fill="var(--color-ink)" />
      <circle cx="48" cy="40" r="3" fill="var(--color-ink)" />
      <path d="M34 48 Q40 54 46 48" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
      <rect x="52" y="28" width="18" height="22" rx="2" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="2" />
      <line x1="56" y1="34" x2="66" y2="34" stroke="var(--color-ink)" strokeWidth="1.5" />
      <line x1="56" y1="38" x2="64" y2="38" stroke="var(--color-ink)" strokeWidth="1.5" />
      <line x1="56" y1="42" x2="66" y2="42" stroke="var(--color-ink)" strokeWidth="1.5" />
      <ellipse cx="22" cy="52" rx="8" ry="5" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2" />
      <ellipse cx="58" cy="52" rx="8" ry="5" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2" />
    </svg>
  );
}
