import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { MODELS } from '../data/site';
import type { Cut, ModelId, Reference, Take } from '../data/types';
import { useTypewriter } from '../lib/hooks';
import { pad2 } from '../lib/media';
import { ShotIcon } from './ShotIcon';
import { autoPhrases, Chip, EASE, ModelToggle, Phrases, PlaceholderBadge, RevealWords, SearchIcon, SectionTag, Stamp } from './ui';
import { Video } from './Video';

const STEPS = ['Intent search', 'Direction breakdown', 'Reference → recipe'];

/**
 * A scripted run of the product: no backend, every result is precomputed.
 * phase 0 typing · 1 searching · 2 references · 3 breakdown + recipe · 4 result
 */
export function HowItWorks() {
  const [sid, setSid] = useState(0);
  const [model, setModel] = useState<ModelId>('seedance');
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);
  const [copied, setCopied] = useState(false);

  const s = SCENARIOS[sid];
  const chosen = s.references.find((r) => r.id === s.chosen) ?? s.references[0];
  const result = s.ours[model][0];
  const totalSec = s.recipe.cuts.reduce((a, c) => a + c.seconds, 0);

  const windowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(windowRef, { once: true, margin: '0px 0px -30% 0px' });
  const { typed, done } = useTypewriter(s.query, inView, `${sid}:${run}`, 44);

  useEffect(() => {
    setPhase(0);
  }, [sid, run]);

  useEffect(() => {
    if (!inView || !done) return;
    const ts = [
      window.setTimeout(() => setPhase(1), 300),
      window.setTimeout(() => setPhase(2), 1800),
      window.setTimeout(() => setPhase(3), 3600),
      window.setTimeout(() => setPhase(4), 5400),
    ];
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [inView, done, sid, run]);

  const restart = (i = sid) => {
    setSid(i);
    setRun((r) => r + 1);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(s.recipe.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  const active = phase >= 4 ? 2 : phase >= 3 ? 1 : 0;

  return (
    <section id="how" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="03" label="How it works" />
        <div className="mt-5 flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <h2 className="display text-[clamp(2.4rem,5.4vw,5rem)]">
            <RevealWords text={'From a sentence\nto shots.'} />
          </h2>
          <ol className="grid gap-3 sm:grid-cols-3 xl:w-[36rem]">
            {STEPS.map((t, i) => (
              <li
                key={t}
                className={`border-t pt-3 transition-colors duration-500 ${
                  phase > 0 && i <= active ? 'border-brand-400 text-paper' : 'border-paper/15 text-paper/45'
                }`}
              >
                <span className="font-script text-xs">{pad2(i + 1)}</span>
                <p className="mt-1 text-sm font-semibold">{t}</p>
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={windowRef}
          className="surface-light mt-14 overflow-hidden rounded-2xl bg-mist text-ink shadow-[0_60px_140px_-60px_rgba(123,31,222,0.6)]"
        >
          <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="mx-auto font-script text-xs text-ink/45">homagia · intent search</span>
            <PlaceholderBadge show={s.placeholder} />
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-sm ring-1 ring-ink/10 md:py-4">
              <SearchIcon className="shrink-0 text-ink/50" />
              <p className="min-h-[1.6em] flex-1 text-[clamp(0.95rem,1.35vw,1.15rem)]">
                “{typed}
                {!done && <span className="caret" />}
                {done && '”'}
              </p>
              <span
                className={`hidden rounded-full px-4 py-1.5 text-sm font-semibold transition-colors sm:inline ${
                  phase >= 1 ? 'bg-accent text-paper' : 'bg-ink/10 text-ink/40'
                }`}
              >
                Search
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink/45">Try</span>
              {SCENARIOS.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => restart(i)}
                  className={`rounded-full px-3 py-1 transition-colors ${i === sid ? 'bg-accent text-paper' : 'bg-ink/6 text-ink/70 hover:bg-ink/10'}`}
                >
                  {x.title}
                </button>
              ))}
              <button type="button" onClick={() => restart()} className="ml-auto text-ink/50 transition-colors hover:text-ink">
                ↻ Replay
              </button>
            </div>

            <AnimatePresence>
              {phase === 1 && (
                <motion.div
                  key="busy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 flex items-center gap-3 text-sm text-ink/60"
                >
                  <span className="spinner text-accent" />
                  Reading the intent, then grouping scenes that create the same feeling…
                </motion.div>
              )}
            </AnimatePresence>

            {phase >= 2 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="label">References · same intent, different styles</span>
                  <span className="font-script text-xs text-ink/45">{s.references.length} scenes</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {s.references.map((r, i) => (
                    <RefCard
                      key={`${sid}-${r.id}`}
                      r={r}
                      delay={i * 0.12}
                      picked={phase >= 3 && r.id === chosen.id}
                      dim={phase >= 3 && r.id !== chosen.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                className="mt-6 grid gap-5 lg:grid-cols-12"
              >
                <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10 lg:col-span-4">
                  <span className="label">Reference</span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight">
                    {chosen.film}
                    {chosen.scene ? `, ${chosen.scene}` : ''}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {chosen.chips.map((c) => (
                      <Chip key={c} tone="light">
                        {c}
                      </Chip>
                    ))}
                  </div>
                  <span className="label mt-6 block">Why it works</span>
                  <p className="mt-2 font-serif text-[1.15rem] leading-snug">
                    <Phrases text={autoPhrases(chosen.why)} />
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10 lg:col-span-8">
                  <div className="flex items-center justify-between">
                    <span className="label">Recipe</span>
                    <span className="font-script text-xs text-ink/45">
                      {s.recipe.cuts.length} cuts · {totalSec}s
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {s.recipe.cuts.map((c, i) => (
                      <CutCard key={`${sid}-${i}`} c={c} i={i} />
                    ))}
                  </div>
                  <pre
                    data-lenis-prevent
                    className="mt-4 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg bg-mist p-4 font-script text-[0.8rem] leading-relaxed text-ink/80"
                  >
                    {s.recipe.prompt}
                  </pre>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <ModelToggle id="how" value={model} onChange={setModel} tone="light" />
                    <button
                      type="button"
                      onClick={copy}
                      className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper transition-transform active:scale-95"
                    >
                      {copied ? 'Copied ✓' : 'Copy prompt'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>{phase >= 4 && result && <ResultReveal key={sid} chosen={chosen} result={result} model={model} />}</AnimatePresence>
      </div>
    </section>
  );
}

function RefCard({ r, delay, picked, dim }: { r: Reference; delay: number; picked: boolean; dim: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: dim ? 0.5 : 1, y: 0 }}
      transition={{ delay: dim ? 0 : delay, duration: 0.5, ease: EASE }}
      className={`relative overflow-hidden rounded-xl bg-white ${picked ? 'ring-2 ring-accent' : 'ring-1 ring-ink/10'}`}
    >
      <div className="relative aspect-video bg-ink">
        <Video src={r.src} small />
        <AnimatePresence>
          {picked && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-paper"
            >
              Creator’s pick
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-serif text-lg font-semibold leading-tight">{r.film}</h4>
          {r.year && <span className="font-script text-xs text-ink/45">{r.year}</span>}
        </div>
        {r.director && <p className="mt-0.5 text-xs text-ink/50">{r.director}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {r.chips.map((c) => (
            <Chip key={c} tone="light">
              {c}
            </Chip>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CutCard({ c, i }: { c: Cut; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.14, duration: 0.45, ease: EASE }}>
      <div className="relative aspect-video overflow-hidden rounded-md bg-brand-950 text-paper/30">
        <ShotIcon size={c.size} />
        <span className="absolute left-1.5 top-1 font-script text-[0.6rem] text-paper/50">{pad2(i + 1)}</span>
      </div>
      <p className="mt-2 text-sm font-semibold">
        {c.shot} · {c.seconds}s
      </p>
      <p className="text-xs leading-snug text-ink/55">{c.desc}</p>
    </motion.div>
  );
}

function ResultReveal({ chosen, result, model }: { chosen: Reference; result: Take; model: ModelId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mt-10"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="label">Result</span>
        <span className="h-px flex-1 bg-paper/15" />
        <span className="hud">One take. Directed.</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <figure>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-3 ring-1 ring-paper/10">
            <Video src={chosen.src} />
          </div>
          <figcaption className="hud mt-3 flex items-center justify-between gap-3">
            <span>
              Reference · {chosen.film}
              {chosen.year ? ` (${chosen.year})` : ''}
            </span>
            <span>{chosen.director}</span>
          </figcaption>
        </figure>
        <figure>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-3 ring-2 ring-brand-400">
            <Video key={result.src} src={result.src} />
            <Stamp kind="ok" delay={0.9} className="right-3 top-3 text-sm" />
          </div>
          <figcaption className="hud mt-3 flex items-center justify-between gap-3">
            <span>Homagia recipe → {MODELS[model].label}</span>
            <span>Take 01</span>
          </figcaption>
        </figure>
      </div>
    </motion.div>
  );
}
