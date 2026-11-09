import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SCENARIOS, STORY_MODEL } from '../data/scenarios';
import { MODELS } from '../data/site';
import type { Take } from '../data/types';
import { useTypewriter } from '../lib/hooks';
import { wordCount } from '../lib/media';
import { TakeTile } from './Takes';
import { Counter, EASE, Phrases, SectionTag } from './ui';

/**
 * The two ways creators prompt today, side by side: a plain sentence and a
 * GPT-enhanced prompt. Both end in rerolls. Uses the first scenario and one model.
 */
export function Problem() {
  const s = SCENARIOS[0];
  const modelName = MODELS[STORY_MODEL].label;
  const plain = s.plain[STORY_MODEL];
  const gpt = s.enhanced.takes[STORY_MODEL];
  const gptPrompt = s.enhanced.prompts[0] ?? '';
  const dropped = s.enhanced.dropped ?? [];
  const plainWords = wordCount(s.query);
  const gptWords = wordCount(gptPrompt);
  const total = plain.length + gpt.length;

  const pair = useRef<HTMLDivElement>(null);
  const inView = useInView(pair, { once: true, margin: '0px 0px -25% 0px' });
  const { typed, done } = useTypewriter(s.query, inView);

  // Strike the ignored phrases a beat after the panels appear.
  const [strike, setStrike] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setStrike(true), 1800);
    return () => window.clearTimeout(t);
  }, [inView]);

  const tally = useRef<HTMLDivElement>(null);
  const tallyIn = useInView(tally, { once: true, margin: '0px 0px -15% 0px' });

  return (
    <section id="problem" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="01" label="The problem" />
        {/* One line per sentence on desktop; on phones each sentence gets its own line. */}
        <h2 className="display mt-5 text-[clamp(1.9rem,3.9vw,3.6rem)]">
          <Phrases text="You can picture | the shot." />{' '}
          <br className="md:hidden" />
          <span className="text-paper/40">
            <Phrases text="You can’t | prompt it." />
          </span>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/60">
          <Phrases
            text={
              'Creators can see the scene | in their head.\nToday there are two common ways | to ask a model for it, | and both end in rerolls.'
            }
          />
        </p>

        <div ref={pair} className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2">
          <Approach
            n="01"
            title="Plain prompt"
            note={'Type the feeling | the way you would say it to a friend.\nThen reroll, again and again.'}
            takes={plain}
            model={modelName}
            words={plainWords}
            show={inView}
            delay={0}
          >
            <p className="font-script text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed">
              “{typed}
              {!done && <span className="caret" />}
              {done && '”'}
            </p>
          </Approach>
          <Approach
            n="02"
            title="GPT-enhanced prompt"
            note={'Ask GPT to make it more cinematic.\nThe details that carried the feeling | get dropped or misread.'}
            takes={gpt}
            model={modelName}
            words={gptWords}
            badge={`${(gptWords / Math.max(1, plainWords)).toFixed(1)}× longer`}
            show={inView}
            delay={0.15}
          >
            <p className="font-script text-[0.86rem] leading-[1.65] text-ink/80">
              <Struck text={gptPrompt} phrases={dropped} active={strike} />
            </p>
            {dropped.length > 0 && (
              <p className="mt-3 text-xs text-ink/55">
                <span className="line-through decoration-accent decoration-2">Struck through</span>: details the model
                ignored
              </p>
            )}
          </Approach>
        </div>

        <motion.div
          ref={tally}
          initial={{ opacity: 0, y: 20 }}
          animate={tallyIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-5 flex flex-col gap-4 rounded-2xl bg-paper/4 p-6 ring-1 ring-paper/10 md:flex-row md:items-center md:gap-12 md:p-8"
        >
          <div className="display shrink-0 text-[clamp(3rem,6vw,5.5rem)] leading-none">
            <Counter from={0} value={tallyIn ? total : 0} duration={1.2} /> <span className="text-paper/40">takes</span>
          </div>
          <div>
            <p className="font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] leading-snug">Longer prompts don’t fix it.</p>
            <p className="mt-2 leading-relaxed text-paper/60">
              <Phrases text={`${total} takes later, | it is still not the scene in their head.\nEvery reroll burns time and credits.`} />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One prompting approach: title, the prompt itself, its word count, and the takes it produced. */
function Approach({
  n,
  title,
  note,
  takes,
  model,
  words,
  badge,
  show,
  delay,
  children,
}: {
  n: string;
  title: string;
  note: string;
  takes: Take[];
  model: string;
  words: number;
  badge?: string;
  show: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className="flex flex-col rounded-2xl bg-paper/4 p-5 ring-1 ring-paper/10 md:p-7"
    >
      <span className="font-script text-sm text-paper/45">{n}</span>
      <h3 className="mt-1 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold leading-tight">{title}</h3>
      <p className="mt-2 leading-relaxed text-paper/60">
        <Phrases text={note} />
      </p>

      <div className="surface-light mt-6 flex flex-1 flex-col rounded-xl bg-mist p-5 text-ink md:p-6">
        {children}
        <div className="mt-auto flex items-baseline gap-2 pt-6">
          <span className="display text-[clamp(2rem,3vw,2.75rem)] leading-none">
            <Counter from={0} value={show ? words : 0} />
          </span>
          <span className="text-sm text-ink/55">words</span>
          {badge && <span className="ml-auto rounded-full bg-ink/8 px-3 py-1 text-xs font-semibold text-ink/70">{badge}</span>}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="hud">Takes on {model}</span>
          <span className="hud">× {takes.length}</span>
        </div>
        <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(takes.length, 4)}, minmax(0, 1fr))` }}>
          {takes.map((t, i) =>
            show ? (
              <TakeTile
                key={`${t.src}-${i}`}
                take={t}
                index={i}
                appearDelay={delay + 0.4 + i * 0.1}
                stampDelay={delay + 1.2 + i * 0.22}
                compact
              />
            ) : (
              <div key={`${t.src}-${i}`} className="aspect-video rounded-md border border-dashed border-paper/15" />
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Strikes through the phrases the model ignored. */
function Struck({ text, phrases, active }: { text: string; phrases: string[]; active: boolean }) {
  if (!phrases.length) return <>{text}</>;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  const lower = phrases.map((p) => p.toLowerCase());
  return (
    <>
      {parts.map((p, i) =>
        lower.includes(p.toLowerCase()) ? (
          <span
            key={i}
            className={`line-through decoration-2 transition-[text-decoration-color,background-color] duration-700 ${
              active ? 'bg-black/7 decoration-accent' : 'decoration-transparent'
            }`}
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
