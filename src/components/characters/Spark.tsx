type SparkProps = {
  className?: string;
};

export function Spark({ className }: SparkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      width="80"
      height="80"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="72" height="72" rx="12" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="3" />
      <ellipse cx="40" cy="38" rx="18" ry="20" fill="var(--color-mustard)" stroke="var(--color-ink)" strokeWidth="2.5" opacity="0.9" />
      <path
        d="M40 58 Q32 68 28 72 M40 58 Q48 68 52 72 M40 58 Q40 70 40 74"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="34" cy="36" r="2.5" fill="var(--color-ink)" />
      <circle cx="46" cy="36" r="2.5" fill="var(--color-ink)" />
      <path d="M36 44 Q40 48 44 44" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="58" cy="24" r="10" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2" />
      <line x1="58" y1="34" x2="58" y2="42" stroke="var(--color-ink)" strokeWidth="2" />
      <line x1="52" y1="28" x2="48" y2="24" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
