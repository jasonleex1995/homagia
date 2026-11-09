import { motion } from 'motion/react';
import { SCENARIOS } from '../data/scenarios';
import { Chip, EASE, Phrases, RevealWords, SearchIcon, SectionTag } from './ui';
import { Video } from './Video';

/** "People can't direct, but they recognize great directing" + keyword vs intent search. */
export function Insight() {
  const s = SCENARIOS.find((x) => x.keywords) ?? SCENARIOS[0];
  const kw = s.keywords ?? { terms: [], hits: [] };
  const techniques = s.references.flatMap((r) => r.chips).slice(0, 4);
  const card = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -10% 0px' },
  };

  return (
    <section className="relative py-28 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="02" label="The insight" />
        <h2 className="display mt-6 text-[clamp(2.1rem,5.4vw,5rem)]">
          <RevealWords text="People | can’t direct." />
          <br />
          <span className="text-paper/40">
            <RevealWords text={'But they know\ngreat directing\nwhen they see it.'} delay={0.25} />
          </span>
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/60">
          <Phrases
            text={
              'Today’s reference search speaks | in tags and technical terms.\nCreators speak in feelings.\nHomagia searches the way they talk.'
            }
          />
        </p>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <motion.div {...card} transition={{ duration: 0.7, ease: EASE }} className="rounded-2xl bg-paper/4 p-6 ring-1 ring-paper/10 md:p-8">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-paper/50">Keyword search</span>
              <span className="font-script text-xs text-paper/35">today</span>
            </div>
            <QueryLine q={s.query} dark />
            <p className="mt-6 text-sm text-paper/45">What it hears</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {kw.terms.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {kw.hits.map((h) => (
                <div key={h} className="grid aspect-video place-items-center rounded-md bg-paper/4 p-2 text-center text-xs text-paper/40 ring-1 ring-paper/10">
                  {h}
                </div>
              ))}
            </div>
            <p className="mt-6 font-serif text-xl text-paper/70">Nouns work. Intent doesn’t.</p>
          </motion.div>

          <motion.div {...card} transition={{ duration: 0.7, ease: EASE, delay: 0.12 }} className="surface-light rounded-2xl bg-mist p-6 text-ink md:p-8">
            <div className="flex items-center justify-between">
              <span className="label">Homagia · intent search</span>
              <span className="font-script text-xs text-ink/40">new</span>
            </div>
            <QueryLine q={s.query} />
            <p className="mt-6 text-sm text-ink/50">What it finds</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {techniques.map((t) => (
                <Chip key={t} tone="light">
                  {t}
                </Chip>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {s.references.map((r) => (
                <div key={r.id}>
                  <div className="aspect-video overflow-hidden rounded-md bg-ink">
                    <Video src={r.src} small />
                  </div>
                  <p className="mt-1.5 truncate text-xs font-semibold">{r.film}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-serif text-xl">
              <Phrases text="A search engine that understands | how a scene should feel." />
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function QueryLine({ q, dark = false }: { q: string; dark?: boolean }) {
  return (
    <div
      className={`mt-5 flex items-center gap-3 rounded-full px-4 py-3 text-sm ${
        dark ? 'bg-paper/6 text-paper/80 ring-1 ring-paper/10' : 'bg-white text-ink ring-1 ring-ink/10'
      }`}
    >
      <SearchIcon className={`shrink-0 ${dark ? 'text-paper/40' : 'text-ink/40'}`} />
      <span className="line-clamp-1">{q}</span>
    </div>
  );
}
