type DigitsProps = {
  className?: string;
};

export function Digits({ className }: DigitsProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      width="80"
      height="80"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4" y="4" width="72" height="72" rx="12" fill="var(--color-teal)" stroke="var(--color-ink)" strokeWidth="3" />
      <ellipse cx="40" cy="48" rx="24" ry="16" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <text x="40" y="52" textAnchor="middle" fontSize="14" fontFamily="var(--font-display)" fill="var(--color-ink)">
        42
      </text>
      <circle cx="28" cy="32" r="8" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="52" cy="32" r="8" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="26" cy="30" r="2" fill="var(--color-ink)" />
      <circle cx="50" cy="30" r="2" fill="var(--color-ink)" />
      <path d="M18 56 L14 62 M62 56 L66 62" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 58 L18 64 M58 58 L62 64" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
