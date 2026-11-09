import { AnimatePresence, motion, useInView } from 'motion/react';
import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { modelName } from '../data/site';
import type { ModelId, Take } from '../data/types';
import { media, pad2 } from '../lib/media';
import { EASE, PlaceholderBadge, Stamp } from './ui';
import { Video } from './Video';

/*
 * The shared "stage" used by Problem and Solution: one big card per method,
 * a caption on top, one slide of media, paddles at the edges, dots below.
 */

/** Scenario switcher. Problem and Solution share the same state. */
export function ScenarioTabs({ sid, onChange }: { sid: number; onChange: (i: number) => void }) {
  // With a single scenario there is nothing to switch; keep only the badge.
  if (SCENARIOS.length < 2) {
    return SCENARIOS[0]?.placeholder ? (
      <div className="flex justify-center">
        <PlaceholderBadge show />
      </div>
    ) : null;
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SCENARIOS.map((x, i) => (
        <button
          key={x.id}
          type="button"
          aria-pressed={i === sid}
          onClick={() => onChange(i)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            i === sid ? 'bg-accent text-paper' : 'bg-paper/6 text-paper/70 hover:bg-paper/12'
          }`}
        >
          <span className="mr-2 font-script text-xs opacity-60">S{pad2(i + 1)}</span>
          {x.title}
        </button>
      ))}
      <PlaceholderBadge show={SCENARIOS[sid]?.placeholder} className="ml-1" />
    </div>
  );
}

type CarouselProps = {
  count: number;
  start?: number;
  /** Homagia's own cards get the brand frame. */
  accent?: boolean;
  caption: (i: number) => ReactNode;
  /** `live` is true for the visible slide once the card is on screen. */
  slide: (i: number, live: boolean) => ReactNode;
};

export function Carousel({ count, start = 0, accent = false, caption, slide }: CarouselProps) {
  const [i, setI] = useState(() => Math.min(Math.max(0, start), Math.max(0, count - 1)));
  const card = useRef<HTMLDivElement>(null);
  const seen = useInView(card, { once: true, margin: '0px 0px -20% 0px' });
  const go = (d: number) => setI((v) => Math.min(count - 1, Math.max(0, v + d)));
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div
      ref={card}
      tabIndex={0}
      onKeyDown={onKey}
      className={`rounded-3xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-400 md:p-7 ${
        accent ? 'bg-ink-2 ring-2 ring-brand-500/60' : 'bg-paper/4 ring-1 ring-paper/10'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {caption(i)}
        </motion.div>
      </AnimatePresence>

      <div className="relative mt-5">
        <div className="overflow-hidden rounded-2xl">
          {/* initial={false}: open on the start slide instead of sliding there on load. */}
          <motion.div className="flex" initial={false} animate={{ x: `${-i * 100}%` }} transition={{ duration: 0.6, ease: EASE }}>
            {Array.from({ length: count }, (_, k) => (
              <div key={k} className="w-full shrink-0" aria-hidden={k !== i}>
                {slide(k, seen && k === i)}
              </div>
            ))}
          </motion.div>
        </div>
        {count > 1 && (
          <>
            <Paddle dir={-1} show={i > 0} onClick={() => go(-1)} />
            <Paddle dir={1} show={i < count - 1} onClick={() => go(1)} />
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: count }, (_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Show slide ${k + 1}`}
              aria-current={k === i}
              onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                k === i ? `w-7 ${accent ? 'bg-brand-400' : 'bg-paper'}` : 'w-1.5 bg-paper/25 hover:bg-paper/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Paddle({ dir, show, onClick }: { dir: 1 | -1; show: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir < 0 ? 'Previous' : 'Next'}
      tabIndex={show ? 0 : -1}
      onClick={onClick}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-paper ring-1 ring-paper/20 backdrop-blur transition-opacity duration-300 hover:bg-ink md:h-12 md:w-12 ${
        dir < 0 ? 'left-2 md:-left-6' : 'right-2 md:-right-6'
      } ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir < 0 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  );
}

/** One slide: the same take from each model, side by side. */
export function ModelPair({
  order,
  takes,
  live,
  glow = false,
}: {
  order: ModelId[];
  takes: Partial<Record<ModelId, Take>>;
  live: boolean;
  glow?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {order.map((m) => {
        const t = takes[m];
        const stamp = t?.blocked ? 'blocked' : t?.verdict;
        return (
          <div
            key={m}
            className={`relative aspect-video overflow-hidden rounded-xl bg-ink ${glow ? 'ring-2 ring-brand-400' : 'ring-1 ring-paper/10'}`}
          >
            {t?.blocked ? (
              <BlockedTile src={t.src} model={modelName(m)} />
            ) : t ? (
              <Video src={t.src} />
            ) : (
              <div className="hud grid h-full place-items-center">No take</div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-ink/65 px-2.5 py-1 text-[0.7rem] font-semibold text-paper backdrop-blur md:left-3 md:top-3 md:text-xs">
              {modelName(m)}
            </span>
            {live && stamp && <Stamp kind={stamp} delay={0.35} className="bottom-2 right-2 md:bottom-3 md:right-3" />}
          </div>
        );
      })}
    </div>
  );
}

/**
 * An attempt the model refused to render: the real error screen, as tall as the
 * tile allows. The tile tops out at 632×356, so the 408×336 capture never upscales.
 */
function BlockedTile({ src, model }: { src: string; model: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-[#0c0c0e]">
      <img
        src={media(src)}
        alt={`${model} error screen: the output was flagged as sensitive content`}
        loading="lazy"
        className="h-[90%] w-auto rounded-md ring-1 ring-paper/15 md:rounded-lg"
      />
    </div>
  );
}

/** Take i of every model in display order. */
export const takesAt = (rec: Record<ModelId, Take[]>, order: ModelId[], i: number) =>
  Object.fromEntries(order.map((m) => [m, rec[m][i]])) as Partial<Record<ModelId, Take>>;
