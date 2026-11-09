import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Counter, RevealWords, SectionTag } from './ui';

// Figures from the pitch deck (sources listed under the section).
const STATS = [
  { to: 1, pre: '~', suf: 'M', label: 'Higgsfield paying subscribers', src: 'Company-reported, Sep 2026' },
  { to: 1, pre: '$', suf: 'B+', label: 'Higgsfield annualized revenue', src: 'Company-reported, Sep 2026' },
  { to: 500, pre: '~$', suf: 'M', label: 'Kling annualized revenue', src: 'Kuaishou, Mar 2026' },
];

export function WhyNow() {
  const grid = useRef<HTMLDivElement>(null);
  const inView = useInView(grid, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <section id="why-now" className="relative border-t border-paper/10 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionTag n="06" label="Why now" />
        <h2 className="display mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,4.4rem)]">
          <RevealWords text="Creators already pay to generate." />
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/60">
          AI created a new kind of video maker. Generation is their camera, so direction is their main way to raise
          quality.
        </p>
        <div ref={grid} className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-paper/10 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink p-7 md:p-9">
              <div className="display text-[clamp(3.2rem,6vw,5.5rem)]">
                {s.pre}
                <Counter from={0} value={inView ? s.to : 0} duration={1.8} />
                {s.suf}
              </div>
              <p className="mt-3 text-paper/80">{s.label}</p>
              <p className="mt-1 font-script text-xs text-paper/40">{s.src}</p>
            </div>
          ))}
        </div>
        <p className="mt-16 font-serif text-[clamp(1.8rem,3.6vw,3.2rem)] leading-tight text-coral">
          <RevealWords text="Generators make money when you reroll." />
          <br />
          <RevealWords text="We make money when you don’t." delay={0.4} />
        </p>
        <p className="mt-6 font-script text-xs text-paper/35">Sources: Higgsfield company blog; Kuaishou Q1 2026 results.</p>
      </div>
    </section>
  );
}
