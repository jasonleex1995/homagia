import type { ShotSize } from '../data/types';

/** Storyboard silhouettes for each shot size, in the style of the pitch deck. */
export function ShotIcon({ size }: { size: ShotSize }) {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" fill="currentColor" aria-hidden>
      {size === 'wide' && (
        <>
          <rect x="0" y="62" width="160" height="1" opacity="0.5" />
          <circle cx="66" cy="45" r="4.5" />
          <rect x="61.5" y="50" width="9" height="12" rx="3.5" />
          <circle cx="98" cy="48" r="3.5" opacity="0.7" />
          <rect x="94.5" y="52" width="7" height="10" rx="3" opacity="0.7" />
        </>
      )}
      {size === 'medium' && (
        <>
          <circle cx="64" cy="36" r="11" />
          <path d="M42 90c0-24 9-38 22-38s22 14 22 38z" />
          <circle cx="106" cy="46" r="6.5" opacity="0.6" />
          <path d="M94 90c0-18 5-30 12-30s12 12 12 30z" opacity="0.6" />
        </>
      )}
      {size === 'close' && (
        <>
          <circle cx="80" cy="40" r="22" />
          <path d="M38 90c0-17 18-26 42-26s42 9 42 26z" />
        </>
      )}
      {size === 'extreme' && (
        <>
          <circle cx="80" cy="-14" r="66" />
          <path d="M80 60c-4 7-7 11-7 15a7 7 0 0 0 14 0c0-4-3-8-7-15z" fill="var(--color-crimson)" />
        </>
      )}
    </svg>
  );
}
