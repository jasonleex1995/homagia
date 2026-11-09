import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { MODEL_ORDER } from '../data/site';
import { wordCount } from '../lib/media';
import { Carousel, ModelPair, ScenarioTabs, takesAt } from './Stage';
import { Counter, EASE, Phrases, SectionTag } from './ui';

/**
 * Today's workflow, as two stages: the plain prompt rerolled N times, and N
 * GPT-enhanced rewrites. Every slide shows Kling and Seedance side by side.
 */
export function Problem({ sid, onScenario }: { sid: number; onScenario: (i: number) => void }) {
  const s = SCENARIOS[sid];
  const plainCount = Math.max(1, ...MODEL_ORDER.map((m) => s.plain[m].length));
  const gptCount = Math.max(1, s.enhanced.prompts.length, ...MODEL_ORDER.map((m) => s.enhanced.takes[m].length));
  const total = MODEL_ORDER.reduce((a, m) => a + s.plain[m].length + s.enhanced.takes[m].length, 0);

  const tally = useRef<HTMLDivElement>(null);
  const tallyIn = useInView(tally, { once: true, margin: '0px 0px -15% 0px' });

  return (
    <section id="problem" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <header className="text-center">
          <SectionTag n="01" label="The problem" center />
          {/* One line per sentence on desktop; on phones each sentence gets its own line. */}
          <h2 className="display mt-5 text-[clamp(1.9rem,3.9vw,3.6rem)]">
            <Phrases text="You can picture | the shot." />{' '}
            <br className="md:hidden" />
            <span className="text-paper/40">
              <Phrases text="You can’t | prompt it." />
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-paper/60">
            <Phrases
              text={
                'Creators can see the scene | in their head.\nToday there are two common ways | to ask a model for it, | and both end in rerolls.'
              }
            />
          </p>
        </header>

        <div className="mt-10">
          <ScenarioTabs sid={sid} onChange={onScenario} />
        </div>

        <div className="mt-10 space-y-6 md:space-y-8">
          <Carousel
            key={`plain-${s.id}`}
            count={plainCount}
            caption={(i) => <PromptCaption title="Plain prompt" text={s.query} counter={`Take ${i + 1} / ${plainCount}`} />}
            slide={(i, live) => <ModelPair order={MODEL_ORDER} takes={takesAt(s.plain, MODEL_ORDER, i)} live={live} />}
          />
          <Carousel
            key={`gpt-${s.id}`}
            count={gptCount}
            caption={(i) => (
              <PromptCaption
                title={`GPT-enhanced prompt v${i + 1}`}
                text={s.enhanced.prompts[i] ?? ''}
                counter={`v${i + 1} / ${gptCount}`}
                dropped={s.enhanced.dropped}
              />
            )}
            slide={(i, live) => <ModelPair order={MODEL_ORDER} takes={takesAt(s.enhanced.takes, MODEL_ORDER, i)} live={live} />}
          />
        </div>

        <motion.div
          ref={tally}
          initial={{ opacity: 0, y: 20 }}
          animate={tallyIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-4 rounded-3xl bg-paper/4 px-6 py-8 text-center ring-1 ring-paper/10 md:mt-10 md:flex-row md:justify-center md:gap-10 md:px-10 md:text-left"
        >
          <div className="display shrink-0 text-[clamp(3rem,5.5vw,5rem)] leading-none">
            <Counter from={0} value={tallyIn ? total : 0} duration={1.2} /> <span className="text-paper/40">takes</span>
          </div>
          <div>
            <p className="font-serif text-[clamp(1.4rem,2.2vw,2rem)] leading-snug">Longer prompts don’t fix it.</p>
            <p className="mt-2 leading-relaxed text-paper/60">
              <Phrases text={`${total} takes later, | it is still not the scene in their head.\nEvery reroll burns time and credits.`} />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Prompt shown above a slide: label, word count, slide counter, and the prompt itself. */
function PromptCaption({ title, text, counter, dropped = [] }: { title: string; text: string; counter: string; dropped?: string[] }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 200;
  const hasDropped = dropped.some((p) => text.toLowerCase().includes(p.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-paper">{title}</h3>
          <span className="font-script text-xs text-paper/45">{wordCount(text)} words</span>
        </div>
        <span className="shrink-0 font-script text-xs text-paper/50">{counter}</span>
      </div>
      <p
        className={`mt-3 font-script text-[clamp(0.9rem,1.05vw,1.02rem)] leading-relaxed text-paper/80 ${
          long && !open ? 'line-clamp-4 md:line-clamp-none' : ''
        }`}
      >
        “<Struck text={text} phrases={dropped} />”
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {hasDropped && (
          <span className="text-xs text-paper/45">
            <span className="line-through decoration-brand-400 decoration-2">Struck through</span>: details the model ignored
          </span>
        )}
        {long && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs text-paper/50 transition-colors hover:text-paper md:hidden">
            {open ? 'Show less' : 'Show full prompt'}
          </button>
        )}
      </div>
    </div>
  );
}

/** Strikes through the phrases the model ignored. */
function Struck({ text, phrases }: { text: string; phrases: string[] }) {
  if (!phrases.length) return <>{text}</>;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  const lower = phrases.map((p) => p.toLowerCase());
  return (
    <>
      {parts.map((p, i) =>
        lower.includes(p.toLowerCase()) ? (
          <span key={i} className="bg-paper/8 line-through decoration-brand-400 decoration-2">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
