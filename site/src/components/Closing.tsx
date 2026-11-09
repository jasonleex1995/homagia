import { motion } from 'motion/react';
import { useMemo } from 'react';
import { isRealClip, SCENARIOS } from '../data/scenarios';
import { SITE } from '../data/site';
import type { Reference } from '../data/types';
import { Phrases, RevealWords, SectionTag } from './ui';

const PHASES = [
  {
    k: 'Phase 1 · Nov 9',
    t: 'Video MVP',
    d: 'Natural-language intent search and a technique tag system for film and drama scenes.',
  },
  {
    k: 'Phase 2 · Next',
    t: 'Visual & narrative',
    d: 'Extend the metadata framework to webtoon layouts, character framing, and graphic design composition.',
  },
  {
    k: 'Phase 3 · Vision',
    t: 'Cross-domain engine',
    d: 'Universal directing-reference search for a billion creators, across video, comics, design, and audio.',
  },
];

/** Roadmap, team, film credits, and footer. */
export function Closing() {
  const films = useMemo(() => {
    const seen = new Map<string, Reference>();
    // Credit only the films whose footage actually appears on the page.
    for (const s of SCENARIOS) for (const r of s.references) if (isRealClip(r.src) && !seen.has(r.film)) seen.set(r.film, r);
    return [...seen.values()];
  }, []);

  return (
    <>
      <section id="roadmap" className="border-t border-paper/10 py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <SectionTag n="06" label="Roadmap" />
          <h2 className="display mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)]">
            <RevealWords text={'From a video MVP\nto a universal | directing engine.'} />
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-paper/10 md:grid-cols-3">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.k}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="bg-ink-2 p-7 md:p-9"
              >
                <span className="label">{p.k}</span>
                <h3 className="mt-4 font-serif text-2xl font-semibold">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-paper/60">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="border-t border-paper/10 py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <SectionTag n="07" label="Team" />
          <h2 className="display mt-5 text-[clamp(2.2rem,4.6vw,4.2rem)]">Team Yonsei</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SITE.team.map((m) => (
              <div key={m.name} className="surface-light rounded-xl bg-mist p-6 text-ink">
                <p className="text-lg font-bold">{m.name}</p>
                <p className="mt-1 text-ink/60">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-paper/10 py-14">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <p className="font-serif text-4xl font-semibold tracking-tight">Homagia</p>
            <p className="mt-2 text-paper/55">Directing-reference search for a billion creators.</p>
            <p className="hud mt-8">c0mpiled-17: Seoul · Team Yonsei · Nov 9, 2026</p>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-paper/50">Film credits</p>
            <ul className="mt-3 grid gap-1 text-sm text-paper/55 sm:grid-cols-2">
              {films.map((f) => (
                <li key={f.film}>
                  <span className="italic">{f.film}</span>
                  {f.year ? ` (${f.year})` : ''}
                  {f.director ? `, ${f.director}` : ''}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-paper/35">
              <Phrases text="Film excerpts are short references | used for research and demonstration. | All rights belong to their respective owners." />
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
