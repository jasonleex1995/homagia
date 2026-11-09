import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, type ReactNode } from 'react';
import { MODELS, MODEL_IDS } from '../data/site';
import type { ModelId } from '../data/types';

export const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-script text-sm text-crimson">{n}</span>
      <span className="h-px w-10 bg-paper/25" />
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-paper/55">{label}</span>
    </div>
  );
}

/** Word-by-word mask reveal when scrolled into view. */
export function RevealWords({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.04 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

export function Chip({ children, tone = 'dark', className = '' }: { children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.78rem] leading-none ${
        tone === 'dark' ? 'bg-paper/10 text-paper/85' : 'bg-ink/7 text-ink/80'
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** Film-set verdict stamp: NG (no good) or OK (keeper). */
export function Stamp({ kind, delay = 0, className = '' }: { kind: 'ng' | 'ok'; delay?: number; className?: string }) {
  const ng = kind === 'ng';
  return (
    <motion.span
      initial={{ scale: 2.2, opacity: 0, rotate: ng ? -18 : -10 }}
      animate={{ scale: 1, opacity: 1, rotate: ng ? -9 : -5 }}
      transition={{ delay, type: 'spring', stiffness: 520, damping: 20 }}
      className={`pointer-events-none absolute z-10 inline-block rounded-[3px] border-2 px-1.5 py-px font-script text-[0.72rem] font-bold tracking-[0.18em] ${
        ng ? 'border-crimson bg-ink/50 text-crimson' : 'border-paper bg-paper text-ink'
      } ${className}`}
    >
      {ng ? 'NG' : 'OK'}
    </motion.span>
  );
}

/** Animated number. Pass `from` to count up on mount. */
export function Counter({
  value,
  from,
  duration = 1.4,
  format = (v: number) => String(Math.round(v)),
}: {
  value: number;
  from?: number;
  duration?: number;
  format?: (v: number) => string;
}) {
  const mv = useMotionValue(from ?? value);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [value, duration, mv]);
  return <motion.span>{text}</motion.span>;
}

export function PlaceholderBadge({ show, className = '' }: { show?: boolean; className?: string }) {
  if (!show) return null;
  return (
    <span className={`inline-block rounded border border-dashed border-coral/60 px-2 py-0.5 font-script text-[0.66rem] uppercase tracking-wider text-coral ${className}`}>
      Placeholder data
    </span>
  );
}

export function ModelToggle({ id, value, onChange, tone = 'dark' }: { id: string; value: ModelId; onChange: (m: ModelId) => void; tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className={`inline-flex rounded-full p-1 ${dark ? 'bg-paper/10' : 'bg-ink/7'}`}>
      {MODEL_IDS.map((m) => (
        <button key={m} type="button" onClick={() => onChange(m)} className="relative rounded-full px-4 py-1.5 text-sm font-semibold">
          {value === m && (
            <motion.span
              layoutId={`toggle-${id}`}
              className={`absolute inset-0 rounded-full ${dark ? 'bg-paper' : 'bg-ink'}`}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <span className={`relative ${value === m ? (dark ? 'text-ink' : 'text-paper') : dark ? 'text-paper/65' : 'text-ink/55'}`}>{MODELS[m].label}</span>
        </button>
      ))}
    </div>
  );
}

export const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M7 5v14l12-7z" />
  </svg>
);

export const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
