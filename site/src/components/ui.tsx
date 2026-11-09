import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { Fragment, useEffect, type ReactNode } from 'react';

export const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionTag({ n, label, center = false }: { n: string; label: string; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span className="font-script text-sm text-glow">{n}</span>
      <span className="h-px w-10 bg-paper/25" />
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-paper/55">{label}</span>
    </div>
  );
}

/*
 * Line-break markup for headings:
 *   "\n"  always starts a new line
 *   "|"   marks a phrase boundary — lines may only break there
 * Words inside a phrase stay on one line whenever the phrase fits the width;
 * only a phrase wider than the whole column wraps inside itself.
 */
const parseLines = (text: string) =>
  text.split('\n').map((line) =>
    line
      .split('|')
      .map((p) => p.trim())
      .filter(Boolean),
  );

/** Marks clause boundaries (after , . ; : ? !) in data text so lines break between clauses. */
export const autoPhrases = (s: string) => s.replace(/([,.;:?!])\s+/g, '$1 | ');

/** Static text that only breaks between phrases. */
export function Phrases({ text }: { text: string }) {
  return (
    <>
      {parseLines(text).map((phrases, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {phrases.map((p, pi) => (
            <Fragment key={pi}>
              {pi > 0 && ' '}
              <span className="inline-block">{p}</span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/** Word-by-word mask reveal when scrolled into view. Accepts the same "\n" / "|" markup as Phrases. */
export function RevealWords({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  let order = 0;
  return (
    <span className={className}>
      {parseLines(text).map((phrases, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {phrases.map((phrase, pi) => (
            <Fragment key={pi}>
              {pi > 0 && ' '}
              <span className="inline-block">
                {phrase.split(' ').map((w, wi, words) => {
                  const i = order++;
                  return (
                    <Fragment key={wi}>
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
                      {wi < words.length - 1 ? ' ' : null}
                    </Fragment>
                  );
                })}
              </span>
            </Fragment>
          ))}
        </Fragment>
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
        ng ? 'border-paper/55 bg-ink/60 text-paper/75' : 'border-accent bg-accent text-paper'
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
    <span className={`inline-block rounded border border-dashed border-neutral-500/60 px-2 py-0.5 font-script text-[0.66rem] uppercase tracking-wider text-neutral-500 ${className}`}>
      Placeholder data
    </span>
  );
}

export const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
