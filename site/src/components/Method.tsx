import { motion } from 'motion/react';
import { EASE, RevealWords, SectionTag } from './ui';

// TODO: align these steps with the real pipeline (models, data, sizes).
const NODES = [
  { t: 'Scene library', d: 'Film and drama scenes, cut into individual shots.' },
  { t: 'Shot breakdown', d: 'Shot size, angle, lighting, and pacing become technique chips and a one-line why.' },
  { t: 'Intent index', d: 'Scenes are indexed by the feeling they create, not the objects they contain.' },
  { t: 'Intent search', d: 'A plain sentence becomes an intent and is matched to scenes that share it.' },
  { t: 'Recipe writer', d: 'The chosen scene becomes a cut-by-cut recipe and a short, model-ready prompt.' },
];

export function Method() {
  return (
    <section id="method" className="relative border-t border-paper/10 py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="04" label="Under the hood" />
        <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 className="display text-[clamp(2.2rem,4.6vw,4.2rem)] md:col-span-7">
            <RevealWords text="Search by feeling. Export as shots." />
          </h2>
          <p className="leading-relaxed text-paper/60 md:col-span-5">
            Every scene in the library is broken down the way a director would describe it, then indexed by the emotion it
            creates. That is what lets a plain sentence find the right reference.
          </p>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-5">
          {NODES.map((n, i) => (
            <motion.div
              key={n.t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="relative rounded-xl bg-ink-2 p-5 ring-1 ring-paper/10"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-script text-sm text-crimson ring-1 ring-paper/20">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-serif text-xl font-semibold">{n.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/55">{n.d}</p>
              {i < NODES.length - 1 && (
                <span className="absolute -right-[0.85rem] top-[1.9rem] z-10 hidden text-paper/35 md:block" aria-hidden>
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <p className="mt-8 font-serif italic text-paper/45">
          Fig. 2 — How Homagia turns a sentence into shots. The examples on this page are precomputed, so the page runs
          without a backend.
        </p>
      </div>
    </section>
  );
}
