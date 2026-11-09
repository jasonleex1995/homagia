import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { isRealClip, SCENARIOS } from '../data/scenarios';
import { SITE } from '../data/site';
import { media, posterOf } from '../lib/media';
import { EASE, Phrases } from './ui';

const CURTAIN = [0.76, 0, 0.24, 1] as const;
const LEDE =
  'Describe how a scene should feel.\nHomagia shows you | how the masters already shot it,\nthen turns it into a cut-by-cut recipe | your video model can follow.';

/** How far each curtain bar must travel to leave a 2.39:1 frame (capped on tall screens). */
function useLetterbox(ref: RefObject<HTMLElement | null>) {
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const h = el.clientHeight;
      const w = el.clientWidth;
      const bar = Math.max(0, Math.min((h - w / 2.39) / 2, h * 0.17));
      setShift(h / 2 - bar);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return shift;
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const shift = useLetterbox(section);

  // One clip per film, cycling behind the title. Real footage only, once there is some.
  const reel = useMemo(() => {
    const seen = new Set<string>();
    const all = SCENARIOS.flatMap((s) => s.references);
    const real = all.filter((r) => isRealClip(r.src));
    return (real.length ? real : all)
      .filter((r) => (seen.has(r.film) ? false : (seen.add(r.film), true)))
      .map((r) => ({ src: r.src, credit: `${r.film}${r.year ? ` (${r.year})` : ''}` }));
  }, []);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reel.length < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % reel.length), 4200);
    return () => window.clearInterval(t);
  }, [reel.length]);
  const clip = reel[i];

  const bar = { duration: 1.5, ease: CURTAIN, delay: 0.2 };

  return (
    <section id="top" ref={section} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          {clip && (
            <motion.video
              key={i}
              src={media(clip.src)}
              poster={posterOf(clip.src)}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: 'linear' } }}
            />
          )}
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(123,31,222,0.3) 0%, rgba(0,0,0,0.45) 56%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

      {/* Letterbox curtain: closed on load, opens to a 2.39:1 frame. */}
      <motion.div className="absolute inset-x-0 top-0 z-10 h-1/2 bg-ink" initial={{ y: 0 }} animate={{ y: -shift }} transition={bar}>
        <motion.div
          className="hud absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-3 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span>Scene 00 · Homagia</span>
          <span className="hidden sm:inline">c0mpiled-17: Seoul · Team Yonsei</span>
        </motion.div>
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-ink" initial={{ y: 0 }} animate={{ y: shift }} transition={bar}>
        <motion.div
          className="hud absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-3 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.span key={clip?.credit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Ref · {clip?.credit}
            </motion.span>
          </AnimatePresence>
          <span>Scroll ↓</span>
        </motion.div>
      </motion.div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.9, ease: EASE }}
          className="text-[clamp(0.95rem,1.5vw,1.3rem)] text-paper/85"
        >
          <Phrases text="Directing-reference search | for a billion creators" />
        </motion.p>
        <h1 className="display mt-1 text-[clamp(4.5rem,15.5vw,13.5rem)] leading-[0.9]" aria-label="Homagia">
          {'Homagia'.split('').map((ch, k) => (
            <span key={k} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden>
              <motion.span
                className="inline-block"
                initial={{ y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.9 + k * 0.055, duration: 1.1, ease: EASE }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.9, ease: EASE }}
          className="mt-3 max-w-[46rem] text-[clamp(1rem,1.35vw,1.18rem)] leading-relaxed text-paper/70"
        >
          <Phrases text={LEDE} />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.95, duration: 0.9, ease: EASE }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#solution" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-brand-400">
            See how it works
          </a>
          {SITE.demoVideo && (
            <a
              href={SITE.demoVideo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-paper/25 px-5 py-2.5 text-sm text-paper/85 transition-colors hover:border-paper/60"
            >
              Watch the demo
            </a>
          )}
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-paper/25 px-5 py-2.5 text-sm text-paper/85 transition-colors hover:border-paper/60"
          >
            GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
