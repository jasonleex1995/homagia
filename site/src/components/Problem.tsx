import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from 'motion/react';
import { useRef, useState } from 'react';
import { SCENARIOS, STORY_MODEL } from '../data/scenarios';
import { MODELS } from '../data/site';
import type { Take } from '../data/types';
import { useTypewriter } from '../lib/hooks';
import { wordCount } from '../lib/media';
import { TakeTile } from './Takes';
import { Counter, EASE, SectionTag } from './ui';

const STEPS = 4;

/**
 * Scroll-pinned story: plain prompt → rerolls → GPT-enhanced prompt → still wrong.
 * Uses the first scenario and one model so the story stays simple.
 */
export function Problem() {
  const s = SCENARIOS[0];
  const modelName = MODELS[STORY_MODEL].label;
  const plain = s.plain[STORY_MODEL];
  const gpt = s.enhanced.takes[STORY_MODEL];
  const gptPrompt = s.enhanced.prompts[0] ?? '';
  const total = plain.length + gpt.length;

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const onStage = useInView(stage, { amount: 0.6 });
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(STEPS - 1, Math.max(0, Math.floor(v * STEPS))));
  });
  const { typed, done } = useTypewriter(s.query, onStage && step === 0);

  const captions = [
    {
      t: 'Creators can see the scene in their head.',
      d: 'So they type the feeling, the way they would describe it to a friend.',
    },
    {
      t: 'Then they reroll. Again and again.',
      d: `${plain.length} takes of the same sentence on ${modelName}. Each one is a different guess at what they meant.`,
    },
    {
      t: 'So they ask GPT to make it better.',
      d: 'The prompt grows longer and more “cinematic.” The details that carried the feeling get dropped or misread.',
    },
    {
      t: 'Longer prompts don’t fix it.',
      d: `${total} takes later, it is still not the scene in their head. Every reroll burns time and credits.`,
    },
  ];

  return (
    <section id="problem" ref={section} className="relative" style={{ height: `${STEPS * 85 + 50}vh` }}>
      <div ref={stage} className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] gap-5 px-5 md:grid-cols-12 md:gap-14 md:px-8">
          <div className="flex flex-col justify-center md:col-span-5">
            <SectionTag n="01" label="The problem" />
            <h2 className="display mt-3 text-[clamp(1.9rem,4.4vw,4.2rem)] md:mt-5">
              You can picture the shot.
              <br />
              <span className="text-paper/40">You can’t prompt it.</span>
            </h2>
            <div className="relative mt-4 min-h-[2.5rem] md:mt-8 md:min-h-[8.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-serif text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug">{captions[step].t}</p>
                  <p className="mt-3 hidden max-w-md leading-relaxed text-paper/60 md:block">{captions[step].d}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-center gap-2 md:mt-6">
              {Array.from({ length: STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === step ? 'w-10 bg-crimson' : i < step ? 'w-4 bg-paper/50' : 'w-4 bg-paper/15'
                  }`}
                />
              ))}
              <span className="hud ml-3">Scroll</span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 md:col-span-7">
            <PromptCard
              step={step}
              typed={typed}
              typing={step === 0 && !done}
              query={s.query}
              gpt={gptPrompt}
              dropped={s.enhanced.dropped ?? []}
            />
            <TakeRows step={step} plain={plain} gpt={gpt} total={total} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PromptCard({
  step,
  typed,
  typing,
  query,
  gpt,
  dropped,
}: {
  step: number;
  typed: string;
  typing: boolean;
  query: string;
  gpt: string;
  dropped: string[];
}) {
  const enhanced = step >= 2;
  return (
    <div className="rounded-2xl bg-paper p-4 text-ink shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={enhanced ? 'gpt' : 'plain'}
            className="label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {enhanced ? 'GPT-enhanced prompt' : 'Plain prompt'}
          </motion.span>
        </AnimatePresence>
        <span className="font-script text-xs text-ink/50">
          <Counter value={enhanced ? wordCount(gpt) : wordCount(query)} /> words
        </span>
      </div>
      <div className="relative h-[7.5rem] overflow-hidden md:h-[12.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {enhanced ? (
            <motion.p
              key="gpt"
              className="fade-bottom h-full font-script text-[0.78rem] leading-[1.6] text-ink/80 md:text-[0.86rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Struck text={gpt} phrases={dropped} active={step >= 3} />
            </motion.p>
          ) : (
            <motion.p
              key="plain"
              className="flex h-full items-center font-script text-[0.95rem] leading-relaxed md:text-[1.3rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>
                “{step === 0 ? typed : query}
                {typing && <span className="caret" />}”
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
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
              active ? 'bg-crimson/15 decoration-crimson' : 'decoration-transparent'
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

function TakeRows({ step, plain, gpt, total }: { step: number; plain: Take[]; gpt: Take[]; total: number }) {
  return (
    <div className="relative min-h-[9rem] md:min-h-[13rem]">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="empty" exit={{ opacity: 0 }}>
            <div className="mb-2 h-4" />
            <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(plain.length, 5)}, minmax(0, 1fr))` }}>
              {plain.map((_, i) => (
                <div key={i} className="aspect-video rounded-md border border-dashed border-paper/15" />
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="plain" exit={{ opacity: 0, y: -8 }}>
            <Row label="Plain prompt" takes={plain} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="gpt" exit={{ opacity: 0, y: -8 }}>
            <Row label="GPT-enhanced prompt" takes={gpt} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="all" exit={{ opacity: 0 }} className="space-y-4">
            <Row label="Plain prompt" takes={plain} instant />
            <Row label="GPT-enhanced prompt" takes={gpt} instant />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === 3 && (
          <motion.div
            key="tally"
            className="pointer-events-none absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
          >
            <div className="rounded-2xl bg-ink/85 px-8 py-5 text-center ring-1 ring-paper/15 backdrop-blur-sm">
              <div className="display text-[clamp(2.8rem,5.5vw,4.6rem)]">
                <Counter from={0} value={total} duration={1.2} /> takes
              </div>
              <div className="hud mt-1">Still not the scene in their head</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, takes, instant = false }: { label: string; takes: Take[]; instant?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="hud">{label}</span>
        <span className="hud">× {takes.length}</span>
      </div>
      <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(takes.length, 5)}, minmax(0, 1fr))` }}>
        {takes.map((t, i) => (
          <TakeTile
            key={`${t.src}-${i}`}
            take={t}
            index={i}
            appearDelay={instant ? 0 : i * 0.15}
            stampDelay={instant ? 0.1 : 0.55 + i * 0.22}
            compact
          />
        ))}
      </div>
    </div>
  );
}
